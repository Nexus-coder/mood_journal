import { analyze } from "@/utils/ai"
import getUserByClerkId from "@/utils/auth"
import { prisma } from "@/utils/db"
import { NextResponse } from "next/server"

export const POST = async () => {
    const user = await getUserByClerkId()
    const newEntry = await prisma.journalEntry.create({
        data: {
            userId: user.id,
            content: 'Welcome this is a new entry!'
        }
    })

    const analysis = await analyze(newEntry.content)
    if (!analysis) return NextResponse.json({ error: "Error getting input from AI" })
    await prisma.analysis.create({
        data: {
            entryId: newEntry.id,
            ...analysis,
        }
    })

    return NextResponse.json({ data: newEntry })
}