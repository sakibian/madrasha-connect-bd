
import React from 'react';

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
    <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold text-sm animate-pulse">M</div>
    <div className="caps-label text-gray-400 animate-pulse">Loading...</div>
  </div>
);

export default PageLoader;
