"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, PlusSquare, Heart, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils"; // I'll create this utility

import PlaylistList from "./PlaylistList";

const routes = [
    { label: "Home", icon: Home, href: "/dashboard", active: true },
    { label: "Search", icon: Search, href: "/search" },
    { label: "Your Library", icon: Library, href: "/library" },
];

const playlistRoutes = [
    { label: "Create Playlist", icon: PlusSquare, href: "#" },
    { label: "Liked Songs", icon: Heart, href: "/liked" },
];

export default function Sidebar() {
    const pathname = usePathname();

    const createPlaylist = async () => {
        const name = `My Playlist #${Math.floor(Math.random() * 1000)}`;
        await fetch("/api/playlists", {
            method: "POST",
            body: JSON.stringify({ name }),
        });
        window.location.reload(); // Simple way to refresh for now
    };

    return (
        <div className="flex flex-col h-full bg-black w-[240px] border-r border-white/10 p-6 space-y-8">
            <div className="flex items-center space-x-2 text-spotify-green px-2" style={{ color: "#1DB954" }}>
                <LayoutDashboard className="w-8 h-8" />
                <span className="text-xl font-bold text-white tracking-tight">TeluguBeats</span>
            </div>

            <nav className="flex flex-col flex-1 space-y-4 overflow-hidden">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex items-center space-x-4 px-2 py-2 rounded-lg transition-all hover:text-white group",
                            pathname === route.href ? "text-white bg-white/10" : "text-neutral-400"
                        )}
                    >
                        <route.icon className="w-5 h-5" />
                        <span className="font-medium">{route.label}</span>
                    </Link>
                ))}

                <div className="pt-4 space-y-4">
                    <button
                        suppressHydrationWarning
                        onClick={createPlaylist}
                        className="flex items-center space-x-4 px-2 py-2 text-neutral-400 hover:text-white transition-all group w-full text-left"
                    >
                        <PlusSquare className="w-5 h-5 group-hover:text-white transition-colors" />
                        <span className="font-medium">Create Playlist</span>
                    </button>
                    <Link
                        href="/liked"
                        className="flex items-center space-x-4 px-2 py-2 text-neutral-400 hover:text-white transition-all group"
                    >
                        <Heart className="w-5 h-5 group-hover:text-white transition-colors" />
                        <span className="font-medium">Liked Songs</span>
                    </Link>
                </div>

                <PlaylistList />
            </nav>

            <div className="pt-8 border-t border-white/10 text-xs text-neutral-500 font-medium">
                <p>Made with ❤️ for Music</p>
            </div>
        </div>
    );
}
