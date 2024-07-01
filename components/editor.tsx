'use client'

import { updateEntry } from "@/utils/api";
import { Span } from "next/dist/trace";
import { useState } from "react";
import { useAutosave } from "react-autosave";

type entry = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    userId: string;
}

export const Editor = ({ entry }: { entry: entry | null }) => {
    const [value, setValue] = useState(entry?.content);
    const [isLoading, setIsLoading] = useState(false)
    useAutosave({
        data: value,
        onSave: async (_value) => {
            setIsLoading(true);
            const updated = await updateEntry(entry?.id as string, _value as string);
            setIsLoading(false)
        }
    })
    console.log("This is loading",isLoading)
    return (
        <div className="h-full w-full">
            {isLoading ? <span>loooaddding...</span> : null}
            <textarea className="h-full w-full text-xl p-8 outline-none" value={value} onChange={(e) => { setValue(e.target.value) }} />
        </div>
    )
}
