
import { Job, Product, ForumPost, User, Fatwa } from '../types';
import { MOCK_JOBS, MOCK_PRODUCTS, MOCK_POSTS, MOCK_FATWAS } from '../data/mockData';

const KEYS = {
  JOBS: 'mc_jobs_v2',
  PRODUCTS: 'mc_products_v2',
  POSTS: 'mc_posts_v2',
  FATWAS: 'mc_fatwas_v1',
  RESOURCES: 'mc_resources_v2',
  USERS: 'madrasa_connect_all_users'
};

const get = <T>(key: string, initial: T): T => {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : initial;
  } catch (e) {
    return initial;
  }
};

const set = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('data_update', { detail: { key } }));
};

// Initial Database Seeding
const seedData = () => {
  if (!localStorage.getItem(KEYS.JOBS)) set(KEYS.JOBS, MOCK_JOBS);
  if (!localStorage.getItem(KEYS.PRODUCTS)) set(KEYS.PRODUCTS, MOCK_PRODUCTS);
  if (!localStorage.getItem(KEYS.POSTS)) set(KEYS.POSTS, MOCK_POSTS);
  if (!localStorage.getItem(KEYS.FATWAS)) set(KEYS.FATWAS, MOCK_FATWAS);
};

seedData();

export const dataService = {
  // --- Jobs Backend ---
  getJobs: () => get<Job[]>(KEYS.JOBS, []),
  
  saveJob: (job: Job) => {
    const jobs = dataService.getJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    if (index > -1) {
      jobs[index] = job;
    } else {
      jobs.unshift(job);
    }
    set(KEYS.JOBS, jobs);
  },

  // Added verifyJob to resolve the missing property error in ProfessionalHub.tsx
  verifyJob: (id: string) => {
    const jobs = dataService.getJobs();
    const index = jobs.findIndex(j => j.id === id);
    if (index > -1) {
      jobs[index].verified = true;
      set(KEYS.JOBS, jobs);
    }
  },

  deleteJob: (id: string) => {
    const jobs = dataService.getJobs().filter(j => j.id !== id);
    set(KEYS.JOBS, jobs);
  },

  // --- Fatwa Backend ---
  getFatwas: () => get<Fatwa[]>(KEYS.FATWAS, []),
  
  saveFatwa: (fatwa: Fatwa) => {
    const fatwas = dataService.getFatwas();
    const index = fatwas.findIndex(f => f.id === fatwa.id);
    if (index > -1) {
      fatwas[index] = fatwa;
    } else {
      fatwas.unshift(fatwa);
    }
    set(KEYS.FATWAS, fatwas);
  },

  // --- Marketplace Backend ---
  getProducts: () => get<Product[]>(KEYS.PRODUCTS, []),
  
  saveProduct: (product: Product) => {
    const products = dataService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    set(KEYS.PRODUCTS, products);
  },

  deleteProduct: (id: string) => {
    const products = dataService.getProducts().filter(p => p.id !== id);
    set(KEYS.PRODUCTS, products);
  },

  getPosts: () => get<ForumPost[]>(KEYS.POSTS, []),

  getUsers: (): User[] => {
    const stored = localStorage.getItem(KEYS.USERS);
    if (!stored) return [];
    const usersMap = JSON.parse(stored);
    return Object.values(usersMap);
  },

  updateUser: (user: User) => {
    const stored = JSON.parse(localStorage.getItem(KEYS.USERS) || '{}');
    stored[user.email] = user;
    localStorage.setItem(KEYS.USERS, JSON.stringify(stored));
    window.dispatchEvent(new CustomEvent('auth_change'));
  }
};
