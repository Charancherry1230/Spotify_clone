import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q") || "";
    if (!q) return NextResponse.json({ error: "No query" }, { status: 400 });

    try {
        const res = await fetch(
            `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " full song audio")}`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept-Language": "en-US,en;q=0.9",
                },
            }
        );

        const html = await res.text();

        // Extract first video ID from YouTube results JSON
        const matches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
        const videoIds = [...new Set(matches.map((m) => m[1]))].slice(0, 3);

        if (videoIds.length === 0) {
            return NextResponse.json({ error: "No results found" }, { status: 404 });
        }

        return NextResponse.json({ videoId: videoIds[0], alternates: videoIds.slice(1) });
    } catch (error) {
        console.error("YouTube search error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
