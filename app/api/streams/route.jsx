import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "../../lib/db";
import youtubeSearchApi from 'youtube-search-api';
import { getServerSession } from "next-auth";
const YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:(?:watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11}))|(?:playlist\?list=([a-zA-Z0-9_-]+))|(?:embed\/videoseries\?list=([a-zA-Z0-9_-]+)))/;

const createStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string() // yotubue or spotify inside 

});

export async function POST(req) {
    try {
        const data = createStreamSchema.parse(await req.json());
        const match = data.url.match(YT_REGEX);

        if (!match) {
            return NextResponse.json({
                message: 'Invalid URL, only YouTube links are allowed'
            }, {
                status: 411
            });
        }

        const extractedId = match[1] || match[2] || match[3] || null;

        if (!extractedId) {
            return NextResponse.json({
                message: 'Could not extract ID from URL'
            }, {
                status: 411
            });
        }
        const res = await youtubeSearchApi.GetVideoDetails(extractedId);
        console.log(res.title);
        if (!res || !res.title) {
            console.error("🔴 YouTube API response is invalid:", res);
            return NextResponse.json({
              message: "Could not fetch video details",
            }, { status: 500 });
        }
        console.log(res.title);
        console.log(JSON.stringify(res.thumbnail.thumbnails));
        const thumb = res.thumbnail.thumbnails;
        thumb.sort((a, b) => a.width - b.width);


        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube",  // capital Y, matching Prisma enum
                title: res.title ?? "Can't Find Video",
                bigImg: thumb[thumb.length - 1].url ?? "data:image/jpeg;base64,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",
                smallImg: (thumb.length > 1 ? thumb[thumb.length - 2].url : thumb[thumb.length - 1].url) ?? "data:image/jpeg;base64,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"

            }
        });

        return NextResponse.json({
            message: "Stream Added",
            id: stream.id,
        });

    } catch (e) {
        return NextResponse.json({
            message: 'Error adding a Stream',
            error: e.message
        }, {
            status: 500
        });
    }
}

export async function GET(req) {
    const creatorId = req.nextUrl.searchParams.get('creatorId');
    const session = await getServerSession();

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if (!user) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
    }

    if (!creatorId) {
        return NextResponse.json(
            { message: "Missing creatorId" },
            { status: 411 }
        )
    }

    const [streams ,activeStream] = await Promise.all([await prismaClient.stream.findMany({
        where: {
            userId: creatorId,
            played : false,
        },
        include: {
            _count: {
                select: {
                    upVotes: true
                }
            },
            upVotes: {
                where: {
                    userId: creatorId
                }
            }
        }
    }), prismaClient.currentStream.findFirst({
        where : {
            userId : creatorId
        },
        include : {
            stream : true
        }
    })]);


    return NextResponse.json({
        streams: streams.map(({ _count, ...rest }) => ({
            ...rest,
            upVotes: _count.upVotes ?? 0,
            haveupVoted: rest.upVotes.length ? true : false

        })),
        activeStream
    });
}