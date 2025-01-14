import { Editor } from "@/components/editor";
import getUserByClerkId from "@/utils/auth"
import { prisma } from "@/utils/db";
import { Analysis, JournalEntry } from "@prisma/client";

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

    console.log('This is the returned entry', entry)


    return <div className="h-full w-full">
        <div className="h-full">
            <Editor entry={entry as JournalEntry & { analysis: Analysis } } />
        </div>
    </div>
}

export default JouranlId