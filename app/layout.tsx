import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import AblyProvider from "@/components/providers/ablyProvider";
import Providers from "./providers";
import { Toaster } from "sonner";
import GlobalRealtime from "@/components/realtime/globalRealtime";
import PWARegister from "@/components/pwa-register";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "CUK Store",
  description: "Buy and Sell Marketplace",
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B2A5B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        inter.variable,
        geistSans.variable,
        geistMono.variable,
      )}
    >
      <body className="flex min-h-screen flex-col">
        <PWARegister />
        <Providers>
          <AblyProvider>
            <Navbar />
            <GlobalRealtime />
            <main className="flex-1">{children}</main>
            <Toaster position="top-right" richColors closeButton />
          </AblyProvider>
        </Providers>
      </body>
    </html>
  );
}
