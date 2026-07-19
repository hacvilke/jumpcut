import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jumpcut — Video Editing Community & Agency for Creators",
  description: "Jumpcut is a creative community and post-production agency. Browse editor templates, follow top creators, and commission premium video edits.",
  icons: { icon: "/assets/J_period_transparent.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700,800&display=swap" rel="stylesheet" />
      </head>
      <body className="dark">
        <ClerkProvider>
          <div className="grain" aria-hidden="true" />
          {children}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}