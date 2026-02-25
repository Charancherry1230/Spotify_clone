// Uses iTunes Search API via internal proxy to avoid CORS
export interface Track {
    id: string;
    title: string;
    duration: number; // seconds
    preview: string;  // 30-second preview URL
    artist: { name: string };
    album: { title: string; cover_medium: string };
}

interface ItunesResult {
    trackId: number;
    trackName: string;
    trackTimeMillis: number;
    previewUrl: string;
    artistName: string;
    collectionName: string;
    artworkUrl100: string;
}

function mapItunes(r: ItunesResult): Track {
    return {
        id: String(r.trackId),
        title: r.trackName,
        duration: Math.floor((r.trackTimeMillis || 0) / 1000),
        preview: r.previewUrl || "",
        artist: { name: r.artistName },
        album: { title: r.collectionName, cover_medium: r.artworkUrl100?.replace("100x100", "300x300") },
    };
}

async function apiGet(params: Record<string, string>): Promise<Track[]> {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`/api/deezer?${qs}`);
    const data = await res.json() as { results?: ItunesResult[] };
    return (data.results || []).filter((r) => r.previewUrl).map(mapItunes);
}

// Keep the same export names so no other files need changing
export const DeezerTrack = {} as unknown as Track; // type compat shim

export async function searchSongs(query: string): Promise<Track[]> {
    try {
        return await apiGet({ type: "search", term: query, limit: "25" });
    } catch (e) {
        console.error("Search error:", e);
        return [];
    }
}

export async function getChart(): Promise<Track[]> {
    try {
        return await apiGet({ type: "charts", limit: "25" });
    } catch (e) {
        console.error("Chart error:", e);
        return [];
    }
}

export async function getTrack(id: string): Promise<Track | null> {
    try {
        const res = await fetch(`/api/deezer?type=lookup&term=${id}`);
        const data = await res.json() as { results?: ItunesResult[] };
        return data.results?.[0] ? mapItunes(data.results[0]) : null;
    } catch {
        return null;
    }
}
