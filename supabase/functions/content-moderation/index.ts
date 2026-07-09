
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || '';
const GEMINI_MODEL = 'gemini-2.0-flash';

const BANGLADESH_BLOCKLIST = [
  /ফিতনা/i,
  /তাকফির/i,
  /বিদআতী/i,
  /গুমরাহ/i,
  /মুরতাদ/i,
  /কাফির(দের|গুলো)?/i,
  /মুশরিক(দের|গুলো)?/i,
  /জিহাদি/i,
  /রাফেজি/i,
  /নাসিবি/i,
  /শিয়ার?(দের|গুলো)?/i,
  /সুন্নির?(দের|গুলো)?/i,
  /আহমদীয়া/i,
  /কাদিয়ানি/i,
  /লানত/i,
  /লাeনত/i,
  /অভিশাপ/i,
  /য\.?না/i,
  /বেহায়া/i,
  /ব্যভিচার/i,
  /পর্ণ/i,
  /বেশ্যা/i,
  /মাদক[\s_]?দ্রব্য/i,
  /গাঁজা/i,
  /ফেনসিডিল/i,
  /হেরোইন/i,
  /আইস/i,
  /ইয়াবা/i,
  /হত্যা/i,
  /খুন(i|ের|ো)?/i,
  /গলা[\s_]?কাটা/i,
  /বোমা/i,
  /আত্মঘাতী/i,
  /উগ্রবাদী/i,
  /সন্ত্রাসী/i,
];

const MODERATION_SYSTEM_PROMPT = `You are an Islamic content moderator for "Madrasa Connect BD", a Bangladeshi madrasa community platform.
Your role: Ensure all content aligns with Islamic ethics (akhlaq) and Bangladesh's community standards.

ALLOWED: Genuine religious questions, respectful debates on fiqh differences, educational content about any Islamic topic (including differences between madhabs), constructive criticism of ideas.

REJECT if content contains:
1. Sectarian hate speech (attacking specific groups as non-Muslim)
2. Explicit/indecent language
3. Calls to violence or illegal activity
4. Promotion of prohibited (haram) acts
5. Personal attacks on scholars or individuals

Return JSON format:
{
  "safe": boolean,
  "feedback": "string in Bengali — if unsafe, explain why and suggest correction",
  "flaggedCategories": ["string array of violated categories"]
}

When safe, feedback should be empty string and flaggedCategories should be empty array.`;

interface ModerationResult {
  safe: boolean;
  feedback: string;
  flaggedCategories: string[];
}

function layer1Regex(text: string): ModerationResult | null {
  for (const pattern of BANGLADESH_BLOCKLIST) {
    if (pattern.test(text)) {
      return {
        safe: false,
        feedback: 'আপনার কন্টেন্টে অনুপযুক্ত ভাষা সনাক্ত করা হয়েছে। দয়া করে সেটা পরিবর্তন করুন।',
        flaggedCategories: ['prohibited_keyword'],
      };
    }
  }
  return null;
}

async function layer2AI(text: string): Promise<ModerationResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      { role: 'user', parts: [{ text: MODERATION_SYSTEM_PROMPT }] },
      { role: 'user', parts: [{ text: `Moderate this content:\n\n${text}` }] },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 512,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          safe: { type: 'boolean' },
          feedback: { type: 'string' },
          flaggedCategories: { type: 'array', items: { type: 'string' } },
        },
        required: ['safe', 'feedback', 'flaggedCategories'],
      },
    },
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error('Gemini API error:', await res.text());
      return { safe: false, feedback: 'AI moderation unavailable — queued for manual review', flaggedCategories: ['service_unavailable'] };
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return JSON.parse(text);
  } catch (err) {
    console.error('Layer 2 error:', err);
    return { safe: false, feedback: 'AI moderation unavailable — queued for manual review', flaggedCategories: ['service_unavailable'] };
  }
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { text, content_type } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'text field required' }), { status: 400 });
    }

    let result = layer1Regex(text);
    let layer = 1;

    if (!result) {
      layer = 2;
      result = await layer2AI(text);
    }

    return new Response(JSON.stringify({
      safe: result.safe,
      feedback: result.feedback,
      flaggedCategories: result.flaggedCategories,
      layer,
      content_type: content_type || 'unknown',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
