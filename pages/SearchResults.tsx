
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { searchPlatform } from '../services/geminiService';
import { 
  Loader2, 
  Briefcase, 
  ShoppingBag, 
  BookOpen, 
  MessageCircle,
  ArrowUpRight
} from 'lucide-react';
import ImageWithFallback from '../components/ui/ImageWithFallback';

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
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
        <Loader2 size={48} className="animate-spin" />
        <div className="caps-label">এআই ফলাফল খুঁজছে...</div>
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
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Search Results</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          "<span className="text-bd-green">{query}</span>" এর জন্য ফলাফল।
        </h1>
        <p className="text-sm font-bold text-gray-500">{totalResults}টি মিল পাওয়া গেছে।</p>
      </div>

      {totalResults === 0 ? (
        <div className="py-40 text-center space-y-6 bg-gray-50 border border-gray-100">
           <p className="text-xl text-gray-500 font-medium">দুঃখিত, কোনো ফলাফল পাওয়া যায়নি।</p>
           <Link to="/" className="text-sm font-bold border-b-2 border-black pb-1">অন্য কিছু লিখে চেষ্টা করুন</Link>
        </div>
      ) : (
        <div className="space-y-24">
          {/* Jobs Results */}
          {results.jobs.length > 0 && (
            <section className="space-y-8">
               <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Briefcase size={20} /> নিয়োগ বিজ্ঞপ্তি
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-gray-100 minimal-border">
                  {results.jobs.map((job: any) => (
                    <Link to="/professional" key={job.id} className="bg-white p-8 flex justify-between items-center group hover:bg-black hover:text-white transition-all">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        <p className="text-sm text-gray-500 group-hover:text-gray-400 font-medium">{job.institution}</p>
                      </div>
                      <ArrowUpRight size={20} className="text-gray-300 group-hover:text-white" />
                    </Link>
                  ))}
               </div>
            </section>
          )}

          {/* Marketplace Results */}
          {results.products.length > 0 && (
            <section className="space-y-8">
               <h2 className="text-2xl font-bold flex items-center gap-3">
                  <ShoppingBag size={20} /> মার্কেটপ্লেস পণ্য
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-gray-100 minimal-border">
                  {results.products.map((prod: any) => (
                    <Link to="/marketplace" key={prod.id} className="bg-white p-6 space-y-4 group transition-all hover:bg-gray-50">
                      <div className="aspect-square bg-gray-50 overflow-hidden grayscale group-hover:grayscale-0">
                          <ImageWithFallback src={prod.image} name={prod.name} className="w-full h-full object-cover" alt={prod.name} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold truncate">{prod.name}</h3>
                        <p className="text-xs font-extrabold text-bd-green">{prod.isFree ? 'ফ্রি' : `৳ ${prod.price}`}</p>
                      </div>
                    </Link>
                  ))}
               </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
