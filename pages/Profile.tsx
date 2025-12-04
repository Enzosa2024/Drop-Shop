import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { Camera, MapPin, Phone, Edit2, Package, Eye, MessageSquare, AlertOctagon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { products, deleteProduct } = useStore();
  const navigate = useNavigate();
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      bio: user?.bio || ''
  });

  if (!user) {
      navigate('/login');
      return null;
  }

  const myProducts = products.filter(p => p.sellerId === user.id);
  const isSeller = user.role === UserRole.SELLER;

  const handleSave = () => {
      updateProfile(formData);
      setEditing(false);
  };

  const handleDeleteProduct = (id: string) => {
      if(window.confirm('Tem certeza que deseja excluir este produto?')) {
          deleteProduct(id);
      }
  };

  return (
    <div className="min-h-screen pb-20">
      
      {/* Header Profile */}
      <div className="relative mb-20">
          <div className="h-40 bg-gradient-to-r from-brand-900 to-slate-900 w-full rounded-b-[3rem]"></div>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="relative">
                <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-28 h-28 rounded-full object-cover border-4 border-slate-950 shadow-2xl bg-slate-800"
                />
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-950"></div>
              </div>
              <div className="mt-3 text-center">
                   <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                   <p className="text-brand-400 font-medium">@{user.username}</p>
              </div>
          </div>
      </div>

      <div className="px-6 max-w-4xl mx-auto space-y-8">
          
          {/* Stats for Seller */}
          {isSeller && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center">
                      <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-400 mb-2">
                          <Package size={20} />
                      </div>
                      <span className="text-2xl font-bold text-white">{myProducts.length}</span>
                      <span className="text-xs text-slate-500">Produtos</span>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 mb-2">
                          <Eye size={20} />
                      </div>
                      <span className="text-2xl font-bold text-white">1.2k</span>
                      <span className="text-xs text-slate-500">Visualizações</span>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mb-2">
                          <MessageSquare size={20} />
                      </div>
                      <span className="text-2xl font-bold text-white">45</span>
                      <span className="text-xs text-slate-500">Mensagens</span>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center">
                      <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 mb-2">
                          <AlertOctagon size={20} />
                      </div>
                      <span className="text-2xl font-bold text-white">0</span>
                      <span className="text-xs text-slate-500">Denúncias</span>
                  </div>
              </div>
          )}

          {/* Edit Profile Section */}
          <div className="glass p-6 rounded-3xl border border-slate-800">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-white">Dados da Conta</h3>
                  {!editing && <button onClick={() => setEditing(true)} className="text-brand-400 hover:text-white"><Edit2 size={18}/></button>}
              </div>

              <div className="space-y-4">
                  <div>
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Bio</label>
                      {editing ? (
                          <textarea className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white mt-1" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={3}/>
                      ) : (
                          <p className="text-slate-300 text-sm mt-1 leading-relaxed">{user.bio || "Nenhuma biografia definida."}</p>
                      )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                      <div>
                          <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Telefone</label>
                          {editing ? (
                              <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white mt-1" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                          ) : (
                              <p className="text-slate-300 text-sm mt-1 flex items-center gap-2"><Phone size={14} className="text-slate-500"/> {user.phone || "---"}</p>
                          )}
                      </div>
                      <div>
                          <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Localização</label>
                          {editing ? (
                              <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white mt-1" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                          ) : (
                              <p className="text-slate-300 text-sm mt-1 flex items-center gap-2"><MapPin size={14} className="text-slate-500"/> {user.address || "---"}</p>
                          )}
                      </div>
                  </div>

                  {editing && (
                      <div className="flex gap-3 pt-4">
                          <button onClick={() => setEditing(false)} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400">Cancelar</button>
                          <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-brand-600 text-white font-bold">Salvar Alterações</button>
                      </div>
                  )}
              </div>
          </div>

          {/* Product Management (Seller Only) */}
          {isSeller && (
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-white">Meus Anúncios</h3>
                      <button onClick={() => navigate('/sell')} className="text-sm font-bold text-brand-400 hover:text-white">+ Novo</button>
                  </div>
                  
                  <div className="grid gap-4">
                      {myProducts.length === 0 ? (
                          <div className="text-center py-10 text-slate-600 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                              Você ainda não tem produtos.
                          </div>
                      ) : (
                          myProducts.map(prod => (
                              <div key={prod.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                                  <img src={prod.images[0]} className="w-16 h-16 rounded-xl object-cover bg-slate-800"/>
                                  <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-white truncate">{prod.name}</h4>
                                      <p className="text-brand-400 font-bold text-sm">R$ {prod.price.toFixed(2)}</p>
                                      <div className="flex gap-3 mt-1 text-xs text-slate-500">
                                          <span>Estoque: {prod.stock}</span>
                                          <span>Vendas: 0</span>
                                      </div>
                                  </div>
                                  <div className="flex gap-2">
                                      <button onClick={() => navigate(`/product/${prod.id}`)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white hover:bg-slate-700"><Eye size={18}/></button>
                                      <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 bg-slate-800 text-red-400 rounded-lg hover:bg-red-900/30"><Trash2 size={18}/></button>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          )}

          <button onClick={logout} className="w-full py-4 text-red-500 font-bold border border-slate-800 rounded-2xl hover:bg-red-500/10 transition">
              Sair da Conta
          </button>
      </div>
    </div>
  );
};