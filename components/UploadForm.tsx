
import React, { useState } from 'react';
import { enhanceImageDescription, suggestPrice } from '../services/geminiService';

interface UploadFormProps {
  onUpload: (data: any) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    tags: '',
    imageUrl: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!formData.name || !formData.description) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceImageDescription(formData.name, formData.description);
      const suggested = await suggestPrice(formData.tags.split(',').map(t => t.trim()));
      setFormData(prev => ({ 
        ...prev, 
        description: enhanced,
        price: suggested.toString()
      }));
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 glass rounded-3xl mt-10">
      <h2 className="text-3xl font-bold font-space mb-8 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
        List Professional Asset
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="group">
            <label className="block text-sm font-semibold text-slate-400 mb-2">Asset Name</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
              placeholder="e.g. Neon Catalyst"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all resize-none"
              placeholder="Tell the story of your image..."
            />
            <button
              onClick={handleEnhance}
              disabled={isEnhancing}
              className="mt-2 text-xs font-bold text-sky-400 flex items-center gap-2 hover:text-sky-300 disabled:opacity-50"
            >
              {isEnhancing ? 'Enhancing with AI...' : '✨ Enhance with Gemini AI'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">Price (ETHO)</label>
              <input 
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                placeholder="500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">Tags (comma separated)</label>
              <input 
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                placeholder="Tech, Blue, Minimal"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-slate-900/30 p-10 group hover:border-sky-500/50 transition-colors">
          <svg className="w-12 h-12 text-slate-600 mb-4 group-hover:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p className="text-sm font-medium text-slate-500 text-center mb-6">
            Drag & Drop or Click to Upload Professional Image
          </p>
          <input 
            type="file" 
            className="hidden" 
            id="image-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFormData({...formData, imageUrl: URL.createObjectURL(file)});
            }}
          />
          <label 
            htmlFor="image-upload"
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-bold transition-all cursor-pointer"
          >
            Select File
          </label>
          
          {formData.imageUrl && (
            <div className="mt-6 relative rounded-xl overflow-hidden aspect-video w-full">
              <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => onUpload(formData)}
        className="w-full mt-10 py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold tracking-wide shadow-xl shadow-sky-900/40 transition-all active:scale-[0.98]"
      >
        MINT AND LIST ASSET
      </button>
    </div>
  );
};

export default UploadForm;
