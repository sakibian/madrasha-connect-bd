
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Eye, ShieldCheck, Heart, Sparkles, UserCheck, ArrowRight } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-card animate-fadeIn">
      {/* Header */}
      <header className="py-8 bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold hover:text-foreground transition-colors">
            <ArrowLeft size={18} /> হোম
          </Link>
          <div className="flex flex-col items-center">
             <span className="text-xl font-bold tracking-tight">আমাদের লক্ষ্য</span>
             <span className="caps-label text-muted-foreground">Mission & Vision</span>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24 space-y-40">
        {/* Story Section */}
        <section className="max-w-4xl space-y-12">
           <div className="caps-label text-foreground">Establishment</div>
           <h1 className="text-6xl md:text-8xl font-extrabold leading-[1.05] tracking-tight">
             ঐতিহ্যের শেকড়, <br /> প্রযুক্তির ডালপালা।
           </h1>
           <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
             বাংলাদেশের মাদ্রাসা ব্যবস্থার সম্মান অক্ষুণ্ণ রেখে একে ডিজিটাল যুগের উপযোগী করে তোলাই আমাদের মূল লক্ষ্য। আমরা বিশ্বাস করি, সঠিক প্রযুক্তির ব্যবহার আলেম সমাজের কর্মসংস্থান এবং শিক্ষা ব্যবস্থাকে আরও সমৃদ্ধ করবে।
           </p>
        </section>

        {/* Vision & Mission Split */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-1 border-y border-border">
           <div className="py-24 pr-12 space-y-8 border-r border-border">
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold">M</div>
              <h2 className="text-4xl font-extrabold">আমাদের মিশন</h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                মাদ্রাসার প্রতিটি স্তরে ডিজিটাল সক্ষমতা বৃদ্ধি করা এবং আলেম-উলামাদের জন্য একটি স্বচ্ছ ও আধুনিক পেশাদার প্ল্যাটফর্ম প্রদান করা।
              </p>
           </div>
           <div className="py-24 pl-12 space-y-8">
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold">V</div>
              <h2 className="text-4xl font-extrabold">আমাদের ভিশন</h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                বাংলাদেশের মাদ্রাসা ইকোসিস্টেমকে বিশ্বের অন্যতম আধুনিক এবং টেকসই শিক্ষা ও পেশাদার নেটওয়ার্ক হিসেবে প্রতিষ্ঠিত করা।
              </p>
           </div>
        </section>

        {/* Values - Minimal Grid */}
        <section className="space-y-12">
           <div className="caps-label text-muted-foreground text-center">Core Values</div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ValueCard icon={<ShieldCheck size={32} />} title="স্বচ্ছতা" desc="আমরা আমাদের প্রতিটি ডাটা এবং ফিচারে সর্বোচ্চ স্বচ্ছতা বজায় রাখি।" />
              <ValueCard icon={<Heart size={32} />} title="মর্যাদা" desc="মাদ্রাসা এবং আলেম সমাজের ধর্মীয় মর্যাদা রক্ষা আমাদের অগ্রাধিকার।" />
              <ValueCard icon={<UserCheck size={32} />} title="নিরাপত্তা" desc="আপনার ব্যক্তিগত তথ্য এবং প্রতিষ্ঠানের গোপনীয়তা আমাদের কাছে আমানত।" />
           </div>
        </section>

        {/* Minimalist CTA */}
        <section className="py-24 bg-primary text-primary-foreground px-12 text-center space-y-10">
           <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
             আপনি কি এই যাত্রায় <br /> আমাদের সাথে আছেন?
           </h2>
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register-user" className="bg-card text-foreground px-10 py-5 font-bold rounded-md text-lg hover:bg-muted transition-all">
                রেজিস্ট্রেশন করুন
              </Link>
              <Link to="/contact" className="border border-border text-primary-foreground px-10 py-5 font-bold rounded-md text-lg hover:bg-secondary transition-all">
                যোগাযোগ করুন
              </Link>
           </div>
        </section>
      </main>

      <footer className="py-20 text-center border-t border-border">
         <div className="caps-label text-muted-foreground">© 2025 Qowmi</div>
      </footer>
    </div>
  );
};

const ValueCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-card p-12 space-y-6 hover:bg-muted transition-colors" rounded-lg border border-border>
    <div className="text-foreground">{icon}</div>
    <h3 className="text-2xl font-bold">{title}</h3>
    <p className="text-muted-foreground leading-relaxed font-medium text-sm">{desc}</p>
  </div>
);

export default AboutUs;
