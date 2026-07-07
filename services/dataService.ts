import { Job, Product, ForumPost, Fatwa, Institution, Course, Scholar, SadaqahProject, User, Source, ContentFlag, ScholarApplication, ContentVersion, UserXP, Badge, UserBadge, XPEvent, UserSkill, ScholarPortfolioItem, AdminAuditLog, getLevel } from '../types';
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
      .select('*, fatwa_answers(*)')
      .order('created_at', { ascending: false });

    if (!user) {
      query = query.eq('status', 'answered');
    }

    const { data, error } = await query;
    if (error) return cacheGet<Fatwa[]>(CACHE_KEYS.FATWAS) || [];
    cacheSet(CACHE_KEYS.FATWAS, data);
    return data.map(f => {
      const answer = (f as any).fatwa_answers;
      return {
        id: f.id,
        question: f.question,
        category: f.category as Fatwa['category'],
        askedBy: f.asked_by || '',
        askedAt: f.created_at || '',
        answer: answer?.answer || undefined,
        answeredBy: answer?.answered_by || undefined,
        answeredAt: answer?.created_at || undefined,
        answerSources: answer?.sources || [],
        aiSuggestion: f.ai_suggestion || undefined,
        status: f.status as Fatwa['status'],
      };
    });
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

  getPendingFatwas: async (): Promise<Fatwa[]> => {
    const { data, error } = await supabase
      .from('fatwas')
      .select('*, fatwa_answers(*)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(f => {
      const answer = (f as any).fatwa_answers;
      return {
        id: f.id,
        question: f.question,
        category: f.category as Fatwa['category'],
        askedBy: f.asked_by || '',
        askedAt: f.created_at || '',
        answer: answer?.answer || undefined,
        answeredBy: answer?.answered_by || undefined,
        answeredAt: answer?.created_at || undefined,
        answerSources: answer?.sources || [],
        aiSuggestion: f.ai_suggestion || undefined,
        status: f.status as Fatwa['status'],
      };
    });
  },

  approveFatwa: async (fatwaId: string, answer: string, sourceIds: string[]) => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in');

    const { error: answerError } = await supabase.from('fatwa_answers').upsert({
      fatwa_id: fatwaId,
      answer,
      answered_by: user.id,
      sources: sourceIds,
    });
    if (answerError) throw answerError;

    const { error: statusError } = await supabase
      .from('fatwas')
      .update({ status: 'answered' })
      .eq('id', fatwaId);
    if (statusError) throw statusError;

    await dataService.logAdminAction('approve_fatwa', 'fatwa', fatwaId);
  },

  rejectFatwa: async (fatwaId: string) => {
    const { error } = await supabase
      .from('fatwas')
      .update({ status: 'rejected' })
      .eq('id', fatwaId);
    if (error) throw error;
    await dataService.logAdminAction('reject_fatwa', 'fatwa', fatwaId);
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
      category: p.category || 'General',
      likes: p.likes || 0,
      comments: p.comments_count || 0,
      verified: p.verified,
    }));
  },

  saveForumPost: async (post: { title: string; content: string; category?: string }) => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in to post');
    const { error } = await supabase.from('forum_posts').insert({
      author_id: user.id,
      title: post.title,
      content: post.content,
      category: post.category || 'General',
    });
    if (error) throw error;
  },

  // --- Forum Post Likes ---
  likePost: async (postId: string): Promise<void> => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in to like');
    const { error } = await supabase.from('forum_post_likes').upsert({
      post_id: postId,
      user_id: user.id,
    }, { onConflict: 'post_id,user_id' });
    if (error && !error.message.includes('duplicate')) throw error;
    const { data: post } = await supabase.from('forum_posts').select('likes').eq('id', postId).single();
    await supabase.from('forum_posts').update({ likes: (post?.likes || 0) + 1 }).eq('id', postId);
  },

  unlikePost: async (postId: string): Promise<void> => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in');
    await supabase.from('forum_post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
    const { data: post } = await supabase.from('forum_posts').select('likes').eq('id', postId).single();
    await supabase.from('forum_posts').update({ likes: Math.max(0, (post?.likes || 1) - 1) }).eq('id', postId);
  },

  getUserLikes: async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('forum_post_likes')
      .select('post_id')
      .eq('user_id', userId);
    if (error) return [];
    return data.map(l => l.post_id);
  },

  // --- Forum Comments ---
  getComments: async (postId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('forum_comments')
      .select('*, user_profiles(name)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (error) return [];
    return data.map(c => ({
      id: c.id,
      postId: c.post_id,
      author: (c as any).user_profiles?.name || c.author_id,
      content: c.content,
      createdAt: c.created_at,
    }));
  },

  saveComment: async (postId: string, content: string): Promise<void> => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in to comment');
    const { error } = await supabase.from('forum_comments').insert({
      post_id: postId,
      author_id: user.id,
      content,
    });
    if (error) throw error;
    const { data: post } = await supabase.from('forum_posts').select('comments_count').eq('id', postId).single();
    await supabase.from('forum_posts').update({ comments_count: (post?.comments_count || 0) + 1 }).eq('id', postId);
  },

  // --- User Stats / Milestones ---
  getUserStats: async (userId: string): Promise<{
    postsCount: number;
    commentsCount: number;
    likesReceived: number;
    fatwasAsked: number;
    coursesEnrolled: number;
  }> => {
    const { count: postsCount } = await supabase
      .from('forum_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId);
    const { count: commentsCount } = await supabase
      .from('forum_comments')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId);
    const { data: userPosts } = await supabase
      .from('forum_posts')
      .select('id')
      .eq('author_id', userId);
    const postIds = userPosts?.map(p => p.id) || [];
    let likesReceived = 0;
    if (postIds.length > 0) {
      const { count } = await supabase
        .from('forum_post_likes')
        .select('*', { count: 'exact', head: true })
        .in('post_id', postIds);
      likesReceived = count || 0;
    }
    const { count: fatwasAsked } = await supabase
      .from('fatwas')
      .select('*', { count: 'exact', head: true })
      .eq('asked_by', userId);
    const { count: coursesEnrolled } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    return { postsCount: postsCount || 0, commentsCount: commentsCount || 0, likesReceived, fatwasAsked: fatwasAsked || 0, coursesEnrolled: coursesEnrolled || 0 };
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
      userId: s.user_id,
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

  getSourcesByIds: async (ids: string[]): Promise<Source[]> => {
    if (ids.length === 0) return [];
    const { data, error } = await supabase
      .from('sources')
      .select('*')
      .in('id', ids);
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

  // --- Content Flags (Moderation) ---
  getFlags: async (status?: string): Promise<ContentFlag[]> => {
    let query = supabase
      .from('content_flags')
      .select('*')
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) return [];
    return data as ContentFlag[];
  },

  flagContent: async (contentType: string, contentId: string, reason: string) => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in to flag content');
    const { error } = await supabase.from('content_flags').upsert({
      content_type: contentType,
      content_id: contentId,
      flagged_by: user.id,
      reason,
    });
    if (error) throw error;
  },

  resolveFlag: async (flagId: string) => {
    const { data: flag } = await supabase.from('content_flags').select('content_type, content_id').eq('id', flagId).single();
    const { error } = await supabase
      .from('content_flags')
      .update({ status: 'resolved' })
      .eq('id', flagId);
    if (error) throw error;
    await dataService.logAdminAction('resolve_flag', 'content_flag', flagId, { contentType: flag?.content_type, contentId: flag?.content_id });
  },

  dismissFlag: async (flagId: string) => {
    const { data: flag } = await supabase.from('content_flags').select('content_type, content_id').eq('id', flagId).single();
    const { error } = await supabase
      .from('content_flags')
      .update({ status: 'dismissed' })
      .eq('id', flagId);
    if (error) throw error;
    await dataService.logAdminAction('dismiss_flag', 'content_flag', flagId, { contentType: flag?.content_type, contentId: flag?.content_id });
  },

  // --- Content Versioning ---
  getVersions: async (contentType: string, contentId: string): Promise<ContentVersion[]> => {
    const { data, error } = await supabase
      .from('content_versions')
      .select('*, user_profiles(name)')
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(v => ({
      id: v.id,
      contentType: v.content_type,
      contentId: v.content_id,
      title: v.title || undefined,
      body: v.body,
      changedBy: (v as any).user_profiles?.name || v.changed_by,
      changeSummary: v.change_summary || undefined,
      createdAt: v.created_at,
    }));
  },

  saveVersion: async (data: {
    contentType: string;
    contentId: string;
    body: string;
    title?: string;
    changeSummary?: string;
  }) => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in');
    const { error } = await supabase.from('content_versions').insert({
      content_type: data.contentType,
      content_id: data.contentId,
      body: data.body,
      title: data.title,
      changed_by: user.id,
      change_summary: data.changeSummary,
    });
    if (error) throw error;
  },

  // --- Gamification: XP & Badges ---
  getUserXP: async (userId: string): Promise<UserXP | null> => {
    const { data, error } = await supabase
      .from('user_xp')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      userId: data.user_id,
      xp: data.xp,
      level: data.level,
      updatedAt: data.updated_at,
    };
  },

  addXP: async (userId: string, action: string, points: number): Promise<void> => {
    const { data: existing } = await supabase
      .from('user_xp')
      .select('*')
      .eq('user_id', userId)
      .single();

    const newXp = (existing?.xp || 0) + points;
    const newLevel = getLevel(newXp);

    if (existing) {
      await supabase.from('user_xp').update({ xp: newXp, level: newLevel, updated_at: new Date().toISOString() }).eq('user_id', userId);
    } else {
      await supabase.from('user_xp').insert({ user_id: userId, xp: newXp, level: newLevel });
    }

    await supabase.from('xp_events').insert({ user_id: userId, action, xp: points });
  },

  getLeaderboard: async (limit: number = 50): Promise<(UserXP & { name: string; avatar?: string })[]> => {
    const { data, error } = await supabase
      .from('user_xp')
      .select('*, user_profiles(name, avatar_url)')
      .order('xp', { ascending: false })
      .limit(limit);
    if (error) return [];
    return data.map(u => ({
      id: u.id,
      userId: u.user_id,
      xp: u.xp,
      level: u.level,
      updatedAt: u.updated_at,
      name: (u as any).user_profiles?.name || 'Unknown',
      avatar: (u as any).user_profiles?.avatar_url || undefined,
    }));
  },

  getBadges: async (): Promise<Badge[]> => {
    const { data, error } = await supabase.from('badges').select('*').order('xp_required');
    if (error) return [];
    return data as Badge[];
  },

  getUserBadges: async (userId: string): Promise<UserBadge[]> => {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badges(*)')
      .eq('user_id', userId);
    if (error) return [];
    return data.map(ub => ({
      id: ub.id,
      userId: ub.user_id,
      badgeId: ub.badge_id,
      earnedAt: ub.earned_at,
      badge: (ub as any).badges as Badge,
    }));
  },

  awardBadge: async (userId: string, badgeId: string): Promise<void> => {
    const { error } = await supabase.from('user_badges').insert({ user_id: userId, badge_id: badgeId });
    if (error && !error.message.includes('duplicate')) throw error;
  },

  getUserXPEvents: async (userId: string): Promise<XPEvent[]> => {
    const { data, error } = await supabase
      .from('xp_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) return [];
    return data as XPEvent[];
  },

  // --- Scholar Reputation ---
  getScholarStats: async (userId: string): Promise<{ answersGiven: number }> => {
    const { count, error } = await supabase
      .from('fatwa_answers')
      .select('*', { count: 'exact', head: true })
      .eq('answered_by', userId);
    return { answersGiven: error ? 0 : (count || 0) };
  },

  // --- Scholar Applications ---
  getScholarApplications: async (status?: string): Promise<ScholarApplication[]> => {
    let query = supabase
      .from('scholar_applications')
      .select('*, user_profiles(name)')
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) return [];
    return data.map(a => ({
      id: a.id,
      userId: a.user_id,
      title: a.title,
      specialization: a.specialization,
      institution: a.institution || '',
      location: a.location || '',
      bio: a.bio || '',
      credentials: a.credentials || [],
      references: a.references || [],
      status: a.status as ScholarApplication['status'],
      adminNotes: a.admin_notes,
      reviewedBy: a.reviewed_by,
      reviewedAt: a.reviewed_at,
      createdAt: a.created_at,
    }));
  },

  submitScholarApplication: async (data: {
    title: string;
    specialization: string;
    institution?: string;
    location?: string;
    bio?: string;
    credentials?: string[];
    references?: string[];
  }) => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in to apply');
    const { error } = await supabase.from('scholar_applications').insert({
      user_id: user.id,
      title: data.title,
      specialization: data.specialization,
      institution: data.institution,
      location: data.location,
      bio: data.bio,
      credentials: data.credentials || [],
      references: data.references || [],
    });
    if (error) throw error;
  },

  getMyScholarApplication: async (): Promise<ScholarApplication | null> => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) return null;
    const { data, error } = await supabase
      .from('scholar_applications')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      specialization: data.specialization,
      institution: data.institution || '',
      location: data.location || '',
      bio: data.bio || '',
      credentials: data.credentials || [],
      references: data.references || [],
      status: data.status as ScholarApplication['status'],
      adminNotes: data.admin_notes,
      reviewedBy: data.reviewed_by,
      reviewedAt: data.reviewed_at,
      createdAt: data.created_at,
    };
  },

  approveScholarApplication: async (applicationId: string, adminNotes?: string) => {
    const admin = (await supabase.auth.getSession()).data.session?.user;
    if (!admin) throw new Error('Must be logged in');

    const { data: app, error: appError } = await supabase
      .from('scholar_applications')
      .select('*')
      .eq('id', applicationId)
      .single();
    if (appError || !app) throw new Error('Application not found');

    await supabase.from('scholar_applications').update({
      status: 'approved',
      admin_notes: adminNotes,
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', applicationId);

    await supabase.from('user_profiles').update({ role: 'SCHOLAR' }).eq('id', app.user_id);

    const { data: existing } = await supabase
      .from('scholars')
      .select('id')
      .eq('user_id', app.user_id)
      .single();
    if (!existing) {
      await supabase.from('scholars').insert({
        user_id: app.user_id,
        title: app.title,
        specialization: app.specialization,
        institution: app.institution,
        location: app.location,
        bio: app.bio,
        verified: true,
      });
    } else {
      await supabase.from('scholars').update({ verified: true, title: app.title, specialization: app.specialization }).eq('user_id', app.user_id);
    }

    await dataService.logAdminAction('approve_scholar', 'scholar_application', applicationId, { userId: app.user_id });
  },

  rejectScholarApplication: async (applicationId: string, adminNotes?: string) => {
    const admin = (await supabase.auth.getSession()).data.session?.user;
    if (!admin) throw new Error('Must be logged in');
    const { data: app } = await supabase.from('scholar_applications').select('user_id').eq('id', applicationId).single();
    await supabase.from('scholar_applications').update({
      status: 'rejected',
      admin_notes: adminNotes,
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', applicationId);
    await dataService.logAdminAction('reject_scholar', 'scholar_application', applicationId, { userId: app?.user_id });
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
      banned: u.banned || false,
    }));
  },

  updateUserRole: async (userId: string, role: string): Promise<void> => {
    const { data: old } = await supabase.from('user_profiles').select('role').eq('id', userId).single();
    const { error } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', userId);
    if (error) throw error;
    await dataService.logAdminAction('update_user_role', 'user', userId, { oldRole: old?.role, newRole: role });
  },

  banUser: async (userId: string, banned: boolean): Promise<void> => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ banned })
      .eq('id', userId);
    if (error) throw error;
    await dataService.logAdminAction(banned ? 'ban_user' : 'unban_user', 'user', userId);
  },

  // --- Institutions (Admin) ---
  getPendingInstitutions: async (): Promise<Institution[]> => {
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('verified', false)
      .order('created_at', { ascending: false });
    if (error) return [];
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

  verifyInstitution: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('institutions')
      .update({ verified: true })
      .eq('id', id);
    if (error) throw error;
    await dataService.logAdminAction('approve_institution', 'institution', id);
  },

  deleteInstitution: async (id: string): Promise<void> => {
    const { data: inst } = await supabase.from('institutions').select('name').eq('id', id).single();
    const { error } = await supabase
      .from('institutions')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await dataService.logAdminAction('reject_institution', 'institution', id, { name: inst?.name });
  },

  // --- Skills & Endorsements ---
  getUserSkills: async (userId: string, currentUserId?: string): Promise<UserSkill[]> => {
    const { data, error } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', userId)
      .order('skill');
    if (error) return [];

    const skills = data.map(s => ({
      id: s.id,
      userId: s.user_id,
      skill: s.skill,
      createdAt: s.created_at,
    }));

    if (currentUserId) {
      const { data: endorsements } = await supabase
        .from('skill_endorsements')
        .select('skill_id')
        .eq('endorsed_by', currentUserId);
      const endorsedIds = new Set(endorsements?.map(e => e.skill_id) || []);

      for (const skill of skills) {
        const { count } = await supabase
          .from('skill_endorsements')
          .select('*', { count: 'exact', head: true })
          .eq('skill_id', skill.id);
        skill.endorsementsCount = count || 0;
        skill.endorsedByMe = endorsedIds.has(skill.id);
      }
    } else {
      for (const skill of skills) {
        const { count } = await supabase
          .from('skill_endorsements')
          .select('*', { count: 'exact', head: true })
          .eq('skill_id', skill.id);
        skill.endorsementsCount = count || 0;
      }
    }

    return skills;
  },

  addUserSkill: async (userId: string, skill: string): Promise<void> => {
    const { error } = await supabase.from('user_skills').insert({
      user_id: userId,
      skill,
    });
    if (error && !error.message.includes('duplicate')) throw error;
  },

  deleteUserSkill: async (skillId: string): Promise<void> => {
    await supabase.from('user_skills').delete().eq('id', skillId);
  },

  endorseSkill: async (skillId: string): Promise<void> => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in');
    const { error } = await supabase.from('skill_endorsements').upsert({
      skill_id: skillId,
      endorsed_by: user.id,
    }, { onConflict: 'skill_id,endorsed_by' });
    if (error && !error.message.includes('duplicate')) throw error;
  },

  unendorseSkill: async (skillId: string): Promise<void> => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in');
    await supabase.from('skill_endorsements').delete()
      .eq('skill_id', skillId)
      .eq('endorsed_by', user.id);
  },

  // --- Scholar Portfolio ---
  getScholarPortfolio: async (userId: string): Promise<ScholarPortfolioItem[]> => {
    const { data, error } = await supabase
      .from('scholar_portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(p => ({
      id: p.id,
      userId: p.user_id,
      title: p.title,
      description: p.description || undefined,
      url: p.url || undefined,
      type: p.type as ScholarPortfolioItem['type'],
      createdAt: p.created_at,
    }));
  },

  addScholarPortfolioItem: async (item: {
    title: string;
    description?: string;
    url?: string;
    type: string;
  }): Promise<void> => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Must be logged in');
    const { error } = await supabase.from('scholar_portfolios').insert({
      user_id: user.id,
      title: item.title,
      description: item.description,
      url: item.url,
      type: item.type,
    });
    if (error) throw error;
  },

  deleteScholarPortfolioItem: async (id: string): Promise<void> => {
    await supabase.from('scholar_portfolios').delete().eq('id', id);
  },

  // --- Admin Audit Log ---
  logAdminAction: async (action: string, targetType: string, targetId: string, details: Record<string, unknown> = {}) => {
    const admin = (await supabase.auth.getSession()).data.session?.user;
    if (!admin) return;
    await supabase.from('admin_audit_log').insert({
      admin_id: admin.id,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
    });
  },

  getAuditLogs: async (): Promise<AdminAuditLog[]> => {
    const { data, error } = await supabase
      .from('admin_audit_log')
      .select('*, admin:admin_id(name)')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(l => ({
      id: l.id,
      adminId: l.admin_id,
      adminName: l.admin?.name,
      action: l.action,
      targetType: l.target_type,
      targetId: l.target_id,
      details: l.details || {},
      createdAt: l.created_at,
    }));
  },
};
