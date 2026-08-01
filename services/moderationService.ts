
import { callEdgeFunction } from './edgeFunctions';

interface ModerationResult {
  safe: boolean;
  pending_review: boolean;
  feedback: string;
  flaggedCategories: string[];
  layer: number;
  content_type: string;
}

const fallback = (contentType: string): ModerationResult => ({
  safe: false,
  pending_review: true,
  feedback: 'Moderation service unavailable — queued for manual review',
  flaggedCategories: [],
  layer: 0,
  content_type: contentType,
});

export const moderateContent = async (
  text: string,
  contentType: string = 'general'
): Promise<ModerationResult> => {
  const data = await callEdgeFunction<ModerationResult>('content-moderation', {
    text,
    content_type: contentType,
  });
  return data ?? fallback(contentType);
};
