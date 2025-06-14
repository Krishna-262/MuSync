import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
    const session = await getServerSession();

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if (!user) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
    }

    const streams = await prismaClient.stream.findMany({
        where: {
          userId: user.id 
        },
        include : {
          _count : {
            select : {
              upVotes : true
            }
          },
          upVotes : {
            where : {
              userId : user.id
            }
          }
        }
      });
  
      return NextResponse.json({
        streams: streams.map(({_count, ...rest})=>({
          ...rest,
          upVotes: _count.upVotes ?? 0 ,
          haveupVoted : rest.upVotes.length ? true : false

        }))
      });
}