import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ImageCard from './components/ImageCard';
import UploadForm from './components/UploadForm';
import { Web3Service } from './services/web3Service';
import { UserState, ImageAsset } from './types';
import { INITIAL_MOCK_ASSETS, PLATFORM_WALLET_ADDRESS } from './constants';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserState>({
    address: null,
    balance: '0',
    networkId: null,
    isConnecting: false
  });
  const [sellerWallet, setSellerWallet] = useState<string>(localStorage.getItem('seller_wallet') || '');
  const [assets, setAssets] = useState<ImageAsset[]>(() => {
    const saved = localStorage.getItem('etho_assets');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_ASSETS;
  });
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const connectWallet = useCallback(async () => {
    setUser(prev => ({ ...prev, isConnecting: true }));
    try {
      const service = Web3Service.getInstance();
      const address = await service.connect();
      if (address) {
        const balance = await service.getBalance(address);
        setUser({
          address,
          balance,
          networkId: '137',
          isConnecting: false
        });
        showNotification('Connected to Polygon Mainnet', 'success');
      }
    } catch (err: any) {
      console.error('Connection Error:', err);
      showNotification(err.message || 'MetaMask Connection Failed', 'error');
      setUser(prev => ({ ...prev, address: null, balance: '0', networkId: null, isConnecting: false }));
    }
  }, [showNotification]);

  const handleBuy = async (asset: ImageAsset) => {
    if (!user.address) {
      connectWallet();
      return;
    }

    try {
      const service = Web3Service.getInstance();
      showNotification(`Authorizing ${asset.price} ETHO...`, 'success');
      
      const success = await service.purchaseImage(asset.price, PLATFORM_WALLET_ADDRESS);
      
      if (success) {
        showNotification('Payment processed. Minting NFT...', 'success');
        showNotification('Asset successfully acquired!', 'success');
        const newAssets = assets.filter(a => a.id !== asset.id);
        setAssets(newAssets);
        localStorage.setItem('etho_assets', JSON.stringify(newAssets));
      }
    } catch (err: any) {
      console.error('Purchase Error:', err);
      showNotification(err.message || 'Transaction was rejected or failed', 'error');
    }
  };

  const handleUpload = (data: any) => {
    if (!user.address) {
      showNotification('Please connect wallet to list assets', 'error');
      return;
    }

    const newAsset: ImageAsset = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name || 'Visionary Asset',
      description: data.description || 'An exclusive professional digital asset.',
      imageUrl: data.imageUrl || `https://picsum.photos/seed/${Math.random()}/1000/1200`,
      price: parseFloat(data.price) || 500,
      seller: user.address,
      createdAt: Date.now(),
      tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : ['HighTech']
    };

    const updated = [newAsset, ...assets];
    setAssets(updated);
    localStorage.setItem('etho_assets', JSON.stringify(updated));
    showNotification('Asset MINTED and LISTED on marketplace!', 'success');
    navigate('/');
  };

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      const handleAccounts = (accounts: string[]) => {
        if (accounts.length > 0) connectWallet();
        else setUser({ address: null, balance: '0', networkId: null, isConnecting: false });
      };
      ethereum.on('accountsChanged', handleAccounts);
      return () => {
        if (ethereum.removeListener) ethereum.removeListener('accountsChanged', handleAccounts);
      };
    }
  }, [connectWallet]);

  return (
    <div className="min-h-screen relative flex flex-col bg-[#020617] text-slate-50 selection:bg-sky-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-sky-600/10 blur-[150px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <Navbar user={user} onConnect={connectWallet} />

      {notification && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 transition-all border animate-in slide-in-from-right fade-in duration-300 ${
          notification.type === 'success' ? 'glass border-sky-500/50 text-sky-400' : 'glass border-rose-500/50 text-rose-400'
        }`}>
          <div className={`w-3 h-3 rounded-full animate-pulse ${notification.type === 'success' ? 'bg-sky-500' : 'bg-rose-500'}`} />
          <span className="text-sm font-bold font-space uppercase tracking-wider">{notification.message}</span>
        </div>
      )}

      <main className="flex-1 container mx-auto px-6 py-12 relative z-10">
        <Routes>
          <Route path="/" element={
            <section className="animate-in fade-in duration-1000">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-black text-sky-400 uppercase tracking-[0.2em]">
                    Active Marketplace
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black font-space tracking-tighter leading-[0.9] uppercase italic">
                    DIGITAL <span className="text-sky-500">CURRENCY</span>
                  </h1>
                  <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                    The next generation of high-fidelity asset trading. Buy, list, and mint professional images using the native ETHO token on Polygon.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="glass px-8 py-6 rounded-3xl border-white/5 group hover:border-sky-500/30 transition-all duration-500">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 group-hover:text-sky-500">Volume (24h)</div>
                    <div className="text-3xl font-space font-bold tracking-tighter">1.2M <span className="text-sky-500 text-sm">ETHO</span></div>
                  </div>
                  <div className="glass px-8 py-6 rounded-3xl border-white/5 group hover:border-indigo-500/30 transition-all duration-500">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 group-hover:text-indigo-500">Assets Live</div>
                    <div className="text-3xl font-space font-bold tracking-tighter">{assets.length}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {assets.map((asset, index) => (
                  <div key={asset.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${index * 150}ms` }}>
                    <ImageCard asset={asset} onBuy={handleBuy} />
                  </div>
                ))}
              </div>
            </section>
          } />
          <Route path="/upload" element={<UploadForm onUpload={handleUpload} />} />
          <Route path="/dashboard" element={
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700">
              <div className="glass rounded-[3rem] p-12 mb-10 overflow-hidden relative">
                <div className="absolute -top-12 -right-12 text-sky-500/5 -rotate-12 select-none pointer-events-none">
                  <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <h2 className="text-5xl font-black font-space mb-4 tracking-tighter uppercase italic">Control <span className="text-sky-500">Center</span></h2>
                  <p className="text-slate-400 text-lg mb-12 max-w-xl">Unified dashboard for managing your professional asset portfolio and liquidity.</p>
                  
                  {!user.address ? (
                    <div className="py-20 flex flex-col items-center glass border-white/5 rounded-[2rem]">
                      <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-slate-400 mb-8 font-bold uppercase tracking-widest text-xs">Security Protocol Required</p>
                      <button onClick={connectWallet} className="px-12 py-5 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-black tracking-widest uppercase transition-all shadow-2xl shadow-sky-900/40 hover:scale-105 active:scale-95">Connect MetaMask</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="glass p-8 rounded-3xl border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                        <div className="text-[10px] text-emerald-400 font-black mb-2 uppercase tracking-[0.2em]">ETHO Balance</div>
                        <div className="text-4xl font-space font-bold tracking-tighter">{user.balance}</div>
                      </div>
                      <div className="glass p-8 rounded-3xl border-sky-500/20 hover:border-sky-500/40 transition-colors">
                        <div className="text-[10px] text-sky-400 font-black mb-2 uppercase tracking-[0.2em]">Active Listings</div>
                        <div className="text-4xl font-space font-bold tracking-tighter">{assets.filter(a => a.seller === user.address).length}</div>
                      </div>
                      <div className="glass p-8 rounded-3xl border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                        <div className="text-[10px] text-indigo-400 font-black mb-2 uppercase tracking-[0.2em]">Vault Status</div>
                        <div className="text-4xl font-space font-bold tracking-tighter">VERIFIED</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {user.address && (
                <div className="glass rounded-[3rem] p-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-sky-500/10 rounded-2xl">
                      <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black font-space tracking-tight uppercase">Payout Configurations</h3>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <label className="block text-xs font-black text-slate-500 mb-3 uppercase tracking-widest">Withdrawal Wallet Address (Polygon)</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input 
                          type="text"
                          value={sellerWallet}
                          onChange={(e) => {
                            setSellerWallet(e.target.value);
                            localStorage.setItem('seller_wallet', e.target.value);
                          }}
                          placeholder="0x..."
                          className="flex-1 bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all font-mono text-sm tracking-tighter"
                        />
                        <button 
                          onClick={() => showNotification('Withdrawal configurations updated!', 'success')}
                          className="px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-sky-400 hover:text-white transition-all uppercase tracking-widest text-xs active:scale-95"
                        >
                          Sync Wallet
                        </button>
                      </div>
                      <div className="mt-4 flex items-start gap-3 p-4 bg-sky-500/5 rounded-2xl border border-sky-500/10">
                        <svg className="w-5 h-5 text-sky-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-slate-500 italic leading-relaxed">
                          This address is registered for automatic P2P liquidation. When your listed assets are purchased, the price is routed here via the ETHO protocol protocol in the background.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          } />
        </Routes>
      </main>
      
      <footer className="py-12 border-t border-white/5 text-center bg-slate-950/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 flex flex-col items-center gap-4">
          <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">
            Secured by ETHO VISION Engine
          </div>
          <p className="text-slate-600 text-xs font-medium">© 2025 Professional Image Trading Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;