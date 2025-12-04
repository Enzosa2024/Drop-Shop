import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, CreditCard } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckout, setIsCheckout] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
      if(!user) {
          navigate('/login');
          return;
      }
      setIsCheckout(true);
  };

  const finalizePurchase = (method: string) => {
      // Simulate purchase flow
      alert(`Redirecionando para pagamento via ${method}...`);
      
      if (method === 'PIX') {
          // In a real app, logic similar to ProductForm fee payment
          // Here simple alert for buyer flow
          alert("Abra seu banco e pague o PIX Copia e Cola gerado.");
      }
      
      clearCart();
      setIsCheckout(false);
      navigate('/app');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-400 mb-4">Seu carrinho está vazio</h2>
        <button onClick={() => navigate('/app')} className="text-brand-500 font-medium">Voltar para a loja</button>
      </div>
    );
  }

  if (isCheckout) {
      return (
          <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Pagamento</h2>
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                  <p className="text-gray-500 mb-2">Total a pagar</p>
                  <p className="text-3xl font-bold text-brand-900">R$ {total.toFixed(2)}</p>
              </div>
              
              <div className="space-y-3">
                  <button onClick={() => finalizePurchase('PIX')} className="w-full bg-green-600 text-white p-4 rounded-lg font-bold flex items-center justify-center gap-2">
                      <div className="w-4 h-4 bg-white/20 rounded-full"></div> PIX (Instantâneo)
                  </button>
                  <button onClick={() => finalizePurchase('Cartão de Crédito')} className="w-full bg-gray-800 text-white p-4 rounded-lg font-bold flex items-center justify-center gap-2">
                      <CreditCard size={18} /> Cartão de Crédito
                  </button>
              </div>
               <button onClick={() => setIsCheckout(false)} className="mt-6 w-full text-gray-500 text-sm">Cancelar</button>
          </div>
      )
  }

  return (
    <div className="p-4 pb-32">
      <h2 className="text-xl font-bold mb-4">Carrinho ({cart.length})</h2>
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
            <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded bg-gray-100" />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-medium line-clamp-1">{item.name}</h3>
                <p className="text-brand-accent font-bold">R$ {item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-3 bg-gray-50 rounded p-1">
                  <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1"><Minus size={14}/></button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1"><Plus size={14}/></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t p-4 md:relative md:border-0 md:bg-transparent">
         <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-4">
                <span className="text-gray-500">Total</span>
                <span className="text-2xl font-bold">R$ {total.toFixed(2)}</span>
            </div>
            <button 
                onClick={handleCheckout}
                className="w-full bg-brand-accent text-white py-4 rounded-lg font-bold shadow-lg text-lg"
            >
                Finalizar Compra
            </button>
         </div>
      </div>
    </div>
  );
};