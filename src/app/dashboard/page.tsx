"use client";

import { useEffect, useState } from "react";
import { getChart, Track } from "@/lib/music";
import { usePlayerStore } from "@/store/usePlayerStore";
import Image from "next/image";
import { Play } from "lucide-react";

export default function DashboardPage() {
    const [charts, setCharts] = useState<Track[]>([]);
    const { setCurrentSong } = usePlayerStore();

    useEffect(() => {
        getChart().then(setCharts);
    }, []);

    const onPlay = (track: Track) => {
        setCurrentSong({
            id: track.id.toString(),
            title: track.title,
            artist: track.artist.name,
            albumCover: track.album.cover_medium,
            previewUrl: track.preview,
            duration: track.duration,
        });
    };

    return (
        <div className="p-8 pb-32">
            <section className="mb-12">
                <h1 className="text-3xl font-bold mb-8 transition-all hover:tracking-tight cursor-default">
                    Good evening
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {charts.slice(0, 6).map((track) => (
                        <div
                            key={track.id}
                            onClick={() => onPlay(track)}
                            className="flex items-center bg-white/5 hover:bg-white/10 rounded-md overflow-hidden transition-all group cursor-pointer glass"
                        >
                            <div className="relative w-20 h-20 shadow-lg">
                                <Image
                                    src={track.album.cover_medium}
                                    alt={track.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="px-4 flex-1 flex items-center justify-between">
                                <span className="font-bold truncate">{track.title}</span>
                                <button className="w-12 h-12 bg-spotify-green rounded-full shadow-lg opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all flex items-center justify-center" style={{ backgroundColor: "#1DB954" }}>
                                    <Play className="w-6 h-6 text-black fill-black ml-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold hover:underline cursor-pointer">Trending Now</h2>
                    <span className="text-neutral-400 text-sm font-bold hover:underline cursor-pointer uppercase tracking-wider">Show all</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {charts.map((track) => (
                        <div
                            key={track.id}
                            className="group bg-neutral-900/40 p-4 rounded-xl hover:bg-neutral-800/60 transition-all cursor-pointer relative glass border border-white/5"
                        >
                            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden shadow-2xl">
                                <Image
                                    src={track.album.cover_medium}
                                    alt={track.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPlay(track);
                                    }}
                                    className="absolute bottom-4 right-4 w-12 h-12 bg-spotify-green rounded-full shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                                    style={{ backgroundColor: "#1DB954" }}
                                >
                                    <Play className="w-6 h-6 text-black fill-black ml-1" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-white font-bold truncate">
                                    {track.title}
                                </h3>
                                <p className="text-neutral-400 text-sm truncate">
                                    {track.artist.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
