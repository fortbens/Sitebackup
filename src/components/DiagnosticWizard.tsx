import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  Home, 
  Layers, 
  Store, 
  TreePine, 
  HelpCircle, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Sparkles, 
  ShieldCheck, 
  FileCheck2, 
  Send, 
  Clock,
  FileSpreadsheet
} from 'lucide-react';
import { 
  PropertyType, 
  IrregularityType, 
  RegionalLocation, 
  UrgencyReason, 
  DiagnosticFormData,
  StoredLead
} from '../types';

interface DiagnosticWizardProps {
  id?: string;
  onLeadCaptured?: (lead: StoredLead) => void;
}

export const DiagnosticWizard: React.FC<DiagnosticWizardProps> = ({ id = 'diagnostico', onLeadCaptured }) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedLead, setCompletedLead] = useState<StoredLead | null>(null);

  const [formData, setFormData] = useState<DiagnosticFormData>({
    propertyType: 'casa',
    irregularities: ['construcao_nao_averbada'],
    location: 'caieiras',
    urgency: 'valorizacao_patrimonial',
    estimatedValue: 600000,
    hasPlanta: null,
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const propertyTypes: { id: PropertyType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'casa', label: 'Casa Térrea', icon: <Home className="w-5 h-5" />, desc: 'Residencial térreo ou ampliado' },
    { id: 'sobrado', label: 'Sobrado / 2+ Pavimentos', icon: <Building2 className="w-5 h-5" />, desc: 'Edificação com mais de um nível' },
    { id: 'terreno', label: 'Terreno / Lote', icon: <Layers className="w-5 h-5" />, desc: 'Lote sem construção ou em loteadora' },
    { id: 'comercial', label: 'Comercial / Galpão', icon: <Store className="w-5 h-5" />, desc: 'Salas, lojas, galpões e comércios' },
    { id: 'chacara', label: 'Chácara / Sítio', icon: <TreePine className="w-5 h-5" />, desc: 'Imóvel em área rural ou de expansão' },
    { id: 'outro', label: 'Outro tipo', icon: <HelpCircle className="w-5 h-5" />, desc: 'Apartamento, herança mista, etc.' },
  ];

  const irregularityOptions: { id: IrregularityType; label: string; desc: string }[] = [
    { id: 'construcao_nao_averbada', label: 'Construção ou ampliação não averbada', desc: 'Aumentou a casa, fez edícula, garagem ou piscina sem constar na matrícula' },
    { id: 'sem_habite_se', label: 'Falta Habite-se da Prefeitura', desc: 'Obra concluída ou antiga sem certidão de conclusão municipal' },
    { id: 'terreno_loteadora', label: 'Terreno em nome de Loteadora / Contrato de gaveta', desc: 'Possui apenas compromisso de compra e venda sem escritura definitiva' },
    { id: 'inss_sero_pendente', label: 'Pendência de INSS de Obra (SERO) / CND', desc: 'Dúvidas sobre cálculo de INSS, decadência tributária e CIB' },
    { id: 'venda_financiamento_travado', label: 'Venda travada por falta de financiamento', desc: 'Comprador precisa financiar pela Caixa/banco mas o imóvel não passa na engenharia' },
    { id: 'inventario_sucessao', label: 'Problemas de inventário ou partilha familiar', desc: 'Imóvel em nome de falecido com herdeiros e documentação pendente' },
    { id: 'imovel_antigo_sem_escritura', label: 'Imóvel muito antigo com posse mansa', desc: 'Necessidade de usucapião extrajudicial ou retificação de área no cartório' },
    { id: 'duvidas_cib', label: 'Inscrição ou divergência no CIB / IPTU', desc: 'Divergência entre metragem no carnê de IPTU e no Cartório' },
    { id: 'outra', label: 'Outra situação ou não sei exatamente', desc: 'Preciso de um raio-x completo para saber por onde começar' },
  ];

  const locations: { id: RegionalLocation; label: string; highlight?: boolean }[] = [
    { id: 'caieiras', label: 'Caieiras (CIMBAJU)', highlight: true },
    { id: 'franco_da_rocha', label: 'Franco da Rocha (CIMBAJU)', highlight: true },
    { id: 'francisco_morato', label: 'Francisco Morato (CIMBAJU)', highlight: true },
    { id: 'mairipora', label: 'Mairiporã (CIMBAJU)', highlight: true },
    { id: 'cajamar', label: 'Cajamar (CIMBAJU)', highlight: true },
    { id: 'sao_paulo_capital', label: 'São Paulo (Capital)' },
    { id: 'grande_sp', label: 'Grande São Paulo (outras cidades)' },
    { id: 'interior_sp', label: 'Interior do Estado de SP' },
    { id: 'outro_estado', label: 'Outro Estado do Brasil' },
  ];

  const urgencies: { id: UrgencyReason; label: string; badge: string }[] = [
    { id: 'venda_urgente', label: 'Quero vender o imóvel nos próximos meses', badge: 'Alta Liquidez' },
    { id: 'aprovacao_financiamento', label: 'Tenho comprador aguardando aprovação de financiamento', badge: 'Urgente' },
    { id: 'notificacao_prefeitura', label: 'Recebi notificação da Prefeitura ou Receita Federal', badge: 'Prazo Legal' },
    { id: 'planejamento_herdeiros', label: 'Planejamento familiar, doação ou inventário seguro', badge: 'Segurança Familiar' },
    { id: 'valorizacao_patrimonial', label: 'Quero regularizar para valorizar e proteger meu patrimônio', badge: 'Planejamento' },
  ];

  const toggleIrregularity = (irrId: IrregularityType) => {
    setFormData((prev) => {
      const exists = prev.irregularities.includes(irrId);
      if (exists) {
        if (prev.irregularities.length === 1) return prev; // keep at least 1
        return { ...prev, irregularities: prev.irregularities.filter((item) => item !== irrId) };
      } else {
        return { ...prev, irregularities: [...prev.irregularities, irrId] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Por favor, informe seu nome e telefone/WhatsApp para receber o diagnóstico.');
      return;
    }

    setIsSubmitting(true);

    const newLead: StoredLead = {
      ...formData,
      id: 'lead_' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'novo',
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('brasil_legal_leads') || '[]');
      existing.unshift(newLead);
      localStorage.setItem('brasil_legal_leads', JSON.stringify(existing));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setCompletedLead(newLead);
      onLeadCaptured?.(newLead);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F8C908', '#161C4D', '#10B981'],
        });
      } catch {
        // ignore
      }
    }, 600);
  };

  // Generate customized technical recommendation based on the user's inputs
  const getTechnicalRoadmap = (lead: DiagnosticFormData) => {
    const steps: { title: string; desc: string; pillar: string }[] = [];

    // Step 1: Technical survey & engineering
    if (lead.irregularities.includes('construcao_nao_averbada') || lead.irregularities.includes('sem_habite_se')) {
      steps.push({
        pillar: 'Engenharia Civil',
        title: 'Levantamento Físico & Projeto "As-Built"',
        desc: 'Medição precisa da área construída, laudo de estabilidade estrutural e elaboração de planta legal para aprovação na prefeitura.',
      });
      steps.push({
        pillar: 'Prefeitura Municipal',
        title: 'Expedição do Habite-se / Certidão de Conclusão',
        desc: 'Protocolo e acompanhamento técnico para obtenção do alvará de habite-se junto à legislação de zoneamento.',
      });
    }

    // Step 2: Fiscal & Revenue
    if (lead.irregularities.includes('inss_sero_pendente') || lead.irregularities.includes('construcao_nao_averbada')) {
      steps.push({
        pillar: 'Inteligência Fiscal',
        title: 'Aferição no SERO & Emissão de CND de Obra',
        desc: 'Inscrição no CIB, cálculo da aferição com tese de decadência dos 5 anos (reduzindo custos tributários desnecessários de INSS).',
      });
    }

    // Step 3: Legal & Cartorial
    if (lead.irregularities.includes('terreno_loteadora') || lead.irregularities.includes('imovel_antigo_sem_escritura')) {
      steps.push({
        pillar: 'Direito Notarial & Registral',
        title: 'Adjudicação Compulsória ou Usucapião Extrajudicial',
        desc: 'Suprimento da escritura definitiva diretamente em cartório de notas e registro de imóveis, sem judicialização morosa.',
      });
    }

    if (lead.irregularities.includes('inventario_sucessao')) {
      steps.push({
        pillar: 'Direito das Sucessões',
        title: 'Saneamento Registral & Partilha Extrajudicial',
        desc: 'Alinhamento da cadeia dominial com inventário em cartório para outorga direta aos herdeiros.',
      });
    }

    // Final Cartorial Step
    steps.push({
      pillar: 'Cartório de Registro de Imóveis (RGI)',
      title: 'Averbação na Matrícula & Liberação para Financiamento',
      desc: 'Registro formal da construção na matrícula original do imóvel. Imóvel 100% financiável pela Caixa e bancos privados.',
    });

    return steps;
  };

  const generateWhatsAppMessage = (lead: StoredLead) => {
    const locMap: Record<RegionalLocation, string> = {
      caieiras: 'Caieiras (CIMBAJU)',
      franco_da_rocha: 'Franco da Rocha (CIMBAJU)',
      francisco_morato: 'Francisco Morato (CIMBAJU)',
      mairipora: 'Mairiporã (CIMBAJU)',
      cajamar: 'Cajamar (CIMBAJU)',
      sao_paulo_capital: 'São Paulo (Capital)',
      grande_sp: 'Grande São Paulo',
      interior_sp: 'Interior de SP',
      outro_estado: 'Outro Estado',
    };

    const text = `*Olá, Brasil Legal! Acabei de gerar meu diagnóstico preliminar no site.*%0A%0A` +
      `👤 *Nome:* ${encodeURIComponent(lead.name)}%0A` +
      `📱 *Telefone:* ${encodeURIComponent(lead.phone)}%0A` +
      `📍 *Local do Imóvel:* ${encodeURIComponent(locMap[lead.location] || lead.location)}%0A` +
      `🏠 *Tipo:* ${encodeURIComponent(lead.propertyType)}%0A` +
      `⚠️ *Pendências Selecionadas:* ${encodeURIComponent(lead.irregularities.length + ' item(ns)')}%0A` +
      `💰 *Valor Estimado:* R$ ${lead.estimatedValue.toLocaleString('pt-BR')}%0A%0A` +
      `Gostaria de agendar uma análise técnica detalhada com a equipe integrada.`;

    return `https://wa.me/5511999999999?text=${text}`;
  };

  return (
    <section id={id} className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-950 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Ferramenta Interativa PropTech</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Diagnóstico Preliminar do Imóvel
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Descubra em menos de 2 minutos os passos técnicos exatos para legalizar sua propriedade e destravar seu valor de mercado.
          </p>
        </div>

        {/* Wizard Box */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl shadow-lg p-5 sm:p-8 relative overflow-hidden">
          
          {/* If finished: Show customized technical roadmap */}
          {completedLead ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center pb-4 border-b border-slate-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
                  Diagnóstico Preliminar Gerado com Sucesso!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Obrigado, <strong className="text-slate-900">{completedLead.name}</strong>. Nossa equipe técnica recebeu suas informações.
                </p>
              </div>

              {/* Summary Pill Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Tipo de Imóvel</div>
                  <div className="font-semibold text-slate-800 capitalize mt-0.5">{completedLead.propertyType}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Localidade</div>
                  <div className="font-semibold text-slate-800 capitalize mt-0.5">{completedLead.location}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Patrimônio Base</div>
                  <div className="font-semibold text-slate-800 mt-0.5">R$ {completedLead.estimatedValue.toLocaleString('pt-BR')}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Previsão Legal</div>
                  <div className="font-semibold text-emerald-600 mt-0.5">Viabilidade Alta</div>
                </div>
              </div>

              {/* Dynamic Technical Steps Roadmap */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-[#161C4D]" />
                    <span>Trilha Técnica Recomendada para Regularização:</span>
                  </h4>
                  <span className="text-[11px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                    Sem Judicialização Desnecessária
                  </span>
                </div>

                <div className="space-y-2.5">
                  {getTechnicalRoadmap(completedLead).map((st, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                      <div className="w-6 h-6 rounded-full bg-[#161C4D] text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{st.title}</span>
                          <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                            {st.pillar}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to actions for closing the lead */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href={generateWhatsAppMessage(completedLead)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                >
                  <Send className="w-4 h-4" />
                  <span>Validar Diagnóstico no WhatsApp com Especialista</span>
                </a>

                <button
                  onClick={() => {
                    setCompletedLead(null);
                    setStep(1);
                  }}
                  className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors"
                >
                  Fazer Novo Diagnóstico
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Nosso tempo médio de resposta inicial via WhatsApp é de menos de 15 minutos em horário comercial.</span>
              </div>
            </div>
          ) : (
            /* Multi-step Form */
            <div>
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>Passo {step} de 4</span>
                  <span>
                    {step === 1 && 'Tipo de Imóvel'}
                    {step === 2 && 'Situação & Pendências'}
                    {step === 3 && 'Localização & Urgência'}
                    {step === 4 && 'Receber Raio-X Técnico'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#161C4D] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* STEP 1: Property Type */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Qual é o tipo do imóvel a ser regularizado?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Selecione a categoria que melhor representa a sua propriedade.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {propertyTypes.map((pt) => (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, propertyType: pt.id })}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                          formData.propertyType === pt.id
                            ? 'bg-white border-[#161C4D] ring-2 ring-[#161C4D]/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-lg ${
                            formData.propertyType === pt.id ? 'bg-[#161C4D] text-amber-400' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {pt.icon}
                          </div>
                          {formData.propertyType === pt.id && (
                            <span className="w-5 h-5 rounded-full bg-[#161C4D] text-white flex items-center justify-center text-[10px]">
                              <Check className="w-3.5 h-3.5 text-amber-400" />
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{pt.label}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{pt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-[#161C4D] hover:bg-[#252E75] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                      <span>Avançar para Situação</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Irregularities */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Quais são as principais pendências ou dúvidas do seu imóvel?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Você pode selecionar mais de uma opção.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {irregularityOptions.map((opt) => {
                      const selected = formData.irregularities.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleIrregularity(opt.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            selected
                              ? 'bg-white border-[#161C4D] ring-2 ring-[#161C4D]/15 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                            selected ? 'bg-[#161C4D] border-[#161C4D] text-amber-400' : 'border-slate-300 bg-white'
                          }`}>
                            {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900">{opt.label}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-[#161C4D] hover:bg-[#252E75] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                      <span>Avançar para Localização</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Location & Urgency */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Onde fica o imóvel e qual o seu objetivo principal?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Isso ajuda a identificar a legislação do Plano Diretor e cartório competente.
                    </p>
                  </div>

                  {/* Location Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>Cidade / Região do Imóvel:</span>
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value as RegionalLocation })}
                      className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#161C4D]"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.highlight ? `⭐ ${loc.label}` : loc.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Urgency Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Principal Motivação ou Prazo:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {urgencies.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, urgency: u.id })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            formData.urgency === u.id
                              ? 'bg-white border-[#161C4D] ring-2 ring-[#161C4D]/15'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-900">{u.label}</div>
                          <span className="inline-block mt-1 text-[10px] font-semibold text-[#161C4D] bg-slate-100 px-2 py-0.5 rounded">
                            {u.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Value Slider */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">Valor Estimado do Imóvel:</span>
                      <span className="font-bold text-[#161C4D] text-sm">
                        R$ {formData.estimatedValue.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={100000}
                      max={3000000}
                      step={50000}
                      value={formData.estimatedValue}
                      onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>R$ 100 mil</span>
                      <span>R$ 1.5 mi</span>
                      <span>R$ 3.0 mi+</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-6 py-2.5 rounded-xl bg-[#161C4D] hover:bg-[#252E75] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                      <span>Próximo Passo</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Lead Contact Form */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Para quem devemos enviar o Parecer Técnico Preliminar?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Sem spam. Seus dados são protegidos e usados exclusivamente para a análise técnica do seu imóvel.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Seu Nome Completo: *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ex: Carlos Eduardo de Oliveira"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#161C4D]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          WhatsApp / Telefone: *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="(11) 99999-9999"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#161C4D]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          E-mail (opcional):
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="seuemail@exemplo.com.br"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#161C4D]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Detalhes adicionais (opcional):
                      </label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Ex: Fiz uma ampliação nos fundos de 40m², o imóvel já tem escritura do terreno mas falta averbar a construção."
                        className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#161C4D]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Processando Raio-X...</span>
                      ) : (
                        <>
                          <span>Gerar Raio-X Técnico Grátis</span>
                          <FileCheck2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
