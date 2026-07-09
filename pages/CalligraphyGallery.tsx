
import React from 'react';
import { Download, ShoppingBag, Sparkles, Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import { MOCK_CALLIGRAPHY } from '../data/mockData';
import ImageWithFallback from '../components/ui/ImageWithFallback';

const CalligraphyGallery: React.FC = () => {
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Premium Gallery</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">ভেক্টর ক্যালিগ্রাফি আর্ট।</h1>
      </div>

      <div className="bg-black text-white p-16 space-y-8">
         <div className="caps-label text-bd-green">High Resolution</div>
         <h2 className="text-5xl font-extrabold leading-tight">ডিজিটাল ক্যালিগ্রাফি <br /> সংগ্রহশালা।</h2>
         <p className="text-gray-400 text-xl max-w-2xl font-medium">৫০০+ হাই-রেজোলিউশন আরবি ক্যালিগ্রাফি। গ্রাফিক ডিজাইনার এবং শিক্ষার্থীদের জন্য একদম ফ্রিতে ডাউনলোডযোগ্য।</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 bg-gray-100 minimal-border">
        {MOCK_CALLIGRAPHY.map(item => (
          <div key={item.id} className="bg-white p-10 flex flex-col group h-full">
            <div className="aspect-square bg-gray-50 mb-8 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
              <ImageWithFallback src={item.image} name={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.name} />
            </div>
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                 <div className="caps-label text-gray-400">Vector Collection</div>
                 {item.isFree && <span className="text-[10px] font-extrabold bg-bd-green text-white px-3 py-1 uppercase tracking-widest">Free</span>}
              </div>
              <h3 className="text-2xl font-extrabold flex-1 leading-tight">{item.name}</h3>
              <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                <span className="text-2xl font-extrabold">{item.isFree ? 'ফ্রি' : `৳ ${item.price}`}</span>
                <button className={`w-12 h-12 flex items-center justify-center transition-all ${item.isFree ? 'bg-black text-white hover:bg-bd-green' : 'border border-gray-200 text-black hover:border-black'}`}>
                   {item.isFree ? <Download size={20} /> : <ShoppingBag size={20} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalligraphyGallery;
