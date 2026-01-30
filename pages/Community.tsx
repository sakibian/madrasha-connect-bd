
import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  User, 
  CheckCircle, 
  Share2, 
  ThumbsUp,
  Sparkles,
  Loader2,
  Heart,
  Search,
  MapPin,
  Droplets
} from 'lucide-react';
import { askScholar } from '../services/geminiService';
import { MOCK_POSTS } from '../data/mockData';
import { addNotification } from '../services/notificationService';

const Community: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bloodSearch, setBloodSearch] = useState('');

  const handleAskScholar = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setAiResponse(null);
    try {
      const response = await askScholar(question);
      setAiResponse(response);
      
      addNotification({
        title: 'এআই আলেম উত্তর দিয়েছে',
        message: `আপনার প্রশ্নের উত্তর তৈরি হয়েছে: "${question.substring(0, 30)}..."`,
        type: 'community',
        link: '/community'
      });
    } catch (e) {
      setAiResponse("দুঃখিত, বর্তমানে এআই স্কলার অফলাইন আছে।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* AI Scholar Section */}
      <section className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-emerald-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-emerald-400/20 rounded-3xl backdrop-blur-md border border-emerald-400/30">
             <Sparkles className="text-emerald-400" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black">এআই আলেম (Alpha)</h2>
            <p className="text-emerald-300 font-medium">মুহূর্তেই আপনার মাসআলার প্রাথমিক সমাধান পান</p>
          </div>
        </div>

        <div className="relative">
          <textarea 
            className="w-full bg-white/10 border border-emerald-400/30 rounded-[2rem] p-6 pr-16 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all min-h-[150px] font-medium"
            placeholder="আপনার মাসআলা বা প্রশ্নটি এখানে বিস্তারিত লিখুন..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button 
            onClick={handleAskScholar}
            disabled={isLoading}
            className="absolute bottom-6 right-6 p-3 bg-emerald-400 text-emerald-900 rounded-2xl hover:bg-white transition-all shadow-xl disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
          </button>
        </div>

        {aiResponse && (
          <div className="mt-8 bg-white/5 border border-white/10 rounded-[2rem] p-8 animate-slideDown shadow-inner">
            <div className="flex items-start gap-4">
               <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                  <span className="text-emerald-800 font-black">AI</span>
               </div>
               <div className="space-y-4 flex-1">
                  <p className="text-emerald-50 leading-relaxed whitespace-pre-line font-medium text-lg">
                    {aiResponse}
                  </p>
               </div>
            </div>
          </div>
        )}
      </section>

      {/* Madrasa Blood Bank Section */}
      <section className="bg-red-50 rounded-[2.5rem] p-8 border border-red-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600 text-white rounded-2xl"><Droplets /></div>
              <h2 className="text-xl font-bold text-gray-800">মাদ্রাসা ব্লাড ব্যাংক</h2>
           </div>
           <button className="text-red-600 text-sm font-bold bg-white px-4 py-2 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all">দাতা হিসেবে যোগ দিন</button>
        </div>
        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-red-300" size={20} />
           <input 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-red-100 outline-none focus:ring-2 focus:ring-red-200"
              placeholder="রক্তের গ্রুপ বা এলাকা (উদা: A+, ঢাকা) লিখে খুঁজুন"
              value={bloodSearch}
              onChange={(e) => setBloodSearch(e.target.value)}
           />
        </div>
        {bloodSearch && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
             <div className="bg-white p-4 rounded-2xl border border-red-50 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center font-black text-xl">A+</div>
                <div>
                   <p className="font-bold text-gray-800 text-sm">মাওলানা জাহিদ</p>
                   <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} /> মিরপুর, ঢাকা</p>
                </div>
                <button className="ml-auto p-2 bg-red-50 text-red-600 rounded-lg"><Heart size={16} /></button>
             </div>
          </div>
        )}
      </section>

      {/* Community Feed */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MessageCircle className="text-emerald-700" size={22} />
          সাম্প্রতিক আলোচনা
        </h2>

        {MOCK_POSTS.map(post => (
          <PostCard 
            key={post.id}
            author={post.author} 
            role={post.role} 
            title={post.title}
            content={post.content}
            likes={post.likes}
            comments={post.comments}
            verified={post.verified}
          />
        ))}
      </div>
    </div>
  );
};

const PostCard: React.FC<any> = ({ author, role, title, content, likes, comments, verified }) => {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
            <img src={`https://picsum.photos/seed/${author}/100/100`} alt={author} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 flex items-center gap-1 group-hover:text-emerald-700 transition-colors">
              {author}
              {verified && <CheckCircle size={14} className="text-blue-500" />}
            </h4>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{role}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-emerald-700 p-2"><Share2 size={20} /></button>
      </div>
      <div>
        <h3 className="font-black text-gray-900 text-xl mb-3 leading-snug">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
      </div>
      <div className="flex items-center gap-8 pt-6 border-t border-gray-50">
        <button className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-emerald-700 transition-all">
          <ThumbsUp size={18} /> {likes} লাইক
        </button>
        <button className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-emerald-700 transition-all">
          <MessageCircle size={18} /> {comments} মন্তব্য
        </button>
      </div>
    </div>
  );
};

export default Community;
