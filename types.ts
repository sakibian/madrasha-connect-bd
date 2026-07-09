
export type UserRole = 'ADMIN' | 'INSTITUTION' | 'SCHOLAR' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  institutionName?: string;
  banned?: boolean;
}

export interface Institution {
  id: string;
  name: string;
  type: 'Qawmi' | 'Alia' | 'Mosque';
  location: string;
  district: string;
  established: string;
  verified: boolean;
  studentCount?: number;
  image: string;
}

export interface Scholar {
  id: string;
  userId: string;
  name: string;
  title: string;
  specialization: string;
  institution: string;
  image: string;
  verified: boolean;
  location: string;
  answersGiven?: number;
}

export interface SadaqahProject {
  id: string;
  title: string;
  institution: string;
  category: 'Infrastructure' | 'Food' | 'Books' | 'Emergency';
  goal: number;
  raised: number;
  description: string;
  image: string;
}

export interface Job {
  id: string;
  title: string;
  institution: string;
  location: string;
  salary: string;
  type: 'Imam' | 'Teacher' | 'Muazzin' | 'Staff';
  postedAt: string;
  verified: boolean;
  contactInfo?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Calligraphy' | 'Sunnah Food' | 'Books' | 'Modest Fashion';
  image: string;
  isFree?: boolean;
  isVector?: boolean;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  category: 'Deen-101' | 'Tajweed' | 'History';
  thumbnail: string;
  isEnrolled?: boolean;
  progress?: number;
}

export interface ForumPost {
  id: string;
  author: string;
  authorId?: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  verified: boolean;
}

export interface UserSkill {
  id: string;
  userId: string;
  skill: string;
  endorsementsCount?: number;
  endorsedByMe?: boolean;
  createdAt?: string;
}

export interface ScholarPortfolioItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  url?: string;
  type: 'publication' | 'video' | 'article' | 'lecture' | 'other';
  createdAt?: string;
}

export interface SkillEndorsement {
  id: string;
  skillId: string;
  endorsedBy: string;
  createdAt?: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Fatwa {
  id: string;
  question: string;
  category: 'Ibadah' | 'Muamalah' | 'Family' | 'Social' | 'Other';
  askedBy: string;
  askedAt: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  answerSources?: string[];
  aiSuggestion?: string;
  status: 'PENDING' | 'ANSWERED' | 'REJECTED';
}

export interface Source {
  id: string;
  type: 'quran' | 'hadith' | 'scholarly' | 'book' | 'other';
  reference: string;
  text?: string;
  url?: string;
}

export interface ContentFlag {
  id: string;
  content_type: string;
  content_id: string;
  flagged_by: string;
  reason: string;
  status: 'open' | 'dismissed' | 'resolved';
  created_at: string;
}

export interface ContentVersion {
  id: string;
  contentType: string;
  contentId: string;
  title?: string;
  body: string;
  changedBy: string;
  changeSummary?: string;
  createdAt: string;
}

export interface ScholarApplication {
  id: string;
  userId: string;
  title: string;
  specialization: string;
  institution: string;
  location: string;
  bio: string;
  credentials: string[];
  references: string[];
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  type: 'job' | 'community' | 'application';
  link?: string;
}

export interface UserXP {
  id: string;
  userId: string;
  xp: number;
  level: number;
  updatedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  xp_required: number;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  badge?: Badge;
}

export interface XPEvent {
  id: string;
  userId: string;
  action: string;
  xp: number;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName?: string;
  action: string;
  targetType: string;
  targetId: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId?: string;
  referralCode: string;
  status: 'pending' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export const XP_ACTIONS = {
  ASK_FATWA: { action: 'ask_fatwa', xp: 10 },
  ANSWER_FATWA: { action: 'answer_fatwa', xp: 50 },
  FORUM_POST: { action: 'forum_post', xp: 15 },
  FORUM_COMMENT: { action: 'forum_comment', xp: 5 },
  VERIFIED_SCHOLAR: { action: 'verified_scholar', xp: 100 },
  POST_JOB: { action: 'post_job', xp: 20 },
  APPLY_JOB: { action: 'apply_job', xp: 10 },
  ENROLL_COURSE: { action: 'enroll_course', xp: 25 },
  COMPLETE_COURSE: { action: 'complete_course', xp: 50 },
  FLAG_CONTENT: { action: 'flag_content', xp: 2 },
  REFERRAL_SIGNUP: { action: 'referral_signup', xp: 30 },
} as const;

export const getLevel = (xp: number): number => Math.floor(Math.sqrt(xp / 100)) + 1;
export const getXpForNextLevel = (level: number): number => (level * 2 - 1) * 100;
export const getLevelProgress = (xp: number): { current: number; next: number; progress: number } => {
  const level = getLevel(xp);
  const currentLevelXp = (level - 1) * (level - 1) * 100;
  const nextLevelXp = level * level * 100;
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  return { current: currentLevelXp, next: nextLevelXp, progress };
};
