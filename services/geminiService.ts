
import { dataService } from "./dataService";

const EDGE_FN_URL = 'https://qazcxnldkrklxdmunfgj.functions.supabase.co/gemini-proxy';

const callEdgeFn = async (body: {
  action: string;
  prompt: string;
  systemInstruction?: string;
  schema?: Record<string, unknown>;
}) => {
  try {
    const res = await fetch(EDGE_FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.text || null;
  } catch {
    return null;
  }
};

const moderationSchema = {
  type: 'object',
  properties: {
    safe: { type: 'boolean' },
    feedback: { type: 'string' },
  },
  required: ['safe', 'feedback'],
};

export const moderateContent = async (text: string): Promise<{ safe: boolean; feedback: string }> => {
  const result = await callEdgeFn({
    action: 'moderate',
    prompt: `Moderate the following text for a Bangladeshi Madrasa Community platform.
Check for: Sectarian hate speech, inappropriate language, or misleading job information.
Return JSON: { "safe": boolean, "feedback": "string in Bengali" }

Text: ${text}`,
    schema: moderationSchema,
  });
  if (!result) return { safe: true, feedback: '' };
  try {
    return JSON.parse(result);
  } catch {
    return { safe: true, feedback: '' };
  }
};

export const askScholar = async (question: string) => {
  const result = await callEdgeFn({
    action: 'ask',
    systemInstruction: "Always reply in high-quality Bengali. Be respectful. Use 'আসসালামু আলাইকুম'.",
    prompt: `You are a verified Islamic scholar from Bangladesh. Provide a helpful, moderate, and evidence-based answer in Bengali to the following question.
Question: ${question}`,
  });
  return result || 'দুঃখিত, প্রযুক্তিগত সমস্যার কারণে উত্তর প্রদান সম্ভব হচ্ছে না।';
};

export const searchPlatform = async (query: string) => {
  const [jobs, products] = await Promise.all([dataService.getJobs(), dataService.getProducts()]);

  const allData = {
    jobs: jobs.map(j => ({ id: j.id, text: `${j.title} ${j.institution}` })),
    products: products.map(p => ({ id: p.id, text: `${p.name} ${p.category}` })),
  };

  const result = await callEdgeFn({
    action: 'search',
    prompt: `Semantic search for "${query}" in: ${JSON.stringify(allData)}. Return IDs for relevant items.
JSON Format: { "jobs": [ids], "products": [ids] }`,
  });

  if (result) {
    try {
      const resultIds = JSON.parse(result);
      return {
        jobs: jobs.filter(j => resultIds.jobs?.includes(j.id)),
        products: products.filter(p => resultIds.products?.includes(p.id)),
        resources: [],
        posts: [],
      };
    } catch { /* fall through */ }
  }

  const q = query.toLowerCase();
  return {
    jobs: jobs.filter(j => j.title.toLowerCase().includes(q)),
    products: products.filter(p => p.name.toLowerCase().includes(q)),
    resources: [],
    posts: [],
  };
};
