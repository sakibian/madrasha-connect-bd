
import React, { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { 
  MessageCircle, 
  Send, 
  CheckCircle, 
  Share2, 
  ThumbsUp,
  Sparkles,
  Loader2,
  Heart,
  Search,
  MapPin,
  Droplets,
  Plus,
  Flag,
  X,
  Trash2,
  Edit3
} from 'lucide-react';
import { RichTextEditor } from '../components/ui';
import { askScholar } from '../services/geminiService';
import { getCurrentUser } from '../services/authService';
import { dataService } from '../services/dataService';
import { addNotification } from '../services/notificationService';
import { ForumPost, ForumComment, XP_ACTIONS } from '../types';

const CATEGORIES = ['General', 'Jobs Discussion', 'Education', 'Events', 'Fatwa', 'Other'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  'General': 'সাধারণ',
  'Jobs Discussion': 'চাকরি আলোচনা',
  'Education': 'শিক্ষা',
  'Events': 'ইভেন্ট',
  'Fatwa': 'মাসআলা',
  'Other': 'অন্যান্য',
};

const Community: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bloodSearch, setBloodSearch] = useState('');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('General');
  const [posting, setPosting] = useState(false);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const currentUser = getCurrentUser();

  useEffect(() => {
    loadPosts();
    if (currentUser) {
      dataService.getUserLikes(currentUser.id).then(setUserLikes);
    }
  }, [currentUser]);

  const loadPosts = async () => {
    setLoadingPosts(true);
    const data = await dataService.getPosts();
    setPosts(data);
    setLoadingPosts(false);
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    setPosting(true);
    try {
      await dataService.saveForumPost({ title: newPostTitle, content: newPostContent, category: newPostCategory });
      if (currentUser) await dataService.addXP(currentUser.id, XP_ACTIONS.FORUM_POST.action, XP_ACTIONS.FORUM_POST.xp);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('General');
      setShowCreatePost(false);
      await loadPosts();
    } catch (e) {
      console.error('Failed to create post', e);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = useCallback(async (postId: string) => {
    if (!currentUser) return;
    const isLiked = userLikes.includes(postId);
    try {
      if (isLiked) {
        await dataService.unlikePost(postId);
        setUserLikes(prev => prev.filter(id => id !== postId));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1) } : p));
      } else {
        await dataService.likePost(postId);
        setUserLikes(prev => [...prev, postId]);
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
      }
    } catch (e) {
      console.error('Like failed', e);
    }
  }, [currentUser, userLikes]);

  const handleAskScholar = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setAiResponse(null);
    try {
      const response = await askScholar(question);
      setAiResponse(response);
      
      await addNotification({
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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle className="text-emerald-700" size={22} />
            সাম্প্রতিক আলোচনা
          </h2>
          {currentUser && (
            <button
              onClick={() => setShowCreatePost(!showCreatePost)}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm font-bold hover:bg-gray-800 transition-all"
            >
              <Plus size={16} /> নতুন পোস্ট
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 text-xs font-black rounded-xl whitespace-nowrap transition-all ${
              activeCategory === null ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            সবগুলো
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-black rounded-xl whitespace-nowrap transition-all ${
                activeCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {showCreatePost && (
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-4 animate-fadeIn">
            <input
              className="w-full px-0 py-2 text-xl font-black border-b border-gray-200 outline-none focus:border-black transition-all"
              placeholder="শিরোনাম"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            <RichTextEditor
              content={newPostContent}
              onChange={setNewPostContent}
              placeholder="আপনার মতামত লিখুন..."
            />
            <div>
              <label className="caps-label text-gray-400 block mb-2">ক্যাটাগরি</label>
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewPostCategory(cat)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      newPostCategory === cat ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-black transition-all"
              >
                বাতিল
              </button>
              <button
                onClick={handleCreatePost}
                disabled={posting || !newPostTitle.trim() || !newPostContent.trim()}
                className="px-6 py-2.5 bg-black text-white text-sm font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {posting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                প্রকাশ করুন
              </button>
            </div>
          </div>
        )}

        {loadingPosts ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-gray-300" />
          </div>
        ) : posts.filter(p => !activeCategory || p.category === activeCategory).length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">
            {activeCategory ? `"${CATEGORY_LABELS[activeCategory]}" ক্যাটাগরিতে এখনো কোনো পোস্ট নেই` : 'এখনো কোনো আলোচনা শুরু হয়নি। প্রথম পোস্ট তৈরি করুন!'}
          </div>
        ) : (
          posts
            .filter(p => !activeCategory || p.category === activeCategory)
            .map(post => (
            <PostCard 
              key={post.id}
              post={post}
              isLiked={userLikes.includes(post.id)}
              currentUser={currentUser}
              onLike={handleLike}
              onRefresh={loadPosts}
            />
          ))
        )}
      </div>
    </div>
  );
};

const PostCard: React.FC<{
  post: ForumPost;
  isLiked: boolean;
  currentUser: any;
  onLike: (postId: string) => void;
  onRefresh?: () => void;
}> = ({ post, isLiked, currentUser, onLike, onRefresh }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flagging, setFlagging] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editCategory, setEditCategory] = useState(post.category);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isOwner = currentUser?.id === post.authorId;

  const loadComments = async () => {
    setLoadingComments(true);
    const data = await dataService.getComments(post.id);
    setComments(data);
    setLoadingComments(false);
  };

  const toggleComments = () => {
    if (!showComments && comments.length === 0) loadComments();
    setShowComments(!showComments);
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    setCommenting(true);
    try {
      await dataService.saveComment(post.id, newComment);
      if (currentUser) await dataService.addXP(currentUser.id, XP_ACTIONS.FORUM_COMMENT.action, XP_ACTIONS.FORUM_COMMENT.xp);
      setNewComment('');
      await loadComments();
      post.comments = comments.length + 1;
    } catch (e) {
      console.error('Comment failed', e);
    } finally {
      setCommenting(false);
    }
  };

  const handleShare = () => {
    const text = `${post.title}\n\n${post.content}\n\n— ${post.author}`;
    navigator.clipboard.writeText(text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    setSaving(true);
    try {
      await dataService.updatePost(post.id, { title: editTitle, content: editContent, category: editCategory });
      setEditing(false);
      onRefresh?.();
    } catch (e) {
      console.error('Edit failed', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dataService.deletePost(post.id);
      setShowDeleteConfirm(false);
      onRefresh?.();
    } catch (e) {
      console.error('Delete failed', e);
    } finally {
      setDeleting(false);
    }
  };

  const handleFlag = async () => {
    if (!flagReason.trim()) return;
    setFlagging(true);
    try {
      await dataService.flagContent('forum_post', post.id, flagReason);
      setFlagged(true);
      setShowFlagModal(false);
    } catch (e) {
      console.error('Flag failed', e);
    } finally {
      setFlagging(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
            <img src={`https://picsum.photos/seed/${post.author}/100/100`} alt={post.author} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 flex items-center gap-1 group-hover:text-emerald-700 transition-colors">
              {post.author || 'ব্যবহারকারী'}
              {post.verified && <CheckCircle size={14} className="text-blue-500" />}
            </h4>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md inline-block mt-1">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isOwner && !editing && (
            <>
              <button
                onClick={() => { setEditing(true); setEditTitle(post.title); setEditContent(post.content); setEditCategory(post.category); }}
                className="text-gray-300 hover:text-blue-500 p-2 transition-all"
                title="এডিট করুন"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-gray-300 hover:text-red-500 p-2 transition-all"
                title="ডিলিট করুন"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          {currentUser && !isOwner && (
            <button
              onClick={() => setShowFlagModal(true)}
              className="text-gray-300 hover:text-red-500 p-2 transition-all"
              title="রিপোর্ট করুন"
            >
              <Flag size={16} />
            </button>
          )}
          <button
            onClick={handleShare}
            className={`p-2 transition-all ${shareCopied ? 'text-emerald-600' : 'text-gray-300 hover:text-emerald-700'}`}
            title={shareCopied ? 'কপি করা হয়েছে!' : 'শেয়ার করুন'}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
      {editing ? (
        <div className="space-y-4">
          <input
            className="w-full px-0 py-2 text-xl font-black border-b border-gray-200 outline-none focus:border-black transition-all"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="শিরোনাম"
          />
          <RichTextEditor
            content={editContent}
            onChange={setEditContent}
            placeholder="বিবরণ"
          />
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setEditCategory(cat)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  editCategory === cat ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditing(false)}
              className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-black transition-all"
            >
              বাতিল
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={saving || !editTitle.trim() || !editContent.trim()}
              className="px-5 py-2 bg-black text-white text-sm font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              সেভ করুন
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="font-black text-gray-900 text-xl mb-3 leading-snug">{post.title}</h3>
          <div className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
        </div>
      )}
      <div className="flex items-center gap-8 pt-6 border-t border-gray-50">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 text-xs font-black transition-all ${
            isLiked ? 'text-emerald-700' : 'text-gray-500 hover:text-emerald-700'
          }`}
          disabled={!currentUser}
        >
          <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} /> {post.likes} লাইক
        </button>
        <button
          onClick={toggleComments}
          className={`flex items-center gap-2 text-xs font-black transition-all ${
            showComments ? 'text-emerald-700' : 'text-gray-500 hover:text-emerald-700'
          }`}
        >
          <MessageCircle size={18} /> {post.comments} মন্তব্য
        </button>
      </div>

      {showComments && (
        <div className="border-t border-gray-50 pt-6 space-y-4 animate-fadeIn">
          {loadingComments ? (
            <div className="flex justify-center py-4">
              <Loader2 size={20} className="animate-spin text-gray-300" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-400 text-sm font-medium py-4">কোনো মন্তব্য নেই</p>
          ) : (
            <div className="space-y-3">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3 bg-gray-50 p-4 rounded-2xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0 flex items-center justify-center">
                    <span className="text-[10px] font-black text-gray-500">{c.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500">{c.author}</p>
                    <p className="text-sm text-gray-700 mt-0.5">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentUser ? (
            <div className="flex gap-3 pt-2">
              <input
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-emerald-300 transition-all"
                placeholder="মন্তব্য লিখুন..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={commenting || !newComment.trim()}
                className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {commenting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          ) : (
            <p className="text-center text-xs text-gray-400 font-medium pt-2">মন্তব্য করতে লগইন করুন</p>
          )}
        </div>
      )}

      {showFlagModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowFlagModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black">পোস্ট রিপোর্ট করুন</h3>
              <button onClick={() => setShowFlagModal(false)} className="text-gray-400 hover:text-black p-1"><X size={20} /></button>
            </div>
            <textarea
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-red-300 transition-all min-h-[100px] resize-none"
              placeholder="কেন এই পোস্টটি রিপোর্ট করছেন? (বিস্তারিত লিখুন)"
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowFlagModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-black transition-all"
              >
                বাতিল
              </button>
              <button
                onClick={handleFlag}
                disabled={flagging || !flagReason.trim()}
                className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {flagging ? <Loader2 size={16} className="animate-spin" /> : null}
                {flagged ? 'রিপোর্ট করা হয়েছে' : 'রিপোর্ট করুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black">পোস্ট ডিলিট করুন</h3>
              <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-400 hover:text-black p-1"><X size={20} /></button>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">আপনি কি নিশ্চিত এই পোস্টটি ডিলিট করতে চান? এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-black transition-all"
              >
                বাতিল
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
