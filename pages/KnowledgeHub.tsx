import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Download, ExternalLink, Search, Book, FileText, Video, Sparkles, Clock, Play, CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Course, Source, XP_ACTIONS } from '../types';
import { supabase } from '../services/supabase';
import { dataService } from '../services/dataService';
import { addNotification } from '../services/notificationService';
import CitationBadge from '../components/CitationBadge';

const KnowledgeHub: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [courseSources, setCourseSources] = useState<Record<string, Source[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user?.id || '';
      const [courseData, enrollData] = await Promise.all([
        dataService.getCourses(),
        userId ? dataService.getEnrollments(userId).catch(() => [] as string[]) : Promise.resolve([] as string[]),
      ]);
      setCourses(courseData);
      setEnrolledCourses(enrollData);

      const sourcesMap: Record<string, Source[]> = {};
      await Promise.all(
        courseData.map(async (c) => {
          const srcs = await dataService.getContentSources('course', c.id);
          if (srcs.length > 0) sourcesMap[c.id] = srcs;
        })
      );
      setCourseSources(sourcesMap);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleEnroll = async (courseId: string, title: string) => {
    if (enrolledCourses.includes(courseId)) return;
    try {
      await dataService.enrollCourse(courseId);
      setEnrolledCourses([...enrolledCourses, courseId]);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user?.id;
      if (userId) dataService.addXP(userId, XP_ACTIONS.ENROLL_COURSE.action, XP_ACTIONS.ENROLL_COURSE.xp);
      await addNotification({
        title: 'এনরোল সফল',
        message: `আপনি "${title}" কোর্সে যুক্ত হয়েছেন।`,
        type: 'community',
        link: '/knowledge'
      });
    } catch {
      return;
    }
  };

  if (loading) {
    return (
      <div className="space-y-24 animate-fadeIn">
        <div className="space-y-4 border-b border-gray-100 pb-12">
          <div className="caps-label text-gray-400">Resources</div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">জ্ঞান ও শিক্ষা কেন্দ্র।</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-gray-100 minimal-border">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-8">
              <div className="aspect-video bg-gray-100 mb-8 animate-pulse" />
              <div className="space-y-3">
                <div className="h-3 w-16 bg-gray-100 animate-pulse" />
                <div className="h-6 w-3/4 bg-gray-100 animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24 animate-fadeIn">
      <div className="space-y-4 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Resources</div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">জ্ঞান ও শিক্ষা কেন্দ্র।</h1>
      </div>

      <section className="space-y-12">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-extrabold">Deen-101 মডিউল</h2>
          <Link to="/deen101" className="text-sm font-bold border-b-2 border-black">সবগুলো দেখুন</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-gray-100 minimal-border">
          {courses.map(course => {
            const isEnrolled = enrolledCourses.includes(course.id);
            const sources = courseSources[course.id] || [];
            return (
              <div key={course.id} className="bg-white p-8 group flex flex-col h-full">
                <div className="aspect-video bg-gray-100 mb-8 overflow-hidden relative">
                  <img src={course.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={course.title} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <div className="w-12 h-12 bg-white flex items-center justify-center">
                      <Play size={24} fill="black" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="caps-label text-bd-green">{course.category}</div>
                  <h3 className="text-2xl font-extrabold leading-tight">{course.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                    <span>•</span>
                    <span>ইন্সট্রাক্টর: {course.instructor}</span>
                  </div>
                  {sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                      {sources.map(src => (
                        <CitationBadge key={src.id} source={src} />
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleEnroll(course.id, course.title)}
                  className={`mt-10 py-4 font-bold text-sm transition-all border ${
                    isEnrolled ? 'bg-gray-50 text-gray-400 border-gray-100' : 'bg-black text-white border-black hover:bg-gray-800'
                  }`}
                >
                  {isEnrolled ? 'অধ্যয়নরত' : 'কোর্সে যুক্ত হোন'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-1 bg-gray-100 minimal-border">
        <div className="bg-white p-12 space-y-10">
          <h2 className="text-3xl font-extrabold border-l-4 border-black pl-6">কওমি সিলেবাস</h2>
          <div className="space-y-4">
            <ListResource title="মেশকাত (দাওয়াতে হাদিস)" sub="বেফাকুল মাদারিস" />
            <ListResource title="জালালাইন (ফজিলাত)" sub="বেফাকুল মাদারিস" />
            <ListResource title="হিদায়াতুন্নাহু (মুতাওয়াসসিতাহ)" sub="বেফাকুল মাদারিস" />
          </div>
        </div>
        <div className="bg-white p-12 space-y-10">
          <h2 className="text-3xl font-extrabold border-l-4 border-bd-green pl-6">আলিয়া সিলেবাস</h2>
          <div className="space-y-4">
            <ListResource title="কামিল (হাদিস বিভাগ)" sub="আরবি বিশ্ববিদ্যালয়" />
            <ListResource title="আলিম (বিজ্ঞান বিভাগ)" sub="মাদ্রাসা শিক্ষা বোর্ড" />
            <ListResource title="দাখিল (সাধারণ)" sub="মাদ্রাসা শিক্ষা বোর্ড" />
          </div>
        </div>
      </section>
    </div>
  );
};

const ListResource = ({ title, sub }: any) => (
  <div className="flex justify-between items-center p-6 bg-gray-50 hover:bg-black hover:text-white transition-all group">
    <div>
      <div className="font-bold text-lg">{title}</div>
      <div className="text-xs text-gray-400 font-bold group-hover:text-gray-500 uppercase tracking-widest mt-1">{sub}</div>
    </div>
    <div className="flex gap-4">
      <button className="p-2 border border-gray-200 group-hover:border-gray-800"><Download size={18} /></button>
      <button className="p-2 border border-gray-200 group-hover:border-gray-800"><ExternalLink size={18} /></button>
    </div>
  </div>
);

export default KnowledgeHub;
