//@ts-nocheck

'use client'

import { askQuestion } from "@/utils/api"
import { MouseEvent, useState } from "react"

const Question = () => {
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [answer, setAnswer] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        let answer = await askQuestion(value)
        setValue('')
        setAnswer(answer)
        setLoading(false)

        // do
    }
    return (

        <form onSubmit={handleSubmit}>
            <input
                className="px-2 py-2"
                placeholder="Enter your question here"
                type="text"
                onChange={(e) => setValue(e.target.value)}
            />
            <button onClick={(e)} type="submit" className="px-2 py-2 bg-red-600">Answer</button>
            {loading && <p>Loading...</p>}
            {answer && <p>{answer}</p>}
        </form>
    )
}

export default Question