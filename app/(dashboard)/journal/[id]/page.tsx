import { Editor } from "@/components/editor";
import getUserByClerkId from "@/utils/auth"
import { prisma } from "@/utils/db";

const getEntry = async (id: string) => {
    const user = await getUserByClerkId();
    const findEntry = prisma.journalEntry.findUnique({
        where: {
            userId_id: {
                id,
                userId: user.id
            },
        }
        ,
        include: {
            analysis: true
        }
    })
    return findEntry;
}

const JouranlId = async ({ params }: { params: { id: string } }) => {
    const entry = await getEntry(params.id);
    const { summary, subject, mood, color, negative } = entry?.analysis
    let analysisData = [
        { name: 'Summary', value: summary },
        { name: 'Subject', value: subject },
        { name: 'Mood', value: mood },
        { name: 'Negative', value: negative ? 'True' : 'False' },
    ]
    return <div className="h-full w-full grid grid-cols-3">
        <div className="col-span-2">
            <Editor entry={entry} />
        </div>
        <div className="border-l border-black/10">
            <div className=" px-6 py-10" style={{ backgroundColor: color }}>
                <h2 className="text-2xl">
                    Analysis
                </h2>
            </div>
            <div>
                <ul>
                    {analysisData.map((data, index) => (
                        <li key={index} className="py-4 px-4 border-t border-b border-black/10">
                            <span className="text-lg font-semibold"> {data.name}</span>
                            <span>{data.value}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    </div>
}

export default JouranlId