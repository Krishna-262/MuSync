import { prismaClient } from "@/app/lib/db";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession();

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if (!user) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
    }

    const mostUpvotedStream = await prismaClient.stream.findFirst({
        where: {
            userId: user.id,
            played : false,

        },
        orderBy: {
            upVotes: {
                _count: 'desc',
            }
        }
    });

    await Promise.all([prismaClient.currentStream.upsert({
        where: {
            userId: user.id,
        },
        update: {
            userId: user.id,
            streamId: mostUpvotedStream?.id || null,
        },
        create: {
            userId: user.id,
            streamId: mostUpvotedStream?.id || null,
        }
    }), prismaClient.stream.update({
        where: { 
            id: mostUpvotedStream?.id || null,
        },
        data  : {
            played : true,
            playedTs : new Date()
        }
    })]);

    return NextResponse.json({
        stream : mostUpvotedStream,
    })
}   