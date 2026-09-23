const DISCORD_CLIENT_ID = "YOUR_DISCORD_CLIENT_ID";
const inviteUrl = DISCORD_CLIENT_ID === "YOUR_DISCORD_CLIENT_ID"
  ? "#"
  : "https://discord.com/oauth2/authorize?client_id=" + encodeURIComponent(DISCORD_CLIENT_ID) + "&permissions=8&scope=bot%20applications.commands";
for (const id of ["inviteBtn","heroInvite","supportInvite"]) {
  const el = document.getElementById(id);
  if (!el) continue;
  el.href = inviteUrl;
  el.addEventListener("click", function (event) {
    if (inviteUrl === "#") {
      event.preventDefault();
      alert("Add your Discord application client ID in app.js to enable the invite button.");
    }
  });
}
document.getElementById("year").textContent = new Date().getFullYear();