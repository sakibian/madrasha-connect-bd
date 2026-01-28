
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Download, 
  Star,
  Grid,
  List,
  Trash2
} from 'lucide-react';
import { Product } from '../types';
import { dataService } from '../services/dataService';
import { getCurrentUser } from '../services/authService';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(dataService.getProducts());
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    const update = () => setProducts(dataService.getProducts());
    window.addEventListener('data_update', update);
    return () => window.removeEventListener('data_update', update);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('পণ্যটি কি মুছে ফেলতে চান?')) {
      dataService.deleteProduct(id);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">মার্কেটপ্লেস</h1>
          <p className="text-gray-500">সেরা মানের সুন্নাহ পণ্য এবং ক্যালিগ্রাফি সংগ্রহ।</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button className="p-2 bg-emerald-700 text-white rounded-lg"><Grid size={20} /></button>
          <button className="p-2 text-gray-400 hover:text-emerald-700"><List size={20} /></button>
        </div>
      </div>

      <section className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="md:w-1/2 z-10">
          <span className="inline-block px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">ফ্রি কালেকশন</span>
          <h2 className="text-3xl font-bold text-amber-900 mb-4">ভেক্টর ক্যালিগ্রাফি ডাউনলোড করুন</h2>
          <p className="text-amber-800 mb-6">৫০০+ হাই-রেজোলিউশন আরবি ক্যালিগ্রাফি একদম ফ্রিতে ডাউনলোড করুন।</p>
          <button className="bg-amber-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-700 transition-all flex items-center gap-2">গ্যালারি দেখুন <Download size={20} /></button>
        </div>
        <div className="md:w-1/2 flex justify-center z-10"><img src="https://picsum.photos/seed/pattern/400/300" className="rounded-2xl shadow-xl border-4 border-white" alt="Featured" /></div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col group relative">
            {isAdmin && (
              <button onClick={() => handleDelete(product.id)} className="absolute top-3 left-3 z-20 p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
            )}
            <div className="relative aspect-[4/3] overflow-hidden">
               <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500"><Heart size={18} /></button>
               {product.isFree && <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Free</span>}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
              <h3 className="font-bold text-gray-800 mb-2 leading-snug">{product.name}</h3>
              <div className="mt-auto flex items-center justify-between">
                 <span className="text-xl font-bold text-emerald-800">{product.isFree ? 'ফ্রি' : `৳ ${product.price}`}</span>
                 <button className={`p-2 rounded-lg transition-all ${product.isFree ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white'}`}>
                    {product.isFree ? <Download size={20} /> : <ShoppingBag size={20} />}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
