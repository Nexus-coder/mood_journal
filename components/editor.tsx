'use client'

import { updateEntry } from "@/utils/api";
import { Analysis, JournalEntry, Prisma } from "@prisma/client";
import { Span } from "next/dist/trace";
import { useState } from "react";
import { useAutosave } from "react-autosave";

export const Editor = ({ entry }: { entry: JournalEntry & { analysis: Analysis } }) => {
    const [value, setValue] = useState(entry?.content);
    const [analysis, setAnalysis] = useState(entry?.analysis);
    const [isLoading, setIsLoading] = useState(false);

    const { summary, subject, mood, color, negative } = analysis;

    let analysisData = [
        { name: 'Summary', value: summary },
        { name: 'Subject', value: subject },
        { name: 'Mood', value: mood },
        { name: 'Negative', value: negative ? 'True' : 'False' },
    ]

    useAutosave({
        data: value,
        onSave: async (_value) => {
            setIsLoading(true);
            const updated = await updateEntry(entry?.id as string, _value as string);
            console.log('This is the updated entry', updated)
            setAnalysis(updated.analysis);
            setIsLoading(false)
        }
    })
    console.log("This is loading", isLoading)
    return (
        <div className="h-full w-full grid grid-cols-3">
            <div className="col-span-2">
                {isLoading ? <span>loooaddding...</span> : null}
                <textarea className="h-full w-full text-xl p-8 outline-none" value={value} onChange={(e) => { setValue(e.target.value) }} />
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
    )
}
