import React from 'react';
import { 
  Building2, 
  Scale, 
  FileSpreadsheet, 
  CheckCircle2, 
  Layers, 
  FileCheck, 
  Compass, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface IntegratedPillarsProps {
  onStartDiagnostic: () => void;
}

export const IntegratedPillars: React.FC<IntegratedPillarsProps> = ({ onStartDiagnostic }) => {
  const pillars = [
    {
      id: 'engenharia',
      icon: <Building2 className="w-7 h-7 text-amber-500" />,
      badge: 'Pilar 01 • Técnico & Físico',
      title: 'Engenharia & Arquitetura Legal',
      subtitle: 'Da medição real à expedição do Habite-se municipal',
      description:
        'Não basta desenhar uma planta: é preciso adequar a edificação às leis municipais de uso do solo, coeficientes urbanísticos e normas de segurança.',
      features: [
        'Levantamento métrico preciso e plantas "As-Built"',
        'Laudos técnicos estruturais e de habitabilidade',
        'Emissão e recolhimento de ART / RRT técnica',
        'Desdobro, desmembramento e unificação de lotes',
        'Aprovação de projetos perante a Prefeitura Municipal',
        'Acompanhamento e expedição final do Habite-se',
      ],
      accentColor: 'border-amber-400/40 bg-amber-50/20',
      tagColor: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'juridico',
      icon: <Scale className="w-7 h-7 text-[#161C4D]" />,
      badge: 'Pilar 02 • Legal & Notarial',
      title: 'Direito Imobiliário & Cartorial',
      subtitle: 'Da posse mansa ao título legítimo de propriedade',
      description:
        'Eliminamos os nós burocráticos que impedem você de ser o dono legítimo perante o Cartório de Registro de Imóveis, priorizando vias extrajudiciais rápidas.',
      features: [
        'Adjudicação Compulsória Extrajudicial (Lei 14.382)',
        'Regularização de Contratos de Gaveta e Loteadoras',
        'Usucapião Extrajudicial direto em Cartório de Notas',
        'Retificação de área e alinhamento de divisas',
        'Saneamento documental para inventários e heranças',
        'Contratos preliminares com segurança jurídica blindada',
      ],
      accentColor: 'border-[#161C4D]/30 bg-blue-50/20',
      tagColor: 'bg-[#161C4D]/10 text-[#161C4D]',
    },
    {
      id: 'fiscal',
      icon: <FileSpreadsheet className="w-7 h-7 text-emerald-600" />,
      badge: 'Pilar 03 • Fiscal & Receita',
      title: 'Inteligência Fiscal & Registral',
      subtitle: 'Do SERO e CIB à Averbação na Matrícula (RGI)',
      description:
        'A maioria dos proprietários paga INSS de obra a mais por desconhecimento. Aplicamos regras de decadência e geramos a CND sem surpresas.',
      features: [
        'Aferição técnica de obra no SERO (Receita Federal)',
        'Análise e aplicação da decadência quinquenal de INSS',
        'Inscrição e saneamento de dados no CIB',
        'Emissão de CND de Obra da Receita Federal',
        'Atendimento a notas de devolução de cartórios',
        'Averbação definitiva na Matrícula no Cartório de Imóveis',
      ],
      accentColor: 'border-emerald-500/30 bg-emerald-50/20',
      tagColor: 'bg-emerald-100 text-emerald-900',
    },
  ];

  return (
    <section id="solucoes" className="py-16 sm:py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#161C4D] shadow-2xs mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Abordagem 360° Exclusiva</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Por que contratar separadamente <br className="hidden sm:inline" />
            se a regularização exige <span className="text-[#161C4D]">sinergia total</span>?
          </h2>

          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            O engenheiro tradicional desconhece os requisitos de qualificação registral do cartório. 
            O advogado muitas vezes não sabe aprovar uma planta técnica na prefeitura. 
            A <strong>Brasil Legal</strong> integra todas as frentes em uma só mesa técnica.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl p-6 sm:p-7 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${p.accentColor}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs">
                    {p.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${p.tagColor}`}>
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-1">
                  {p.title}
                </h3>
                
                <p className="text-xs font-semibold text-slate-500 mb-3">
                  {p.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {p.description}
                </p>

                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Entregáveis inclusos:
                  </span>
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <button
                  onClick={onStartDiagnostic}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Incluir neste Diagnóstico</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#161C4D]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Unified Workflow Callout Banner */}
        <div className="mt-12 bg-[#0C1033] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Responsabilidade Técnica Única</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold">
              Sem jogo de empurra entre profissionais.
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Você não precisa perder dias em cartórios, filas de prefeitura ou despachantes. 
              Nós gerenciamos o processo de ponta a ponta e entregamos a matrícula atualizada.
            </p>
          </div>

          <button
            onClick={onStartDiagnostic}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md transform hover:-translate-y-0.5 cursor-pointer"
          >
            Fazer Diagnóstico Integrado
          </button>
        </div>

      </div>
    </section>
  );
};
