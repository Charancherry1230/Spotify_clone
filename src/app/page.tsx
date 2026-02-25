"use client";

import { useState } from "react";
import Intro3D from "@/components/Intro/Intro3D";
import { useRouter } from "next/navigation";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const router = useRouter();

  const handleComplete = () => {
    setIntroComplete(true);
    // After intro, we can either show the landing page or redirect to dashboard
    // For now, let's just stay on the page and show the content
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {!introComplete && <Intro3D onComplete={handleComplete} />}

      {introComplete && (
        <div className="flex items-center justify-center min-h-screen flex-col space-y-8 animate-in fade-in duration-1000">
          <h1 className="text-6xl font-black tracking-tighter text-center">
            TELUGU<span className="text-spotify-green" style={{ color: "#1DB954" }}>BEATS</span>
          </h1>
          <p className="text-neutral-400 text-lg">Stream your favourite Telugu hits, albums & more.</p>
          <button
            onClick={() => router.push("/login")}
            className="px-12 py-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all scale-100 hover:scale-105 active:scale-95"
          >
            GET STARTED
          </button>
        </div>
      )}
    </main>
  );
}
