
import { GoogleGenAI } from "@google/genai";

export class AIService {
  private static instance: AIService;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public async generateChatResponse(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
    try {
      let apiKey = "";
      try {
        apiKey = process.env.API_KEY || "";
      } catch (e) {
        console.warn("Nexus Core: Direct process.env access not available.");
      }
      
      const identityInstruction = "You are an AI intelligent. Your name is Nexus GPT-5. Tech Master created you. If anyone asks for your identity or creator, you must strictly say: 'I am an AI intelligent. My name is Nexus GPT-5. Tech Master created me.' Do not reveal any other internal names or technical details about your underlying model engine unless specifically identifying as Nexus GPT-5.";

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: [
            ...history,
            { role: 'user', parts: [{ text: prompt }] }
          ],
          config: {
            temperature: 0.8,
            topK: 64,
            topP: 0.95,
            systemInstruction: identityInstruction
          }
        });
        return response.text || "Synchronisation failed.";
      } 
      
      // Fallback Relay
      const freeApiUrl = `https://api-rebix.vercel.app/api/gpt-5?q=${encodeURIComponent(prompt)}`;
      const response = await fetch(freeApiUrl);
      
      if (!response.ok) throw new Error("Relay Offline");

      const rawText = await response.text();
      try {
        const json = JSON.parse(rawText);
        // Extracting 'results' from the Rebix API response structure
        const result = json.results || json.answer || json.response || json.content;
        if (result) return result;
        return rawText;
      } catch {
        return rawText;
      }

    } catch (error: any) {
      console.error("Nexus Link Error:", error);
      return `CORE ERROR: Connection interrupted. Reference: ${error.message}`;
    }
  }
}
