// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WordWeave",
  description: "A decentralized word game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0E0E11] text-white`}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
