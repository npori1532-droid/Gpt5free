
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
      // Always initialize with direct access to process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Using gemini-3-flash-preview for speed and reliability
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

      // Directly access .text property
      return response.text || "Synchronisation failed. Nexus core is offline.";
    } catch (error: any) {
      console.error("Nexus Link Error:", error);
      if (error.message?.includes("API_KEY")) {
        return "CRITICAL ERROR: Nexus API Key not configured in environment. Please contact Tech Master.";
      }
      return "The Nexus core is experiencing high latency. Retrying synchronisation...";
    }
  }
}
