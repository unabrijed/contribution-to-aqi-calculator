import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Calculate your contribution to AQI | AQI Calc",
  description:
    "Select your smoke sources, set your daily intake, and see your real annual PM2.5 contribution. Built on WHO-based data across 70+ brands and eight categories.",
  openGraph: {
    title: "Calculate your contribution to AQI",
    description:
      "Select your smoke sources, set your daily intake, and see your real annual PM2.5 contribution.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
