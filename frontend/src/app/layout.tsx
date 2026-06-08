import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillFund | Skill-based trading platform",
  description: "Practice trading with real session rules, reward milestones, and a demo wallet mapped to your deposit.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent theme flash */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){var t=localStorage.getItem('sf-theme');if(t==='light')document.documentElement.classList.add('light');})();`
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}