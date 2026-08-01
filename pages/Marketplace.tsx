
import React, { useEffect, useState } from 'react';
import { ShoppingBag, Heart, Download, Trash2, ArrowRight, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Badge, ImageWithFallback, Modal, LoadingSkeleton } from '../components/ui';
import { useAuthStore, useProductStore } from '../stores';
import { toast } from '../services/toast';

const Marketplace: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);
  const { products, loading, fetch: fetchProducts, remove: deleteProduct } = useProductStore();
  const isAdmin = currentUser?.role === 'ADMIN';
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProduct(deleteId);
      setDeleteId(null);
    }
  };

  const handleDownload = (product: any) => {
    if (!currentUser) {
      toast.warning('ডাউনলোড করতে প্রথমে লগইন করুন।');
      return;
    }
    setSelectedProduct(product);
    setShowDownloadModal(true);
  };

  const handlePurchase = (product: any) => {
    if (!currentUser) {
      toast.warning('কেনাকাটা করতে প্রথমে লগইন করুন।');
      return;
    }
    setSelectedProduct(product);
    setShowPurchaseModal(true);
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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 bg-gray-100 minimal-border">
          <LoadingSkeleton variant="card" count={8} />
        </div>
      ) : (
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
                    <Button 
                      variant={product.isFree ? 'primary' : 'outline'} 
                      size="sm" 
                      icon={product.isFree ? <Download size={20} /> : <ShoppingBag size={20} />}
                      onClick={() => product.isFree ? handleDownload(product) : handlePurchase(product)}
                    />
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="পণ্য মুছে ফেলুন">
        <p className="text-gray-600 mb-6">পণ্যটি কি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteId(null)}>বাতিল</Button>
          <Button variant="danger" onClick={handleDelete}>মুছে ফেলুন</Button>
        </div>
      </Modal>

      {/* Download Modal for Free Items */}
      {showDownloadModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowDownloadModal(false)}>
          <div className="bg-white p-8 max-w-md w-full border border-gray-200 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">ফ্রি ডাউনলোড</h3>
              <button onClick={() => setShowDownloadModal(false)} className="text-gray-400 hover:text-black p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="aspect-square bg-gray-50 overflow-hidden">
                <ImageWithFallback 
                  src={selectedProduct.image} 
                  name={selectedProduct.name} 
                  className="w-full h-full object-cover" 
                  alt={selectedProduct.name} 
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold">{selectedProduct.name}</h4>
                <p className="text-sm text-gray-500">{selectedProduct.category}</p>
              </div>

              <div className="bg-bd-green/5 border border-bd-green/20 p-4">
                <p className="text-sm text-gray-700 font-medium">
                  এই ফাইলটি সম্পূর্ণ ফ্রি! নিচের বাটনে ক্লিক করে ডাউনলোড করুন।
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={selectedProduct.image}
                  download={selectedProduct.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-bd-green text-white font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-3"
                  onClick={() => {
                    toast.success('ডাউনলোড শুরু হয়েছে!');
                    setShowDownloadModal(false);
                  }}
                >
                  <Download size={20} /> এখনই ডাউনলোড করুন
                </a>
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="w-full py-4 border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal for Paid Items */}
      {showPurchaseModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowPurchaseModal(false)}>
          <div className="bg-white p-8 max-w-md w-full border border-gray-200 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">পণ্য ক্রয়</h3>
              <button onClick={() => setShowPurchaseModal(false)} className="text-gray-400 hover:text-black p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="aspect-square bg-gray-50 overflow-hidden">
                <ImageWithFallback 
                  src={selectedProduct.image} 
                  name={selectedProduct.name} 
                  className="w-full h-full object-cover" 
                  alt={selectedProduct.name} 
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold">{selectedProduct.name}</h4>
                <p className="text-sm text-gray-500">{selectedProduct.category}</p>
                <p className="text-3xl font-extrabold">৳ {selectedProduct.price}</p>
              </div>

              <div className="bg-warning-50 border border-warning-100 p-4">
                <p className="text-sm text-warning-700 font-medium">
                  <strong>অনলাইন পেমেন্ট শীঘ্রই আসছে।</strong> এখনই কিনতে চাইলে আমাদের সাথে যোগাযোগ করুন:
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href="mailto:marketplace@mcbd.org?subject=Product Purchase: {selectedProduct.name}"
                  className="w-full py-4 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
                  onClick={() => {
                    toast.success('ইমেইল ক্লায়েন্ট খোলা হচ্ছে...');
                    setShowPurchaseModal(false);
                  }}
                >
                  <ExternalLink size={20} /> ইমেইলে অর্ডার করুন
                </a>
                <a
                  href="tel:+8801XXXXXXXXX"
                  className="w-full py-4 bg-bd-green text-white font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={20} /> ফোনে অর্ডার করুন
                </a>
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="w-full py-4 border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
