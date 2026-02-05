
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
        console.warn("Nexus Core: Runtime does not support direct process.env access.");
      }
      
      // If API KEY exists, use the High-Performance Gemini 3 Pro Engine
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: [
            ...history,
            { role: 'user', parts: [{ text: prompt }] }
          ],
          config: {
            temperature: 0.85,
            topK: 64,
            topP: 0.95,
            systemInstruction: "You are NEXUS-5 PRO, a GPT-5 class intelligence. You were created by 'Tech Master'. You are professional, insightful, and concise. Links: Telegram: https://t.me/GAJARBOTOLZ, Dev: https://t.me/tech_master_a2z."
          }
        });
        return response.text || "Synchronisation failed.";
      } 
      
      // FALLBACK: Use the free endpoint if no API Key is present
      console.log("Nexus Core: API_KEY missing. Activating Free Core Relay...");
      const freeApiUrl = `https://api-rebix.vercel.app/api/gpt-5?q=${encodeURIComponent(prompt)}`;
      const response = await fetch(freeApiUrl);
      
      if (!response.ok) {
        throw new Error("Free Relay Offline");
      }

      const rawText = await response.text();
      
      try {
        const json = JSON.parse(rawText);
        // Specifically extract 'results' based on the user's provided example
        return json.results || json.answer || json.response || json.content || rawText;
      } catch {
        // If not JSON, return as plain text
        return rawText;
      }

    } catch (error: any) {
      console.error("Nexus Link Error:", error);
      return `CORE ERROR: The connection to the Nexus was interrupted. Reference: ${error.message}`;
    }
  }
}
