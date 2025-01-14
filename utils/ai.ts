import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";

import { HarmBlockThreshold, HarmCategory, TaskType } from "@google/generative-ai";
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { loadQARefineChain } from "langchain/chains"


import z, { date } from "zod"

import { JournalEntry } from "@prisma/client";
import { Document } from "@langchain/core/documents"

const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        sentimentScore: z.
        number()
        .describe('sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'),
        mood: z
            .string()
            .describe('the mood of the person who wrote the journal entry.'),
        subject: z
            .string()
            .describe('the subject of the journal entry.'),
        negative: z
            .boolean()
            .describe(
                'is the journal entry negative? (i.e. does it contain negative emotions?).'
            ),
        summary: z
            .string()
            .describe('quick summary of the entire entry.'),
        color: z
            .string()
            .describe(
                'a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.'
            )
    })
)

const getPrompt = async (content: string) => {
    const format_instructions = parser.getFormatInstructions()

    const prompt = new PromptTemplate({
        template:
            'Analyze the following journal entry. Follow the intructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
        inputVariables: ['entry'],
        partialVariables: { format_instructions },
    })

    const input = await prompt.format({
        entry: content,
    })
    return input
}

// Text

export const analyze = async (content: string) => {
    const prompt = await getPrompt(content)
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-pro",
        maxOutputTokens: 2048,
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            },
        ],
    });


    // Batch and stream are also supported
    const res = await model.invoke([
        [
            "human",
            `${prompt}`,
        ],
    ]);
    try {
        return parser.parse(res.content as string)
    } catch (error) {
        return null
    }
}

export const qa = async (question:string, entries:JournalEntry[]) => {

    const docs = entries.map(
        (entry) => {
            return new Document({
                pageContent: entry.content,
                metadata: { source: entry.id, date: entry.createdAt },
            })
        })

    const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
    const chain = loadQARefineChain(model)
    const embeddings = new OpenAIEmbeddings()

    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings)

    const relevantDocs = await vectorStore.similaritySearch(question)
    const res = await chain.invoke({
        input_documents: relevantDocs,
        question
    })

    return res.output_text


}
