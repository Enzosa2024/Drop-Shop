import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';

export const Feed: React.FC = () => {
  const { products, addToCart } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Search Logic
  const filteredProducts = products.filter(p => {
      const term = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(term) || 
             p.description.toLowerCase().includes(term) || 
             p.category.toLowerCase().includes(term) ||
             p.shopName?.toLowerCase().includes(term);
  });

  return (
    <div className="pb-24 space-y-6">
      
      {/* Search Bar */}
      <div className="relative group z-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
          </div>
          <input 
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl leading-5 text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 sm:text-sm transition-all shadow-sm"
              placeholder="Pesquisar por produtos, marcas ou categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition">
                  <Filter size={20} />
              </button>
          </div>
      </div>

      {/* Banner */}
      {!searchTerm && (
        <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer transform transition hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute inset-0 flex items-center justify-between p-8">
                 <div className="z-10">
                     <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold text-white mb-3 inline-block border border-white/10">Destaque</span>
                     <h3 className="text-3xl font-black text-white mb-1">Tech Week</h3>
                     <p className="text-indigo-100 font-medium">Os melhores gadgets com envio imediato.</p>
                 </div>
                 <div className="w-32 h-32 bg-white/10 rounded-full blur-2xl absolute -right-4 -bottom-4"></div>
            </div>
        </div>
      )}

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Search className="text-slate-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhum resultado</h3>
          <p className="text-slate-500 max-w-xs mx-auto mb-6">Não encontramos produtos com este termo. Tente algo diferente.</p>
          {user?.role === 'SELLER' && (
             <button 
                onClick={() => navigate('/sell')}
                className="px-6 py-2 bg-brand-600 text-white rounded-full font-medium shadow-lg shadow-brand-500/20 hover:bg-brand-500 transition"
             >
                Criar Anúncio Agora
             </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 group hover:border-brand-500/50 transition-all">
              <div 
                className="aspect-[4/5] bg-slate-800 relative cursor-pointer overflow-hidden"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {product.condition === 'used' && (
                    <span className="absolute top-2 right-2 bg-amber-500/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-white shadow-sm">
                        USADO
                    </span>
                )}
              </div>
              <div className="p-4 flex flex-col">
                <div className="flex items-start justify-between mb-1">
                     <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug">{product.name}</h3>
                </div>
                <p className="text-xs text-slate-400 mb-3">{product.shopName}</p>
                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <p className="text-lg font-bold text-white">R$ {product.price.toFixed(2)}</p>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white hover:bg-brand-500 hover:scale-110 active:scale-95 transition-all shadow-lg shadow-brand-600/30"
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};