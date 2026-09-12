import React from 'react';
import { 
  Search, 
  FileText, 
  Wrench, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface StepProcessProps {
  onStartDiagnostic: () => void;
}

export const StepByStepProcess: React.FC<StepProcessProps> = ({ onStartDiagnostic }) => {
  const steps = [
    {
      number: '01',
      title: 'Diagnóstico & Raio-X 360°',
      subtitle: 'Entendimento completo das pendências',
      description: 'Analisamos a certidão de matrícula do cartório, carnê de IPTU, histórico perante a prefeitura e eventuais pendências com a Receita Federal.',
      icon: <Search className="w-6 h-6 text-amber-500" />,
      time: 'Em até 48h úteis'
    },
    {
      number: '02',
      title: 'Plano Estratégico & Custos Claros',
      subtitle: 'Sem surpresas financeiras',
      description: 'Apresentamos o mapa exato da regularização com cronograma estimado, taxas públicas previstas e honorários fixados em contrato transparente.',
      icon: <FileText className="w-6 h-6 text-[#161C4D]" />,
      time: 'Apresentação detalhada'
    },
    {
      number: '03',
      title: 'Execução Técnica Integrada',
      subtitle: 'Engenharia + Jurídico em sincronia',
      description: 'Nossa equipe elabora projetos As-Built, protocola aprovações na prefeitura, cuida do SERO/INSS e conduz o procedimento cartorial diretamente.',
      icon: <Wrench className="w-6 h-6 text-emerald-600" />,
      time: 'Acompanhamento contínuo'
    },
    {
      number: '04',
      title: 'Matrícula com Habite-se na Mão',
      subtitle: 'Patrimônio 100% desembaraçado',
      description: 'Você recebe a certidão de matrícula atualizada com a construção averbada. Imóvel pronto para venda à vista, financiamento bancário ou partilha.',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
      time: 'Conclusão oficial'
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[#161C4D] text-xs font-bold uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Método Sem Estresse</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Como funciona a sua jornada <br className="hidden sm:inline" />
            com a <span className="text-[#161C4D]">Brasil Legal</span>
          </h2>

          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Eliminamos a complexidade para você. Do primeiro documento à entrega da certidão do cartório de imóveis.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => (
            <div
              key={st.number}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-extrabold text-2xl text-slate-300 group-hover:text-[#161C4D] transition-colors">
                    {st.number}
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {st.icon}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {st.title}
                </h3>
                <div className="text-xs font-semibold text-amber-600 mb-2">
                  {st.subtitle}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {st.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Prazo:</span>
                <span className="font-bold text-slate-800">{st.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center">
          <button
            onClick={onStartDiagnostic}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#161C4D] hover:bg-[#252E75] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Iniciar Etapa 01: Fazer Diagnóstico Grátis</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
