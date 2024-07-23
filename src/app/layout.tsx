import { Toaster } from "@/components/ui/toaster";
import "highlight.js/styles/github.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from 'next/script';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luke Ding",
  description: "Luke Ding's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/favicon.ico" />
      </head>
      <body className={inter.className+" "+"dark font-dance "}>
       {children}
      <Toaster />
       <Script defer src="/misc/time.js"></Script>
      </body>

    </html>
  );
}
