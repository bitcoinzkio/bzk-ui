import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageLayout from "./pagelayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BitcoinZK",
  description: "A decentralized social network for BitcoinZK users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}
