
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { searchPlatform } from '../services/geminiService';
import { 
  Loader2, 
  Briefcase, 
  ShoppingBag, 
  BookOpen, 
  MessageCircle,
  ArrowRight
} from 'lucide-react';

const SearchResults: React.FC = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get('q') || '';
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      const data = await searchPlatform(query);
      setResults(data);
      setLoading(false);
    };
    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 size={48} className="text-emerald-700 animate-spin" />
        <p className="text-gray-500 font-medium">এআই আপনার জন্য ফলাফল খুঁজছে...</p>
      </div>
    );
  }

  if (!results) return null;

  const totalResults = 
    results.jobs.length + 
    results.products.length + 
    results.resources.length + 
    results.posts.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          "<span className="text-emerald-700">{query}</span>" এর জন্য ফলাফল
        </h1>
        <p className="text-sm text-gray-500 mt-1">{totalResults}টি মিল পাওয়া গেছে</p>
      </div>

      {totalResults === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400">দুঃখিত, কোনো ফলাফল পাওয়া যায়নি। অন্য কিছু লিখে চেষ্টা করুন।</p>
        </div>
      )}

      {/* Jobs Results */}
      {results.jobs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Briefcase size={20} className="text-emerald-700" /> নিয়োগ বিজ্ঞপ্তি
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.jobs.map((job: any) => (
              <Link to="/professional" key={job.id} className="bg-white p-4 rounded-xl border border-gray-100 hover:border-emerald-300 transition-all flex justify-between items-center group">
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-emerald-700">{job.title}</h3>
                  <p className="text-xs text-gray-500">{job.institution}</p>
                </div>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-emerald-700 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Marketplace Results */}
      {results.products.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag size={20} className="text-amber-600" /> মার্কেটপ্লেস পণ্য
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.products.map((prod: any) => (
              <Link to="/marketplace" key={prod.id} className="bg-white p-3 rounded-xl border border-gray-100 hover:shadow-md transition-all text-center group">
                <img src={prod.image} className="w-full h-24 object-cover rounded-lg mb-2" />
                <h3 className="text-xs font-bold text-gray-800 group-hover:text-emerald-700 truncate">{prod.name}</h3>
                <p className="text-[10px] text-emerald-700 font-bold mt-1">{prod.isFree ? 'ফ্রি' : `৳ ${prod.price}`}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Resources Results */}
      {results.resources.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" /> জ্ঞান ও শিক্ষা রিসোর্স
          </h2>
          <div className="space-y-2">
            {results.resources.map((res: any) => (
              <Link to="/knowledge" key={res.id} className="block bg-white p-4 rounded-xl border border-gray-100 hover:bg-blue-50 transition-all">
                <p className="text-sm font-bold text-gray-800">{res.title}</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase">{res.type}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Community Results */}
      {results.posts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle size={20} className="text-purple-600" /> আলোচনা ও ফতোয়া
          </h2>
          <div className="space-y-3">
            {results.posts.map((post: any) => (
              <Link to="/community" key={post.id} className="block bg-white p-5 rounded-2xl border border-gray-100 hover:border-purple-200 transition-all">
                <h3 className="font-bold text-gray-800 mb-1">{post.title}</h3>
                <p className="text-xs text-gray-500">লিখেছেন: {post.author}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;
