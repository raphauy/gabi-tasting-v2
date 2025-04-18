import { openai } from '@ai-sdk/openai';
import { CoreMessage, generateText } from 'ai';
import { z } from 'zod';

export async function generateAIText(system: string, prompt: string, pdfUrl?: string) {
    const messages: CoreMessage[] = [
        {
            role: "system",
            content: prompt
        }
    ]
    if (pdfUrl) {
        messages.push({
            role: "user",
            content: [
                {
                    type: "file",
                    data: new URL(pdfUrl),
                    mimeType: "application/pdf"
                }
            ]
        })
    }
    console.log(messages)
    const { text } = await generateText({
        model: openai('gpt-4.1'),
        system,
        messages: messages
    });
    return text
}
