
import React from 'react';
import { ImageAsset } from '../types';

interface ImageCardProps {
  asset: ImageAsset;
  onBuy: (asset: ImageAsset) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ asset, onBuy }) => {
  return (
    <div className="group glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/20">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={asset.imageUrl} 
          alt={asset.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 right-4 flex gap-2">
          {asset.tags.map(tag => (
            <span key={tag} className="px-2 py-1 rounded bg-black/40 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-sky-300 border border-white/5">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold font-space text-white">{asset.name}</h3>
          <span className="text-sky-400 font-bold font-space">{asset.price} ETHO</span>
        </div>
        <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
          {asset.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20" />
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">
              By {asset.seller.slice(0, 10)}...
            </span>
          </div>
          <button 
            onClick={() => onBuy(asset)}
            className="px-4 py-2 bg-white text-slate-950 text-xs font-bold rounded-lg hover:bg-sky-400 hover:text-white transition-colors"
          >
            Buy Asset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
