
import { GoogleGenAI, Type } from "@google/genai";
import { dataService } from "./dataService";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const moderateContent = async (text: string): Promise<{ safe: boolean; feedback: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Moderate the following text for a Bangladeshi Madrasa Community platform. 
      Check for: Sectarian hate speech, inappropriate language, or misleading job information.
      Return JSON: { "safe": boolean, "feedback": "string in Bengali" }
      
      Text: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safe: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          },
          required: ["safe", "feedback"]
        }
      }
    });
    return JSON.parse(response.text || '{"safe":true, "feedback": ""}');
  } catch (e) {
    console.error("Moderation error:", e);
    return { safe: true, feedback: "" }; // Fallback to safe if AI fails
  }
};

export const askScholar = async (question: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a verified Islamic scholar from Bangladesh. Provide a helpful, moderate, and evidence-based answer in Bengali to the following question.
      Question: ${question}`,
      config: {
        systemInstruction: "Always reply in high-quality Bengali. Be respectful. Use 'আসসালামু আলাইকুম'.",
      },
    });
    return response.text;
  } catch (error) {
    return "দুঃখিত, প্রযুক্তিগত সমস্যার কারণে উত্তর প্রদান সম্ভব হচ্ছে না।";
  }
};

export const searchPlatform = async (query: string) => {
  const jobs = dataService.getJobs();
  const products = dataService.getProducts();
  
  const allData = {
    jobs: jobs.map(j => ({ id: j.id, text: `${j.title} ${j.institution}` })),
    products: products.map(p => ({ id: p.id, text: `${p.name} ${p.category}` })),
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Semantic search for "${query}" in: ${JSON.stringify(allData)}. Return IDs for relevant items.
      JSON Format: { "jobs": [ids], "products": [ids] }`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultIds = JSON.parse(response.text || '{}');
    return {
      jobs: jobs.filter(j => resultIds.jobs?.includes(j.id)),
      products: products.filter(p => resultIds.products?.includes(p.id)),
      resources: [], // Expandable
      posts: [], // Expandable
    };
  } catch (error) {
    const q = query.toLowerCase();
    return {
      jobs: jobs.filter(j => j.title.toLowerCase().includes(q)),
      products: products.filter(p => p.name.toLowerCase().includes(q)),
      resources: [],
      posts: [],
    };
  }
};
