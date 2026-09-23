import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NORTHLINE™ — Digital Marketplace",
  description: "Buy and sell digital services with NORTHLINE Trade Guard."
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}