import { create } from "zustand";
import { getChart } from "@/lib/music";

interface Song {
    id: string;
    title: string;
    artist: string;
    albumCover: string;
    previewUrl: string;
    duration: number;
}

interface PlayerStore {
    currentSong: Song | null;
    isPlaying: boolean;
    volume: number;
    queue: Song[];
    currentIndex: number;

    setCurrentSong: (song: Song) => void;
    togglePlay: () => void;
    setPlaying: (isPlaying: boolean) => void;
    setVolume: (volume: number) => void;
    addToQueue: (song: Song) => void;
    playNext: () => Promise<void>;
    playPrevious: () => Promise<void>;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    volume: 0.5,
    queue: [],
    currentIndex: -1,

    setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setPlaying: (isPlaying) => set({ isPlaying }),
    setVolume: (volume) => set({ volume }),
    addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),

    playNext: async () => {
        const state = get();
        if (state.queue.length === 0) {
            try {
                const charts = await getChart();
                if (charts.length > 0) {
                    const randomTrack = charts[Math.floor(Math.random() * charts.length)];
                    set({
                        currentSong: {
                            id: randomTrack.id.toString(),
                            title: randomTrack.title,
                            artist: randomTrack.artist.name,
                            albumCover: randomTrack.album.cover_medium,
                            previewUrl: randomTrack.preview,
                            duration: randomTrack.duration,
                        },
                        isPlaying: true,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch random song", error);
            }
            return;
        }

        const nextIndex = (state.currentIndex + 1) % state.queue.length;
        set({
            currentSong: state.queue[nextIndex],
            currentIndex: nextIndex,
            isPlaying: true,
        });
    },

    playPrevious: async () => {
        const state = get();
        if (state.queue.length === 0) {
            try {
                const charts = await getChart();
                if (charts.length > 0) {
                    const randomTrack = charts[Math.floor(Math.random() * charts.length)];
                    set({
                        currentSong: {
                            id: randomTrack.id.toString(),
                            title: randomTrack.title,
                            artist: randomTrack.artist.name,
                            albumCover: randomTrack.album.cover_medium,
                            previewUrl: randomTrack.preview,
                            duration: randomTrack.duration,
                        },
                        isPlaying: true,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch random song", error);
            }
            return;
        }

        const prevIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
        set({
            currentSong: state.queue[prevIndex],
            currentIndex: prevIndex,
            isPlaying: true,
        });
    },
}));
