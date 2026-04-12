import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Calculate your contribution to AQI | Calculator",
  description:
    "Find out how much PM2.5 your smoking habits contribute to the air and what that's equivalent to in cars, trucks, and chimneys.",
  openGraph: {
    title: "Calculate your contribution to AQI",
    description: "Find out your personal PM2.5 contribution.",
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
      </body>
    </html>
  );
}
