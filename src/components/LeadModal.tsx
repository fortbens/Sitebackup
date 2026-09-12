import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { DiagnosticWizard } from './DiagnosticWizard';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-[#0C1033] text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">
              Diagnóstico Preliminar de Imóvel • Brasil Legal
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-2 sm:p-6 max-h-[85vh] overflow-y-auto">
          <DiagnosticWizard id="modal-diagnostico" />
        </div>

      </div>
    </div>
  );
};
