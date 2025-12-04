import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Help: React.FC = () => {
  const navigate = useNavigate();
  const { submitHelpReport } = useStore();
  
  const [formData, setFormData] = useState({
      context: '',
      description: '',
      relatedUser: ''
  });
  
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.context || !formData.description) return;
      
      submitHelpReport(formData.context, formData.description, formData.relatedUser);
      setIsSuccess(true);
      setFormData({ context: '', description: '', relatedUser: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
            onClick={() => navigate('/')} 
            className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
            <ChevronLeft size={20} />
            <span className="font-medium">Voltar para o início</span>
        </button>

        <div className="bg-slate-900 border border-slate-800 shadow-xl rounded-2xl overflow-hidden">
            <div className="p-8 md:p-12 border-b border-slate-800">
                <h1 className="text-3xl font-extrabold text-white mb-4">
                    Centro de Ajuda
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed">
                    Esta página serve para reportar qualquer tipo de problema ocorrido no site, em comunidades, em anúncios ou em negociações. Seus relatórios nos ajudam a identificar bugs, casos suspeitos de fraude, golpes, falhas técnicas ou qualquer outra anomalia que precise ser analisada por nossa equipe de segurança e desenvolvimento.
                </p>
            </div>

            <div className="p-8 md:p-12 bg-slate-900/50">
                {isSuccess ? (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 flex flex-col items-center text-center animate-fade-in">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-green-400 mb-2">Relatório Enviado</h3>
                        <p className="text-green-200">
                            Seu relatório foi enviado com sucesso. Nossa equipe analisará as informações em breve.
                        </p>
                        <button 
                            onClick={() => setIsSuccess(false)}
                            className="mt-6 text-sm font-medium text-green-400 hover:text-green-300 underline"
                        >
                            Enviar outro relatório
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label htmlFor="context" className="block text-sm font-semibold text-slate-300 mb-2">
                                Onde ocorreu o problema?
                            </label>
                            <div className="relative">
                                <select
                                    id="context"
                                    required
                                    className="block w-full rounded-xl border-slate-700 bg-slate-950 text-white border p-4 focus:border-brand-500 focus:ring-brand-500 sm:text-sm shadow-sm appearance-none cursor-pointer"
                                    value={formData.context}
                                    onChange={e => setFormData({...formData, context: e.target.value})}
                                >
                                    <option value="" disabled>Selecione uma opção...</option>
                                    <option value="Página inicial">Página inicial</option>
                                    <option value="Comunidades">Comunidades</option>
                                    <option value="Marketplace">Marketplace</option>
                                    <option value="Criação de anúncio">Criação de anúncio</option>
                                    <option value="Chat privado">Chat privado</option>
                                    <option value="Página de usuário">Página de usuário</option>
                                    <option value="Sistema de denúncias">Sistema de denúncias</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-slate-300 mb-2">
                                Descreva o problema detalhadamente
                            </label>
                            <textarea
                                id="description"
                                required
                                rows={6}
                                className="block w-full rounded-xl border-slate-700 bg-slate-950 text-white border p-4 focus:border-brand-500 focus:ring-brand-500 sm:text-sm shadow-sm"
                                placeholder="Explique o que aconteceu, como aconteceu e quaisquer detalhes relevantes..."
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        <div>
                            <label htmlFor="relatedUser" className="block text-sm font-semibold text-slate-300 mb-2">
                                Este problema envolve alguém especificamente? <span className="font-normal text-slate-500">(Opcional)</span>
                            </label>
                            <input
                                type="text"
                                id="relatedUser"
                                className="block w-full rounded-xl border-slate-700 bg-slate-950 text-white border p-4 focus:border-brand-500 focus:ring-brand-500 sm:text-sm shadow-sm"
                                placeholder="Nome de usuário, ID ou link do perfil"
                                value={formData.relatedUser}
                                onChange={e => setFormData({...formData, relatedUser: e.target.value})}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all transform hover:-translate-y-1"
                            >
                                Enviar Relatório
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};