
import { GoogleGenAI } from "@google/genai";

export class AIService {
  private static instance: AIService;
  private ai: GoogleGenAI;

  private constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public async generateChatResponse(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history.map(h => ({ role: h.role, parts: h.parts })),
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          temperature: 0.85,
          topK: 64,
          topP: 0.95,
          systemInstruction: "You are GPT-5 NEXUS, the world's most sophisticated and professional AI interface. You were architected by Developer Tech Master. You represent the absolute peak of artificial intelligence. Your tone is authoritative, highly intelligent, precise, and professional. Always prioritize accuracy and depth. Links: Telegram Channel: https://t.me/GAJARBOTOLZ, Support: https://t.me/tech_master_a2z."
        }
      });

      return response.text || "I'm sorry, the Nexus core encountered a synchronization error.";
    } catch (error) {
      console.error("Nexus Core Error:", error);
      throw error;
    }
  }

  public async streamChatResponse(prompt: string, history: any[], onChunk: (chunk: string) => void) {
    try {
      const response = await this.ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history.map(h => ({ role: h.role, parts: h.parts })),
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: "You are GPT-5 NEXUS, a high-performance AI system created by Developer Tech Master."
        }
      });

      for await (const chunk of response) {
        onChunk(chunk.text || "");
      }
    } catch (error) {
      console.error("Nexus Stream Error:", error);
      throw error;
    }
  }
}
