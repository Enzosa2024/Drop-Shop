import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { ProductMessage, SyncEvent } from '../types';
import { storageService, subscribeToSync } from '../services/storageService';
import { ChevronLeft, Share2, AlertTriangle, Shield, Send, ShoppingBag, Truck } from 'lucide-react';

export const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, addToCart, reportProduct } = useStore();
    const { user } = useAuth();
    
    const product = products.find(p => p.id === id);
    const [activeImage, setActiveImage] = useState(0);
    const [messages, setMessages] = useState<ProductMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showReportForm, setShowReportForm] = useState(false);
    
    const [reportReason, setReportReason] = useState('Fraude');
    const [reportDetails, setReportDetails] = useState('');
    const [reportSuccess, setReportSuccess] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Load Chat & Subscribe to Updates
    useEffect(() => {
        if (!product) return;
        setMessages(storageService.getProductMessages(product.id));

        const unsubscribe = subscribeToSync((event: SyncEvent) => {
            if (event.type === 'NEW_PRODUCT_MSG' && event.payload.productId === product.id) {
                setMessages(prev => [...prev, event.payload]);
                scrollToBottom();
            }
        });
        
        scrollToBottom();
        return unsubscribe;
    }, [product]);

    const scrollToBottom = () => {
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !user || !product) return;

        const msg: ProductMessage = {
            id: Date.now().toString(),
            productId: product.id,
            senderId: user.id,
            senderName: user.name,
            senderAvatar: user.avatar,
            text: newMessage,
            timestamp: Date.now(),
            isSeller: user.id === product.sellerId
        };

        storageService.saveProductMessage(product.id, msg);
        setMessages(prev => [...prev, msg]);
        setNewMessage('');
        scrollToBottom();
    };

    const handleReport = (e: React.FormEvent) => {
        e.preventDefault();
        if(product && reportDetails) {
            reportProduct(product.id, reportReason, reportDetails);
            setReportSuccess(true);
            setTimeout(() => {
                setReportSuccess(false);
                setShowReportForm(false);
                setReportDetails('');
            }, 2000);
        }
    };

    if (!product) return <div className="p-10 text-center text-white">Produto não encontrado.</div>;

    return (
        <div className="bg-slate-950 min-h-screen pb-10">
            {/* Header */}
            <div className="sticky top-0 z-30 flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur border-b border-slate-800">
                <button onClick={() => navigate('/app')} className="p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700">
                    <ChevronLeft />
                </button>
                <div className="flex gap-2">
                    <button className="p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700">
                        <Share2 size={20} />
                    </button>
                    <button onClick={() => setShowReportForm(!showReportForm)} className="p-2 bg-slate-800 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition">
                        <AlertTriangle size={20} />
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Images Section */}
                <div className="space-y-4">
                    <div className="aspect-square bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 relative">
                        <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                        {product.condition === 'used' && (
                             <div className="absolute top-4 left-4 bg-amber-500 text-black font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                                 Usado
                             </div>
                        )}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {product.images.map((img, i) => (
                            <button 
                                key={i} 
                                onClick={() => setActiveImage(i)}
                                className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${activeImage === i ? 'border-brand-500' : 'border-transparent'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    {/* Report Form Inline */}
                    {showReportForm && (
                        <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-6 animate-fade-in mb-4">
                            {!reportSuccess ? (
                                <form onSubmit={handleReport} className="space-y-4">
                                    <h3 className="font-bold text-red-200 flex items-center gap-2"><Shield size={18}/> Denunciar Anúncio</h3>
                                    <select 
                                        className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl"
                                        value={reportReason} onChange={e => setReportReason(e.target.value)}
                                    >
                                        <option>Fraude / Golpe</option>
                                        <option>Produto Falso</option>
                                        <option>Conteúdo Impróprio</option>
                                        <option>Outro</option>
                                    </select>
                                    <textarea 
                                        placeholder="Descreva o problema..." 
                                        className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl min-h-[100px]"
                                        value={reportDetails} onChange={e => setReportDetails(e.target.value)}
                                        required
                                    />
                                    <button className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-500">Enviar Denúncia</button>
                                </form>
                            ) : (
                                <div className="text-center text-green-400 py-4 font-bold">Denúncia enviada com sucesso.</div>
                            )}
                        </div>
                    )}

                    <div>
                        <h1 className="text-3xl font-black text-white leading-tight mb-2">{product.name}</h1>
                        <p className="text-3xl font-bold text-brand-400">R$ {product.price.toFixed(2)}</p>
                    </div>

                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Truck className="text-brand-500" />
                            <div className="text-sm">
                                <p className="text-white font-medium">Envio Imediato</p>
                                <p className="text-slate-500">{product.stock} unidades disponíveis</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800">
                        <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider mb-2">Descrição</h3>
                        <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center gap-4 bg-slate-900 rounded-2xl p-4 border border-slate-800">
                        <img src={product.sellerAvatar || `https://ui-avatars.com/api/?name=${product.sellerName}`} className="w-12 h-12 rounded-full" alt="Seller"/>
                        <div className="flex-1">
                            <h4 className="font-bold text-white">{product.shopName}</h4>
                            <p className="text-xs text-slate-500">Vendedor Verificado</p>
                        </div>
                        <button className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700">Ver Perfil</button>
                    </div>

                    <button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-brand-500 shadow-xl shadow-brand-600/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                    >
                        <ShoppingBag size={20} /> Adicionar ao Carrinho
                    </button>

                    {/* Public Chat */}
                    <div className="mt-8 border-t border-slate-800 pt-6">
                        <h3 className="font-bold text-xl text-white mb-4">Perguntas ao Vendedor</h3>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden h-80 flex flex-col">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.length === 0 && (
                                    <div className="text-center text-slate-500 text-sm mt-10">Seja o primeiro a perguntar!</div>
                                )}
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.senderId === user?.id ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden">
                                             <img src={msg.senderAvatar || `https://ui-avatars.com/api/?name=${msg.senderName}`} className="w-full h-full object-cover"/>
                                        </div>
                                        <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                                            msg.isSeller 
                                                ? 'bg-brand-900/50 border border-brand-500/30 text-brand-100' 
                                                : 'bg-slate-800 text-slate-200'
                                        }`}>
                                            <div className="font-bold text-xs opacity-70 mb-1 flex items-center gap-1">
                                                {msg.senderName}
                                                {msg.isSeller && <span className="bg-brand-500 text-white text-[9px] px-1 rounded ml-1">Vendedor</span>}
                                            </div>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder={user ? "Escreva sua dúvida..." : "Faça login para perguntar"}
                                    disabled={!user}
                                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 text-white text-sm focus:border-brand-500 outline-none"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!user || !newMessage.trim()}
                                    className="bg-brand-600 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-brand-500"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};