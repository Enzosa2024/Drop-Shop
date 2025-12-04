import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, TrendingUp, ShieldCheck, ArrowRight, Zap, Globe } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto w-full z-30 relative">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-tr from-brand-500 to-brand-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(139,92,246,0.5)]">D</div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">Drop Shop</span>
        </div>
        <div className="space-x-4">
             <button 
                onClick={() => navigate('/login')} 
                className="px-4 py-2 font-medium text-slate-300 hover:text-white transition"
             >
                Entrar
             </button>
             <button 
                onClick={() => navigate('/login?mode=register')} 
                className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-brand-50 transition shadow-[0_0_10px_rgba(255,255,255,0.3)]"
             >
                Criar Conta
             </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 px-4">
         <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-bold mb-8 animate-fade-in">
                <Zap size={16} className="text-brand-400" />
                <span>Multiplayer em Tempo Real</span>
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-8 leading-[1.1]">
                O Futuro do <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-brand-600 animate-pulse">
                    Commerce Social
                </span>
            </h1>
            <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Venda e compre instantaneamente. Sem taxas de adesão. Chat ao vivo. Sincronização global.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
                <button
                  onClick={() => navigate('/login?mode=register&role=SELLER')}
                  className="px-8 py-4 rounded-full text-lg font-bold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:scale-105"
                >
                  Começar a Vender Grátis
                </button>
                <button
                  onClick={() => navigate('/app')}
                  className="px-8 py-4 rounded-full text-lg font-bold text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all hover:scale-105"
                >
                  Explorar Marketplace
                </button>
            </div>
         </div>

         {/* Background Blobs */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] pointer-events-none">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob" style={{animationDelay: '2s'}}></div>
         </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl hover:border-brand-500/30 transition-all group">
                <div className="w-14 h-14 bg-brand-500/20 rounded-2xl flex items-center justify-center text-brand-400 mb-6 group-hover:scale-110 transition-transform">
                    <Globe size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">100% Sincronizado</h3>
                <p className="text-slate-400">
                    O que acontece agora, aparece para todos. Novos produtos, mensagens e atualizações sem recarregar a página.
                </p>
            </div>

            <div className="glass p-8 rounded-3xl hover:border-brand-500/30 transition-all group">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Segurança Total</h3>
                <p className="text-slate-400">
                    Verificação rigorosa de e-mails e sistema de denúncias integrado em tempo real para combater fraudes.
                </p>
            </div>

            <div className="glass p-8 rounded-3xl hover:border-brand-500/30 transition-all group">
                <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                    <TrendingUp size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Zero Taxas</h3>
                <p className="text-slate-400">
                    Publique quantos anúncios quiser sem pagar nada. O lucro é 100% seu. Liberdade total para vender.
                </p>
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 pt-16 pb-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="flex items-center gap-3 mb-6 md:mb-0">
                    <div className="bg-brand-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl">D</div>
                    <span className="font-bold text-2xl text-white">Drop Shop</span>
                </div>
                <div className="flex gap-8 text-sm font-medium text-slate-400">
                    <button onClick={() => navigate('/terms')} className="hover:text-white transition">Termos</button>
                    <button onClick={() => navigate('/privacy')} className="hover:text-white transition">Privacidade</button>
                    <button onClick={() => navigate('/help')} className="hover:text-white transition">Ajuda</button>
                </div>
            </div>
            <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-600">
                <p>&copy; {new Date().getFullYear()} Drop Shop. Todos os direitos reservados.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};