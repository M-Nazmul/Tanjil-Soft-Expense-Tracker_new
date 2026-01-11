import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const getFinancialInsights = async (transactions: Transaction[]) => {
  if (transactions.length === 0) return "Add some transactions to get AI insights!";

  const summary = transactions.map(t => `${t.date}: ${t.type === 'income' ? '+' : '-'}$${t.amount} (${t.category} - ${t.title})`).join('\n');

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional financial advisor. Analyze the following transaction history and provide 3 concise, actionable pieces of advice to improve the user's financial health. Format the response as a bulleted list. Keep it encouraging and high-end SaaS tone.
      
      Transactions:
      ${summary}`,
      config: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    return response.text || "I couldn't generate insights at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI financial advisor is currently offline. Please check your spending patterns manually.";
  }
};