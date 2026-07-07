
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Download, 
  Star,
  Grid,
  List,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { Product } from '../types';
import { dataService } from '../services/dataService';
import { getCurrentUser } from '../services/authService';
import { Link } from 'react-router-dom';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    dataService.getProducts().then(setProducts);
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('পণ্যটি কি মুছে ফেলতে চান?')) {
      await dataService.deleteProduct(id);
      setProducts(await dataService.getProducts());
    }
  };

  return (
    <div className="space-y-24 animate-fadeIn">
      <div className="space-y-4 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Marketplace</div>
        <h1 className="text-5xl font-extrabold tracking-tight">সুন্নাহ ও ক্যালিগ্রাফি।</h1>
      </div>

      <section className="bg-black text-white p-16 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
        <div className="md:w-1/2 z-10 space-y-8">
          <div className="caps-label text-bd-green">Featured</div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">ভেক্টর ক্যালিগ্রাফি সংগ্রহ।</h2>
          <p className="text-gray-400 text-xl leading-relaxed">৫০০+ হাই-রেজোলিউশন আরবি ক্যালিগ্রাফি গ্রাফিক ডিজাইনার এবং শিক্ষার্থীদের জন্য একদম ফ্রিতে ডাউনলোডযোগ্য।</p>
          <Link to="/calligraphy" className="bg-white text-black px-10 py-5 font-bold text-lg inline-flex items-center gap-3 hover:bg-gray-100 transition-all">
            গ্যালারি দেখুন <ArrowRight size={20} />
          </Link>
        </div>
        <div className="md:w-1/2 grayscale hover:grayscale-0 transition-all duration-1000">
           <img src="https://picsum.photos/seed/pattern/600/450" className="w-full h-auto object-cover border-8 border-gray-900 shadow-2xl" alt="Featured" />
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 bg-gray-100 minimal-border">
        {products.map(product => (
          <div key={product.id} className="bg-white p-8 flex flex-col group h-full">
            <div className="relative aspect-square bg-gray-50 mb-8 overflow-hidden">
               <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
               <button className="absolute top-4 right-4 p-3 bg-white text-gray-300 hover:text-black border border-gray-100"><Heart size={18} /></button>
               {product.isFree && <span className="absolute bottom-4 left-4 bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest">Free</span>}
            </div>
            <div className="flex-1 space-y-4 flex flex-col">
              <div className="caps-label text-gray-400">{product.category}</div>
              <h3 className="text-xl font-bold leading-tight flex-1">{product.name}</h3>
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                 <span className="text-2xl font-extrabold text-black">{product.isFree ? 'ফ্রি' : `৳ ${product.price}`}</span>
                 <div className="flex gap-2">
                    {isAdmin && (
                      <button onClick={() => handleDelete(product.id)} className="p-3 border border-gray-200 text-red-600 hover:bg-red-50"><Trash2 size={18} /></button>
                    )}
                    <button className={`p-4 transition-all ${product.isFree ? 'bg-black text-white hover:bg-bd-green' : 'border border-black text-black hover:bg-black hover:text-white'}`}>
                       {product.isFree ? <Download size={20} /> : <ShoppingBag size={20} />}
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
