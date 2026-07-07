
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white minimal-border overflow-hidden group cursor-pointer hover:border-gray-300 transition-all"
  >
    <div className="aspect-square bg-gray-100 grayscale overflow-hidden">
      <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
    </div>
    <div className="p-6 space-y-3">
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{product.category}</span>
      <h3 className="font-extrabold text-gray-800">{product.name}</h3>
      <p className="font-black text-xl">৳{product.price}</p>
    </div>
  </div>
);

export default ProductCard;
