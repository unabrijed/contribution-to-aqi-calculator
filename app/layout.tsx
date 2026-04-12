import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "How much air do you poison? | AQI Contribution Calculator",
  description:
    "Find out how much PM2.5 your smoking habits contribute to the air — and what that's equivalent to in cars, trucks, and chimneys.",
  openGraph: {
    title: "How much air do you poison?",
    description: "Calculate your personal PM2.5 contribution.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
