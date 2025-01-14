import { qa } from "@/utils/ai"
import getUserByClerkId from "@/utils/auth"
import { prisma } from "@/utils/db"
import { JournalEntry } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {

    const { question } = await req.json()

    const user = await getUserByClerkId()

    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: user.id
        },
    })
    const response = await qa(question, entries)
    console.log('response', response)

    return NextResponse.json({ data: response })
}