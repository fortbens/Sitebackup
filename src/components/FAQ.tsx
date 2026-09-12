import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export const FAQ: React.FC = () => {
  const { config } = useSiteConfig();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const cleanPhone = (config.contact.whatsappNumber || '5511999999999').replace(/\D/g, '');
  const items = config.faq && config.faq.length > 0 ? config.faq : [];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200" style={{ color: config.colors.primaryNavy }}>
            <HelpCircle className="w-3.5 h-3.5" style={{ color: config.colors.accentYellow }} />
            <span>Transparência Total</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Perguntas Frequentes sobre Regularização
          </h2>

          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Tire suas dúvidas técnicas com clareza e sem juridiquês desnecessário.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.id || index}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50 hover:bg-slate-50"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {item.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                  style={isOpen ? { backgroundColor: config.colors.primaryNavy, color: config.colors.accentYellow } : {}}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-4 bg-white animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Support Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-xl text-slate-950 shrink-0"
              style={{ backgroundColor: config.colors.accentYellow }}
            >
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Tem uma dúvida específica sobre seu imóvel?</div>
              <div className="text-xs text-slate-600">Nossa equipe técnica atende diretamente pelo WhatsApp em horário comercial.</div>
            </div>
          </div>

          <a
            href={`https://wa.me/${cleanPhone}?text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida%20espec%C3%ADfica%20sobre%20a%20regulariza%C3%A7%C3%A3o%20do%20meu%20im%C3%B3vel.`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-colors"
            style={{ backgroundColor: config.colors.primaryNavy }}
          >
            Tirar Dúvida no WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
};
