import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const playlist = await prisma.playlist.findUnique({
        where: { id: params.id },
        include: {
            songs: {
                include: {
                    song: true,
                },
            },
        },
    });

    if (!playlist) return NextResponse.json({ error: "Playlist not found" }, { status: 404 });

    return NextResponse.json(playlist);
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description } = await req.json();

    const playlist = await prisma.playlist.update({
        where: { id: params.id, userId: session.user.id },
        data: { name, description },
    });

    return NextResponse.json(playlist);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.playlist.delete({
        where: { id: params.id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
}
