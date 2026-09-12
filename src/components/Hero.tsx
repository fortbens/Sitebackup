import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Building2, 
  Scale, 
  FileText, 
  AlertTriangle,
  Lock,
  TrendingUp,
  MapPin,
  Play
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface HeroProps {
  onStartDiagnostic: () => void;
  onWatchVideo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartDiagnostic, onWatchVideo }) => {
  const { config } = useSiteConfig();
  const [activeTab, setActiveTab] = useState<'regularizado' | 'irregular'>('regularizado');

  const cleanPhone = (config.contact.whatsappNumber || '5511999999999').replace(/\D/g, '');

  const handleVideoClick = () => {
    if (onWatchVideo) {
      onWatchVideo();
    } else {
      const el = document.getElementById('video-institucional');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-slate-100/80 via-white to-slate-50 border-b border-slate-200/60">
      {/* Subtle architectural grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${config.colors.primaryNavy} 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & High-Converting Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tag / Category Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
              <span 
                className="flex h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: config.colors.accentYellow }}
              />
              <span>{config.hero.tagText}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {config.hero.headlinePre} <br className="hidden sm:inline" />
              <span 
                className="relative"
                style={{ color: config.colors.primaryNavy }}
              >
                {config.hero.headlineHighlight}
                <svg 
                  className="absolute -bottom-1.5 left-0 w-full h-2 opacity-90 -z-10" 
                  viewBox="0 0 100 12" 
                  preserveAspectRatio="none"
                  style={{ color: config.colors.accentYellow }}
                >
                  <path d="M0 8 Q 50 0 100 8" stroke="currentColor" strokeWidth="6" fill="none" />
                </svg>
              </span>{' '}
              {config.hero.headlinePost}
            </h1>

            {/* Subhead / Value Proposition */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {config.hero.subheadline}
            </p>

            {/* Three Pillar Micro-badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1 max-w-xl">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <Building2 className="w-5 h-5 shrink-0" style={{ color: config.colors.accentYellow }} />
                <div className="leading-tight">
                  <div className="text-xs font-bold text-slate-900">Engenharia</div>
                  <div className="text-[10px] text-slate-500">Projetos & Habite-se</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <Scale className="w-5 h-5 shrink-0" style={{ color: config.colors.primaryNavy }} />
                <div className="leading-tight">
                  <div className="text-xs font-bold text-slate-900">Jurídico</div>
                  <div className="text-[10px] text-slate-500">Notarial & Sucessório</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="leading-tight">
                  <div className="text-xs font-bold text-slate-900">Cartorial</div>
                  <div className="text-[10px] text-slate-500">SERO, CND & RGI</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                onClick={onStartDiagnostic}
                id="hero-cta-diagnostic"
                className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 group"
                style={{ backgroundColor: config.colors.primaryNavy }}
              >
                <span>{config.hero.ctaButtonText || 'Fazer Diagnóstico Preliminar do Imóvel'}</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={`https://wa.me/${cleanPhone}?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20a%20regulariza%C3%A7%C3%A3o%20do%20meu%20im%C3%B3vel%20com%20a%20Brasil%20Legal.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base border border-slate-300 transition-colors"
              >
                <span>{config.hero.whatsappButtonText || 'Falar via WhatsApp'}</span>
              </a>

              {config.video.enabled && (
                <button
                  onClick={handleVideoClick}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
                  title="Assistir apresentação em vídeo"
                >
                  <Play className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>Ver Vídeo</span>
                </button>
              )}
            </div>

            {/* Trust and Safety notes */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Diagnóstico inicial sem custo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-600" />
                <span>Sigilo profissional absoluto</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Especialistas na Região CIMBAJU & SP</span>
              </div>
            </div>

          </div>

          {/* Right Column: PropTech Interactive Comparison Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
              
              {/* Card Header with Interactive Toggle */}
              <div 
                className="p-4 sm:p-5 text-white"
                style={{ backgroundColor: config.colors.primaryDark }}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span 
                    className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5"
                    style={{ color: config.colors.accentYellow }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Comparador Patrimonial
                  </span>
                  <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-slate-300">
                    Impacto Real
                  </span>
                </div>

                <p className="text-sm text-slate-200 font-medium">
                  Veja a diferença de valor e segurança entre um imóvel com pendências e um regularizado:
                </p>

                {/* State selector toggle */}
                <div className="mt-4 grid grid-cols-2 p-1 bg-white/10 rounded-xl gap-1">
                  <button
                    onClick={() => setActiveTab('irregular')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'irregular'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Com Pendências</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('regularizado')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'regularizado'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>100% Regularizado</span>
                  </button>
                </div>
              </div>

              {/* Comparative Metrics Body */}
              <div className="p-5 sm:p-6 space-y-4">
                
                {/* Metric 1: Financiamento Bancário */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Financiamento Bancário (Caixa / Bancos)
                  </div>
                  {activeTab === 'irregular' ? (
                    <div className="flex items-start gap-2 text-rose-700">
                      <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                      <div>
                        <div className="text-sm font-bold">100% Recusado pelos Bancos</div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Sem habite-se ou averbação, nenhum banco financia. Você perde mais de 80% dos compradores em potencial.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-emerald-800">
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                      <div>
                        <div className="text-sm font-bold">Aprovado para Qualquer Financiamento</div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Aceito pela Caixa, Itaú, Santander, Bradesco e consórcios imobiliários. Venda rápida pelo preço justo.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Metric 2: Liquidez & Valorização */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Liquidez & Negociação
                  </div>
                  {activeTab === 'irregular' ? (
                    <div className="flex items-start gap-2 text-amber-800">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                      <div>
                        <div className="text-sm font-bold">Deságio Forçado de 20% a 40%</div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Compradores exigem abatimentos pesados pelo risco e custos que terão para legalizar depois.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-emerald-800">
                      <TrendingUp className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                      <div>
                        <div className="text-sm font-bold">Valor Integral de Mercado Destravado</div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Patrimônio protegido, liquidez imediata e possibilidade de dar o imóvel em garantia de crédito.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Metric 3: Sucessão e Herança */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Segurança Jurídica & Sucessão Familiar
                  </div>
                  {activeTab === 'irregular' ? (
                    <div className="flex items-start gap-2 text-rose-700">
                      <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                      <div>
                        <div className="text-sm font-bold">Inventários Travados e Risco de Multas</div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Herdeiros enfrentam disputas de gaveta, impostos com juros e impossibilidade de partilhar a escritura.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-emerald-800">
                      <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                      <div>
                        <div className="text-sm font-bold">Matrícula Limpa no Cartório de Imóveis</div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Transmissão hereditária ou doação transparente, sem riscos de cobranças fiscais retroativas.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card footer CTA */}
                <div className="pt-2">
                  <button
                    onClick={onStartDiagnostic}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                    style={{
                      backgroundColor: config.colors.accentYellow,
                      color: '#0F172A',
                    }}
                  >
                    <span>Avaliar Situação do Meu Imóvel Agora</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
