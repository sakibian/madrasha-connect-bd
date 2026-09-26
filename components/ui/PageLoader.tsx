
import React from 'react';

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
    <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-sm animate-pulse">M</div>
    <div className="caps-label text-muted-foreground animate-pulse">Loading...</div>
  </div>
);

export default PageLoader;
