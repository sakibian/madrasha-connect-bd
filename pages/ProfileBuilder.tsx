
import React, { useState, useEffect } from 'react';
import { User, GraduationCap, Briefcase, Eye, ArrowRight, ArrowLeft, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { getCurrentUser } from '../services/authService';
import { dataService } from '../services/dataService';
import { toast } from '../services/toast';

interface EducationEntry {
  institution: string;
  degree: string;
  year: string;
  result: string;
}

interface ExperienceEntry {
  title: string;
  organization: string;
  duration: string;
  description: string;
}

interface ProfileData {
  name: string;
  phone: string;
  district: string;
  maslak: string;
  bio: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
}

const ProfileBuilder: React.FC = () => {
  const user = getCurrentUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<ProfileData>({
    name: user?.name || '',
    phone: '',
    district: '',
    maslak: '',
    bio: '',
    education: [{ institution: '', degree: '', year: '', result: '' }],
    experience: [{ title: '', organization: '', duration: '', description: '' }]
  });

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      try {
         const data = await dataService.getMyProfile();

         if (data) {
          setFormData({
            name: data.name || '',
            phone: data.phone || '',
            district: data.district || '',
            maslak: data.maslak || '',
            bio: data.bio || '',
            education: (data.education as EducationEntry[]) || [{ institution: '', degree: '', year: '', result: '' }],
            experience: (data.experience as ExperienceEntry[]) || [{ title: '', organization: '', duration: '', description: '' }]
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  const updateField = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', year: '', result: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', organization: '', duration: '', description: '' }]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index: number, field: keyof ExperienceEntry, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        toast.error('নাম প্রয়োজন');
        return false;
      }
      if (!formData.phone.trim()) {
        toast.error('ফোন নম্বর প্রয়োজন');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(4, s + 1));
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error('লগইন করুন');
      return;
    }

    setSaving(true);
    try {
      await dataService.saveMyProfile({
        name: formData.name,
        phone: formData.phone,
        district: formData.district,
        maslak: formData.maslak,
        bio: formData.bio,
        education: formData.education,
        experience: formData.experience,
      });

      toast.success('প্রোফাইল সফলভাবে সেভ হয়েছে!');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      toast.error('সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <div className="text-gray-400">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-fadeIn pb-24">
      <div className="space-y-6 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Professional Identity</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">প্রফেশনাল আইডি বিল্ডার।</h1>
        <p className="text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
          আপনার ডিজিটাল বায়োডাটা বা সিভি তৈরি করুন। এই তথ্যগুলো নিয়োগকর্তাদের কাছে দৃশ্যমান হবে।
        </p>
      </div>

      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 minimal-border">
        <StepIndicator num={1} label="মৌলিক তথ্য" active={step === 1} />
        <StepIndicator num={2} label="শিক্ষাগত যোগ্যতা" active={step === 2} />
        <StepIndicator num={3} label="অভিজ্ঞতা" active={step === 3} />
        <StepIndicator num={4} label="প্রিভিউ" active={step === 4} />
      </div>

      <div className="bg-white minimal-border p-8 md:p-16">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-12 animate-fadeIn">
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-4">
              <User size={28} /> ব্যক্তিগত তথ্য
            </h2>
            <div className="space-y-8">
              <Input 
                label="পুরো নাম *" 
                value={formData.name} 
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="নাম লিখুন"
              />
              <Input 
                label="ফোন নম্বর *" 
                value={formData.phone} 
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="০১XXXXXXXXX"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input 
                  label="জেলা" 
                  value={formData.district} 
                  onChange={(e) => updateField('district', e.target.value)}
                  placeholder="উদা: ঢাকা"
                />
                <Input 
                  label="মাসলাক / মতাদর্শ" 
                  value={formData.maslak} 
                  onChange={(e) => updateField('maslak', e.target.value)}
                  placeholder="উদা: দেওবন্দী / আহলে সুন্নাত"
                />
              </div>
              <TextArea
                label="সংক্ষিপ্ত পরিচয়"
                value={formData.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="আপনার সম্পর্কে কিছু লিখুন (ঐচ্ছিক)"
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-12 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-4">
                <GraduationCap size={28} /> শিক্ষাগত যোগ্যতা
              </h2>
              <button
                onClick={addEducation}
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black"
              >
                <Plus size={18} /> আরও যোগ করুন
              </button>
            </div>
            <div className="space-y-8">
              {formData.education.map((edu, index) => (
                <div key={index} className="p-6 bg-gray-50 minimal-border space-y-6 relative">
                  {formData.education.length > 1 && (
                    <button
                      onClick={() => removeEducation(index)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-black"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="প্রতিষ্ঠানের নাম"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      placeholder="মাদ্রাসার নাম"
                    />
                    <Input
                      label="ডিগ্রি / সানাদ"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="উদা: দাওরায়ে হাদীস"
                    />
                    <Input
                      label="শিক্ষাবর্ষ"
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      placeholder="উদা: ২০২০"
                    />
                    <Input
                      label="ফলাফল"
                      value={edu.result}
                      onChange={(e) => updateEducation(index, 'result', e.target.value)}
                      placeholder="উদা: মুমতাজ / জায়্যিদ জিদ্দান"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Experience */}
        {step === 3 && (
          <div className="space-y-12 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-4">
                <Briefcase size={28} /> কর্ম অভিজ্ঞতা
              </h2>
              <button
                onClick={addExperience}
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black"
              >
                <Plus size={18} /> আরও যোগ করুন
              </button>
            </div>
            <div className="space-y-8">
              {formData.experience.map((exp, index) => (
                <div key={index} className="p-6 bg-gray-50 minimal-border space-y-6 relative">
                  {formData.experience.length > 1 && (
                    <button
                      onClick={() => removeExperience(index)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-black"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="পদবি / দায়িত্ব"
                        value={exp.title}
                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                        placeholder="উদা: মুদাররিস / খতীব"
                      />
                      <Input
                        label="প্রতিষ্ঠান"
                        value={exp.organization}
                        onChange={(e) => updateExperience(index, 'organization', e.target.value)}
                        placeholder="মাদ্রাসা / মসজিদের নাম"
                      />
                    </div>
                    <Input
                      label="সময়কাল"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      placeholder="উদা: ২০১৮ - ২০২২"
                    />
                    <TextArea
                      label="বিবরণ"
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      placeholder="দায়িত্ব ও অর্জন সম্পর্কে লিখুন"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && (
          <div className="space-y-12 animate-fadeIn">
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-4">
              <Eye size={28} /> প্রোফাইল প্রিভিউ
            </h2>
            
            <div className="space-y-10">
              {/* Basic Info Preview */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{formData.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  {formData.phone && <p><strong>ফোন:</strong> {formData.phone}</p>}
                  {formData.district && <p><strong>জেলা:</strong> {formData.district}</p>}
                  {formData.maslak && <p><strong>মাসলাক:</strong> {formData.maslak}</p>}
                </div>
                {formData.bio && (
                  <p className="text-gray-700 leading-relaxed mt-4">{formData.bio}</p>
                )}
              </div>

              {/* Education Preview */}
              {formData.education.some(e => e.institution || e.degree) && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <GraduationCap size={22} /> শিক্ষাগত যোগ্যতা
                  </h3>
                  <div className="space-y-4">
                    {formData.education.filter(e => e.institution || e.degree).map((edu, i) => (
                      <div key={i} className="p-4 bg-gray-50 minimal-border">
                        <p className="font-bold">{edu.degree || 'N/A'}</p>
                        <p className="text-gray-600">{edu.institution || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{edu.year} {edu.result && `• ${edu.result}`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Preview */}
              {formData.experience.some(e => e.title || e.organization) && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <Briefcase size={22} /> কর্ম অভিজ্ঞতা
                  </h3>
                  <div className="space-y-4">
                    {formData.experience.filter(e => e.title || e.organization).map((exp, i) => (
                      <div key={i} className="p-4 bg-gray-50 minimal-border">
                        <p className="font-bold">{exp.title || 'N/A'}</p>
                        <p className="text-gray-600">{exp.organization || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                        {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="pt-12 mt-12 border-t border-gray-100 flex justify-between items-center">
           <button 
             onClick={() => setStep(s => Math.max(1, s-1))} 
             disabled={step === 1}
             className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${step === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-black'}`}
           >
             <ArrowLeft size={18} /> পূর্ববর্তী
           </button>
           {step === 4 ? (
             <button 
               onClick={handleSave}
               disabled={saving}
               className="bg-black text-white px-12 py-5 font-bold text-sm flex items-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'} <CheckCircle size={20} />
             </button>
           ) : (
             <button 
               onClick={handleNext}
               className="bg-black text-white px-12 py-5 font-bold text-sm flex items-center gap-3 hover:bg-gray-800 transition-all"
             >
               পরবর্তী ধাপ <ArrowRight size={20} />
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

const StepIndicator = ({ num, label, active }: any) => (
  <div className={`flex items-center gap-4 px-4 md:px-8 py-4 transition-all ${active ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-white'} flex-1 justify-center`}>
    <span className="text-[10px] font-black uppercase tracking-widest">{num}. {label}</span>
  </div>
);

const Input = ({ label, placeholder, value, onChange }: any) => (
  <div className="space-y-3">
    <label className="caps-label text-gray-400">{label}</label>
    <input 
      value={value} 
      onChange={onChange}
      placeholder={placeholder} 
      className="w-full p-4 md:p-5 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-medium text-base md:text-lg" 
    />
  </div>
);

const TextArea = ({ label, placeholder, value, onChange, rows = 3 }: any) => (
  <div className="space-y-3">
    <label className="caps-label text-gray-400">{label}</label>
    <textarea 
      value={value} 
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full p-4 md:p-5 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-medium text-base md:text-lg resize-none"
    />
  </div>
);

export default ProfileBuilder;
