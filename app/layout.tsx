import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "How much air do you poison? | AQI Contribution Calculator",
  description:
    "Find out how much PM2.5 your smoking habits contribute to the air and what that's equivalent to in cars, trucks, and chimneys.",
  openGraph: {
    title: "How much air do you poison?",
    description: "Calculate your personal PM2.5 contribution.",
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
