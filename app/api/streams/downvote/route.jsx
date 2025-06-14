import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const DownVoteSchema = z.object({
    streamId: z.string(),
    creatorId: z.string(),
})


export async function POST(req) {
    // const session = await getServerSession();
    const rawBody = await req.json();
    const data = DownVoteSchema.parse(rawBody);

    if (!data.creatorId) {
        return NextResponse.json({ message: "Missing creatorId" }, { status: 400 });
    }

    const existing = await prismaClient.upvote.findFirst({
        where: {
            userId: data.creatorId,
            streamId: data.streamId,
        },
    });

    try {
        if (existing) {
            // Step 1: Remove any existing upvote
            await prismaClient.upvote.deleteMany({
                where: {
                    userId: data.creatorId,
                    streamId: data.streamId,
                },
            });

            const voteCount = await prismaClient.upvote.count({
                where: {
                    streamId: data.streamId,
                },
            });

            return NextResponse.json({
                message: "Upvote removed via downvote action",
                voteCount,
            }, { status: 200 });
        }
        else {
            return NextResponse.json({
                message: "No upvote to remove",
            }, { status: 200 });
        }

    } catch (e) {

        console.error("Error caught during downvote process:", e);
        return NextResponse.json("Error While DownVoting", { status: 403 });
    }

};