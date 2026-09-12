import React from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Banknote, 
  Scale, 
  AlertOctagon, 
  CheckCircle2, 
  Landmark, 
  Users,
  ShieldAlert,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface ValueSectionProps {
  onDiagnosticClick: () => void;
}

export const ValueDestructionVsValorization: React.FC<ValueSectionProps> = ({ onDiagnosticClick }) => {
  return (
    <section id="por-que-regularizar" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle lighting overlay */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-700">
            <span>Visão Patrimonial Estratégica</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            A regularização não é burocracia: <br className="hidden sm:inline" />
            é a chave para <span className="text-amber-400">destravar a liquidez</span> do seu imóvel.
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Proprietários costumam ver a documentação como um custo chato. Na realidade, manter um imóvel irregular 
            bloqueia 80% do mercado comprador, atrai ofertas com deságio forçado e expõe sua família a riscos fiscais.
          </p>
        </div>

        {/* Dual Comparison Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Panel 1: O Custo Invisível da Irregularidade */}
          <div className="rounded-2xl p-6 sm:p-8 bg-slate-800/80 border border-rose-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/50">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Imóvel com Irregularidades</h3>
                    <p className="text-xs text-rose-300 font-medium">Restrições de mercado e vulnerabilidade</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Alto Risco
                </span>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Exclusão de Compradores com Financiamento:</strong>
                    <span className="text-slate-300 text-xs sm:text-sm">
                      Mais de 80% das compras imobiliárias no Brasil utilizam financiamento bancário (Caixa, Santander, etc.). Sem Habite-se ou averbação, nenhum banco autoriza o crédito.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Banknote className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Deságio Agressivo em Vendas Rápidas:</strong>
                    <span className="text-slate-300 text-xs sm:text-sm">
                      Compradores com dinheiro na mão exigem descontos de até 30% a 40%, alegando que assumirão as despesas e riscos de regularizar por conta própria.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Risco Fiscal e Notificações Municipais:</strong>
                    <span className="text-slate-300 text-xs sm:text-sm">
                      Divergência entre carnê de IPTU e prefeitura gera autos de infração, cobrança de alíquotas punitivas e autuações da Receita Federal sobre o INSS de obra.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Inventários Travados e Disputas Sucessórias:</strong>
                    <span className="text-slate-300 text-xs sm:text-sm">
                      A falta de matrícula atualizada impede a partilha amigável em cartório, obrigando a família a processos judiciais longos e de alto custo.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-700/60 text-xs text-rose-300/80 italic">
              * Quem não registra e averba não é considerado juridicamente proprietário pleno da edificação perante terceiros.
            </div>
          </div>

          {/* Panel 2: O Poder do Imóvel Regularizado */}
          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-slate-800 to-[#10193E] border border-emerald-500/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Imóvel com Brasil Legal</h3>
                    <p className="text-xs text-emerald-300 font-medium">Patrimônio pleno, seguro e 100% transacionável</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Segurança Total
                </span>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Landmark className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Aceito em Qualquer Banco e Consórcio:</strong>
                    <span className="text-slate-300 text-xs sm:text-sm">
                      Com Habite-se e matrícula averbada, seu imóvel passa na perícia de qualquer instituição financeira, multiplicando seus potenciais compradores.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Banknote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Valor Integral de Avaliação de Mercado:</strong>
                    <span className="text-slate-300 text-xs sm:text-sm">
                      Você negocia de igual para igual pelo valor real do metro quadrado, sem necessidade de conceder descontos forçados ou concessões inseguras.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Blindagem Fiscal & Redução de INSS Legal:</strong>
                    <span className="text-slate-300 text-xs sm:text-sm">
                      Aplicação de decadência de 5 anos no SERO e aferição técnica correta, evitando recolhimentos desnecessários e obtendo a CND da Receita Federal.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Tranquilidade Sucessória e Herança Direta:</strong>
                    <span className="text-slate-300 text-xs sm:text-sm">
                      Possibilidade de doação com reserva de usufruto ou inventário rápido em cartório de notas, resguardando o futuro dos seus herdeiros.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-700/60">
              <button
                onClick={onDiagnosticClick}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <span>Destravar Meu Imóvel com a Brasil Legal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
