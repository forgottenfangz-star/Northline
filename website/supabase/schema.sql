-- NORTHLINE production database
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text default '',
  role text not null default 'member' check (role in ('member','seller','support','moderator','senior_moderator','supervisor','administrator','management')),
  reputation text not null default 'No Rating' check (reputation in ('Trusted','Verified','Caution','Restricted','No Rating')),
  account_flag text,
  flag_reason text,
  flagged_at timestamptz,
  flagged_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null,
  price_cents integer not null check (price_cents > 0),
  delivery_days integer not null default 3,
  status text not null default 'active' check (status in ('active','paused','removed')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id),
  seller_id uuid not null references public.profiles(id),
  service_id uuid not null references public.services(id),
  stripe_session_id text unique,
  amount_cents integer not null,
  currency text not null default 'usd',
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  status text not null default 'awaiting_payment' check (status in ('awaiting_payment','in_progress','delivered','completed','cancelled','disputed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.account_flags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  flag text not null,
  reason text not null,
  evidence text,
  created_by uuid not null references public.profiles(id),
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  target_user_id uuid references public.profiles(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.seller_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved','needs_info','declined','ai_uncertain')),
  portfolio text not null default '',
  answers jsonb not null default '{}'::jsonb,
  reviewer_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id,username,display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'username',''), split_part(new.email,'@',1)),
    coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(new.email,'@',1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.account_flags enable row level security;
alter table public.audit_logs enable row level security;
alter table public.seller_applications enable row level security;

create policy "profiles public read" on public.profiles for select using (true);
create policy "own profile update" on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id);
create policy "active services public read" on public.services for select using (status='active');
create policy "own orders read" on public.orders for select using (auth.uid()=buyer_id or auth.uid()=seller_id);
create policy "own applications read" on public.seller_applications for select using (auth.uid()=user_id);
create policy "own applications create" on public.seller_applications for insert with check (auth.uid()=user_id);


create or replace function public.can_manage_role(actor text, target text)
returns boolean language sql immutable as $$
select case actor
  when 'management' then target <> 'management'
  when 'administrator' then target in ('member','seller','support','moderator','senior_moderator','supervisor')
  when 'supervisor' then target in ('member','seller','support','moderator')
  when 'senior_moderator' then target in ('member','seller','support','moderator')
  when 'moderator' then target in ('member','seller')
  when 'support' then target in ('member','seller')
  else false end;
$$;

create or replace function public.management_update_user(
  target_id uuid,
  new_role text default null,
  new_reputation text default null,
  new_flag text default null,
  new_flag_reason text default null
)
returns public.profiles
language plpgsql security definer set search_path = public as $$
declare
  actor public.profiles;
  target public.profiles;
  result public.profiles;
begin
  select * into actor from public.profiles where id=auth.uid();
  select * into target from public.profiles where id=target_id;
  if actor.id is null or target.id is null then raise exception 'Account not found'; end if;

  if new_role is not null then
    if new_role not in ('member','seller','support','moderator','senior_moderator','supervisor','administrator','management') then raise exception 'Invalid role'; end if;
    if not public.can_manage_role(actor.role,new_role) then raise exception 'Insufficient permission to assign this role'; end if;
  end if;

  if new_reputation is not null and new_reputation not in ('Trusted','Verified','Caution','Restricted','No Rating') then raise exception 'Invalid reputation'; end if;

  update public.profiles set
    role=coalesce(new_role,role),
    reputation=coalesce(new_reputation,reputation),
    account_flag=coalesce(new_flag,account_flag),
    flag_reason=case when new_flag is not null then new_flag_reason else flag_reason end,
    flagged_at=case when new_flag is not null then now() else flagged_at end,
    flagged_by=case when new_flag is not null then actor.id else flagged_by end,
    updated_at=now()
  where id=target_id returning * into result;

  insert into public.audit_logs(actor_id,action,target_user_id,metadata)
  values(actor.id,'management_update_user',target_id,jsonb_build_object('role',new_role,'reputation',new_reputation,'flag',new_flag,'reason',new_flag_reason));

  return result;
end;
$$;

revoke all on function public.management_update_user(uuid,text,text,text,text) from public;
grant execute on function public.management_update_user(uuid,text,text,text,text) to authenticated;
