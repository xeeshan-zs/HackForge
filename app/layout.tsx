import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HackForge 2026 | ACM Chapter NUML Lahore",
  description:
    "HackForge is NUML's flagship coding and innovation competition by ACM Chapter NUML Lahore.",
  openGraph: {
    title: "HackForge 2026",
    description:
      "Forge your future at HackForge — categories, schedule, prizes, and registration.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1E1E35",
              color: "#F0F0F0",
              border: "1px solid rgba(255,69,0,0.25)",
            },
          }}
        />
      </body>
    </html>
  );
}
