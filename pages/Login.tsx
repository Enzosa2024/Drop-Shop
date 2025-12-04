import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Eye, EyeOff, ChevronLeft, Mail, Lock, User, CheckCircle, ShieldAlert, UserPlus } from 'lucide-react';

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(searchParams.get('mode') === 'register');
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: UserRole.BUYER
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if(await login(formData.email, formData.password)) {
          navigate('/app');
      } else {
          setError('Credenciais inválidas ou usuário bloqueado.');
      }
  };

  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      // Strict Validations
      if(formData.name.trim().length < 2) { setError('Nome é obrigatório.'); return; }
      if(formData.username.trim().length < 3) { setError('Usuário deve ter pelo menos 3 caracteres.'); return; }
      if(!formData.email.includes('@')) { setError('E-mail inválido.'); return; }
      if(formData.password.length < 6) { setError('Senha deve ter 6+ caracteres.'); return; }

      const result = await register({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          role: formData.role
      }, formData.password);

      if (result.success) {
          navigate('/app');
      } else {
          setError(result.message || 'Erro ao registrar.');
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 left-10 w-96 h-96 bg-brand-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
      </div>

      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft size={20} /> <span className="text-sm font-medium">Voltar</span>
      </button>

      <div className="w-full max-w-md p-8 z-10 glass rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-xl animate-fade-in mx-4">
        
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                {isRegistering ? 'Criar Conta' : 'Bem-vindo'}
            </h2>
            <p className="text-slate-400 text-sm mt-2">
                {isRegistering 
                    ? 'Preencha seus dados para começar'
                    : 'Acesse sua conta para continuar'
                }
            </p>
        </div>

        {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                <ShieldAlert size={16} />
                {error}
            </div>
        )}

        {/* LOGIN FORM */}
        {!isRegistering && (
            <form onSubmit={handleLogin} className="space-y-5">
                <div className="group">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-500 group-focus-within:text-brand-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Email ou Usuário"
                            className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-600"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>
                <div className="group">
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-500 group-focus-within:text-brand-500 transition-colors" size={20} />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Senha"
                            className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-10 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-600"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500 hover:text-white">
                            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                        </button>
                    </div>
                </div>
                <button disabled={isLoading} className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:to-brand-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-95 flex justify-center">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : 'Entrar'}
                </button>
            </form>
        )}

        {/* REGISTER FORM */}
        {isRegistering && (
            <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setFormData({...formData, role: UserRole.BUYER})}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.role === UserRole.BUYER ? 'bg-brand-500/20 border-brand-500 text-brand-300' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>
                        Quero Comprar
                    </button>
                    <button type="button" onClick={() => setFormData({...formData, role: UserRole.SELLER})}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.role === UserRole.SELLER ? 'bg-brand-500/20 border-brand-500 text-brand-300' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>
                        Quero Vender
                    </button>
                </div>
                
                <div className="relative group">
                    <User className="absolute left-3 top-3 text-slate-500" size={20} />
                    <input 
                        type="text" required placeholder="Nome Completo"
                        className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div className="relative group">
                    <UserPlus className="absolute left-3 top-3 text-slate-500" size={20} />
                    <input 
                        type="text" required placeholder="Nome de usuário"
                        className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                </div>

                <div className="relative group">
                    <Mail className="absolute left-3 top-3 text-slate-500" size={20} />
                    <input 
                        type="email" required placeholder="Seu e-mail"
                        className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <div className="relative group">
                     <Lock className="absolute left-3 top-3 text-slate-500" size={20} />
                     <input 
                        type={showPassword ? "text" : "password"} required placeholder="Senha (min 6 caracteres)"
                        className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                <button disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:to-emerald-500 transition-all flex items-center justify-center gap-2">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><CheckCircle size={20}/> Finalizar Cadastro</>}
                </button>
            </form>
        )}

        {/* FOOTER SWITCH */}
        <div className="mt-8 text-center border-t border-slate-700 pt-6">
            <button 
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                }}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
                {isRegistering ? 'Já tem conta? Faça Login' : 'Não tem conta? Cadastre-se'}
            </button>
        </div>

      </div>
    </div>
  );
};