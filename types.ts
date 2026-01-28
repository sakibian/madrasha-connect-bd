
export type UserRole = 'ADMIN' | 'INSTITUTION' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  institutionName?: string;
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

export interface Curriculum {
  id: string;
  title: string;
  board: 'Qawmi (Befaq)' | 'Alia';
  level: string;
  subjects: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Calligraphy' | 'Sunnah Food' | 'Books' | 'Modest Fashion';
  image: string;
  isFree?: boolean;
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

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  type: 'job' | 'community' | 'application';
  link?: string;
}
