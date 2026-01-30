
import React, { useState } from 'react';
import { Book, CheckCircle, ArrowRight, Sun, Sparkles, Heart, HelpCircle, Trophy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Deen101: React.FC = () => {
  const modules = [
    { 
      title: 'ওযু করার সঠিক নিয়ম', 
      steps: ['নিয়ত করা', 'হাত ধোয়া', 'কুলি করা', 'নাক পরিষ্কার করা', 'মুখমন্ডল ধোয়া'], 
      duration: '১০ মিনিট',
      icon: <Sparkles size={20} />,
      quiz: {
        question: "ওযু শুরু করার আগে কোনটি করতে হয়?",
        options: ["কুলি করা", "নিয়ত করা", "মাথা মাসেহ করা", "পা ধোয়া"],
        correct: 1
      }
    },
    { 
      title: 'সালাতের প্রাথমিক ধাপ', 
      steps: ['তাকবীরে তাহরীমা', 'সানা পড়া', 'কিরাত', 'রুকু', 'সিজদাহ'], 
      duration: '১৫ মিনিট',
      icon: <Heart size={20} />,
      quiz: {
        question: "সালাতে প্রথম তাকবীরকে কী বলা হয়?",
        options: ["তাকবীরে উলা", "তাকবীরে তাহরীমা", "তাকবীরে ফাতাহ", "তাকবীরে সালাত"],
        correct: 1
      }
    },
    { 
      title: 'কুরআন তিলাওয়াতের আদব', 
      steps: ['পবিত্রতা অর্জন', 'আউযুবিল্লাহ-বিসমিল্লাহ', 'ধীরে ধীরে পড়া', 'অর্থ অনুধাবন'], 
      duration: '৮ মিনিট',
      icon: <Book size={20} />,
      quiz: {
        question: "তিলাওয়াত শুরুর আগে কোনটি পড়া উত্তম?",
        options: ["শুধুমাত্র বিসমিল্লাহ", "আউযুবিল্লাহ ও বিসমিল্লাহ", "সূরা ফাতেহা", "তাকবীর"],
        correct: 1
      }
    },
  ];

  const [activeModule, setActiveModule] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleQuizSubmit = (index: number) => {
    setSelectedOption(index);
    const correct = index === modules[activeModule].quiz.correct;
    setIsCorrect(correct);
  };

  const nextModule = () => {
    setActiveModule((prev) => (prev + 1) % modules.length);
    setShowQuiz(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-24 animate-fadeIn">
      <div className="space-y-12">
        <Link to="/knowledge" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-all">
          <ArrowLeft size={14} /> Back to Library
        </Link>
        <div className="space-y-4">
          <div className="caps-label text-bd-green">Learning Pathway</div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">Deen-101 (মৌলিক দ্বীন শিক্ষা)।</h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
            প্রতিটি মুসলমানের জন্য অত্যাবশ্যকীয় দ্বীনি জ্ঞানসমূহ সহজ ও সাবলীল বাংলায় শেখার ডিজিটাল মাধ্যম।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 bg-gray-100 minimal-border">
        {/* Module Sidebar */}
        <div className="lg:col-span-4 bg-white divide-y divide-gray-100">
           {modules.map((m, i) => (
             <button 
               key={i}
               onClick={() => { setActiveModule(i); setShowQuiz(false); setSelectedOption(null); setIsCorrect(null); }}
               className={`w-full p-10 text-left transition-all flex items-start gap-6 ${activeModule === i ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
             >
               <div className={`mt-1 ${activeModule === i ? 'text-bd-green' : 'text-gray-300'}`}>{m.icon}</div>
               <div>
                 <h3 className="text-xl font-bold mb-1">{m.title}</h3>
                 <p className={`text-[10px] font-bold uppercase tracking-widest ${activeModule === i ? 'text-gray-400' : 'text-gray-400'}`}>{m.duration}</p>
               </div>
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 bg-white p-12 md:p-20 flex flex-col min-h-[600px]">
           {!showQuiz ? (
             <div className="space-y-12 animate-fadeIn flex-1">
                <div className="space-y-4">
                   <div className="caps-label text-gray-400">Step by Step Guide</div>
                   <h2 className="text-4xl font-extrabold">{modules[activeModule].title}</h2>
                </div>
                
                <div className="space-y-0">
                   {modules[activeModule].steps.map((step, idx) => (
                     <div key={idx} className="flex gap-8 py-8 border-b border-gray-100 last:border-none group">
                        <div className="text-4xl font-black text-gray-100 group-hover:text-black transition-all">0{idx + 1}</div>
                        <div className="space-y-2 pt-2">
                           <p className="text-2xl font-bold">{step}</p>
                           <p className="text-gray-500 font-medium text-sm max-w-lg">এই ধাপটি সঠিকভাবে পালন করার জন্য স্থিরচিত্র এবং বর্ণিত আদবসমূহ লক্ষ্য করুন।</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="pt-12">
                   <button 
                    onClick={() => setShowQuiz(true)}
                    className="w-full py-6 bg-black text-white font-bold text-lg flex items-center justify-center gap-4 hover:bg-gray-800 transition-all"
                   >
                     নিজেকে যাচাই করুন <ArrowRight size={24} />
                   </button>
                </div>
             </div>
           ) : (
             <div className="space-y-12 animate-fadeIn flex flex-col flex-1">
                <div className="flex justify-between items-center border-b border-gray-100 pb-8">
                   <h2 className="text-3xl font-extrabold flex items-center gap-4">
                      <HelpCircle size={28} /> কুইজ টেস্ট
                   </h2>
                   <button onClick={() => setShowQuiz(false)} className="caps-label text-gray-400 hover:text-black">Cancel</button>
                </div>

                <div className="flex-1 space-y-8">
                   <p className="text-3xl font-extrabold leading-tight">{modules[activeModule].quiz.question}</p>
                   <div className="grid grid-cols-1 gap-2">
                      {modules[activeModule].quiz.options.map((option, idx) => (
                        <button 
                          key={idx}
                          disabled={isCorrect !== null}
                          onClick={() => handleQuizSubmit(idx)}
                          className={`p-6 text-left font-bold transition-all border-2 ${
                            selectedOption === idx 
                              ? (idx === modules[activeModule].quiz.correct ? 'bg-bd-green/10 border-bd-green text-bd-green' : 'bg-red-50 border-red-500 text-red-500')
                              : 'bg-white border-gray-100 hover:border-black'
                          }`}
                        >
                           {option}
                        </button>
                      ))}
                   </div>
                </div>

                {isCorrect !== null && (
                  <div className={`p-10 text-center space-y-8 animate-slideDown ${isCorrect ? 'bg-gray-50' : 'bg-red-50'}`}>
                     <div className="flex items-center justify-center gap-3">
                        {isCorrect ? <Trophy className="text-black" size={32} /> : <Sparkles className="text-gray-400" size={32} />}
                        <p className={`text-2xl font-extrabold ${isCorrect ? 'text-black' : 'text-red-500'}`}>
                           {isCorrect ? 'চমৎকার! সঠিক উত্তর।' : 'দুঃখিত, উত্তরটি ভুল ছিল।'}
                        </p>
                     </div>
                     <button 
                      onClick={nextModule}
                      className="w-full py-6 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-all"
                     >
                        পরবর্তী মডিউলে যান
                     </button>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Deen101;
