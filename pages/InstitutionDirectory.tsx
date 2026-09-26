
import React, { useState } from 'react';
import { MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { MOCK_INSTITUTIONS } from '../data/mockData';
import { Link } from 'react-router-dom';
import { Button, SearchInput, ImageWithFallback } from '../components/ui';

const InstitutionDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Qawmi' | 'Alia' | 'Mosque'>('All');

  const filtered = MOCK_INSTITUTIONS.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inst.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || inst.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-border pb-12">
        <div className="space-y-2">
          <div className="caps-label text-muted-foreground">Directory</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">প্রতিষ্ঠান ডিরেক্টরি</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['All', 'Qawmi', 'Alia', 'Mosque'] as const).map(f => (
            <Button
              key={f}
              variant={activeFilter === f ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(f)}
            >
              {f === 'All' ? 'সব' : f === 'Qawmi' ? 'কওমি' : f === 'Alia' ? 'আলিয়া' : 'মসজিদ'}
            </Button>
          ))}
        </div>
      </div>

      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="প্রতিষ্ঠানের নাম বা এলাকা লিখুন..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(inst => (
          <Link key={inst.id} to={`/institution/${inst.id}`} className="bg-card rounded-lg border border-border overflow-hidden group hover:shadow-md hover:border-primary transition-all flex flex-col">
             <div className="aspect-[16/9] overflow-hidden bg-muted grayscale group-hover:grayscale-0 transition-all duration-700">
                <ImageWithFallback src={inst.image} name={inst.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={inst.name} />
             </div>

             <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex justify-between items-start">
                   <div className="caps-label text-primary">{inst.type}</div>
                   {inst.verified && <CheckCircle size={18} className="text-primary" />}
                </div>
                <h3 className="text-2xl font-extrabold">{inst.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                   <MapPin size={16} /> {inst.location}
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-border mt-auto">
                   <div className="space-y-1">
                      <div className="caps-label text-muted-foreground">Established</div>
                      <div className="text-sm font-bold">{inst.established}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="caps-label text-muted-foreground">Students</div>
                      <div className="text-sm font-bold">{inst.studentCount || 'N/A'}</div>
                   </div>
                </div>
                <div className="flex items-center justify-between font-bold text-sm border-t border-border pt-4 group-hover:text-primary">
                   বিস্তারিত প্রোফাইল <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
             </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InstitutionDirectory;
