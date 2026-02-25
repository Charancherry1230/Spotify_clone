"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from "lucide-react";
import Image from "next/image";

// Extend window for YouTube IFrame API
declare global {
    interface Window {
        YT: typeof YT;
        onYouTubeIframeAPIReady: () => void;
    }
}

function formatTime(sec: number) {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlayerBar() {
    const { currentSong, isPlaying, togglePlay, volume, setVolume, playNext, playPrevious } =
        usePlayerStore();

    const playerRef = useRef<YT.Player | null>(null);
    const iframeContainerRef = useRef<HTMLDivElement>(null);
    const [ytReady, setYtReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [ytId, setYtId] = useState<string | null>(null);
    const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    // Load YouTube IFrame API
    useEffect(() => {
        if (window.YT?.Player) { setYtReady(true); return; }
        window.onYouTubeIframeAPIReady = () => setYtReady(true);
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
    }, []);

    // Search YouTube for the current song when it changes
    useEffect(() => {
        if (!currentSong) return;
        const q = `${currentSong.title} ${currentSong.artist}`;
        fetch(`/api/yt?q=${encodeURIComponent(q)}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.videoId) setYtId(data.videoId);
            })
            .catch(console.error);
    }, [currentSong]);

    // Create / cue YouTube player once both ytReady and ytId are available
    useEffect(() => {
        if (!ytReady || !ytId || !iframeContainerRef.current) return;

        if (playerRef.current) {
            // Cue new video and autoplay
            playerRef.current.loadVideoById(ytId);
            if (!isPlaying) playerRef.current.pauseVideo();
            return;
        }

        // Create player
        playerRef.current = new window.YT.Player(iframeContainerRef.current, {
            height: "1",
            width: "1",
            videoId: ytId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                rel: 0,
                modestbranding: 1,
                playsinline: 1,
            },
            events: {
                onReady: (e) => {
                    e.target.setVolume(volume * 100);
                    if (isPlaying) e.target.playVideo();
                },
                onStateChange: (e) => {
                    // YT.PlayerState.ENDED = 0
                    if (e.data === 0) playNext();
                },
            },
        });
    }, [ytReady, ytId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync play/pause
    useEffect(() => {
        if (!playerRef.current) return;
        try {
            if (isPlaying) {
                playerRef.current.playVideo();
            } else {
                playerRef.current.pauseVideo();
            }
        } catch (_) { /* player not ready yet */ }
    }, [isPlaying]);

    // Sync volume
    useEffect(() => {
        if (!playerRef.current) return;
        try { playerRef.current.setVolume(volume * 100); } catch (_) { }
    }, [volume]);

    // Progress polling
    const stopProgress = useCallback(() => {
        if (progressInterval.current) clearInterval(progressInterval.current);
    }, []);

    useEffect(() => {
        stopProgress();
        if (!isPlaying) return;
        progressInterval.current = setInterval(() => {
            if (!playerRef.current) return;
            try {
                const cur = playerRef.current.getCurrentTime() || 0;
                const dur = playerRef.current.getDuration() || 0;
                setCurrentTime(cur);
                setDuration(dur);
                setProgress(dur > 0 ? (cur / dur) * 100 : 0);
            } catch (_) { }
        }, 500);
        return stopProgress;
    }, [isPlaying, stopProgress]);

    const seek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!playerRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        playerRef.current.seekTo(pct * duration, true);
        setProgress(pct * 100);
    };

    if (!currentSong) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/90 backdrop-blur-lg border-t border-white/10 px-4 flex items-center justify-between z-50">
            {/* Hidden YouTube player */}
            <div className="absolute -top-0 left-0 opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
                <div ref={iframeContainerRef} />
            </div>

            {/* Left: Song info */}
            <div className="flex items-center space-x-4 w-[30%]">
                <div className="relative w-14 h-14 rounded-md overflow-hidden bg-neutral-800 flex-shrink-0">
                    {currentSong.albumCover && (
                        <Image src={currentSong.albumCover} alt={currentSong.title} fill className="object-cover" />
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center space-x-2">
                        <span className="text-white text-sm font-semibold truncate hover:underline cursor-pointer">
                            {currentSong.title}
                        </span>
                        {isPlaying && (
                            <div className="flex items-end space-x-[2px] h-4 flex-shrink-0">
                                <div className="equalizer-bar" />
                                <div className="equalizer-bar" />
                                <div className="equalizer-bar" />
                                <div className="equalizer-bar" />
                            </div>
                        )}
                    </div>
                    <span className="text-neutral-400 text-xs truncate hover:underline cursor-pointer">
                        {currentSong.artist}
                    </span>
                </div>
            </div>

            {/* Center: Controls + seek */}
            <div className="flex flex-col items-center space-y-2 w-[40%]">
                <div className="flex items-center space-x-6">
                    <Shuffle className="w-4 h-4 text-neutral-400 hover:text-white transition-colors cursor-pointer" />
                    <SkipBack
                        onClick={playPrevious}
                        className="w-5 h-5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    />
                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full hover:scale-105 transition-transform active:scale-95"
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5 text-black fill-black" />
                        ) : (
                            <Play className="w-5 h-5 text-black fill-black ml-1" />
                        )}
                    </button>
                    <SkipForward
                        onClick={playNext}
                        className="w-5 h-5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    />
                    <Repeat className="w-4 h-4 text-neutral-400 hover:text-white transition-colors cursor-pointer" />
                </div>

                <div className="flex items-center space-x-2 w-full max-w-md">
                    <span className="text-[10px] text-neutral-400 w-10 text-right">{formatTime(currentTime)}</span>
                    <div
                        className="flex-1 h-1 bg-neutral-600 rounded-full overflow-hidden cursor-pointer group relative"
                        onClick={seek}
                    >
                        <div
                            className="h-full bg-spotify-green transition-none group-hover:bg-green-400"
                            style={{ width: `${progress}%`, backgroundColor: "#1DB954" }}
                        />
                    </div>
                    <span className="text-[10px] text-neutral-400 w-10">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Volume */}
            <div className="flex items-center justify-end space-x-4 w-[30%]">
                <div className="flex items-center space-x-2 w-32">
                    <Volume2 className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                    <div
                        className="flex-1 h-1 bg-neutral-600 rounded-full overflow-hidden cursor-pointer"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setVolume((e.clientX - rect.left) / rect.width);
                        }}
                    >
                        <div className="h-full bg-white" style={{ width: `${volume * 100}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
