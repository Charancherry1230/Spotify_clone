"use client";

import { signIn } from "next-auth/react";
import { LayoutDashboard, Mail } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center p-4">
            <div className="max-w-md w-full glass p-10 rounded-3xl space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-spotify-green rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(29,185,84,0.3)]" style={{ backgroundColor: "#1DB954" }}>
                        <LayoutDashboard className="w-10 h-10 text-black" />
                    </div>
                    <h1 className="text-3xl font-black text-center tracking-tighter">
                        MUSIC FOR <span className="text-spotify-green" style={{ color: "#1DB954" }}>EVERYONE.</span>
                    </h1>
                    <p className="text-neutral-400 text-center text-sm">
                        Login to save your playlists and recently played history.
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
                        className="w-full py-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all flex items-center justify-center space-x-3 shadow-lg hover:shadow-[#1DB954]/20 active:scale-[0.98]"
                    >
                        <span>Continue with Spotify</span>
                    </button>

                    <button
                        disabled
                        className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full transition-all flex items-center justify-center space-x-3 opacity-50 cursor-not-allowed hover:bg-white/10"
                    >
                        <Mail className="w-5 h-5" />
                        <span>Continue with Email</span>
                    </button>
                </div>

                <div className="pt-4 text-center">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                        Stream Telugu Music. Anywhere.
                    </p>
                </div>
            </div>

            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#1DB954]/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>
        </div>
    );
}
