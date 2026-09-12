import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  Percent,
  Banknote
} from 'lucide-react';

interface CalculatorProps {
  onApplyEstimate: (val: number) => void;
}

export const EquityCalculator: React.FC<CalculatorProps> = ({ onApplyEstimate }) => {
  const [propertyValue, setPropertyValue] = useState<number>(650000);

  // Conservative realistic calculations
  const estimatedDiscountMin = Math.round(propertyValue * 0.20);
  const estimatedDiscountMax = Math.round(propertyValue * 0.35);
  const averageDiscount = Math.round((estimatedDiscountMin + estimatedDiscountMax) / 2);
  const netIrregularValue = propertyValue - averageDiscount;

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="simulador" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-100/70 border-t border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-950 text-xs font-bold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulador de Liquidez Patrimonial</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Quanto o seu patrimônio ganha em segurança e <br className="hidden sm:inline" />
            <span className="text-[#161C4D]">poder de negociação</span>?
          </h2>

          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Arraste o valor estimado do seu imóvel para entender o impacto direto da falta de documentação na hora de vender ou avaliar o patrimônio da sua família.
          </p>
        </div>

        {/* Interactive Calculator Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Slider Control Block */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
                  Valor Estimado de Avaliação do Imóvel:
                </label>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-[#161C4D]">
                  {formatBRL(propertyValue)}
                </div>
              </div>

              <input
                type="range"
                min={200000}
                max={3000000}
                step={25000}
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />

              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>R$ 200 mil</span>
                <span>R$ 1.5 milhão</span>
                <span>R$ 3.0 milhões+</span>
              </div>
            </div>

            {/* Visual Results Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              
              {/* Box 1: Preço com Deságio de Imóvel Irregular */}
              <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1">
                    Venda com Documentação Pendente
                  </div>
                  <div className="text-xl sm:text-2xl font-display font-bold text-rose-900">
                    {formatBRL(netIrregularValue)}
                  </div>
                  <p className="text-xs text-rose-700 mt-2 leading-relaxed">
                    Compradores à vista impõem desconto médio de <strong>{formatBRL(averageDiscount)}</strong> sob alegação do risco e custos que assumirão.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-rose-200/60 text-[11px] text-rose-800 font-medium">
                  ⚠️ -82% de compradores excluídos (sem financiamento)
                </div>
              </div>

              {/* Box 2: Valor Total Destravado com Brasil Legal */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                    Valor Integral de Mercado (Regularizado)
                  </div>
                  <div className="text-xl sm:text-2xl font-display font-bold text-emerald-900">
                    {formatBRL(propertyValue)}
                  </div>
                  <p className="text-xs text-emerald-700 mt-2 leading-relaxed">
                    Você mantém 100% do valor patrimonial. Imóvel aceito em qualquer banco (Caixa, Itaú, Bradesco) e consórcios.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-200/60 text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% dos compradores habilitados</span>
                </div>
              </div>

              {/* Box 3: Liquidez e Acesso a Crédito */}
              <div className="p-5 rounded-2xl bg-[#0C1033] text-white flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    Potencial de Garantia & Crédito
                  </div>
                  <div className="text-xl sm:text-2xl font-display font-bold text-white">
                    Até {formatBRL(Math.round(propertyValue * 0.60))}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Imóvel regularizado pode ser oferecido como garantia real (Home Equity) para empréstimos com as menores taxas do mercado.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700 text-[11px] text-amber-300 font-semibold">
                  🛡️ Segurança patrimonial para herdeiros
                </div>
              </div>

            </div>

            {/* CTA inside calculator */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <div className="text-xs text-slate-500 max-w-lg text-center sm:text-left">
                <strong>Critério Técnico e Responsável:</strong> Os dados acima refletem médias de mercado imobiliário brasileiro e deságios médios apurados em cartórios e perícias bancárias. Não constituem promessa de ganho fixo, mas a eliminação comprovada de entraves comerciais.
              </div>

              <button
                onClick={() => onApplyEstimate(propertyValue)}
                className="shrink-0 px-6 py-3.5 rounded-xl bg-[#161C4D] hover:bg-[#252E75] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Usar Este Valor no Diagnóstico</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
