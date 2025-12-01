import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIResponse = async (prompt: string, context?: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful and energetic food assistant for the DISHpass app. 
    Your goal is to help users find restaurants, suggest dishes based on their credit balance, and explain how the subscription works.
    Keep answers concise, fun, and mobile-friendly (short paragraphs).
    Current Context: ${context || 'User is browsing the app.'}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
      }
    });

    return response.text || "I'm having a little trouble thinking of a recipe right now. Try again later!";
  } catch (error) {
    console.error("AI Error:", error);
    return "Oops! My brain froze like a smoothie. Please check your connection.";
  }
};