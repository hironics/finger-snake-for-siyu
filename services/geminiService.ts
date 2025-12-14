import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    // process.env.API_KEY is replaced by Vite at build time
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API_KEY is missing.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const generateSiyuWisdom = async (score: number, context: 'start' | 'gameover'): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) {
      return "Siyu Offline (Check API Key)";
    }

    const prompt = context === 'start' 
      ? "Write a short, cryptic, cyberpunk-style welcome message (max 15 words) for a game called 'Siyu Snake'. Be cool and mysterious."
      : `The player just finished a game of 'Siyu Snake' with a score of ${score}. Write a short, slightly mocking or encouraging cyberpunk-style comment (max 15 words) based on their performance.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Siyu is watching.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection to Siyu Network unstable...";
  }
};