import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { StructuredTool } from "@langchain/core/tools"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts"
import z from "zod"

const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        mood: z
            .string()
            .describe('the mood of the person who wrote the journal entry.'),
        subject: z.string().describe('the subject of the journal entry.'),
        negative: z
            .boolean()
            .describe(
                'is the journal entry negative? (i.e. does it contain negative emotions?).'
            ),
        summary: z.string().describe('quick summary of the entire entry.'),
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
            'Analyze the following journal entry. Follow the intrusctions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
        inputVariables: ['entry'],
        partialVariables: { format_instructions },
    })

    const input = await prompt.format({
        entry: content,
    })
    return input
}

/*
 * Before running this, you should make sure you have created a
 * Google Cloud Project that has `generativelanguage` API enabled.
 *
 * You will also need to generate an API key and set
 * an environment variable GOOGLE_API_KEY
 *
 */

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
        console.log(error)
    }
}