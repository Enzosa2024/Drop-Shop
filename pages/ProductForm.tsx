import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ChevronLeft, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

export const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addProduct } = useStore();
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    shopName: user?.name || '',
    category: 'Geral',
    condition: 'new' as 'new' | 'used',
    paymentMethods: {
      pix: true,
      credit: true,
      debit: true
    }
  });

  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImages([...images, url]);
    }
  };

  const handleSubmit = () => {
    setError('');

    // Strict Validation
    if (!formData.name.trim()) return setError('Nome do produto é obrigatório.');
    if (!formData.description.trim()) return setError('Descrição é obrigatória.');
    if (!formData.shopName.trim()) return setError('Nome da loja é obrigatório.');
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) return setError('Preço deve ser um valor positivo.');
    
    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) return setError('Estoque deve ser um número inteiro válido.');

    if (images.length === 0) return setError('Adicione pelo menos 1 imagem real do produto.');

    if (!user) return;
    
    const newProduct: Product = {
        id: Date.now().toString(),
        sellerId: user.id,
        sellerName: user.name,
        sellerAvatar: user.avatar,
        shopName: formData.shopName,
        name: formData.name,
        description: formData.description,
        price: price,
        stock: stock,
        category: formData.category,
        images: images,
        condition: formData.condition,
        paymentMethods: Object.keys(formData.paymentMethods).filter(k => (formData.paymentMethods as any)[k]),
        createdAt: Date.now(),
        active: true 
    };
    
    addProduct(newProduct); // Broadcasts automatically via Context
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <div className="border-b border-slate-800 px-4 py-4 flex items-center sticky top-0 bg-slate-950/80 backdrop-blur z-20">
        <button onClick={() => navigate('/app')} className="p-2 -ml-2 text-slate-400 hover:text-white">
            <ChevronLeft />
        </button>
        <span className="ml-2 font-bold text-lg text-white">Criar Anúncio</span>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        
        {/* Images */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Fotos do Produto *</label>
            <div className="grid grid-cols-3 gap-3">
                {images.map((img, idx) => (
                    <div key={idx} className="aspect-square bg-slate-800 rounded-xl overflow-hidden border border-slate-700 relative group">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition">✕</button>
                    </div>
                ))}
                {images.length < 5 && (
                    <label className="aspect-square bg-slate-900 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 hover:border-brand-500 transition-colors">
                        <Upload className="text-slate-500" />
                        <span className="text-xs text-slate-500 mt-2">Adicionar</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                )}
            </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nome do Produto</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none transition" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Fone Bluetooth Pro" />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nome da Loja</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none transition" 
                    value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} placeholder="Ex: Tech Store" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Descrição Detalhada</label>
                <textarea className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none transition" rows={5}
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descreva características, estado e detalhes..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Preço (R$)</label>
                    <input type="number" step="0.01" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none transition" 
                        value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Estoque</label>
                    <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none transition" 
                        value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Categoria</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none transition appearance-none"
                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option>Geral</option>
                        <option>Eletrônicos</option>
                        <option>Moda</option>
                        <option>Casa</option>
                        <option>Beleza</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Condição</label>
                    <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-700">
                        <button className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${formData.condition === 'new' ? 'bg-brand-600 text-white shadow' : 'text-slate-400'}`}
                            onClick={() => setFormData({...formData, condition: 'new'})}>Novo</button>
                        <button className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${formData.condition === 'used' ? 'bg-brand-600 text-white shadow' : 'text-slate-400'}`}
                            onClick={() => setFormData({...formData, condition: 'used'})}>Usado</button>
                    </div>
                </div>
            </div>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg flex items-center gap-2">
                <AlertTriangle size={18} />
                <span className="text-sm font-medium">{error}</span>
            </div>
        )}

        <button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
            Publicar Anúncio Gratuitamente
        </button>

      </div>
    </div>
  );
};