import React, { useState } from 'react';
import { 
  Building, 
  FileWarning, 
  KeyRound, 
  Receipt, 
  HelpCircle, 
  Users, 
  FileText, 
  Warehouse, 
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface UseCasesProps {
  onSelectCase: (caseId: string) => void;
}

export const UseCasesGrid: React.FC<UseCasesProps> = ({ onSelectCase }) => {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'obras' | 'juridico' | 'vendas'>('todos');

  const cases = [
    {
      id: 'construcao_nao_averbada',
      category: 'obras',
      title: 'Construção ou Ampliação Não Averbada',
      description: 'Você ampliou a casa, construiu um sobrado nos fundos, garagem ou piscina, mas na matrícula do cartório consta apenas o terreno nu ou metragem antiga.',
      solution: 'Elaboração de projeto As-Built, laudo técnico, aprovação na prefeitura, Habite-se e averbação no RGI.',
      badge: 'Mais Comum',
      tagColor: 'bg-amber-100 text-amber-900',
      icon: <Building className="w-5 h-5 text-amber-500" />
    },
    {
      id: 'sem_habite_se',
      category: 'obras',
      title: 'Obra Concluída Sem Habite-se',
      description: 'O imóvel está pronto e habitado há anos, mas a prefeitura nunca expediu a certidão de conclusão (Habite-se) ou o processo antigo foi arquivado.',
      solution: 'Revalidação perante a lei de zoneamento ou anistia municipal, inspeção técnica e expedição do Habite-se definitivo.',
      badge: 'Risco de Multa',
      tagColor: 'bg-rose-100 text-rose-800',
      icon: <FileWarning className="w-5 h-5 text-rose-500" />
    },
    {
      id: 'terreno_loteadora',
      category: 'juridico',
      title: 'Terreno em Nome de Loteadora / Contrato de Gaveta',
      description: 'Comprou o lote parcelado, quitou todas as parcelas, mas a loteadora sumiu, faliu ou se recusa a outorgar a escritura pública definitiva.',
      solution: 'Adjudicação Compulsória Extrajudicial diretamente pelo Cartório de Registro de Imóveis (Lei 14.382/2022).',
      badge: 'Solução em Cartório',
      tagColor: 'bg-blue-100 text-blue-900',
      icon: <FileText className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'inss_sero_pendente',
      category: 'obras',
      title: 'INSS de Obra, SERO e Dúvidas sobre CIB',
      description: 'A Receita Federal está cobrando valores exorbitantes de INSS sobre a construção ou você não sabe como emitir a CND de obra para levar ao cartório.',
      solution: 'Aferição tributária pelo SERO com aplicação legal de decadência (obras com mais de 5 anos), reduzindo o tributo.',
      badge: 'Economia Tributária',
      tagColor: 'bg-emerald-100 text-emerald-900',
      icon: <Receipt className="w-5 h-5 text-emerald-600" />
    },
    {
      id: 'venda_financiamento_travado',
      category: 'vendas',
      title: 'Venda Travada por Financiamento da Caixa / Bancos',
      description: 'Você achou um comprador pronto para comprar, mas o banco reprovou o laudo de engenharia porque a construção não confere com a matrícula.',
      solution: 'Saneamento prioritário em prefeitura e cartório para liberar a liberação do crédito imobiliário do comprador.',
      badge: 'Urgência Comercial',
      tagColor: 'bg-amber-100 text-amber-900',
      icon: <KeyRound className="w-5 h-5 text-amber-600" />
    },
    {
      id: 'inventario_sucessao',
      category: 'juridico',
      title: 'Imóvel com Problemas Sucessórios e Herança',
      description: 'O proprietário original faleceu, o imóvel ficou sem inventário ou com partilha pendente, impossibilitando a venda regular pelos herdeiros.',
      solution: 'Diagnóstico da cadeia sucessória, retificação prévia da matrícula e inventário extrajudicial em cartório de notas.',
      badge: 'Paz Familiar',
      tagColor: 'bg-purple-100 text-purple-900',
      icon: <Users className="w-5 h-5 text-purple-600" />
    },
    {
      id: 'imovel_antigo_sem_escritura',
      category: 'juridico',
      title: 'Imóvel Muito Antigo Sem Escritura Registrada',
      description: 'Família reside no local há décadas com recibos ou contratos antigos, sem nunca ter obtido a matrícula individualizada no cartório de imóveis.',
      solution: 'Procedimento de Usucapião Extrajudicial ou Regularização Fundiária (Reurb) com levantamento topográfico.',
      badge: 'Segurança Jurídica',
      tagColor: 'bg-slate-100 text-slate-800',
      icon: <HelpCircle className="w-5 h-5 text-slate-600" />
    },
    {
      id: 'comercial_galpao',
      category: 'obras',
      title: 'Galpões, Prédios Comerciais e Adequação de Uso',
      description: 'Imóveis comerciais que precisam de alteração de uso (residencial para comercial), adequação às exigências de acessibilidade e AVCB dos Bombeiros.',
      solution: 'Engenharia completa com projetos complementares, aprovação de uso e emissão de alvará de funcionamento.',
      badge: 'Comercial & Indústria',
      tagColor: 'bg-indigo-100 text-indigo-900',
      icon: <Warehouse className="w-5 h-5 text-indigo-600" />
    },
  ];

  const filtered = cases.filter(c => {
    if (activeFilter === 'todos') return true;
    return c.category === activeFilter;
  });

  return (
    <section id="casos" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#161C4D] text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200">
            <span>Especialidades Práticas</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Qual é a situação documental <br className="hidden sm:inline" />
            do seu imóvel hoje?
          </h2>

          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Seja uma simples ampliação sem averbação ou uma cadeia sucessória complexa, nossa equipe técnica possui a rota validada para resolver.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveFilter('todos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'todos'
                  ? 'bg-[#161C4D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos os Casos ({cases.length})
            </button>

            <button
              onClick={() => setActiveFilter('obras')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'obras'
                  ? 'bg-[#161C4D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Obras, Habite-se & INSS
            </button>

            <button
              onClick={() => setActiveFilter('juridico')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'juridico'
                  ? 'bg-[#161C4D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Loteadoras, Cartório & Herança
            </button>

            <button
              onClick={() => setActiveFilter('vendas')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'vendas'
                  ? 'bg-[#161C4D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Vendas & Financiamentos
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-[#161C4D]/40 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.tagColor}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="p-3 rounded-xl bg-white border border-slate-100 text-xs text-slate-700 space-y-1 mb-4">
                  <div className="font-bold text-[10px] uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Como a Brasil Legal resolve:</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    {item.solution}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectCase(item.id)}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#161C4D] text-slate-700 hover:text-white border border-slate-200 hover:border-[#161C4D] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Quero regularizar este caso</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
