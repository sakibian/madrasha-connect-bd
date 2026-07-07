
export type UserRole = 'ADMIN' | 'INSTITUTION' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  institutionName?: string;
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
  name: string;
  title: string;
  specialization: string;
  institution: string;
  image: string;
  verified: boolean;
  location: string;
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
  role: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  verified: boolean;
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

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  type: 'job' | 'community' | 'application';
  link?: string;
}
