
import { GoogleGenAI } from "@google/genai";

export async function enhanceImageDescription(name: string, currentDescription: string): Promise<string> {
  // Fix: Create instance right before API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As a professional art curator, enhance this image description to make it sound high-tech and valuable for an NFT marketplace.
    Title: ${name}
    Current Description: ${currentDescription}
    Keep the enhanced description concise and professional.`,
    config: {
      temperature: 0.7,
      // Fix: Avoid setting maxOutputTokens without thinkingBudget to prevent empty responses.
    }
  });
  
  // Fix: Access .text property directly as per guidelines.
  return response.text || currentDescription;
}

export async function suggestPrice(tags: string[]): Promise<number> {
  // Fix: Create instance right before API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on these art tags: ${tags.join(', ')}, suggest a competitive starting price in ETHO (a high-value Polygon altcoin). 
    Return ONLY a number representing the ETHO price.`,
    config: {
      temperature: 0.5,
      // Fix: Avoid setting maxOutputTokens without thinkingBudget to prevent empty responses.
    }
  });
  
  // Fix: Ensure response.text exists before calling trim()
  const text = response.text || "";
  const price = parseFloat(text.trim());
  return isNaN(price) ? 500 : price;
}
