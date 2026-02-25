"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music } from "lucide-react";
import { useSession } from "next-auth/react";

interface Playlist {
    id: string;
    name: string;
}

export default function PlaylistList() {
    const { data: session } = useSession();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        if (session) {
            fetch("/api/playlists")
                .then((res) => res.json())
                .then(setPlaylists);
        }
    }, [session]);

    if (!session) return null;

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pt-4 flex flex-col space-y-2">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold px-2 py-2">
                Your Playlists
            </p>
            {playlists.map((playlist) => (
                <Link
                    key={playlist.id}
                    href={`/playlist/${playlist.id}`}
                    className="flex items-center space-x-3 px-2 py-2 text-neutral-400 hover:text-white transition-all group truncate"
                >
                    <Music className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium truncate">{playlist.name}</span>
                </Link>
            ))}

            {playlists.length === 0 && (
                <p className="text-xs text-neutral-600 px-2 italic">No playlists yet</p>
            )}
        </div>
    );
}
