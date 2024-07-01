import { analyze } from "@/utils/ai";
import getUserByClerkId from "@/utils/auth"
import { prisma } from "@/utils/db"
import { NextResponse } from "next/server";

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    const { content } = await request.json()
    const user = await getUserByClerkId();
    const updatedEntry = await prisma.journalEntry.update({
        where: {
            userId_id: {
                userId: user.id,
                id: params.id
            }
        },
        data: {
            content
        }
    })

    const analysis = await analyze(updatedEntry.content)
    const newAnalysis = await prisma.analysis.update({
        where: {
            entryId: updatedEntry.id
        },
        data: {
            ...analysis
        }
    })
    return NextResponse.json({ data: updatedEntry })
}