
import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  User, 
  CheckCircle, 
  Share2, 
  ThumbsUp,
  Sparkles,
  Loader2
} from 'lucide-react';
import { askScholar } from '../services/geminiService';
import { MOCK_POSTS } from '../data/mockData';
import { addNotification } from '../services/notificationService';

const Community: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskScholar = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setAiResponse(null);
    try {
      const response = await askScholar(question);
      setAiResponse(response);
      
      // Notify user that AI scholar has responded
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
      <section className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-emerald-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-emerald-400/20 rounded-lg">
             <Sparkles className="text-emerald-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">এআই আলেম (Alpha)</h2>
            <p className="text-emerald-300 text-xs">মুহূর্তেই আপনার প্রশ্নের প্রাথমিক উত্তর পান</p>
          </div>
        </div>

        <div className="relative">
          <textarea 
            className="w-full bg-white/10 border border-emerald-400/30 rounded-2xl p-4 pr-12 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all min-h-[120px]"
            placeholder="আপনার মাসআলা বা প্রশ্নটি এখানে লিখুন..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button 
            onClick={handleAskScholar}
            disabled={isLoading}
            className="absolute bottom-4 right-4 p-2 bg-emerald-400 text-emerald-900 rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
          </button>
        </div>

        {aiResponse && (
          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 animate-slideDown">
            <div className="flex items-start gap-3">
               <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-emerald-800 font-bold">AI</span>
               </div>
               <div className="space-y-4 flex-1">
                  <p className="text-emerald-50 leading-relaxed whitespace-pre-line">
                    {aiResponse}
                  </p>
               </div>
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
  const handleLike = () => {
    addNotification({
      title: 'নতুন লাইক',
      message: `${author}-এর পোস্টে আপনি লাইক দিয়েছেন।`,
      type: 'community'
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
            <img src={`https://picsum.photos/seed/${author}/100/100`} alt={author} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1">
              {author}
              {verified && <CheckCircle size={14} className="text-blue-500" />}
            </h4>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-emerald-700"><Share2 size={18} /></button>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{content}</p>
      </div>
      <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
        <button 
          onClick={handleLike}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-emerald-700 transition-colors"
        >
          <ThumbsUp size={16} /> {likes} লাইক
        </button>
        <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-emerald-700 transition-colors">
          <MessageCircle size={16} /> {comments} মন্তব্য
        </button>
      </div>
    </div>
  );
};

export default Community;
