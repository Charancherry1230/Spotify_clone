import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const playlists = await prisma.playlist.findMany({
        where: { userId: session.user.id },
        include: { _count: { select: { songs: true } } },
    });

    return NextResponse.json(playlists);
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description } = await req.json();

    const playlist = await prisma.playlist.create({
        data: {
            name,
            description,
            userId: session.user.id,
        },
    });

    return NextResponse.json(playlist);
}
