"use client";

import Navbar from "../../components/Navbar";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0E0E11]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
