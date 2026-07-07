
const MODERATION_FN_URL = 'https://qazcxnldkrklxdmunfgj.functions.supabase.co/content-moderation';

interface ModerationResult {
  safe: boolean;
  feedback: string;
  flaggedCategories: string[];
  layer: number;
  content_type: string;
}

export const moderateContent = async (text: string, contentType: string = 'general'): Promise<ModerationResult> => {
  try {
    const res = await fetch(MODERATION_FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, content_type: contentType }),
    });
    if (!res.ok) {
      console.error('Moderation API error:', res.status);
      return { safe: true, feedback: '', flaggedCategories: [], layer: 0, content_type: contentType };
    }
    return await res.json();
  } catch (err) {
    console.error('Moderation service error:', err);
    return { safe: true, feedback: '', flaggedCategories: [], layer: 0, content_type: contentType };
  }
};
