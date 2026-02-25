import { create } from "zustand";

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
    playNext: () => void;
    playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
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

    playNext: () => set((state) => {
        if (state.queue.length === 0) return state;
        const nextIndex = (state.currentIndex + 1) % state.queue.length;
        return {
            currentSong: state.queue[nextIndex],
            currentIndex: nextIndex,
            isPlaying: true,
        };
    }),

    playPrevious: () => set((state) => {
        if (state.queue.length === 0) return state;
        const prevIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
        return {
            currentSong: state.queue[prevIndex],
            currentIndex: prevIndex,
            isPlaying: true,
        };
    }),
}));
