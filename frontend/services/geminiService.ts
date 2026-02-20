import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MoodResult } from "../types";

// Safely access the API key to prevent ReferenceError in browsers where 'process' is undefined
// Using the user-provided API key directly to prevent environment variable issues
const apiKey = "API KEY HERE";
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

export interface BookSummaryResult {
  summary: string;
  price: {
    inr: string;
    usd: string;
  };
}

export const generateBookSummary = async (title: string, author: string): Promise<BookSummaryResult | null> => {
  try {
    if (!apiKey) throw new Error("API Key is missing");

    const summarySchema: Schema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        price: {
          type: Type.OBJECT,
          properties: {
            inr: { type: Type.STRING, description: "Average price range in India (e.g. ₹300-500)" },
            usd: { type: Type.STRING, description: "Average price range in US (e.g. $10-15)" }
          },
          required: ["inr", "usd"]
        }
      },
      required: ["summary", "price"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        text: `Write an engaging summary for the book "${title}" by ${author}. Keep it between 50-150 words. Also estimate the average price range for this book in India (INR) and the US (USD). Return JSON.`
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: summarySchema,
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as BookSummaryResult;

  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return null;
  }
};

// Fallback: Get recommendations when local search fails
export const getFallbackRecommendations = async (query: string): Promise<any[]> => {
  try {
    if (!apiKey) throw new Error("API Key is missing");

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          author: { type: Type.STRING },
          description: { type: Type.STRING },
          genre: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          year: { type: Type.NUMBER }
        },
        required: ["title", "author", "description", "genre", "rating", "year"]
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        text: `The user searched for "${query}" but we found no exact matches in our database. 
        Recommend 5 relevant books that match this query. 
        Return a JSON array. 
        For each book, provide a title, author, brief description, genre, realistic rating (0-10), and publication year.`
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) return [];

    const results = JSON.parse(text);
    // Add placeholder images and simulated prices
    return results.map((book: any) => {
      // Simple hash for price
      let hash = 0;
      for (let i = 0; i < book.title.length; i++) hash = book.title.charCodeAt(i) + ((hash << 5) - hash);
      const price = 10 + Math.abs(hash % 41);

      return {
        ...book,
        price,
        coverUrl: `https://placehold.co/400x600/2a2a2a/FFF?text=${encodeURIComponent(book.title)}`
      };
    });

  } catch (error) {
    console.error("Gemini Fallback Error:", error);
    return [];
  }
};

// Personalization: Recommend books based on history
export const getPersonalizedRecommendations = async (historyTitles: string[]): Promise<any[]> => {
  try {
    if (!apiKey) throw new Error("API Key is missing");
    if (historyTitles.length === 0) return [];

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          author: { type: Type.STRING },
          description: { type: Type.STRING },
          genre: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          year: { type: Type.NUMBER }
        },
        required: ["title", "author", "description", "genre", "rating", "year"]
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        text: `The user has read and liked the following books: ${historyTitles.join(", ")}.
        Recommend 8 NEW books they might enjoy based on this taste.
        Do not recommend books they have already read.
        Return a JSON array.`
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) return [];

    const results = JSON.parse(text);
    return results.map((book: any) => {
      // Simple hash for price
      let hash = 0;
      for (let i = 0; i < book.title.length; i++) hash = book.title.charCodeAt(i) + ((hash << 5) - hash);
      const price = 10 + Math.abs(hash % 41);

      return {
        ...book,
        price,
        coverUrl: `https://placehold.co/400x600/1a1a1a/FFF?text=${encodeURIComponent(book.title)}`
      };
    });

  } catch (error) {
    console.error("Gemini Personalization Error:", error);
    return [];
  }
};
