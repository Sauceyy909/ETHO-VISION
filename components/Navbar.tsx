
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserState } from '../types';

interface NavbarProps {
  user: UserState;
  onConnect: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onConnect }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center neon-border group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold font-space tracking-tight text-sky-400">
            ETHO <span className="text-white">VISIØN</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-sky-400' : 'text-slate-400 hover:text-white'}`}>Marketplace</Link>
          <Link to="/upload" className={`text-sm font-medium transition-colors ${isActive('/upload') ? 'text-sky-400' : 'text-slate-400 hover:text-white'}`}>Sell Asset</Link>
          <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-sky-400' : 'text-slate-400 hover:text-white'}`}>Dashboard</Link>
        </div>
        
        <button
          onClick={onConnect}
          disabled={user.isConnecting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            user.address 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-900/40'
          }`}
        >
          {user.isConnecting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
          {user.address 
            ? `${user.address.slice(0, 6)}...${user.address.slice(-4)} | ${user.balance} ETHO`
            : 'Connect MetaMask'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
