
import React, { useEffect, useState } from 'react';
import { ShoppingBag, Heart, Download, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Badge, ImageWithFallback, Modal } from '../components/ui';
import { useAuthStore, useProductStore } from '../stores';

const Marketplace: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);
  const { products, fetch: fetchProducts, remove: deleteProduct } = useProductStore();
  const isAdmin = currentUser?.role === 'ADMIN';
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProduct(deleteId);
      setDeleteId(null);
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
           <ImageWithFallback src="https://picsum.photos/seed/pattern/600/450" className="w-full h-auto object-cover border-8 border-gray-900 shadow-2xl" alt="Featured" />
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 bg-gray-100 minimal-border">
        {products.map(product => (
          <div key={product.id} className="bg-white p-8 flex flex-col group h-full">
            <div className="relative aspect-square bg-gray-50 mb-8 overflow-hidden">
               <ImageWithFallback src={product.image} name={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={product.name} />
               <button className="absolute top-4 right-4 p-3 bg-white text-gray-300 hover:text-black border border-gray-100"><Heart size={18} /></button>
               {product.isFree && <Badge variant="success" className="absolute bottom-4 left-4">Free</Badge>}
            </div>
            <div className="flex-1 space-y-4 flex flex-col">
              <div className="caps-label text-gray-400">{product.category}</div>
              <h3 className="text-xl font-bold leading-tight flex-1">{product.name}</h3>
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                 <span className="text-2xl font-extrabold text-black">{product.isFree ? 'ফ্রি' : `৳ ${product.price}`}</span>
                 <div className="flex gap-2">
                     {isAdmin && (
                       <Button variant="danger" size="sm" onClick={() => setDeleteId(product.id)} icon={<Trash2 size={18} />} />
                     )}
                    <Button variant={product.isFree ? 'primary' : 'outline'} size="sm" icon={product.isFree ? <Download size={20} /> : <ShoppingBag size={20} />} />
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="পণ্য মুছে ফেলুন">
        <p className="text-gray-600 mb-6">পণ্যটি কি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteId(null)}>বাতিল</Button>
          <Button variant="danger" onClick={handleDelete}>মুছে ফেলুন</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Marketplace;
