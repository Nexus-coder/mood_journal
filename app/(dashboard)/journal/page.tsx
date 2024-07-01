import Entrycard from "@/components/entry-card";
import NewEntryCard from "@/components/new-entry";
import { analyze } from "@/utils/ai";
import getUserByClerkId from "@/utils/auth"
import { prisma } from "@/utils/db";
import Link from "next/link";

const getEntries = async () => {
    const user = await getUserByClerkId();
    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: user.id
        }
    })

    return entries

}

const JournalPage = async () => {
    const entries = await getEntries();
    return (
        <div className="p-10 bg-zinc-400/10 h-full">
            <h2>Journal</h2>
            <div className="grid grid-cols-3 gap-4">
                <NewEntryCard />
                {entries.map((entry) => (
                    <Link href={`/journal/${entry.id}`} key={entry.id}>
                        <Entrycard entry={entry} />
                    </Link>
                ))}
            </div>
        </div>)
}

export default JournalPage