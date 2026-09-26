
import React from 'react';
import { Download, ShoppingBag, Sparkles, Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import { MOCK_CALLIGRAPHY } from '../data/mockData';
import ImageWithFallback from '../components/ui/ImageWithFallback';

const CalligraphyGallery: React.FC = () => {
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4 border-b border-border pb-12">
        <div className="caps-label text-muted-foreground">Premium Gallery</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">ভেক্টর ক্যালিগ্রাফি আর্ট।</h1>
      </div>

      <div className="bg-foreground text-background p-12 space-y-8">
         <div className="caps-label text-background">High Resolution</div>
         <h2 className="text-5xl font-bold leading-tight">ডিজিটাল ক্যালিগ্রাফি <br /> সংগ্রহশালা।</h2>
         <p className="text-background text-xl max-w-2xl font-medium">৫০০+ হাই-রেজোলিউশন আরবি ক্যালিগ্রাফি। গ্রাফিক ডিজাইনার এবং শিক্ষার্থীদের জন্য একদম ফ্রিতে ডাউনলোডযোগ্য।</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CALLIGRAPHY.map(item => (
          <div key={item.id} className="bg-card p-10 flex flex-col group h-full" rounded-lg border border-border>
            <div className="aspect-square rounded-lg bg-muted mb-8 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
              <ImageWithFallback src={item.image} name={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.name} />
            </div>
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                 <div className="caps-label text-muted-foreground">Vector Collection</div>
                 {item.isFree && <span className="text-[10px] font-bold bg-primary text-primary-foreground px-3 py-1 uppercase tracking-widest">Free</span>}
              </div>
              <h3 className="text-2xl font-bold flex-1 leading-tight">{item.name}</h3>
              <div className="pt-8 border-t border-border flex items-center justify-between">
                <span className="text-2xl font-bold">{item.isFree ? 'ফ্রি' : `৳ ${item.price}`}</span>
                <button className={`w-12 h-12 flex items-center justify-center transition-all ${item.isFree ? 'bg-primary text-primary-foreground hover:bg-primary' : 'border border-border text-foreground hover:border-primary'}`}>
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
