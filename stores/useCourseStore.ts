
import { create } from 'zustand';
import { dataService } from '../services/dataService';
import { Course } from '../types';

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  enroll: (courseId: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const courses = await dataService.getCourses();
      set({ courses, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  enroll: async (courseId) => {
    await dataService.enrollCourse(courseId);
    set((s) => ({
      courses: s.courses.map((c) =>
        c.id === courseId ? { ...c, isEnrolled: true, progress: 0 } : c
      ),
    }));
  },
}));
