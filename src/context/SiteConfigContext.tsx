import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteConfig, HeadingFontOption, BodyFontOption, FAQItem, TeamMember, GitHubConfig } from '../types';

import photoCarlos from '../assets/images/team_lawyer_carlos_1789239401585.jpg';
import photoGabriela from '../assets/images/team_engineer_gabriela_1789239411935.jpg';
import photoMarcelo from '../assets/images/team_architect_marcelo_1789239422294.jpg';
import photoVanessa from '../assets/images/team_notary_vanessa_1789239431968.jpg';

export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  enabled: false,
  repoOwner: '',
  repoName: '',
  branch: 'main',
  token: '',
  autoSync: false,
  lastSync: undefined,
  lastCommitSha: undefined,
  configPath: 'config/site-config.json',
  leadsPath: 'data/leads-backup.json',
  syncLogs: [],
};

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team_carlos',
    name: 'Dr. Carlos Eduardo Medeiros',
    role: 'Diretor Jurídico & Especialista em Direito Imobiliário',
    credential: 'OAB/SP 312.450',
    pillar: 'juridico',
    bio: 'Mais de 16 anos de atuação estratégica em regularização fundiária, adjudicação compulsória extrajudicial (Lei 14.382/22) e usucapião notarial nos cartórios de SP e CIMBAJU.',
    specialties: ['Adjudicação Compulsória', 'Usucapião Extrajudicial', 'Desembaraço de Herança', 'Contratos Imobiliários'],
    photoUrl: photoCarlos,
    email: 'carlos.medeiros@brasillegal.imb.br',
    whatsapp: '5511987654321',
    featured: true,
    displayOrder: 1,
  },
  {
    id: 'team_gabriela',
    name: 'Engª. Gabriela Vasconcelos',
    role: 'Diretora de Engenharia Civil & Projetos As-Built',
    credential: 'CREA-SP 506.918.234',
    pillar: 'engenharia',
    bio: 'Especialista em levantamentos cadastrais de alta precisão, laudos estruturais, desdobro de lotes e tramitação de anistia edilícia com aprovação expedita de Habite-se.',
    specialties: ['Projetos As-Built', 'Emissão de Habite-se & ART', 'Decadência INSS/SERO', 'Laudos de Estabilidade'],
    photoUrl: photoGabriela,
    email: 'gabriela.engenharia@brasillegal.imb.br',
    whatsapp: '5511987654322',
    featured: true,
    displayOrder: 2,
  },
  {
    id: 'team_marcelo',
    name: 'Arq. Marcelo Ribeiro Santos',
    role: 'Arquiteto Urbanista & Topógrafo Cadastral',
    credential: 'CAU-SP A184.920',
    pillar: 'urbanistico',
    bio: 'Mestre em Planejamento Urbano. Especialista nas leis de zoneamento, recuos obrigatórios e códigos de obras dos municípios de Caieiras, Franco da Rocha, Francisco Morato e Mairiporã.',
    specialties: ['Zoneamento & Anistia', 'Georreferenciamento', 'Desdobro & Remembramento', 'Adequação Sanitária'],
    photoUrl: photoMarcelo,
    email: 'marcelo.urbanismo@brasillegal.imb.br',
    whatsapp: '5511987654323',
    featured: true,
    displayOrder: 3,
  },
  {
    id: 'team_vanessa',
    name: 'Dra. Vanessa Toledo Prado',
    role: 'Consultora Registral & Relações Notariais',
    credential: 'Especialista Notarial & Registral',
    pillar: 'cartorial',
    bio: 'Ex-oficial substituta de Registro de Imóveis com profundo domínio das exigências dos Oficiais Registradores, saneamento de notas devolutivas e averbações de certidões fiscais.',
    specialties: ['Saneamento de Notas Devolutivas', 'Averbação de Construção', 'CND Receita Federal', 'Certidões Vintenárias'],
    photoUrl: photoVanessa,
    email: 'vanessa.cartorios@brasillegal.imb.br',
    whatsapp: '5511987654324',
    featured: true,
    displayOrder: 4,
  },
];

export const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'juridico',
    question: 'Meu imóvel tem apenas contrato de gaveta ou escritura antiga. É possível regularizar no meu nome?',
    answer: 'Sim! Com os avanços da Lei Federal 14.382/2022 (que viabilizou a Adjudicação Compulsória Extrajudicial) e os provimentos de Usucapião Extrajudicial do CNJ, hoje é possível regularizar a titularidade legítima diretamente nos Cartórios de Notas e de Registro de Imóveis, sem a necessidade de esperar anos por um processo moroso na justiça.'
  },
  {
    id: 'faq_2',
    category: 'geral',
    question: 'Se eu regularizar a ampliação do meu imóvel, meu IPTU vai dobrar?',
    answer: 'Mito comum! Atualmente, quase todas as prefeituras (incluindo Caieiras, Franco da Rocha e região) já utilizam imagens de satélite e drones para atualizar a metragem cadastral do IPTU. Deixar o imóvel irregular não evita o IPTU e ainda gera cobrança de alíquotas punitivas de obra não regularizada. Ao fazer o projeto oficial, você garante o Habite-se, protege seu patrimônio de multas e ganha o direito de vender financiado.'
  },
  {
    id: 'faq_3',
    category: 'financeiro',
    question: 'O que é o SERO e por que preciso da CND da Receita Federal?',
    answer: 'O SERO (Serviço Eletrônico de Aferição de Obras) é a plataforma da Receita Federal para apuração do INSS sobre a mão de obra da construção civil. O Cartório de Imóveis exige por lei a CND (Certidão Negativa de Débitos) de Obra para averbar qualquer construção. A Brasil Legal avalia estrategicamente se sua obra possui mais de 5 anos para aplicar a tese da decadência tributária, o que pode reduzir substancialmente ou até zerar o valor cobrado pela Receita.'
  },
  {
    id: 'faq_4',
    category: 'engenharia',
    question: 'Por que preciso de Engenharia e Jurídico integrados na mesma contratação?',
    answer: 'Porque a regularização imobiliária no Brasil é multidisciplinar por natureza. O Cartório de Registro de Imóveis exige o Habite-se expedido pela Prefeitura (que demanda planta As-Built e ART de Engenheiro Civil). Por sua vez, a Prefeitura exige certidões de titularidade que demandam análise jurídica. Quando você contrata profissionais separados, um costuma culpar o outro por atrasos. Na Brasil Legal, engenheiros e especialistas jurídicos trabalham em sintonia.'
  },
  {
    id: 'faq_5',
    category: 'geral',
    question: 'Quanto tempo demora para regularizar um imóvel?',
    answer: 'Processos de averbação com expedição de Habite-se e certidão da Receita Federal costumam tramitar entre 60 e 180 dias, dependendo dos prazos de análise da Secretaria de Obras do município e da agilidade do cartório local. Na fase de Diagnóstico Preliminar, informamos uma estimativa realista para o seu caso específico.'
  },
  {
    id: 'faq_6',
    category: 'geral',
    question: 'Vocês atendem apenas na região de Caieiras e CIMBAJU?',
    answer: 'A região do CIMBAJU (Caieiras, Franco da Rocha, Francisco Morato, Mairiporã e Cajamar) e Grande São Paulo é nosso polo de atendimento presencial e prioritário, onde temos estreita familiaridade com as leis municipais e cartórios locais. No entanto, prestamos consultoria registral e diagnósticos técnicos para proprietários em todo o Estado de São Paulo e Brasil.'
  },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brand: {
    name: 'BRASIL LEGAL',
    descriptor: 'Regularização Imobiliária Integrada',
    showDescriptor: true,
    showLogoInHeader: true,
    showLogoInTopBar: false,
    logoType: 'vector_default',
    customLogoUrl: '',
    logoLightUrl: '',
    logoDarkUrl: '',
    logoScale: 1,
  },
  colors: {
    primaryNavy: '#161c4d',
    primaryDark: '#0c1033',
    accentYellow: '#f8c908',
    accentHover: '#e5b700',
    successGreen: '#10b981',
    presetName: 'Oficial Brasil Legal',
  },
  fonts: {
    headingFont: 'Outfit',
    bodyFont: 'Plus Jakarta Sans',
  },
  topBar: {
    enabled: true,
    showLogo: false,
    badgeText: 'FOCO REGIONAL',
    announcementText: 'Atendimento Especializado CIMBAJU (Caieiras, Franco da Rocha, Fco. Morato, Mairiporã, Cajamar) & Estado de SP',
    plantaoText: 'Plantão Técnico WhatsApp',
  },
  hero: {
    tagText: 'Regularização Imobiliária Integrada • PropTech & Consultoria',
    headlinePre: 'Regularize seu imóvel e',
    headlineHighlight: 'destrave o valor real',
    headlinePost: 'do seu patrimônio.',
    subheadline: 'Engenharia, Direito Imobiliário e Inteligência Registral unificados em um só lugar. Elimine o risco de multas, libere financiamentos bancários e resolva pendências de Habite-se, construção não averbada e matrícula com agilidade técnica.',
    ctaButtonText: 'Fazer Diagnóstico Preliminar do Imóvel',
    whatsappButtonText: 'Falar via WhatsApp',
    showComparisonCard: true,
  },
  video: {
    enabled: true,
    title: 'Como a Brasil Legal Desembaraça Seu Imóvel',
    subtitle: 'Assista à explicação dos nossos diretores técnicos sobre como a integração entre Engenharia e Cartórios acelera a emissão do Habite-se e Matrícula.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: '',
    buttonText: 'Assistir Vídeo Explicativo',
  },
  teamSection: {
    enabled: true,
    badgeText: 'Corpo Técnico Multidisciplinar',
    title: 'Especialistas Integrados em Engenharia, Direito & Cartórios',
    subtitle: 'Nossa equipe própria unifica engenheiros civis credenciados no CREA, advogados especialistas em Direito Imobiliário pela OAB e consultores registrais com trânsito diário nos cartórios da região.',
  },
  team: DEFAULT_TEAM_MEMBERS,
  contact: {
    whatsappNumber: '5511999999999',
    whatsappDisplay: '(11) 99999-9999',
    email: 'contato@brasillegal.imb.br',
    hours: 'Segunda a Sexta: 08h30 às 18h00 | Plantão de Análise aos Sábados',
    serviceRegion: 'Caieiras, Franco da Rocha, Francisco Morato, Mairiporã, Cajamar, Grande SP e Todo o Brasil',
  },
  regional: {
    badgeText: 'Autoridade Regional CIMBAJU',
    title: 'Forte atuação nos municípios do Consórcio CIMBAJU & Região Metropolitana',
    subtitle: 'Cada prefeitura possui sua própria lei de zoneamento, código de obras e decretos de anistia. Nossa equipe atua diretamente nos balcões técnicos e cartórios da região, garantindo agilidade real.',
  },
  footer: {
    aboutText: 'Engenharia, Direito Imobiliário e Inteligência Registral unificados para destravar o valor, a liquidez e a segurança jurídica do seu patrimônio.',
    disclaimerText: 'A BRASIL LEGAL — Regularização Imobiliária Integrada realiza diagnósticos técnicos, projetos de engenharia civil (com ART/RRT), consultoria urbanística e assessoria de regularização imobiliária extrajudicial em conformidade com as legislações municipais de uso e ocupação do solo, Lei dos Registros Públicos (Lei nº 6.015/73) e Leis Federais aplicáveis.',
    copyrightText: 'BRASIL LEGAL — Regularização Imobiliária Integrada. Todos os direitos reservados.',
  },
  github: DEFAULT_GITHUB_CONFIG,
  faq: DEFAULT_FAQ_ITEMS,
};

export const COLOR_PRESETS = [
  {
    name: 'Oficial Brasil Legal',
    colors: {
      primaryNavy: '#161c4d',
      primaryDark: '#0c1033',
      accentYellow: '#f8c908',
      accentHover: '#e5b700',
      successGreen: '#10b981',
      presetName: 'Oficial Brasil Legal',
    }
  },
  {
    name: 'Cobalto & Ouro Nobre',
    colors: {
      primaryNavy: '#0f2b5c',
      primaryDark: '#081734',
      accentYellow: '#e6b00f',
      accentHover: '#c89705',
      successGreen: '#059669',
      presetName: 'Cobalto & Ouro Nobre',
    }
  },
  {
    name: 'Modern Slate & Esmeralda',
    colors: {
      primaryNavy: '#1e293b',
      primaryDark: '#0f172a',
      accentYellow: '#10b981',
      accentHover: '#059669',
      successGreen: '#10b981',
      presetName: 'Modern Slate & Esmeralda',
    }
  },
  {
    name: 'Engenharia & Sol',
    colors: {
      primaryNavy: '#1e3a5f',
      primaryDark: '#0f1f33',
      accentYellow: '#f59e0b',
      accentHover: '#d97706',
      successGreen: '#10b981',
      presetName: 'Engenharia & Sol',
    }
  },
];

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig> | ((prev: SiteConfig) => SiteConfig)) => void;
  updateSection: <K extends keyof SiteConfig>(section: K, data: Partial<SiteConfig[K]>) => void;
  resetToDefaults: () => void;
  exportConfigJson: () => void;
  importConfigJson: (jsonString: string) => boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'brasil_legal_cms_config';

const normalizeTeam = (raw: any): TeamMember[] => {
  if (!raw) return DEFAULT_TEAM_MEMBERS;
  if (Array.isArray(raw) && raw.length > 0) return raw;
  if (typeof raw === 'object' && raw !== null) {
    const list = Object.values(raw) as TeamMember[];
    if (list.length > 0 && (list[0]?.name || list[0]?.role)) {
      return list;
    }
  }
  return DEFAULT_TEAM_MEMBERS;
};

const normalizeFaq = (raw: any): FAQItem[] => {
  if (!raw) return DEFAULT_FAQ_ITEMS;
  if (Array.isArray(raw) && raw.length > 0) return raw;
  if (typeof raw === 'object' && raw !== null) {
    const list = Object.values(raw) as FAQItem[];
    if (list.length > 0 && list[0]?.question) {
      return list;
    }
  }
  return DEFAULT_FAQ_ITEMS;
};

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge deep with default to ensure no missing keys
        return {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          brand: { ...DEFAULT_SITE_CONFIG.brand, ...parsed.brand },
          colors: { ...DEFAULT_SITE_CONFIG.colors, ...parsed.colors },
          fonts: { ...DEFAULT_SITE_CONFIG.fonts, ...parsed.fonts },
          topBar: { ...DEFAULT_SITE_CONFIG.topBar, ...parsed.topBar },
          hero: { ...DEFAULT_SITE_CONFIG.hero, ...parsed.hero },
          video: { ...DEFAULT_SITE_CONFIG.video, ...parsed.video },
          teamSection: { ...DEFAULT_SITE_CONFIG.teamSection, ...(parsed.teamSection || {}) },
          team: normalizeTeam(parsed.team),
          contact: { ...DEFAULT_SITE_CONFIG.contact, ...parsed.contact },
          regional: { ...DEFAULT_SITE_CONFIG.regional, ...parsed.regional },
          footer: { ...DEFAULT_SITE_CONFIG.footer, ...parsed.footer },
          github: { ...DEFAULT_GITHUB_CONFIG, ...(parsed.github || {}) },
          faq: normalizeFaq(parsed.faq),
        };
      }
    } catch (e) {
      console.error('Failed to load CMS config from storage', e);
    }
    return DEFAULT_SITE_CONFIG;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Não foi possível persistir no localStorage (possível limite de cota excedido):', e);
    }
  }, [config]);

  // Dynamically apply CSS variables to root and load fonts
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-brand-navy', config.colors.primaryNavy);
    root.style.setProperty('--color-brand-navy-dark', config.colors.primaryDark);
    root.style.setProperty('--color-brand-yellow', config.colors.accentYellow);
    root.style.setProperty('--color-brand-yellow-hover', config.colors.accentHover);
    root.style.setProperty('--color-brand-success', config.colors.successGreen);

    // Font application
    root.style.setProperty('--font-display', `"${config.fonts.headingFont}", system-ui, sans-serif`);
    root.style.setProperty('--font-sans', `"${config.fonts.bodyFont}", system-ui, sans-serif`);

    // Dynamically load Google Font if needed
    const fontFamilies = Array.from(new Set([config.fonts.headingFont, config.fonts.bodyFont]));
    const linkId = 'dynamic-cms-google-fonts';
    let linkTag = document.getElementById(linkId) as HTMLLinkElement | null;
    
    const formattedFonts = fontFamilies
      .map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800;900`)
      .join('&');

    const href = `https://fonts.googleapis.com/css2?${formattedFonts}&display=swap`;

    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.id = linkId;
      linkTag.rel = 'stylesheet';
      document.head.appendChild(linkTag);
    }
    linkTag.href = href;
  }, [config.colors, config.fonts]);

  const updateConfig = (newConfig: Partial<SiteConfig> | ((prev: SiteConfig) => SiteConfig)) => {
    if (typeof newConfig === 'function') {
      setConfig(prev => newConfig(prev));
    } else {
      setConfig(prev => ({ ...prev, ...newConfig }));
    }
  };

  const updateSection = <K extends keyof SiteConfig>(section: K, data: any) => {
    setConfig(prev => {
      // If the data is an array or the target section is an array (e.g. team, faq), replace it cleanly
      if (Array.isArray(data) || Array.isArray(prev[section])) {
        const arrayData = Array.isArray(data)
          ? data
          : (typeof data === 'object' && data !== null ? Object.values(data) : []);
        return {
          ...prev,
          [section]: arrayData as SiteConfig[K],
        };
      }

      return {
        ...prev,
        [section]: {
          ...(typeof prev[section] === 'object' && prev[section] !== null && !Array.isArray(prev[section])
            ? prev[section]
            : {}),
          ...data,
        },
      };
    });
  };

  const resetToDefaults = () => {
    if (confirm('Deseja restaurar todas as configurações visuais e textos para o padrão original da Brasil Legal?')) {
      setConfig(DEFAULT_SITE_CONFIG);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const exportConfigJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `brasil_legal_config_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importConfigJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object' && parsed.colors && parsed.brand) {
        setConfig({
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
        });
        return true;
      }
    } catch (e) {
      console.error('Failed to import config JSON', e);
    }
    return false;
  };

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        updateConfig,
        updateSection,
        resetToDefaults,
        exportConfigJson,
        importConfigJson,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
