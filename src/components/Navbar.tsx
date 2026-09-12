import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { 
  PhoneCall, 
  Menu, 
  X, 
  ShieldCheck, 
  MapPin, 
  ChevronRight,
  FileCheck,
  Video,
  Settings
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface NavbarProps {
  onOpenDiagnostic: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDiagnostic, onOpenAdmin }) => {
  const { config } = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Diagnóstico', href: '#diagnostico' },
    { label: 'Por Que Regularizar', href: '#por-que-regularizar' },
    { label: 'Soluções Integradas', href: '#solucoes' },
    ...(config.video.enabled ? [{ label: 'Vídeo', href: '#video-institucional' }] : []),
    { label: 'Casos Atendidos', href: '#casos' },
    { label: 'Simulador', href: '#simulador' },
    { label: 'Região CIMBAJU', href: '#regiao' },
    ...(config.teamSection?.enabled !== false ? [{ label: 'Especialistas', href: '#equipe' }] : []),
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cleanPhone = (config.contact.whatsappNumber || '5511999999999').replace(/\D/g, '');

  return (
    <>
      {/* Top Announcement Bar */}
      <div 
        className="text-slate-200 text-xs py-2 px-4 border-b border-slate-800"
        style={{ backgroundColor: config.colors.primaryDark || '#0C1033' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center">
            <span 
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-950"
              style={{ backgroundColor: config.colors.accentYellow }}
            >
              {config.topBar.badgeText || 'FOCO REGIONAL'}
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {config.topBar.announcementText}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Engenharia + Jurídico + Cartório
            </span>
            <a 
              href={`https://wa.me/${cleanPhone}?text=Ol%C3%A1%2C%20gostaria%20de%20um%20diagn%C3%B3stico%20para%20regulariza%C3%A7%C3%A3o%20do%20meu%20im%C3%B3vel`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              {config.topBar.plantaoText || 'Plantão Técnico WhatsApp'}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <Logo size="md" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors relative py-1 hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-amber-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {onOpenAdmin && (
              <a
                href="/painel"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenAdmin();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Acessar Painel"
              >
                <Settings className="w-3.5 h-3.5 text-amber-600" />
                <span>Painel</span>
              </a>
            )}

            <a
              href={`https://wa.me/${cleanPhone}?text=Ol%C3%A1%2C%20visitei%20o%20site%20da%20Brasil%20Legal%20e%20gostaria%20de%20orienta%C3%A7%C3%A3o%20para%20o%20meu%20im%C3%B3vel.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>{config.contact.whatsappDisplay || 'WhatsApp'}</span>
            </a>

            <button
              onClick={onOpenDiagnostic}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-white shadow-sm hover:shadow transition-all"
              style={{
                backgroundColor: config.colors.primaryNavy,
              }}
            >
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>Diagnóstico Rápido</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {onOpenAdmin && (
              <a
                href="/painel"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenAdmin();
                }}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
                title="Painel"
              >
                <Settings className="w-5 h-5 text-amber-600" />
              </a>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-2 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDiagnostic();
                }}
                className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow"
                style={{ backgroundColor: config.colors.primaryNavy }}
              >
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>Iniciar Diagnóstico do Imóvel</span>
              </button>

              <a
                href={`https://wa.me/${cleanPhone}?text=Ol%C3%A1%2C%20gostaria%20de%20orienta%C3%A7%C3%A3o%20para%20regularizar%20meu%20im%C3%B3vel.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Conversar no WhatsApp</span>
              </a>

              {onOpenAdmin && (
                <a
                  href="/painel"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-600" />
                  <span>Painel</span>
                </a>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
