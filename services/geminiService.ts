import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSongVibe = async (songName: string): Promise<string> => {
  if (!apiKey) return "AI insights unavailable (Missing API Key)";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a concise, technical 1-sentence analysis of the likely musical style, key instrumentation, and production era for a track titled "${songName}". Do not use poetic metaphors.`,
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate analysis.";
  }
};