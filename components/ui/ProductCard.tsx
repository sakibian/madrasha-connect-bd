
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => (
  <div
    onClick={onClick}
    className="bg-card minimal-border overflow-hidden group cursor-pointer hover:border-border transition-all"
  >
    <div className="aspect-square bg-muted grayscale overflow-hidden">
      <ImageWithFallback src={product.image} name={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
    </div>
    <div className="p-6 space-y-3">
      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{product.category}</span>
      <h3 className="font-extrabold text-foreground">{product.name}</h3>
      <p className="font-black text-xl">৳{product.price}</p>
    </div>
  </div>
);

export default ProductCard;
