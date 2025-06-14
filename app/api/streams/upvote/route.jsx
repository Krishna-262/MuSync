import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const UpVoteSchema = z.object({
    streamId: z.string(),
    creatorId: z.string(),
})


export async function POST(req) {
    const rawBody = await req.json();
    const data = UpVoteSchema.parse(rawBody);

    if (!data.creatorId) {
        return NextResponse.json({ message: "Missing creatorId" }, { status: 400 });
    }

    const existing = await prismaClient.upvote.findFirst({
        where: {
            userId: data.creatorId,
            streamId: data.streamId,
        },
    });

    if (existing) {
        await prismaClient.upvote.delete({
            where: {
                id: existing.id,
            },
        });
    } else {
        await prismaClient.upvote.create({
            data: {
                userId: data.creatorId,
                streamId: data.streamId,
            },
        });
    }

    const voteCount = await prismaClient.upvote.count({
        where: {
            streamId: data.streamId,
        },
    });

    return NextResponse.json({
        message: existing ? "Upvote removed" : "Upvoted",
        voteCount,
    }, { status: 200 });
}
