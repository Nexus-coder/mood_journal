import { analyze } from "@/utils/ai"
import getUserByClerkId from "@/utils/auth"
import { prisma } from "@/utils/db"
import { NextResponse } from "next/server"

export const POST = async () => {
    const user = await getUserByClerkId()
    const newEntry = await prisma.journalEntry.create({
        data: {
            userId: user.id,
            content: 'Welcome this is a new entry!',
            analysis: {
                create: {
                    mood: 'Neutral',
                    subject: 'None',
                    negative: false,
                    summary: 'None',
                    sentimentScore: 0,
                    color: '#0101fe',
                    userId: user.id,
                },
            },
        }
    })

    // const analysis = await analyze(newEntry.content)

    // if (!analysis) return NextResponse.json({ error: "Error getting input from AI" })

    // await prisma.analysis.update({
    //     where: {
    //         entryId: newEntry.id,
    //     },
    //     data: {
    //         ...analysis,
    //     }
    // })

    return NextResponse.json({ data: newEntry })
}