"use client";

import { useEffect, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import Image from "next/image";
import { Play, Clock, MoreHorizontal } from "lucide-react";
import { use } from "react";

interface PlaylistSong {
    song: {
        id: string;
        title: string;
        artist: string;
        albumName: string | null;
        albumCover: string | null;
        duration: number | null;
        previewUrl: string | null;
    };
}

interface Playlist {
    id: string;
    name: string;
    songs: PlaylistSong[];
}

// Next.js 15+: params is a Promise in client pages too
export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const { setCurrentSong } = usePlayerStore();

    useEffect(() => {
        fetch(`/api/playlists/${id}`)
            .then(res => res.json())
            .then(setPlaylist);
    }, [id]);

    const onPlay = (track: PlaylistSong["song"]) => {
        setCurrentSong({
            id: track.id,
            title: track.title,
            artist: track.artist,
            albumCover: track.albumCover || "",
            previewUrl: track.previewUrl || "",
            duration: track.duration || 0,
        });
    };

    if (!playlist) return null;

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-neutral-800 to-black p-8">
            <div className="flex items-end space-x-6 mb-8">
                <div className="relative w-52 h-52 shadow-[0_8px_40px_rgba(0,0,0,0.5)] rounded-md overflow-hidden bg-neutral-800">
                    {playlist.songs[0]?.song.albumCover && (
                        <Image
                            src={playlist.songs[0].song.albumCover}
                            alt={playlist.name}
                            fill
                            className="object-cover"
                        />
                    )}
                </div>
                <div className="flex flex-col space-y-2">
                    <span className="text-xs font-bold uppercase">Playlist</span>
                    <h1 className="text-7xl font-black tracking-tight mb-2">{playlist.name}</h1>
                    <div className="flex items-center space-x-2 text-sm text-neutral-300">
                        <span className="font-bold text-white">TeluguBeats</span>
                        <span>•</span>
                        <span>{playlist.songs.length} songs</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center space-x-8 mb-8">
                <button
                    onClick={() => playlist.songs[0] && onPlay(playlist.songs[0].song)}
                    className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg"
                    style={{ backgroundColor: "#1DB954" }}
                >
                    <Play className="w-6 h-6 text-black fill-black ml-1" />
                </button>
                <MoreHorizontal className="w-8 h-8 text-neutral-400 hover:text-white transition-colors cursor-pointer" />
            </div>

            <div className="flex-1">
                <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 border-b border-white/10 text-neutral-400 text-sm font-medium mb-4">
                    <span>#</span>
                    <span>Title</span>
                    <span>Album</span>
                    <span className="flex justify-end"><Clock className="w-4 h-4" /></span>
                </div>

                <div className="flex flex-col">
                    {playlist.songs.map((item, index) => (
                        <div
                            key={item.song.id}
                            onClick={() => onPlay(item.song)}
                            className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 hover:bg-white/10 rounded-md group cursor-pointer transition-all"
                        >
                            <span className="flex items-center text-neutral-400 group-hover:text-white">
                                {index + 1}
                            </span>
                            <div className="flex items-center space-x-4">
                                <div className="relative w-10 h-10 rounded overflow-hidden bg-neutral-700">
                                    {item.song.albumCover && (
                                        <Image src={item.song.albumCover} alt={item.song.title} fill className="object-cover" />
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-white font-medium truncate group-hover:text-spotify-green" style={{ transition: "color 0.2s" }}>{item.song.title}</span>
                                    <span className="text-neutral-400 text-xs truncate group-hover:text-white">{item.song.artist}</span>
                                </div>
                            </div>
                            <span className="flex items-center text-neutral-400 text-sm truncate group-hover:text-white">
                                {item.song.albumName || "Unknown Album"}
                            </span>
                            <span className="flex items-center justify-end text-neutral-400 text-sm tabular-nums group-hover:text-white">
                                {item.song.duration
                                    ? `${Math.floor(item.song.duration / 60)}:${(item.song.duration % 60).toString().padStart(2, "0")}`
                                    : "--:--"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
