"use client";

import { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, Play, Loader2 } from "lucide-react";
import { searchSongs, Track } from "@/lib/music";
import { usePlayerStore } from "@/store/usePlayerStore";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);
    const { setCurrentSong } = usePlayerStore();

    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        const tracks = await searchSongs(searchQuery);
        setResults(tracks);
        setLoading(false);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);

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
            <div className="max-w-xl mb-8 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                    suppressHydrationWarning
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What do you want to listen to?"
                    className="w-full bg-neutral-800/50 border border-white/5 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-spotify-green transition-all glass"
                />
                {loading && (
                    <div className="absolute inset-y-0 right-6 flex items-center">
                        <Loader2 className="w-5 h-5 text-spotify-green animate-spin" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {results.map((track) => (
                    <div
                        key={track.id}
                        className="group bg-neutral-900/40 border border-white/5 p-4 rounded-xl hover:bg-neutral-800/60 transition-all cursor-pointer relative"
                    >
                        <div className="relative aspect-square mb-4 rounded-lg overflow-hidden shadow-2xl">
                            <Image
                                src={track.album.cover_medium}
                                alt={track.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <button
                                onClick={() => onPlay(track)}
                                className="absolute bottom-4 right-4 w-12 h-12 bg-spotify-green rounded-full shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 z-10"
                                style={{ backgroundColor: "#1DB954" }}
                            >
                                <Play className="w-6 h-6 text-black fill-black ml-1" />
                            </button>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-white font-bold truncate leading-snug">
                                {track.title}
                            </h3>
                            <p className="text-neutral-400 text-sm font-medium truncate">
                                {track.artist.name}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {results.length === 0 && !loading && query.length > 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <h2 className="text-2xl font-bold mb-2">No results found for "{query}"</h2>
                    <p className="text-neutral-400">Please check your spelling or try a different keyword.</p>
                </div>
            )}

            {results.length === 0 && !loading && query.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                    <SearchIcon className="w-16 h-16 mb-4" />
                    <h2 className="text-2xl font-bold">Search for your favorite music</h2>
                </div>
            )}
        </div>
    );
}
