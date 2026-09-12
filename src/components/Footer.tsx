import React from 'react';
import { Logo } from './Logo';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Building2, 
  Scale, 
  FileCheck,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface FooterProps {
  onOpenDiagnostic: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDiagnostic, onOpenAdmin }) => {
  const { config } = useSiteConfig();
  const cleanPhone = (config.contact.whatsappNumber || '5511999999999').replace(/\D/g, '');

  return (
    <footer 
      className="text-slate-300 border-t border-slate-800 pt-16 pb-12"
      style={{ backgroundColor: config.colors.primaryDark || '#0C1033' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="white" size="lg" />
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {config.footer.aboutText}
            </p>

            <div className="pt-2 text-xs font-semibold flex items-center gap-2" style={{ color: config.colors.accentYellow }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Plantão Técnico Especializado em Atendimento</span>
            </div>

            {onOpenAdmin && (
              <div className="pt-2">
                <a
                  href="/painel"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenAdmin();
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                  title="Acessar Painel"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>Painel</span>
                </a>
              </div>
            )}
          </div>

          {/* Nav Links Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navegação Rápida
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#diagnostico" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Diagnóstico Preliminar do Imóvel</span>
                </a>
              </li>
              <li>
                <a href="#por-que-regularizar" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>O Custo Real da Irregularidade</span>
                </a>
              </li>
              <li>
                <a href="#solucoes" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Os 3 Pilares Integrados</span>
                </a>
              </li>
              {config.video.enabled && (
                <li>
                  <a href="#video-institucional" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <span>Apresentação em Vídeo</span>
                  </a>
                </li>
              )}
              <li>
                <a href="#casos" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Situações e Casos Atendidos</span>
                </a>
              </li>
              <li>
                <a href="#simulador" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Simulador de Liquidez Patrimonial</span>
                </a>
              </li>
              <li>
                <a href="#regiao" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Região de Atuação CIMBAJU</span>
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Perguntas Frequentes (FAQ)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Regional CIMBAJU Presence */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: config.colors.accentYellow }} />
              <span>Região CIMBAJU</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="hover:text-white transition-colors">• Caieiras (SP)</li>
              <li className="hover:text-white transition-colors">• Franco da Rocha (SP)</li>
              <li className="hover:text-white transition-colors">• Francisco Morato (SP)</li>
              <li className="hover:text-white transition-colors">• Mairiporã (SP)</li>
              <li className="hover:text-white transition-colors">• Cajamar (SP)</li>
              <li className="hover:text-white transition-colors">• Grande SP & Capital</li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Atendimento Técnico
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${cleanPhone}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-amber-400 transition-colors"
                >
                  WhatsApp: {config.contact.whatsappDisplay || '(11) 99999-9999'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" style={{ color: config.colors.accentYellow }} />
                <a href={`mailto:${config.contact.email}`} className="hover:text-white transition-colors">
                  {config.contact.email}
                </a>
              </div>
              <div className="text-[11px] text-slate-400 pt-2 leading-relaxed">
                {config.contact.hours}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenDiagnostic}
                  className="w-full py-2.5 px-3 rounded-xl text-slate-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  style={{ backgroundColor: config.colors.accentYellow }}
                >
                  Solicitar Raio-X Preliminar
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Responsible Legal Disclaimer */}
        <div className="pt-8 pb-4 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong>Aviso Jurídico & Responsabilidade Técnica:</strong> {config.footer.disclaimerText}
          </p>
          <p>
            As estimativas de liquidez e deságio apresentadas no simulador representam parâmetros estatísticos do mercado imobiliário decorrentes da exigência de garantia limpa pelos bancos financiadores, não constituindo garantia de ganho fixo ou valorização pré-determinada.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <div>
            © {new Date().getFullYear()} {config.footer.copyrightText || `${config.brand.name} — ${config.brand.descriptor}. Todos os direitos reservados.`}
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-200 transition-colors">Termos de Uso</span>
            <span>•</span>
            <span className="hover:text-slate-200 transition-colors">Política de Privacidade & LGPD</span>
            <span>•</span>
            <span className="font-medium" style={{ color: config.colors.accentYellow }}>Segurança & Sigilo Registral</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
