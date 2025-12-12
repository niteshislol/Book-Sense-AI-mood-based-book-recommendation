import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MoodResult } from "../types";

// Safely access the API key to prevent ReferenceError in browsers where 'process' is undefined
const apiKey = (typeof process !== "undefined" && process.env && process.env.API_KEY) || "AIzaSyDCoMj5cjZDF35ZnYR3HolHN3V9eXFjVBM"; // Use provided key as fallback
const ai = new GoogleGenAI({ apiKey });

export const analyzeMoodAndRecommend = async (base64Image: string): Promise<MoodResult> => {
  try {
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    // Schema for mood response only
    const moodSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        mood: { type: Type.STRING, description: "One of: Happy, Sad, Excited, Bored, Stressed, Romantic, Neutral" },
        confidence: { type: Type.NUMBER },
        suggestedGenres: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["mood", "confidence", "suggestedGenres"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        {
          text: "Analyze the facial expression to determine the mood. Return JSON with mood, confidence, and suggestedGenres (e.g. Comedy for Happy).",
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: moodSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as MoodResult;

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};
