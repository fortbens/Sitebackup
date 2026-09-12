export type PropertyType = 
  | 'casa' 
  | 'sobrado' 
  | 'terreno' 
  | 'comercial' 
  | 'chacara' 
  | 'outro';

export type IrregularityType = 
  | 'construcao_nao_averbada'
  | 'sem_habite_se'
  | 'terreno_loteadora'
  | 'inss_sero_pendente'
  | 'venda_financiamento_travado'
  | 'inventario_sucessao'
  | 'imovel_antigo_sem_escritura'
  | 'duvidas_cib'
  | 'outra';

export type RegionalLocation = 
  | 'caieiras'
  | 'franco_da_rocha'
  | 'francisco_morato'
  | 'mairipora'
  | 'cajamar'
  | 'sao_paulo_capital'
  | 'grande_sp'
  | 'interior_sp'
  | 'outro_estado';

export type UrgencyReason = 
  | 'venda_urgente'
  | 'aprovacao_financiamento'
  | 'notificacao_prefeitura'
  | 'planejamento_herdeiros'
  | 'valorizacao_patrimonial';

export interface DiagnosticFormData {
  propertyType: PropertyType;
  irregularities: IrregularityType[];
  location: RegionalLocation;
  urgency: UrgencyReason;
  estimatedValue: number;
  hasPlanta: boolean | null;
  name: string;
  phone: string;
  email: string;
  notes?: string;
}

export interface StoredLead extends DiagnosticFormData {
  id: string;
  createdAt: string;
  status: 'novo' | 'em_contato' | 'proposta_enviada' | 'concluido' | 'arquivado';
  internalNotes?: string;
  updatedAt?: string;
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  category: 'geral' | 'engenharia' | 'juridico' | 'financeiro';
}

export type HeadingFontOption = 
  | 'Outfit' 
  | 'Plus Jakarta Sans' 
  | 'Montserrat' 
  | 'Poppins' 
  | 'Playfair Display' 
  | 'Inter';

export type BodyFontOption = 
  | 'Plus Jakarta Sans' 
  | 'Inter' 
  | 'Roboto' 
  | 'Lato' 
  | 'Open Sans';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  credential: string; // e.g., "OAB/SP 312.450", "CREA-SP 506.918.234"
  pillar: 'juridico' | 'engenharia' | 'cartorial' | 'urbanistico';
  bio: string;
  specialties: string[];
  photoUrl: string;
  email?: string;
  whatsapp?: string;
  featured: boolean;
  displayOrder: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string;
  phone?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  action: 'login_success' | 'login_failed' | 'password_changed' | 'profile_updated' | 'session_logout' | 'lockout';
  ipAddress?: string;
  details: string;
}

export interface GitHubSyncLog {
  id: string;
  timestamp: string;
  action: 'push_config' | 'pull_config' | 'test_connection' | 'export_leads' | 'trigger_dispatch';
  status: 'success' | 'error' | 'pending';
  commitSha?: string;
  message: string;
}

export interface GitHubConfig {
  enabled: boolean;
  repoOwner: string;
  repoName: string;
  branch: string;
  token: string;
  autoSync: boolean;
  lastSync?: string;
  lastCommitSha?: string;
  configPath: string;
  leadsPath: string;
  syncLogs?: GitHubSyncLog[];
}

export interface SiteConfig {
  brand: {
    name: string;
    descriptor: string;
    showDescriptor: boolean;
    showLogoInHeader?: boolean;
    showLogoInTopBar?: boolean;
    logoType: 'vector_default' | 'custom_image';
    customLogoUrl: string; // legacy fallback
    logoLightUrl: string;  // Logo Claro (para fundos escuros / rodapé / modo escuro)
    logoDarkUrl: string;   // Logo Escuro (para fundos claros / navbar / modo claro)
    logoScale: number; // e.g., 1
  };
  colors: {
    primaryNavy: string;     // default #161C4D
    primaryDark: string;     // default #0C1033
    accentYellow: string;    // default #F8C908
    accentHover: string;     // default #E5B700
    successGreen: string;    // default #10B981
    presetName: string;
  };
  fonts: {
    headingFont: HeadingFontOption;
    bodyFont: BodyFontOption;
  };
  topBar: {
    enabled?: boolean;
    showLogo?: boolean;
    badgeText: string;
    announcementText: string;
    plantaoText: string;
  };
  hero: {
    tagText: string;
    headlinePre: string;
    headlineHighlight: string;
    headlinePost: string;
    subheadline: string;
    ctaButtonText: string;
    whatsappButtonText: string;
    showComparisonCard: boolean;
  };
  video: {
    enabled: boolean;
    title: string;
    subtitle: string;
    videoUrl: string;
    thumbnailUrl: string;
    buttonText: string;
  };
  teamSection: {
    enabled: boolean;
    badgeText: string;
    title: string;
    subtitle: string;
  };
  team: TeamMember[];
  contact: {
    whatsappNumber: string; // only numbers, e.g. 5511999999999
    whatsappDisplay: string; // e.g. (11) 99999-9999
    email: string;
    hours: string;
    serviceRegion: string;
  };
  regional: {
    badgeText: string;
    title: string;
    subtitle: string;
  };
  footer: {
    aboutText: string;
    disclaimerText: string;
    copyrightText: string;
  };
  github: GitHubConfig;
  faq: FAQItem[];
}

