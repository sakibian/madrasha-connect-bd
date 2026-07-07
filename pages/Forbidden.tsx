
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';

const Forbidden: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-8">
      <ShieldX size={80} className="text-red-300" />
      <div className="space-y-2">
        <h1 className="text-5xl font-extrabold">403</h1>
        <p className="text-xl font-bold text-gray-500">প্রবেশাধিকার অস্বীকৃত</p>
        <p className="text-gray-400 font-medium max-w-md">এই পৃষ্ঠায় প্রবেশের জন্য আপনার যথাযথ অনুমতি নেই।</p>
      </div>
      <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold border-b-2 border-black pb-0.5">
        <ArrowLeft size={16} /> ড্যাশবোর্ডে ফিরুন
      </Link>
    </div>
  );
};

export default Forbidden;
