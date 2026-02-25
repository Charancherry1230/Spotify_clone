import { NextRequest, NextResponse } from "next/server";

const ITUNES_API = "https://itunes.apple.com";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get("term") || "telugu hits";
    const limit = searchParams.get("limit") || "20";
    const type = searchParams.get("type") || "search"; // search | charts

    let url = "";

    if (type === "charts") {
        url = `${ITUNES_API}/search?term=telugu+hits+2024&media=music&limit=${limit}&country=IN`;
    } else {
        url = `${ITUNES_API}/search?term=${encodeURIComponent(term)}&media=music&limit=${limit}&country=IN`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Music API proxy error:", error);
        return NextResponse.json({ error: "Music fetch failed" }, { status: 500 });
    }
}
