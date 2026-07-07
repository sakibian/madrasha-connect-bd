import { Job, Product, ForumPost, Fatwa, Institution, Course, Scholar, SadaqahProject, User, Source } from '../types';
import { supabase } from './supabase';

const CACHE_KEYS = {
  INSTITUTIONS: 'mc_cache_institutions',
  JOBS: 'mc_cache_jobs',
  PRODUCTS: 'mc_cache_products',
  COURSES: 'mc_cache_courses',
  FATWAS: 'mc_cache_fatwas',
  POSTS: 'mc_cache_posts',
  SCHOLARS: 'mc_cache_scholars',
  SADAQAH: 'mc_cache_sadaqah',
  EVENTS: 'mc_cache_events',
  USERS: 'mc_cache_users',
};

const cacheGet = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const cacheSet = (key: string, data: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { }
};

export const dataService = {
  // --- Institutions ---
  getInstitutions: async (): Promise<Institution[]> => {
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .order('name');
    if (error) return cacheGet<Institution[]>(CACHE_KEYS.INSTITUTIONS) || [];
    cacheSet(CACHE_KEYS.INSTITUTIONS, data);
    return data.map(i => ({
      id: i.id,
      name: i.name,
      type: i.type as Institution['type'],
      location: i.location,
      district: i.district,
      established: i.established || '',
      verified: i.verified,
      studentCount: i.student_count,
      image: i.image_url || 'https://picsum.photos/seed/institution/400/300',
    }));
  },

  getInstitutionById: async (id: string): Promise<Institution | null> => {
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      name: data.name,
      type: data.type as Institution['type'],
      location: data.location,
      district: data.district,
      established: data.established || '',
      verified: data.verified,
      studentCount: data.student_count,
      image: data.image_url || 'https://picsum.photos/seed/institution/400/300',
    };
  },

  // --- Jobs ---
  getJobs: async (): Promise<Job[]> => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, institutions(name)')
      .in('status', ['verified', 'pending'])
      .order('created_at', { ascending: false });
    if (error) return cacheGet<Job[]>(CACHE_KEYS.JOBS) || [];
    cacheSet(CACHE_KEYS.JOBS, data);
    return data.map(j => ({
      id: j.id,
      title: j.title,
      institution: (j as any).institutions?.name || j.institution_id || '',
      location: j.location,
      salary: j.salary || '',
      type: j.type as Job['type'],
      postedAt: j.created_at || '',
      verified: j.status === 'verified',
      contactInfo: j.contact_info,
    }));
  },

  saveJob: async (job: Job) => {
    const { error } = await supabase.from('jobs').upsert({
      id: job.id,
      title: job.title,
      type: job.type,
      location: job.location,
      salary: job.salary,
      contact_info: job.contactInfo,
      status: 'pending',
    });
    if (error) throw error;
  },

  verifyJob: async (id: string) => {
    await supabase.from('jobs').update({ status: 'verified' }).eq('id', id);
  },

  deleteJob: async (id: string) => {
    await supabase.from('jobs').delete().eq('id', id);
  },

  // --- Fatwas ---
  getFatwas: async (): Promise<Fatwa[]> => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    let query = supabase
      .from('fatwas')
      .select('*')
      .order('created_at', { ascending: false });

    if (!user) {
      query = query.eq('status', 'answered');
    }

    const { data, error } = await query;
    if (error) return cacheGet<Fatwa[]>(CACHE_KEYS.FATWAS) || [];
    cacheSet(CACHE_KEYS.FATWAS, data);
    return data.map(f => ({
      id: f.id,
      question: f.question,
      category: f.category as Fatwa['category'],
      askedBy: f.asked_by || '',
      askedAt: f.created_at || '',
      answer: undefined,
      answeredBy: undefined,
      answeredAt: undefined,
      status: f.status as Fatwa['status'],
    }));
  },

  saveFatwa: async (fatwa: Fatwa) => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in to submit a fatwa');
    const { error } = await supabase.from('fatwas').insert({
      id: fatwa.id,
      question: fatwa.question,
      category: fatwa.category,
      asked_by: user.id,
      status: 'pending',
    });
    if (error) throw error;
  },

  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    if (error) return cacheGet<Product[]>(CACHE_KEYS.PRODUCTS) || [];
    cacheSet(CACHE_KEYS.PRODUCTS, data);
    return data.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category as Product['category'],
      image: p.image_url || 'https://picsum.photos/seed/product/400/300',
      isFree: p.is_free,
      isVector: p.is_vector,
    }));
  },

  saveProduct: async (product: Product) => {
    const { error } = await supabase.from('products').upsert({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image_url: product.image,
      is_free: product.isFree,
      is_vector: product.isVector,
    });
    if (error) throw error;
  },

  deleteProduct: async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
  },

  // --- Courses ---
  getCourses: async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('title');
    if (error) return cacheGet<Course[]>(CACHE_KEYS.COURSES) || [];
    cacheSet(CACHE_KEYS.COURSES, data);
    return data.map(c => ({
      id: c.id,
      title: c.title,
      instructor: c.instructor,
      duration: c.duration || '',
      category: c.category as Course['category'],
      thumbnail: c.thumbnail_url || 'https://picsum.photos/seed/course/400/250',
    }));
  },

  // --- Forum Posts ---
  getPosts: async (): Promise<ForumPost[]> => {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*, user_profiles(name)')
      .order('created_at', { ascending: false });
    if (error) return cacheGet<ForumPost[]>(CACHE_KEYS.POSTS) || [];
    cacheSet(CACHE_KEYS.POSTS, data);
    return data.map(p => ({
      id: p.id,
      author: (p as any).user_profiles?.name || p.author_id || '',
      role: '',
      title: p.title,
      content: p.content,
      likes: p.likes || 0,
      comments: p.comments_count || 0,
      verified: p.verified,
    }));
  },

  saveForumPost: async (post: { title: string; content: string }) => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in to post');
    const { error } = await supabase.from('forum_posts').insert({
      author_id: user.id,
      title: post.title,
      content: post.content,
    });
    if (error) throw error;
  },

  // --- Scholars ---
  getScholars: async (): Promise<Scholar[]> => {
    const { data, error } = await supabase
      .from('scholars')
      .select('*, user_profiles(name, avatar_url)')
      .order('created_at');
    if (error) return cacheGet<Scholar[]>(CACHE_KEYS.SCHOLARS) || [];
    cacheSet(CACHE_KEYS.SCHOLARS, data);
    return data.map(s => ({
      id: s.id,
      name: (s as any).user_profiles?.name || '',
      title: s.title,
      specialization: s.specialization,
      institution: s.institution || '',
      image: s.image_url || 'https://picsum.photos/seed/scholar/400/300',
      verified: s.verified,
      location: s.location || '',
    }));
  },

  // --- Sadaqah Projects ---
  getSadaqahProjects: async (): Promise<SadaqahProject[]> => {
    const { data, error } = await supabase
      .from('sadaqah_projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return cacheGet<SadaqahProject[]>(CACHE_KEYS.SADAQAH) || [];
    cacheSet(CACHE_KEYS.SADAQAH, data);
    return data.map(p => ({
      id: p.id,
      title: p.title,
      institution: p.institution || '',
      category: p.category as SadaqahProject['category'],
      goal: Number(p.goal),
      raised: Number(p.raised),
      description: p.description || '',
      image: p.image_url || 'https://picsum.photos/seed/sadaqah/400/300',
    }));
  },

  saveSadaqahProject: async (project: SadaqahProject) => {
    const { error } = await supabase.from('sadaqah_projects').upsert({
      id: project.id,
      title: project.title,
      institution: project.institution,
      category: project.category,
      goal: project.goal,
      raised: project.raised,
      description: project.description,
      image_url: project.image,
    });
    if (error) throw error;
  },

  // --- Events ---
  getEvents: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date');
    if (error) return cacheGet<any[]>(CACHE_KEYS.EVENTS) || [];
    cacheSet(CACHE_KEYS.EVENTS, data);
    return data;
  },

  // --- Enrollments ---
  getEnrollments: async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', userId);
    if (error) return [];
    return data.map(e => e.course_id);
  },

  enrollCourse: async (courseId: string) => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in to enroll');
    const { error } = await supabase.from('enrollments').insert({
      course_id: courseId,
      user_id: user.id,
    });
    if (error) throw error;
  },

  // --- Sources (Authentic Knowledge Base) ---
  getSources: async (): Promise<Source[]> => {
    const { data, error } = await supabase
      .from('sources')
      .select('*')
      .order('reference');
    if (error) return [];
    return data as Source[];
  },

  getSourcesByType: async (type: Source['type']): Promise<Source[]> => {
    const { data, error } = await supabase
      .from('sources')
      .select('*')
      .eq('type', type)
      .order('reference');
    if (error) return [];
    return data as Source[];
  },

  getContentSources: async (contentType: string, contentId: string): Promise<Source[]> => {
    const { data, error } = await supabase
      .from('content_sources')
      .select('sources(*)')
      .eq('content_type', contentType)
      .eq('content_id', contentId);
    if (error) return [];
    return data.map((cs: any) => cs.sources).filter(Boolean) as Source[];
  },

  // --- Users (Admin) ---
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(u => ({
      id: u.id,
      name: u.name,
      email: '',
      role: u.role as User['role'],
      avatar: u.avatar_url || 'https://picsum.photos/seed/user/100/100',
      institutionName: u.institution_name,
    }));
  },
};
