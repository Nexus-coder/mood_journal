import HistoryChart from "@/components/history-chart"
import getUserByClerkId from "@/utils/auth"
import { prisma } from "@/utils/db"

const getData = async () => {
    const user = await getUserByClerkId()

    const analysis = await prisma.analysis.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: 'asc'
        }
    })
    console.log('analysis', analysis)
    const sum = analysis.reduce((a, b) => a + b.sentimentScore, 0)
    const avg = sum / analysis.length
    return { analysis, avg }
}

const History = async () => {
    const { analysis, avg } = await getData()
    console.log('sum', analysis)
    return (
        <div className="h-full w-full">
            <h1>History:{avg}</h1>
            <div className="h-full w-full">
                <HistoryChart data={analysis}/>
            </div>
        </div>
    )
}
export default History