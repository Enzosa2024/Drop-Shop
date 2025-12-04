import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, PlusSquare, MessageCircle, User as UserIcon, LogOut, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, hideNav = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  if (hideNav) {
    return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
  }

  const NavItem = ({ path, icon: Icon, label }: { path: string; icon: any; label: string }) => (
    <button
      onClick={() => navigate(path)}
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
        isActive(path) ? 'text-brand-500' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      <Icon size={24} strokeWidth={isActive(path) ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  const getPageTitle = (path: string) => {
    if (path.includes('/cart')) return 'Carrinho';
    if (path.includes('/profile')) return 'Perfil';
    if (path.includes('/chat')) return 'Chat';
    if (path.includes('/sell')) return 'Vender';
    if (path.includes('/product/')) return 'Detalhes';
    return 'Drop Shop';
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/app')}>
            <div className="bg-gradient-to-r from-brand-600 to-brand-500 w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/20">D</div>
            <h1 className="text-xl font-bold tracking-tight text-white">Drop Shop</h1>
        </div>
        <div className="flex items-center space-x-6">
            <button onClick={() => navigate('/app')} className="hover:text-brand-400 font-medium text-slate-300 transition">Loja</button>
            {user?.role === UserRole.SELLER && (
               <button onClick={() => navigate('/sell')} className="bg-brand-600 text-white px-5 py-2 rounded-full font-medium hover:bg-brand-500 transition shadow-lg shadow-brand-500/30">Vender</button>
            )}
            <button onClick={() => navigate('/cart')} className="hover:text-brand-400 text-slate-300 transition">
                <ShoppingBag size={24} />
            </button>
            <button onClick={() => navigate('/chat')} className="hover:text-brand-400 text-slate-300 transition">
                <MessageCircle size={24} />
            </button>
            <button onClick={() => navigate('/profile')} className="hover:text-brand-400 text-slate-300 transition">
                <UserIcon size={24} />
            </button>
             <button onClick={logout} className="text-red-500 hover:text-red-400 transition">
                <LogOut size={20} />
            </button>
        </div>
      </header>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
            {location.pathname !== '/app' && (
                <button onClick={() => navigate(-1)} className="mr-3 text-slate-300 hover:text-white transition-colors">
                    <ChevronLeft size={26} />
                </button>
            )}
            <h1 className={`font-bold text-lg ${location.pathname === '/app' ? 'bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent' : 'text-white'}`}>
                {getPageTitle(location.pathname)}
            </h1>
        </div>
        {location.pathname === '/app' && (
             <div className="bg-gradient-to-r from-brand-600 to-brand-500 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs">D</div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto md:p-6 p-4">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 h-16 flex items-center justify-between px-4 z-50 pb-safe">
        <NavItem path="/app" icon={Home} label="Início" />
        <NavItem path="/cart" icon={ShoppingBag} label="Carrinho" />
        
        {user?.role === UserRole.SELLER ? (
             <div className="relative -top-6">
                <button 
                    onClick={() => navigate('/sell')}
                    className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] border-4 border-slate-950 active:scale-95 transition-transform"
                >
                    <PlusSquare size={28} />
                </button>
             </div>
        ) : (
             <div className="w-12"></div>
        )}

        <NavItem path="/chat" icon={MessageCircle} label="Chat" />
        <NavItem path="/profile" icon={UserIcon} label="Perfil" />
      </nav>
    </div>
  );
};