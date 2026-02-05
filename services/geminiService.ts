
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
      // Defensive environment key retrieval for production hosting environments
      let apiKey = "";
      
      try {
        // @ts-ignore
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
          apiKey = process.env.API_KEY;
        }
      } catch (e) {
        console.warn("Nexus Core: Standard process.env access not available in this runtime.");
      }
      
      if (!apiKey) {
        // Provide clear feedback for the developer to fix deployment config
        return "NEXUS INTERRUPTED: API_KEY is missing from environment. Please add 'API_KEY' to your Vercel Project Environment Variables and trigger a new deployment.";
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
      return `LINK ERROR: ${error.message || 'The connection to the Nexus was lost'}. Check console for technical logs.`;
    }
  }
}
