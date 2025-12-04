import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const Privacy: React.FC = () => {
  const navigate = useNavigate();

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

        <div className="bg-slate-900 border border-slate-800 shadow-xl rounded-2xl p-8 md:p-12">
            <h1 className="text-3xl font-extrabold text-white mb-8 pb-4 border-b border-slate-800">
                Política de Privacidade
            </h1>

            <div className="space-y-8 leading-relaxed text-slate-300">
                <p className="text-lg">
                    No Drop Shop, a privacidade e a segurança dos seus dados são prioridades absolutas. Esta política descreve de forma transparente como coletamos, usamos, armazenamos e protegemos suas informações pessoais. Ao utilizar nossos serviços, você confia a nós seus dados, e estamos comprometidos em manter essa confiança através de práticas claras e seguras de manipulação de informação.
                </p>

                <section>
                    <h2 className="text-xl font-bold text-brand-400 mb-4">Coleta e Tratamento de Dados</h2>
                    <p>
                        Coletamos apenas as informações estritamente necessárias para o funcionamento adequado da plataforma e para a sua segurança. Isso inclui dados fornecidos diretamente por você no momento do cadastro, como nome, e-mail, telefone e endereço, bem como informações geradas automaticamente durante a navegação, como registros de acesso e interações com a interface. Esses dados são utilizados para criar sua identidade digital no Marketplace, processar transações, verificar pagamentos e personalizar sua experiência de uso. Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing sem o seu consentimento explícito.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-brand-400 mb-4">Segurança e Proteção da Conta</h2>
                    <p>
                        A segurança da sua conta é fundamental. As senhas são armazenadas utilizando criptografia de ponta e nunca são visíveis para nossa equipe. Implementamos medidas técnicas e administrativas robustas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Além disso, monitoramos constantemente a plataforma em busca de atividades suspeitas para prevenir fraudes e proteger a comunidade. Recomendamos que você utilize senhas fortes e únicas, e nunca compartilhe suas credenciais de acesso com ninguém, nem mesmo com supostos representantes do suporte técnico.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-brand-400 mb-4">Uso de Cookies e Dados de Navegação</h2>
                    <p>
                        Utilizamos cookies e tecnologias similares de forma responsável para melhorar o desempenho do site e entender como você interage com nossos serviços. Esses pequenos arquivos de texto permitem, por exemplo, manter sua sessão ativa para que você não precise fazer login repetidamente, lembrar suas preferências de idioma e analisar o tráfego para otimizar a velocidade e a estabilidade da plataforma. Você tem o controle sobre o uso de cookies através das configurações do seu navegador, mas lembramos que a desativação de certos cookies pode afetar a funcionalidade de recursos essenciais do Drop Shop.
                    </p>
                </section>
            </div>
        </div>
      </div>
    </div>
  );
};