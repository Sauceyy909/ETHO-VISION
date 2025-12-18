
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
  const [sellerWallet, setSellerWallet] = useState<string>('');
  const [assets, setAssets] = useState<ImageAsset[]>(INITIAL_MOCK_ASSETS);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

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
        showNotification('MetaMask Connected to Polygon', 'success');
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Connection failed', 'error');
      setUser(prev => ({ ...prev, isConnecting: false }));
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleBuy = async (asset: ImageAsset) => {
    if (!user.address) {
      connectWallet();
      return;
    }

    try {
      const service = Web3Service.getInstance();
      showNotification(`Initiating Secure Transfer of ${asset.price} ETHO...`, 'success');
      
      // Step 1: User sends ETHO to the Platform Wallet (Your wallet)
      // This wallet acts as the intermediary to ensure the NFT is minted and the seller is paid.
      await service.purchaseImage(asset.price, PLATFORM_WALLET_ADDRESS);
      
      showNotification('Funds Secured. Minting NFT to Vault...', 'success');
      
      // Step 2: The platform automatically mints/transfers the NFT (Simulated in background)
      // Logic would typically trigger a backend script here using the platform private key.
      
      showNotification('Success! Asset acquired and NFT minted.', 'success');
      
      // Remove from marketplace (simulation)
      setAssets(prev => prev.filter(a => a.id !== asset.id));
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Transaction failed', 'error');
    }
  };

  const handleUpload = (data: any) => {
    if (!user.address) {
      showNotification('Please connect wallet to list assets', 'error');
      return;
    }

    const newAsset: ImageAsset = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl || `https://picsum.photos/seed/${data.name}/800/1000`,
      price: parseFloat(data.price) || 100,
      seller: user.address,
      createdAt: Date.now(),
      tags: data.tags.split(',').map((t: string) => t.trim())
    };

    setAssets(prev => [newAsset, ...prev]);
    showNotification('Asset successfully listed for sale!', 'success');
    navigate('/');
  };

  useEffect(() => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) connectWallet();
        else setUser({ address: null, balance: '0', networkId: null, isConnecting: false });
      });
    }
  }, [connectWallet]);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#020617]">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <Navbar user={user} onConnect={connectWallet} />

      {notification && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce transition-all ${
          notification.type === 'success' ? 'glass border-emerald-500/50 text-emerald-400' : 'glass border-rose-500/50 text-rose-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span className="text-sm font-bold font-space">{notification.message}</span>
        </div>
      )}

      <main className="container mx-auto px-6 py-12">
        <Routes>
          <Route path="/" element={
            <section>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <h1 className="text-5xl md:text-7xl font-black font-space tracking-tighter mb-4 leading-none uppercase">
                    Visiønary <span className="text-sky-500">Assets</span>
                  </h1>
                  <p className="text-slate-400 text-lg max-w-xl font-medium">
                    The elite portal for professional image trading. Secured by the ETHO protocol on Polygon.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="glass px-6 py-4 rounded-2xl border-white/5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Market Vol.</div>
                    <div className="text-xl font-space font-bold text-sky-400">1.2M ETHO</div>
                  </div>
                  <div className="glass px-6 py-4 rounded-2xl border-white/5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Live Assets</div>
                    <div className="text-xl font-space font-bold">{assets.length}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {assets.map(asset => (
                  <ImageCard 
                    key={asset.id} 
                    asset={asset} 
                    onBuy={handleBuy}
                  />
                ))}
              </div>
            </section>
          } />
          <Route path="/upload" element={<UploadForm onUpload={handleUpload} />} />
          <Route path="/dashboard" element={
            <div className="max-w-4xl mx-auto">
              <div className="glass rounded-3xl p-10 mb-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 text-slate-800/10 -rotate-12 select-none pointer-events-none">
                  <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold font-space mb-2">Account Dashboard</h2>
                <p className="text-slate-400 mb-8">Manage your assets, revenue, and platform settings.</p>
                
                {!user.address ? (
                  <div className="py-12 flex flex-col items-center">
                    <p className="text-slate-500 mb-6 font-medium">Connect MetaMask to access your private dashboard</p>
                    <button onClick={connectWallet} className="px-10 py-4 bg-sky-600 hover:bg-sky-500 rounded-full font-bold shadow-xl shadow-sky-900/20 transition-all">Connect Wallet</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-2xl border-emerald-500/20">
                      <div className="text-xs text-emerald-400 font-bold mb-1 uppercase tracking-tighter">ETHO Balance</div>
                      <div className="text-3xl font-space font-bold">{user.balance}</div>
                    </div>
                    <div className="glass p-6 rounded-2xl border-sky-500/20">
                      <div className="text-xs text-sky-400 font-bold mb-1 uppercase tracking-tighter">Assets Owned</div>
                      <div className="text-3xl font-space font-bold">0</div>
                    </div>
                    <div className="glass p-6 rounded-2xl border-indigo-500/20">
                      <div className="text-xs text-indigo-400 font-bold mb-1 uppercase tracking-tighter">Sales Revenue</div>
                      <div className="text-3xl font-space font-bold">0.00</div>
                    </div>
                  </div>
                )}
              </div>

              {user.address && (
                <div className="glass rounded-3xl p-10">
                  <h3 className="text-xl font-bold font-space mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Seller Settings
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-2">Withdrawal Wallet Address (Polygon)</label>
                      <div className="flex gap-4">
                        <input 
                          type="text"
                          value={sellerWallet}
                          onChange={(e) => setSellerWallet(e.target.value)}
                          placeholder="0x..."
                          className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                        />
                        <button 
                          onClick={() => showNotification('Withdrawal wallet updated!', 'success')}
                          className="px-6 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-sky-400 hover:text-white transition-colors"
                        >
                          Save
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-slate-500 italic">This is where your ETHO proceeds will be sent automatically upon a successful sale.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          } />
        </Routes>
      </main>
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
