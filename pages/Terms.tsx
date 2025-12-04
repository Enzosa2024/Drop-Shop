import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const Terms: React.FC = () => {
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
                Termos de Uso
            </h1>

            <div className="space-y-8 leading-relaxed text-slate-300">
                <section>
                    <h2 className="text-xl font-bold text-brand-400 mb-4">Uso da Plataforma</h2>
                    <p>
                        Bem-vindo ao Drop Shop. Ao acessar ou utilizar nossa plataforma, você concorda expressamente com estes termos. O Drop Shop é um ambiente digital que conecta vendedores e compradores, oferecendo ferramentas para dropshipping e comércio eletrônico. O uso da plataforma implica na aceitação total e irrestrita de todas as condições aqui estabelecidas. A navegação e a utilização das ferramentas disponibilizadas pressupõem a leitura atenta e o entendimento completo das responsabilidades que cada usuário assume ao criar uma conta. Nosso objetivo é fornecer um ecossistema seguro e eficiente, e para isso, contamos com a colaboração de todos os membros da comunidade para manter um padrão de qualidade e respeito.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-brand-400 mb-4">Condutas Proibidas</h2>
                    <p>
                        Para garantir a segurança e a integridade de nossa comunidade, é estritamente proibido o uso da plataforma para fins ilícitos, fraudulentos ou que violem direitos de terceiros. Isso inclui, mas não se limita a: publicação de produtos falsificados, enganosos ou proibidos pela legislação vigente; tentativas de golpe, phishing ou engenharia social para obter dados de outros usuários; uso de linguagem ofensiva, discriminatória ou que incite o ódio em chats, descrições de produtos ou perfis; e qualquer tentativa de manipular o sistema de pagamentos ou taxas do site. A violação destas regras resultará no bloqueio imediato e permanente da conta, sem prejuízo das medidas legais cabíveis para reparação de danos e responsabilização civil e criminal.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-brand-400 mb-4">Responsabilidades do Usuário</h2>
                    <p>
                        Cada usuário é o único e exclusivo responsável pelo conteúdo que cria, publica e compartilha no Drop Shop. Vendedores devem garantir que possuem os produtos anunciados (ou o direito de vendê-los via dropshipping), que as descrições são precisas e que as imagens correspondem à realidade do item. Compradores, por sua vez, comprometem-se a realizar pagamentos de forma honesta e a comunicar-se com respeito. A plataforma fornece a infraestrutura tecnológica, mas a veracidade das informações e o cumprimento das obrigações comerciais entre as partes são de responsabilidade dos usuários. É dever do usuário manter seus dados de acesso seguros e não compartilhá-los com terceiros.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-brand-400 mb-4">Isenções de Responsabilidade</h2>
                    <p>
                        O Drop Shop atua como um intermediário tecnológico e não é proprietário dos produtos anunciados pelos usuários, não detém a posse dos itens e não realiza as ofertas de venda. Embora utilizemos sistemas de segurança avançados e verificação de pagamentos, não nos responsabilizamos por vícios ocultos nos produtos, falhas na entrega por parte de transportadoras terceirizadas ou arrependimentos de compra que não sigam o fluxo padrão de devolução acordado entre as partes. A plataforma não garante que o serviço será ininterrupto ou livre de erros técnicos, embora trabalhemos incessantemente para mitigar tais ocorrências e oferecer a melhor experiência possível.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-brand-400 mb-4">Alterações nos Termos</h2>
                    <p>
                        Reservamo-nos o direito de modificar, alterar ou atualizar estes Termos de Uso a qualquer momento, visando a melhoria dos serviços ou a adequação a novas legislações. Alterações significativas serão comunicadas através da plataforma ou por e-mail, mas é responsabilidade do usuário revisar periodicamente esta página. A continuidade do uso do Drop Shop após a publicação de alterações constitui aceitação tácita dos novos termos. Se você não concordar com qualquer parte das condições revisadas, deve interromper imediatamente o uso da plataforma e solicitar o encerramento de sua conta através dos canais apropriados.
                    </p>
                </section>
            </div>
        </div>
      </div>
    </div>
  );
};