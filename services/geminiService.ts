import { GoogleGenAI, Content, GenerateContentParameters, Part } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants.ts';
import type { ChatMessageFile } from '../types.ts';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function* sendMessageStreamToAI(
    history: Content[],
    message: string, 
    file: ChatMessageFile | undefined,
    internetAccess: boolean,
    signal: AbortSignal
): AsyncGenerator<{ text: string, groundingMetadata: any | null }> {
    try {
        const messageParts: Part[] = [];

        if (message.trim()) {
            messageParts.push({ text: message });
        }

        if (file) {
            messageParts.push({
                inlineData: {
                    mimeType: file.type,
                    data: file.base64Data,
                }
            });
        }
        
        if (messageParts.length === 0) return;

        const contents: Content[] = [...history, { role: 'user', parts: messageParts }];

        const request: GenerateContentParameters = {
            model: 'gemini-2.0-flash:generateContent',
            contents,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        };

        if (internetAccess) {
            if (!request.config) {
                request.config = {};
            }
            request.config.tools = [{ googleSearch: {} }];
        }

        const responseStream = await ai.models.generateContentStream(request);

        if (signal.aborted) return;
        
        let groundingMetadata: any | null = null;

        for await (const chunk of responseStream) {
            if (signal.aborted) {
                return;
            }
            if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                 groundingMetadata = chunk.candidates[0].groundingMetadata.groundingChunks;
            }
            yield { text: chunk.text, groundingMetadata };
        }

    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log('Stream aborted by user.');
          throw error;
        }
        console.error("Error sending message to AI:", error);
        yield { text: "I seem to be encountering a technical difficulty. My apologies. Please try again in a few moments.", groundingMetadata: null };
    }
}
