import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/ui/header";
import { Providers } from "@/components/ui/providers";
import { Footer } from "@/components/ui/footer";
import { FloatingChat } from "@/components/ui/floating-chat";
import "./globals.css";

// Initialize the fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Therapy Agent",
  description: "Your personal AI therapy companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
          <Providers>
          <Header />
          <main>{children}</main>
          <FloatingChat />
          <Footer />
          </Providers>
      </body>
    </html>
  );
}