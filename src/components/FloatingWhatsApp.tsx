import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export const FloatingWhatsApp: React.FC = () => {
  const { config } = useSiteConfig();
  const [showTooltip, setShowTooltip] = useState(true);

  const cleanPhone = (config.contact.whatsappNumber || '5511999999999').replace(/\D/g, '');

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="mb-2 p-3 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 text-xs max-w-xs animate-in fade-in slide-in-from-bottom-2 relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-600 flex items-center justify-center text-[10px] cursor-pointer"
            aria-label="Fechar dica"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Plantão de Regularização Ativo</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Envie sua dúvida ou foto da matrícula para uma primeira análise sem compromisso!
          </p>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        href={`https://wa.me/${cleanPhone}?text=Ol%C3%A1!%20Visitei%20o%20site%20da%20Brasil%20Legal%20e%20gostaria%20de%20um%20diagn%C3%B3stico%20t%C3%A9cnico%20para%20o%20meu%20im%C3%B3vel.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group cursor-pointer"
        aria-label="Conversar no WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">Falar no WhatsApp</span>
      </a>
    </div>
  );
};
