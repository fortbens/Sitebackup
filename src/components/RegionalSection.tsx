import React from 'react';
import { MapPin, Building, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface RegionalSectionProps {
  onStartDiagnostic: () => void;
}

export const RegionalSection: React.FC<RegionalSectionProps> = ({ onStartDiagnostic }) => {
  const cities = [
    {
      name: 'Caieiras',
      tag: 'Base Operacional',
      description: 'Conhecimento aprofundado do Plano Diretor de Caieiras, Secretarias de Obras e Cartório de Registro de Imóveis competente.',
      features: ['Regularizações de ampliações e Habite-se', 'Aprovação célere de projetos As-Built', 'Regularização em condomínios e bairros tradicionais']
    },
    {
      name: 'Franco da Rocha',
      tag: 'Atendimento Prioritário',
      description: 'Tramitação direta junto à Prefeitura de Franco da Rocha e Cartório de Notas e Registro de Imóveis.',
      features: ['Lotes de loteamento e desmembramentos', 'Saneamento de áreas com posse mansa', 'Adequações fiscais e de zoneamento urbano']
    },
    {
      name: 'Francisco Morato',
      tag: 'Atendimento Prioritário',
      description: 'Diagnóstico específico para imóveis em topografias acidentadas, regularização fundiária e Habite-se municipal.',
      features: ['Laudos de estabilidade e contenção', 'Adjudicação compulsória de lotes quitados', 'Emissão de CND e averbação cartorial']
    },
    {
      name: 'Mairiporã',
      tag: 'Zonas Urbanas & Chácaras',
      description: 'Especialistas em especificidades de áreas de mananciais, preservação, chácaras residenciais e condomínios fechados.',
      features: ['Adequação a restrições ambientais legais', 'Desdobros e unificações de chácaras', 'Averbação de residências em condomínio']
    },
    {
      name: 'Cajamar',
      tag: 'Residencial & Galpões',
      description: 'Polo logístico e residencial. Soluções completas para residências, galpões e comércios no distrito de Jordanésia e Polvilho.',
      features: ['Regularização de imóveis residenciais e comerciais', 'AVCB e adequação de uso do solo', 'Certidões municipais e registrais']
    },
  ];

  return (
    <section id="regiao" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Autoridade Regional CIMBAJU</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Forte atuação nos municípios do <br className="hidden sm:inline" />
            <span className="text-[#161C4D]">Consórcio CIMBAJU & Região Metropolitana</span>
          </h2>

          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Cada prefeitura possui sua própria lei de zoneamento, código de obras e decretos de anistia. 
            Nossa equipe atua diretamente nos balcões técnicos e cartórios da região, garantindo agilidade real.
          </p>
        </div>

        {/* 5 CIMBAJU Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, idx) => (
            <div
              key={city.name}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-[#161C4D]/30 transition-all flex flex-col justify-between hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#161C4D] text-amber-400 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{city.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    {city.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {city.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  {city.features.map((f, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200/60">
                <button
                  onClick={onStartDiagnostic}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Regularizar imóvel em {city.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                </button>
              </div>
            </div>
          ))}

          {/* Plus Regional Banner */}
          <div className="p-6 rounded-2xl bg-[#0C1033] text-white flex flex-col justify-between shadow-md">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-3">
                <Building className="w-4 h-4" />
                <span>Extensão Territorial</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">São Paulo, Grande SP & Brasil</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Atendemos também a Capital Paulista, cidades vizinhas (Jundiaí, Santana de Parnaíba, Barueri, Guarulhos) e realizamos consultoria registral digital para proprietários em todo o território nacional.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700">
              <button
                onClick={onStartDiagnostic}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Consultar Minha Cidade</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
