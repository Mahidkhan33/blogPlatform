import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
export const metadata: Metadata = {
  title: "DevBlog | Modern CMS & Blog Platform",
  description: "A premium blog platform built with Next.js, MongoDB, and TipTap.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased`}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">

            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
