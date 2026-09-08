import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "Praana",
  description: "AI-Powered Health Monitoring & Emergency Mesh Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-slate-50 text-slate-900 font-sans`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
