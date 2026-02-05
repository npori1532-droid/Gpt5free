
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
        console.warn("Nexus Core: Env access not available.");
      }
      
      const identityInstruction = "I am an AI intelligent. My name is Nexus GPT-5. Tech Master created me. If anyone asks who you are, what your name is, or who created you, you MUST reply with exactly: 'I am an AI intelligent. My name is Nexus GPT-5. Tech Master created me.' Do not provide any other name or background info.";

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
            topK: 40,
            topP: 0.9,
            systemInstruction: identityInstruction
          }
        });
        return response.text || "Neural link unstable. Retry.";
      } 
      
      // Fallback Relay to Free API
      const freeApiUrl = `https://api-rebix.vercel.app/api/gpt-5?q=${encodeURIComponent(prompt)}`;
      const response = await fetch(freeApiUrl);
      
      if (!response.ok) throw new Error("RELAY_OFFLINE");

      const rawText = await response.text();
      try {
        const json = JSON.parse(rawText);
        // The Rebix API returns { "results": "..." }
        return json.results || json.answer || json.response || rawText;
      } catch {
        return rawText;
      }

    } catch (error: any) {
      console.error("Nexus Link Error:", error);
      return `CORE ERROR: Connection interrupted. Please check your network.`;
    }
  }
}
