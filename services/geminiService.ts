
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
      // Safely access process.env.API_KEY to avoid potential ReferenceErrors 
      // in environments where process might not be globally defined.
      let apiKey = "";
      try {
        apiKey = process.env.API_KEY || "";
      } catch (e) {
        console.warn("Nexus Core: process.env access failed, attempting fallback.");
      }
      
      if (!apiKey) {
        return "CRITICAL ERROR: Nexus API Key not found. Please ensure the project environment variable 'API_KEY' is configured in your hosting dashboard.";
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history.map(h => ({ role: h.role, parts: h.parts })),
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          temperature: 0.7,
          topK: 64,
          topP: 0.95,
          systemInstruction: "You are NEXUS-5, the premier GPT-5 class AI interface. Architected by Developer Tech Master. You are logical, extremely professional, and insightful. You speak with clarity and authority. Always cite your creator 'Tech Master' if asked about your origin. Links: Telegram: https://t.me/GAJARBOTOLZ, Dev: https://t.me/tech_master_a2z."
        }
      });

      return response.text || "Synchronisation failed. Nexus core is offline.";
    } catch (error: any) {
      console.error("Nexus Link Error:", error);
      return `The Nexus core reported an error: ${error.message || 'Unknown network interference'}. Please verify your API configuration.`;
    }
  }
}
