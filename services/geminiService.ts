
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
        // Access process.env.API_KEY directly as per requirements
        apiKey = process.env.API_KEY || "";
      } catch (e) {
        console.warn("Nexus Core: Runtime does not support process.env access.");
      }
      
      if (!apiKey) {
        return "NEXUS INTERRUPTED: The API_KEY is not configured in your Vercel Project Settings. Please add 'API_KEY' to your Environment Variables in the Vercel dashboard and trigger a new deployment.";
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          temperature: 0.8,
          topK: 64,
          topP: 0.95,
          systemInstruction: "You are NEXUS-5 PRO. A GPT-5 class intelligence created by Tech Master. You are highly analytical, professional, and concise. Ensure your responses demonstrate superior reasoning. Links: Telegram Channel: https://t.me/GAJARBOTOLZ, Developer: https://t.me/tech_master_a2z."
        }
      });

      return response.text || "Synchronisation failed. Nexus core is offline.";
    } catch (error: any) {
      console.error("Nexus Link Error:", error);
      return `CORE ERROR: ${error.message || 'The connection to the Nexus was interrupted'}. Verify your deployment settings.`;
    }
  }
}
