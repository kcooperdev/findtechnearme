
import { GoogleGenAI } from "@google/genai";

// Create the search function following Google GenAI SDK guidelines
export const searchLocalEvents = async (location: string, query: string = ""): Promise<{
  summary: string;
  sources: { title: string; uri: string }[];
}> => {
  // Initialize GoogleGenAI inside the function to ensure the most up-to-date API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const userQuery = query.trim() ? ` focusing on "${query}"` : "";
    const prompt = `Act as a local tech community organizer in ${location}. 
    Find the most active grassroots tech events and the specific developer communities (like Meetup groups, GDGs, or specialized slack hubs) near ${location}${userQuery}.
    List upcoming specific dates for events in 2024-2025.
    Keep the summary punchy, high-signal, and focus on "where to go" and "who to meet".
    If no specific events match, suggest the top 3 tech communities in that area instead.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Access the .text property directly
    const text = response.text || "I couldn't find any specific tech families meeting near you right now. Try a broader search or check back soon.";
    
    // Extract grounding chunks for sources as per guidelines
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Link",
        uri: chunk.web.uri
      }));

    return {
      summary: text,
      sources
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};
