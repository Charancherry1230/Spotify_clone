import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Navigation/Sidebar";
import PlayerBar from "@/components/Player/PlayerBar";
import AuthProvider from "@/components/Providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TeluguBeats - Stream Telugu Music",
  description: "TeluguBeats — The ultimate Telugu music streaming platform with 3D intro and AI-powered music fetching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white h-screen overflow-hidden`}>
        <AuthProvider>
          <div className="flex h-full w-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative pb-24 no-scrollbar">
              {children}
            </main>
          </div>
          <PlayerBar />
        </AuthProvider>
      </body>
    </html>
  );
}
