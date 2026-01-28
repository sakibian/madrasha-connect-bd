
import { User, UserRole } from '../types';

const AUTH_KEY = 'madrasa_connect_user';
const USERS_COLLECTION_KEY = 'madrasa_connect_all_users';

const DEFAULT_USERS: Record<string, User> = {
  'admin@madrasa.bd': {
    id: 'u-1',
    name: 'আব্দুর রহমান',
    email: 'admin@madrasa.bd',
    role: 'ADMIN',
    avatar: 'https://picsum.photos/seed/admin/100/100'
  },
  'hathazari@madrasa.bd': {
    id: 'u-2',
    name: 'মাওলানা ইউসুফ',
    email: 'hathazari@madrasa.bd',
    role: 'INSTITUTION',
    institutionName: 'হাটহাজারী মাদ্রাসা',
    avatar: 'https://picsum.photos/seed/inst/100/100'
  },
  'student@madrasa.bd': {
    id: 'u-3',
    name: 'মো. সালমান',
    email: 'student@madrasa.bd',
    role: 'USER',
    avatar: 'https://picsum.photos/seed/student/100/100'
  }
};

const getStoredUsers = (): Record<string, User> => {
  const stored = localStorage.getItem(USERS_COLLECTION_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_USERS;
};

export const login = (email: string): User | null => {
  const users = getStoredUsers();
  const user = users[email];
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('auth_change'));
    return user;
  }
  return null;
};

export const registerUser = (userData: Omit<User, 'id' | 'avatar'>): User => {
  const users = getStoredUsers();
  const newUser: User = {
    ...userData,
    id: `u-${Date.now()}`,
    avatar: `https://picsum.photos/seed/${userData.email}/100/100`
  };
  users[userData.email] = newUser;
  localStorage.setItem(USERS_COLLECTION_KEY, JSON.stringify(users));
  return newUser;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new CustomEvent('auth_change'));
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
};
