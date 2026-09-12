/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DiagnosticWizard } from './components/DiagnosticWizard';
import { ValueDestructionVsValorization } from './components/ValueDestructionVsValorization';
import { IntegratedPillars } from './components/IntegratedPillars';
import { TeamSection } from './components/TeamSection';
import { VideoSection } from './components/VideoSection';
import { UseCasesGrid } from './components/UseCasesGrid';
import { EquityCalculator } from './components/EquityCalculator';
import { RegionalSection } from './components/RegionalSection';
import { StepByStepProcess } from './components/StepByStepProcess';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LeadModal } from './components/LeadModal';
import { LeadManagementDrawer } from './components/LeadManagementDrawer';
import { AdminCMS } from './components/admin/AdminCMS';
import { AdminLoginScreen } from './components/admin/AdminLoginScreen';
import { StoredLead } from './types';
import { Settings, Database } from 'lucide-react';

const isPainelPath = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path === '/painel' ||
    path.startsWith('/painel/') ||
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#painel' ||
    hash.startsWith('#painel/') ||
    search.includes('painel')
  );
};

function MainAppContent() {
  const { config } = useSiteConfig();
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<'site' | 'admin'>(() => {
    return isPainelPath() ? 'admin' : 'site';
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [leadsDrawerOpen, setLeadsDrawerOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const navigateTo = (mode: 'site' | 'admin') => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      if (mode === 'admin') {
        const currentPath = window.location.pathname.toLowerCase();
        if (currentPath !== '/painel') {
          window.history.pushState({ view: 'admin' }, '', '/painel');
        }
      } else {
        const currentPath = window.location.pathname.toLowerCase();
        if (currentPath === '/painel' || currentPath === '/admin' || window.location.hash === '#painel') {
          window.history.pushState({ view: 'site' }, '', '/');
        }
      }
    }
  };

  useEffect(() => {
    const handleUrlChange = () => {
      if (isPainelPath()) {
        setViewMode('admin');
      } else {
        setViewMode('site');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    if (viewMode === 'admin') {
      document.title = `Painel de Gestão | ${config.brand.name || 'BRASIL LEGAL'}`;
    } else {
      document.title = `${config.brand.name || 'BRASIL LEGAL'} — Regularização Imobiliária Integrada`;
    }
  }, [viewMode, config.brand.name]);

  const handleStartDiagnostic = () => {
    const el = document.getElementById('diagnostico');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setModalOpen(true);
    }
  };

  const handleCaseSelected = () => {
    const el = document.getElementById('diagnostico');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setModalOpen(true);
    }
  };

  const handleApplyEstimate = () => {
    const el = document.getElementById('diagnostico');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLeadCaptured = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // If user navigated to Control Panel
  if (viewMode === 'admin') {
    if (!isAuthenticated) {
      return (
        <AdminLoginScreen 
          onBackToSite={() => navigateTo('site')} 
          onLoginSuccess={() => navigateTo('admin')} 
        />
      );
    }
    return <AdminCMS onBackToSite={() => navigateTo('site')} />;
  }

  // Count leads in localStorage for quick badge
  let leadCount = 0;
  try {
    const stored = localStorage.getItem('brasil_legal_leads');
    if (stored) {
      leadCount = JSON.parse(stored).length;
    }
  } catch {
    leadCount = 0;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Navigation */}
      <Navbar 
        onOpenDiagnostic={() => setModalOpen(true)} 
        onOpenAdmin={() => navigateTo('admin')}
      />

      {/* Main Content Flow */}
      <main className="flex-1">
        {/* 1. Hero Section with PropTech Comparison */}
        <Hero 
          onStartDiagnostic={handleStartDiagnostic} 
          onWatchVideo={() => {
            const el = document.getElementById('video-institucional');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* 2. Interactive Diagnostic Lead Engine */}
        <DiagnosticWizard id="diagnostico" onLeadCaptured={handleLeadCaptured} />

        {/* 3. The Real Cost of Irregularity vs. Unlocked Equity */}
        <ValueDestructionVsValorization onDiagnosticClick={handleStartDiagnostic} />

        {/* 4. The 3 Integrated Pillars (Engenharia + Jurídico + Cartorial) */}
        <IntegratedPillars onStartDiagnostic={handleStartDiagnostic} />

        {/* 5. Institutional Video Presentation (Customizable via CMS) */}
        <VideoSection onStartDiagnostic={handleStartDiagnostic} />

        {/* 6. Specific Use Cases & Situations */}
        <UseCasesGrid onSelectCase={handleCaseSelected} />

        {/* 7. Interactive Asset Equity & Liquidity Simulator */}
        <EquityCalculator onApplyEstimate={handleApplyEstimate} />

        {/* 8. Regional CIMBAJU & SP Authority */}
        <RegionalSection onStartDiagnostic={handleStartDiagnostic} />

        {/* 8.5. Multidisciplinary Technical Team with real portraits & credentials */}
        <TeamSection id="equipe" onStartDiagnostic={handleStartDiagnostic} />

        {/* 9. 4-Stage Methodology Process */}
        <StepByStepProcess onStartDiagnostic={handleStartDiagnostic} />

        {/* 10. Comprehensive FAQ (Editable in CMS) */}
        <FAQ />
      </main>

      {/* Institutional Footer */}
      <Footer 
        onOpenDiagnostic={() => setModalOpen(true)} 
        onOpenAdmin={() => navigateTo('admin')}
      />

      {/* Floating WhatsApp Contact Button */}
      <FloatingWhatsApp />

      {/* Quick Diagnostic Modal */}
      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Admin Leads Management Drawer */}
      <LeadManagementDrawer
        isOpen={leadsDrawerOpen}
        onClose={() => setLeadsDrawerOpen(false)}
        refreshTrigger={refreshTrigger}
      />

      {/* Floating Painel Quick Switcher Pill (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
        <a
          href="/painel"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('admin');
          }}
          className="px-3.5 py-2 bg-slate-900/90 hover:bg-[#0C1033] text-white rounded-full text-xs font-bold border border-slate-700 shadow-xl backdrop-blur-xs flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer group"
          title="Abrir Painel de Controle"
        >
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: config.colors.accentYellow }}
          />
          <Settings className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span>Painel</span>
          {leadCount > 0 && (
            <span 
              className="px-1.5 py-0.2 rounded-full text-[10px] font-black text-slate-950"
              style={{ backgroundColor: config.colors.accentYellow }}
            >
              {leadCount}
            </span>
          )}
        </a>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <SiteConfigProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </SiteConfigProvider>
  );
}
