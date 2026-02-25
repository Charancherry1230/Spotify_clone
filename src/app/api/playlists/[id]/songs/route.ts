import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Next.js 15+: params is a Promise
type Context = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Context) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { song } = await req.json();

    await prisma.song.upsert({
        where: { id: song.id.toString() },
        update: {},
        create: {
            id: song.id.toString(),
            title: song.title,
            artist: song.artist,
            albumName: song.albumName,
            albumCover: song.albumCover,
            duration: song.duration,
            previewUrl: song.previewUrl,
        },
    });

    const playlistSong = await prisma.playlistSong.create({
        data: {
            playlistId: id,
            songId: song.id.toString(),
        },
    });

    return NextResponse.json(playlistSong);
}

export async function DELETE(req: NextRequest, { params }: Context) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { songId } = await req.json();

    await prisma.playlistSong.delete({
        where: {
            playlistId_songId: { playlistId: id, songId },
        },
    });

    return NextResponse.json({ success: true });
}
