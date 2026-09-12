import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  Palette, 
  Type, 
  FileText, 
  Video, 
  HelpCircle, 
  Database, 
  Eye, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Check, 
  Phone, 
  Mail, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  AlertTriangle,
  Play,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Edit3,
  X,
  MessageSquare,
  LogOut,
  Shield,
  UserCheck,
  Github
} from 'lucide-react';
import { useSiteConfig, COLOR_PRESETS } from '../../context/SiteConfigContext';
import { useAuth } from '../../context/AuthContext';
import { StoredLead, HeadingFontOption, BodyFontOption, FAQItem } from '../../types';
import { Logo } from '../Logo';
import { getEmbedVideoUrl } from '../VideoSection';
import { TeamManagerTab } from './TeamManagerTab';
import { AdminProfileTab } from './AdminProfileTab';
import { GitHubIntegrationTab } from './GitHubIntegrationTab';

interface AdminCMSProps {
  onBackToSite: () => void;
}

type TabType = 'leads' | 'team' | 'profile' | 'brand' | 'colors' | 'fonts' | 'texts' | 'video' | 'faq' | 'backup' | 'github';

export const AdminCMS: React.FC<AdminCMSProps> = ({ onBackToSite }) => {
  const { config, updateConfig, updateSection, resetToDefaults, exportConfigJson, importConfigJson } = useSiteConfig();
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('leads');
  const [savedNotification, setSavedNotification] = useState(false);

  // Leads CRM State
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [cityFilter, setCityFilter] = useState<string>('todas');
  const [selectedLead, setSelectedLead] = useState<StoredLead | null>(null);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [newLeadData, setNewLeadData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: 'casa' as StoredLead['propertyType'],
    location: 'caieiras' as StoredLead['location'],
    urgency: 'venda_urgente' as StoredLead['urgency'],
    estimatedValue: 500000,
    notes: '',
  });

  // FAQ Modal / State
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  // Load leads from storage
  const loadLeads = () => {
    try {
      const data = localStorage.getItem('brasil_legal_leads');
      if (data) {
        setLeads(JSON.parse(data));
      } else {
        // Sample initial leads
        const sample: StoredLead[] = [
          {
            id: 'lead_1',
            propertyType: 'casa',
            irregularities: ['construcao_nao_averbada', 'sem_habite_se'],
            location: 'caieiras',
            urgency: 'venda_urgente',
            estimatedValue: 780000,
            hasPlanta: true,
            name: 'Ricardo Silveira',
            phone: '(11) 98765-4321',
            email: 'ricardo.silveira@email.com',
            notes: 'Casa ampliada no Serpa com piscina e edícula não averbadas. Comprador quer financiar pela Caixa.',
            createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
            status: 'novo',
            internalNotes: 'Fizemos o primeiro contato pelo WhatsApp. Cliente vai enviar cópia do IPTU e certidão antiga.',
          },
          {
            id: 'lead_2',
            propertyType: 'terreno',
            irregularities: ['terreno_loteadora'],
            location: 'franco_da_rocha',
            urgency: 'planejamento_herdeiros',
            estimatedValue: 320000,
            hasPlanta: false,
            name: 'Mariana Duarte',
            phone: '(11) 99123-8899',
            email: 'mariana.duarte@gmail.com',
            notes: 'Lote quitado há 8 anos, loteadora encerrou atividades e não conseguimos a escritura no cartório.',
            createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
            status: 'em_contato',
            internalNotes: 'Caso perfeito para Adjudicação Compulsória Extrajudicial pelo art. 216-B da Lei 6.015/73.',
          },
          {
            id: 'lead_3',
            propertyType: 'comercial',
            irregularities: ['inss_sero_pendente', 'sem_habite_se'],
            location: 'cajamar',
            urgency: 'notificacao_prefeitura',
            estimatedValue: 1450000,
            hasPlanta: true,
            name: 'Cláudio Ferreira Lima',
            phone: '(11) 97321-1100',
            email: 'claudio@transportesferreira.com.br',
            notes: 'Galpão em Jordanésia notificado pela prefeitura para adequação de habite-se comercial e regularização perante a Receita.',
            createdAt: new Date(Date.now() - 3600000 * 70).toISOString(),
            status: 'proposta_enviada',
            internalNotes: 'Enviada proposta para projeto As-Built + protocolo de decadência no SERO.',
          },
        ];
        setLeads(sample);
        localStorage.setItem('brasil_legal_leads', JSON.stringify(sample));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const saveLeadsToStorage = (updated: StoredLead[]) => {
    setLeads(updated);
    localStorage.setItem('brasil_legal_leads', JSON.stringify(updated));
  };

  const handleUpdateLeadStatus = (id: string, newStatus: StoredLead['status']) => {
    const updated = leads.map(l => l.id === id ? { ...l, status: newStatus, updatedAt: new Date().toISOString() } : l);
    saveLeadsToStorage(updated);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
    triggerSaveAlert();
  };

  const handleUpdateLeadNotes = (id: string, notes: string) => {
    const updated = leads.map(l => l.id === id ? { ...l, internalNotes: notes, updatedAt: new Date().toISOString() } : l);
    saveLeadsToStorage(updated);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(prev => prev ? { ...prev, internalNotes: notes } : null);
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta solicitação de lead?')) {
      const updated = leads.filter(l => l.id !== id);
      saveLeadsToStorage(updated);
      if (selectedLead?.id === id) {
        setSelectedLead(null);
      }
      triggerSaveAlert();
    }
  };

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadData.name || !newLeadData.phone) {
      alert('Nome e Telefone são obrigatórios.');
      return;
    }

    const newLead: StoredLead = {
      id: `manual_${Date.now()}`,
      propertyType: newLeadData.propertyType,
      irregularities: ['construcao_nao_averbada'],
      location: newLeadData.location,
      urgency: newLeadData.urgency,
      estimatedValue: Number(newLeadData.estimatedValue) || 0,
      hasPlanta: true,
      name: newLeadData.name,
      phone: newLeadData.phone,
      email: newLeadData.email,
      notes: newLeadData.notes,
      createdAt: new Date().toISOString(),
      status: 'novo',
    };

    const updated = [newLead, ...leads];
    saveLeadsToStorage(updated);
    setIsAddingLead(false);
    setNewLeadData({
      name: '',
      phone: '',
      email: '',
      propertyType: 'casa',
      location: 'caieiras',
      urgency: 'venda_urgente',
      estimatedValue: 500000,
      notes: '',
    });
    triggerSaveAlert();
  };

  const triggerSaveAlert = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  // Filtered leads
  const filteredLeads = leads.filter(l => {
    const matchSearch = !leadSearch || 
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.includes(leadSearch) ||
      l.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      (l.notes && l.notes.toLowerCase().includes(leadSearch.toLowerCase()));
    
    const matchStatus = statusFilter === 'todos' || l.status === statusFilter;
    const matchCity = cityFilter === 'todas' || l.location === cityFilter;

    return matchSearch && matchStatus && matchCity;
  });

  // Calculate CRM metrics
  const totalValue = leads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const countNovos = leads.filter(l => l.status === 'novo').length;
  const countEmContato = leads.filter(l => l.status === 'em_contato').length;
  const countPropostas = leads.filter(l => l.status === 'proposta_enviada').length;
  const countConcluidos = leads.filter(l => l.status === 'concluido').length;

  // Image Upload handler for Logo (Dark and Light)
  const handleLogoFileUpload = (variant: 'dark' | 'light', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          if (variant === 'dark') {
            updateSection('brand', {
              logoType: 'custom_image',
              logoDarkUrl: result,
              customLogoUrl: result,
            });
          } else {
            updateSection('brand', {
              logoType: 'custom_image',
              logoLightUrl: result,
              customLogoUrl: config.brand.customLogoUrl || result,
            });
          }
          triggerSaveAlert();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // FAQ management
  const handleSaveFaqItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    if (isAddingFaq) {
      const newItem: FAQItem = {
        ...editingFaq,
        id: `faq_${Date.now()}`,
      };
      updateSection('faq', [...config.faq, newItem]);
    } else {
      const updated = config.faq.map(item => item.id === editingFaq.id ? editingFaq : item);
      updateSection('faq', updated);
    }

    setEditingFaq(null);
    setIsAddingFaq(false);
    triggerSaveAlert();
  };

  const handleDeleteFaqItem = (id?: string) => {
    if (!id) return;
    if (confirm('Deseja excluir esta pergunta do FAQ?')) {
      const updated = config.faq.filter(f => f.id !== id);
      updateSection('faq', updated);
      triggerSaveAlert();
    }
  };

  const exportLeadsCSV = () => {
    if (leads.length === 0) {
      alert('Nenhum lead para exportar.');
      return;
    }
    const headers = ['Data', 'Nome', 'Telefone', 'Email', 'Local', 'Tipo Imóvel', 'Valor Estimado', 'Status', 'Urgência', 'Notas Cliente', 'Notas Internas'];
    const rows = leads.map(l => [
      new Date(l.createdAt).toLocaleDateString('pt-BR'),
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.location}"`,
      `"${l.propertyType}"`,
      l.estimatedValue,
      `"${l.status}"`,
      `"${l.urgency}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${(l.internalNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_brasil_legal_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const headingFontOptions: HeadingFontOption[] = [
    'Outfit',
    'Plus Jakarta Sans',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Inter',
  ];

  const bodyFontOptions: BodyFontOption[] = [
    'Plus Jakarta Sans',
    'Inter',
    'Roboto',
    'Lato',
    'Open Sans',
  ];

  const videoInfo = getEmbedVideoUrl(config.video.videoUrl);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      
      {/* Top Admin Header Bar */}
      <header className="bg-[#0C1033] text-white border-b border-slate-800 sticky top-0 z-50 px-4 sm:px-6 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-slate-950"
                style={{ backgroundColor: config.colors.accentYellow }}
              >
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <span>Painel de Controle</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
                    Ao Vivo
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {config.brand.name} • Gestão Total do Site e Formulários
                </div>
              </div>
            </div>

            <button
              onClick={onBackToSite}
              className="sm:hidden px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-slate-200 flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Site</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {savedNotification && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden lg:inline">Salvo no navegador</span>
              </span>
            )}

            {/* Admin Profile Chip */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                  : 'bg-white/10 hover:bg-white/15 text-slate-200 border-slate-700'
              }`}
              title="Acessar Perfil & Configurações de Segurança"
            >
              <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-900 border border-amber-400/50 flex items-center justify-center font-bold text-[11px] text-amber-300">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  currentUser?.name ? currentUser.name.charAt(0) : 'A'
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-bold text-[11px] leading-tight truncate max-w-[120px]">
                  {currentUser?.name || 'Administrador'}
                </div>
                <div className="text-[9px] opacity-70 leading-none">Perfil & Senha</div>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                onBackToSite();
              }}
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs transition-colors cursor-pointer"
              title="Encerrar Sessão Segura"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              onClick={exportConfigJson}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-slate-200 hidden md:flex items-center gap-1.5 transition-colors"
              title="Baixar arquivo de backup com todas as configurações"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Backup</span>
            </button>

            <button
              onClick={onBackToSite}
              className="px-3.5 py-2 rounded-xl text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition-all transform hover:scale-105 cursor-pointer"
              style={{ backgroundColor: config.colors.accentYellow }}
            >
              <Eye className="w-4 h-4" />
              <span>Ver Site</span>
            </button>
          </div>

        </div>
      </header>

      {/* Navigation Sub-bar (Tabs) */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 sticky top-[61px] z-40 overflow-x-auto shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 py-2">
          
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-[#161C4D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Leads & CRM</span>
            {countNovos > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {countNovos}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'team'
                ? 'bg-[#161C4D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Nossa Equipe</span>
            {config.team && config.team.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                {config.team.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#161C4D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Perfil & Senha</span>
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'brand'
                ? 'bg-[#161C4D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>Logo & Marca</span>
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'colors'
                ? 'bg-[#161C4D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span>Cores & Tema</span>
          </button>

          <button
            onClick={() => setActiveTab('fonts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'fonts'
                ? 'bg-[#161C4D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Type className="w-4 h-4 text-amber-400" />
            <span>Tipografia</span>
          </button>

          <button
            onClick={() => setActiveTab('texts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'texts'
                ? 'bg-[#161C4D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Textos do Site</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#161C4D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Video className="w-4 h-4 text-amber-400" />
            <span>Vídeo Institucional</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-[#161C4D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Gestão do FAQ</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-[#161C4D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>Backup & Padrões</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'github'
                ? 'bg-[#161C4D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Github className="w-4 h-4 text-amber-400" />
            <span>Integração GitHub</span>
            {config.github?.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="GitHub Conectado" />
            )}
          </button>

        </div>
      </div>

      {/* Main CMS Tab Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* ========================================================= */}
        {/* TAB: EQUIPE MULTIDISCIPLINAR & FOTOS */}
        {/* ========================================================= */}
        {activeTab === 'team' && (
          <div className="animate-in fade-in duration-150">
            <TeamManagerTab />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PERFIL DE ADMINISTRADOR & SEGURANÇA */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-150">
            <AdminProfileTab onLogout={() => {
              logout();
              onBackToSite();
            }} />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: LEADS & FORMULÁRIOS (CRM COMPLETO) */}
        {/* ========================================================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 block">Total de Leads</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{leads.length}</span>
                <span className="text-[11px] text-slate-400">Capturas no site</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs bg-amber-50/40">
                <span className="text-xs font-semibold text-amber-900 block">Novos (Aguardando)</span>
                <span className="text-2xl font-black text-amber-900 mt-1 block">{countNovos}</span>
                <span className="text-[11px] text-amber-700 font-medium">Prioridade imediata</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-2xs">
                <span className="text-xs font-semibold text-blue-900 block">Em Negociação</span>
                <span className="text-2xl font-black text-blue-900 mt-1 block">{countEmContato + countPropostas}</span>
                <span className="text-[11px] text-blue-600">Contato / Proposta</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs">
                <span className="text-xs font-semibold text-emerald-900 block">Concluídos</span>
                <span className="text-2xl font-black text-emerald-900 mt-1 block">{countConcluidos}</span>
                <span className="text-[11px] text-emerald-600">Contratos fechados</span>
              </div>

              <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 block">Patrimônio em Diagnóstico</span>
                <span className="text-xl sm:text-2xl font-black text-[#161C4D] mt-1 block">
                  R$ {(totalValue / 1000000).toFixed(1)}M
                </span>
                <span className="text-[11px] text-slate-400">Valor somado dos imóveis</span>
              </div>
            </div>

            {/* Filter and Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3">
              
              {/* Search input */}
              <div className="relative w-full lg:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome, telefone, notas..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#161C4D]/20 focus:border-[#161C4D]"
                />
              </div>

              {/* Status and City Dropdowns */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="novo">Novos</option>
                  <option value="em_contato">Em Contato</option>
                  <option value="proposta_enviada">Proposta Enviada</option>
                  <option value="concluido">Concluídos</option>
                </select>

                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none"
                >
                  <option value="todas">Todas as Cidades</option>
                  <option value="caieiras">Caieiras</option>
                  <option value="franco_da_rocha">Franco da Rocha</option>
                  <option value="francisco_morato">Francisco Morato</option>
                  <option value="mairipora">Mairiporã</option>
                  <option value="cajamar">Cajamar</option>
                  <option value="sao_paulo_capital">São Paulo</option>
                  <option value="grande_sp">Grande SP</option>
                </select>

                <button
                  onClick={() => setIsAddingLead(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#161C4D] hover:bg-[#252E75] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Novo Lead Manual</span>
                </button>

                <button
                  onClick={exportLeadsCSV}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Exportar planilha Excel/CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>

            </div>

            {/* Leads Table & Detail Viewer Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Leads list */}
              <div className={`${selectedLead ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
                {filteredLeads.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm">Nenhum lead encontrado com os filtros selecionados.</p>
                    <p className="text-xs text-slate-400 mt-1">Experimente limpar a busca ou cadastrar um novo cliente manual.</p>
                  </div>
                ) : (
                  filteredLeads.map((lead) => {
                    const isSelected = selectedLead?.id === lead.id;
                    const cleanPhone = lead.phone.replace(/\D/g, '');
                    return (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                          isSelected 
                            ? 'border-[#161C4D] ring-2 ring-[#161C4D]/15' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-slate-900 text-base">{lead.name}</h4>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                lead.status === 'novo' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                                lead.status === 'em_contato' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                                lead.status === 'proposta_enviada' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                                'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              }`}>
                                {lead.status === 'novo' ? 'Novo' :
                                 lead.status === 'em_contato' ? 'Em Contato' :
                                 lead.status === 'proposta_enviada' ? 'Proposta' : 'Concluído'}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                              <span className="flex items-center gap-1 font-medium text-slate-700 capitalize">
                                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                                {lead.location.replace(/_/g, ' ')}
                              </span>
                              <span>•</span>
                              <span className="capitalize">{lead.propertyType}</span>
                              <span>•</span>
                              <span className="font-semibold text-slate-800">
                                R$ {lead.estimatedValue.toLocaleString('pt-BR')}
                              </span>
                              <span>•</span>
                              <span className="text-slate-400">
                                {new Date(lead.createdAt).toLocaleDateString('pt-BR')} às {new Date(lead.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>

                          {/* Action icons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href={`https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(lead.name)}%2C%20aqui%20%C3%A9%20da%20Brasil%20Legal.%20Recebemos%20sua%20solicita%C3%A7%C3%A3o%20de%20diagn%C3%B3stico%20para%20o%20im%C3%B3vel%20em%20${encodeURIComponent(lead.location)}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                              title="Abrir WhatsApp com mensagem automática"
                            >
                              <Phone className="w-4 h-4" />
                            </a>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLead(lead.id);
                              }}
                              className="p-2 rounded-xl hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-colors"
                              title="Excluir lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </div>

                        {/* Irregularity Tags */}
                        {lead.irregularities && lead.irregularities.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-slate-100">
                            {lead.irregularities.map((irr, idx) => (
                              <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                                {irr.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Customer note preview */}
                        {lead.notes && (
                          <p className="mt-2 text-xs text-slate-600 line-clamp-1 italic bg-slate-50 p-1.5 rounded">
                            "{lead.notes}"
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Detailed Selected Lead Inspector */}
              {selectedLead && (
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#161C4D]/30 shadow-md space-y-4 sticky top-36">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Ficha do Cliente</span>
                      <h3 className="text-lg font-bold text-slate-900">{selectedLead.name}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Status update controller */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Status do Processo:</span>
                    <select
                      value={selectedLead.status}
                      onChange={(e) => handleUpdateLeadStatus(selectedLead.id, e.target.value as StoredLead['status'])}
                      className="text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none"
                    >
                      <option value="novo">🟡 Novo Lead</option>
                      <option value="em_contato">🔵 Em Contato</option>
                      <option value="proposta_enviada">🟣 Proposta Enviada</option>
                      <option value="concluido">🟢 Concluído / Contratado</option>
                      <option value="arquivado">⚪ Arquivado</option>
                    </select>
                  </div>

                  {/* Contact shortcuts */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        Telefone / WhatsApp:
                      </span>
                      <a
                        href={`https://wa.me/55${selectedLead.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <span>{selectedLead.phone}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {selectedLead.email && (
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          E-mail:
                        </span>
                        <a href={`mailto:${selectedLead.email}`} className="font-semibold text-slate-800 hover:underline">
                          {selectedLead.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Property snapshot */}
                  <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 text-xs space-y-1.5">
                    <div className="font-bold text-slate-900">Detalhes do Imóvel:</div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Município:</span>
                      <span className="font-semibold capitalize text-slate-900">{selectedLead.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tipo:</span>
                      <span className="font-semibold capitalize text-slate-900">{selectedLead.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Valor Estimado:</span>
                      <span className="font-bold text-slate-900">R$ {selectedLead.estimatedValue.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Possui Planta/Projeto:</span>
                      <span className="font-semibold text-slate-900">{selectedLead.hasPlanta ? 'Sim' : 'Não'}</span>
                    </div>
                  </div>

                  {/* Client observations */}
                  {selectedLead.notes && (
                    <div className="text-xs space-y-1">
                      <span className="font-bold text-slate-700">Relato do Proprietário:</span>
                      <p className="p-2.5 bg-slate-50 rounded-lg text-slate-600 italic border border-slate-200">
                        "{selectedLead.notes}"
                      </p>
                    </div>
                  )}

                  {/* Internal Technical Notes Editor */}
                  <div className="text-xs space-y-1 pt-2 border-t border-slate-200">
                    <span className="font-bold text-[#161C4D] flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" />
                      Anotações Internas da Equipe Técnica:
                    </span>
                    <textarea
                      rows={3}
                      value={selectedLead.internalNotes || ''}
                      onChange={(e) => handleUpdateLeadNotes(selectedLead.id, e.target.value)}
                      placeholder="Ex: Ligado para o cliente, solicitada certidão de ônus do 1º Cartório de Caieiras..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-[#161C4D]/20 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 block">Salvo automaticamente ao digitar.</span>
                  </div>

                  {/* Direct Contact Button */}
                  <a
                    href={`https://wa.me/55${selectedLead.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(selectedLead.name)}%2C%20aqui%20%C3%A9%20da%20Brasil%20Legal.%20Recebemos%20sua%20solicita%C3%A7%C3%A3o%20de%20diagn%C3%B3stico%20e%20gostar%C3%ADamos%20de%20apresentar%20a%20avalia%C3%A7%C3%A3o%20t%C3%A9cnica.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Iniciar Atendimento no WhatsApp</span>
                  </a>

                </div>
              )}

            </div>

            {/* Modal: New Manual Lead */}
            {isAddingLead && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-500" />
                      Cadastrar Lead Manualmente
                    </h3>
                    <button onClick={() => setIsAddingLead(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateManualLead} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={newLeadData.name}
                        onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                        placeholder="Ex: João da Silva"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Telefone / WhatsApp *</label>
                        <input
                          type="text"
                          required
                          value={newLeadData.phone}
                          onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                          placeholder="(11) 98765-4321"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">E-mail</label>
                        <input
                          type="email"
                          value={newLeadData.email}
                          onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                          placeholder="cliente@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Cidade / Região</label>
                        <select
                          value={newLeadData.location}
                          onChange={(e) => setNewLeadData({ ...newLeadData, location: e.target.value as any })}
                          className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                        >
                          <option value="caieiras">Caieiras</option>
                          <option value="franco_da_rocha">Franco da Rocha</option>
                          <option value="francisco_morato">Francisco Morato</option>
                          <option value="mairipora">Mairiporã</option>
                          <option value="cajamar">Cajamar</option>
                          <option value="sao_paulo_capital">São Paulo</option>
                          <option value="grande_sp">Grande SP</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Tipo de Imóvel</label>
                        <select
                          value={newLeadData.propertyType}
                          onChange={(e) => setNewLeadData({ ...newLeadData, propertyType: e.target.value as any })}
                          className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                        >
                          <option value="casa">Casa Térrea</option>
                          <option value="sobrado">Sobrado</option>
                          <option value="terreno">Terreno / Lote</option>
                          <option value="comercial">Comercial / Galpão</option>
                          <option value="chacara">Chácara</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Valor Estimado (R$)</label>
                      <input
                        type="number"
                        value={newLeadData.estimatedValue}
                        onChange={(e) => setNewLeadData({ ...newLeadData, estimatedValue: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Observações do Imóvel</label>
                      <textarea
                        rows={2}
                        value={newLeadData.notes}
                        onChange={(e) => setNewLeadData({ ...newLeadData, notes: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                        placeholder="Ex: Imóvel com ampliação nos fundos, necessita de Habite-se urgente."
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingLead(false)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#161C4D] hover:bg-[#252E75] text-white font-bold"
                      >
                        Cadastrar Lead
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: IDENTIDADE & LOGO */}
        {/* ========================================================= */}
        {activeTab === 'brand' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Identidade Visual & Logotipo</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Personalize o logo oficial vetorial ou utilize sua própria imagem (PNG, SVG, JPG).
                </p>
              </div>

              {/* Logo Type Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div 
                  onClick={() => {
                    updateSection('brand', { logoType: 'vector_default' });
                    triggerSaveAlert();
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    config.brand.logoType === 'vector_default'
                      ? 'border-[#161C4D] bg-slate-50 ring-2 ring-[#161C4D]/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-slate-900">Logo Vetorial Oficial</span>
                    {config.brand.logoType === 'vector_default' && (
                      <CheckCircle2 className="w-5 h-5 text-[#161C4D]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Design clássico da Brasil Legal com os 3 documentos dourados empilhados e tipografia estilizada.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
                    <Logo size="md" />
                  </div>
                </div>

                <div 
                  onClick={() => {
                    updateSection('brand', { logoType: 'custom_image' });
                    triggerSaveAlert();
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    config.brand.logoType === 'custom_image'
                      ? 'border-[#161C4D] bg-slate-50 ring-2 ring-[#161C4D]/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-slate-900">Logo Customizado (Claro & Escuro)</span>
                    {config.brand.logoType === 'custom_image' && (
                      <CheckCircle2 className="w-5 h-5 text-[#161C4D]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Defina imagens personalizadas para aplicação em fundos claros (Navbar) e fundos escuros (Rodapé).
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-center min-h-[56px] gap-3">
                    {config.brand.logoDarkUrl || config.brand.logoLightUrl || config.brand.customLogoUrl ? (
                      <div className="flex items-center gap-3">
                        {(config.brand.logoDarkUrl || config.brand.customLogoUrl) && (
                          <div className="flex flex-col items-center">
                            <img 
                              src={config.brand.logoDarkUrl || config.brand.customLogoUrl} 
                              alt="Logo Escuro" 
                              className="h-8 object-contain" 
                            />
                            <span className="text-[9px] text-slate-500 font-bold mt-1">Escuro</span>
                          </div>
                        )}
                        {config.brand.logoLightUrl && (
                          <div className="flex flex-col items-center bg-slate-900 px-2 py-1 rounded-md">
                            <img 
                              src={config.brand.logoLightUrl} 
                              alt="Logo Claro" 
                              className="h-6 object-contain" 
                            />
                            <span className="text-[9px] text-slate-300 font-bold mt-0.5">Claro</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Nenhum logo carregado</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Upload Controls when custom_image is selected */}
              {config.brand.logoType === 'custom_image' && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Grid of Dual Logos: Logo Escuro (Fundos Claros) & Logo Claro (Fundos Escuros) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* 1. LOGO ESCURO (Para Fundos Claros / Fundo Branco / Navbar) */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-slate-900 inline-block" />
                            <h4 className="font-bold text-sm text-slate-900">Logo Escuro</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                              Para Fundo Claro (Navbar)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Aplicado no menu de navegação, formulários e áreas com fundo branco ou claro.
                          </p>
                        </div>
                      </div>

                      {/* Mini Preview Box */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between min-h-[64px]">
                        <div className="flex items-center gap-3">
                          {config.brand.logoDarkUrl || config.brand.customLogoUrl ? (
                            <img
                              src={config.brand.logoDarkUrl || config.brand.customLogoUrl}
                              alt="Logo Escuro Prévia"
                              className="h-10 max-w-[140px] object-contain"
                            />
                          ) : (
                            <div className="text-xs text-slate-400 italic">Nenhuma imagem definida para fundo claro</div>
                          )}
                        </div>
                        {(config.brand.logoDarkUrl || config.brand.customLogoUrl) && (
                          <button
                            onClick={() => {
                              updateSection('brand', { logoDarkUrl: '', customLogoUrl: '' });
                              triggerSaveAlert();
                            }}
                            className="text-xs text-rose-600 hover:text-rose-800 font-semibold p-1 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            title="Remover Logo Escuro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Upload de Arquivo (PNG, SVG, WebP)
                          </label>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                            onChange={(e) => handleLogoFileUpload('dark', e)}
                            className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#161C4D] file:text-white hover:file:bg-[#252E75] file:cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Ou insira a URL direta da imagem:
                          </label>
                          <input
                            type="url"
                            placeholder="https://exemplo.com/logo-escuro.png"
                            value={config.brand.logoDarkUrl || ''}
                            onChange={(e) => {
                              updateSection('brand', { 
                                logoDarkUrl: e.target.value,
                                customLogoUrl: e.target.value 
                              });
                              triggerSaveAlert();
                            }}
                            className="w-full p-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. LOGO CLARO (Para Fundos Escuros / Fundo Noturno / Rodapé) */}
                    <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-white inline-block shadow-xs" />
                            <h4 className="font-bold text-sm text-white">Logo Claro</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200">
                              Para Fundo Escuro (Rodapé)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Aplicado no rodapé do site, cabeçalhos noturnos e áreas com fundo azul marinho ou preto.
                          </p>
                        </div>
                      </div>

                      {/* Mini Preview Box on Dark */}
                      <div 
                        className="p-3 rounded-xl border border-slate-700 flex items-center justify-between min-h-[64px]"
                        style={{ backgroundColor: config.colors.primaryDark || '#0C1033' }}
                      >
                        <div className="flex items-center gap-3">
                          {config.brand.logoLightUrl ? (
                            <img
                              src={config.brand.logoLightUrl}
                              alt="Logo Claro Prévia"
                              className="h-10 max-w-[140px] object-contain"
                            />
                          ) : (
                            <div className="text-xs text-slate-400 italic">Nenhuma imagem definida para fundo escuro</div>
                          )}
                        </div>
                        {config.brand.logoLightUrl && (
                          <button
                            onClick={() => {
                              updateSection('brand', { logoLightUrl: '' });
                              triggerSaveAlert();
                            }}
                            className="text-xs text-rose-400 hover:text-rose-300 font-semibold p-1 hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                            title="Remover Logo Claro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3 pt-2 text-slate-200">
                        <div>
                          <label className="text-xs font-semibold text-slate-200 block mb-1">
                            Upload de Arquivo (PNG transparente, SVG, WebP)
                          </label>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                            onChange={(e) => handleLogoFileUpload('light', e)}
                            className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-400 file:text-slate-950 hover:file:bg-amber-300 file:cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-200 block mb-1">
                            Ou insira a URL direta da imagem clara:
                          </label>
                          <input
                            type="url"
                            placeholder="https://exemplo.com/logo-claro-branco.png"
                            value={config.brand.logoLightUrl || ''}
                            onChange={(e) => {
                              updateSection('brand', { logoLightUrl: e.target.value });
                              triggerSaveAlert();
                            }}
                            className="w-full p-2 rounded-xl border border-slate-700 text-xs text-white bg-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* Logo Sizing / Scale Control */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Escala de Tamanho do Logotipo</span>
                  <span className="text-[11px] text-slate-500">Ajuste o tamanho visual do logotipo no cabeçalho e rodapé.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-bold">0.8x</span>
                  <input
                    type="range"
                    min="0.8"
                    max="1.5"
                    step="0.05"
                    value={config.brand.logoScale || 1}
                    onChange={(e) => {
                      updateSection('brand', { logoScale: parseFloat(e.target.value) });
                      triggerSaveAlert();
                    }}
                    className="w-36 accent-[#161C4D] cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 font-bold">1.5x</span>
                  <span className="text-xs font-black text-[#161C4D] bg-white px-2.5 py-1 rounded-lg border border-slate-200 min-w-[48px] text-center">
                    {(config.brand.logoScale || 1).toFixed(2)}x
                  </span>
                </div>
              </div>

              {/* Brand Slogan & Descriptor */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nome da Marca</label>
                    <input
                      type="text"
                      value={config.brand.name}
                      onChange={(e) => {
                        updateSection('brand', { name: e.target.value });
                        triggerSaveAlert();
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Descritor / Slogan Oficial</label>
                    <input
                      type="text"
                      value={config.brand.descriptor}
                      onChange={(e) => {
                        updateSection('brand', { descriptor: e.target.value });
                        triggerSaveAlert();
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="showDescriptor"
                    checked={config.brand.showDescriptor}
                    onChange={(e) => {
                      updateSection('brand', { showDescriptor: e.target.checked });
                      triggerSaveAlert();
                    }}
                    className="w-4 h-4 rounded text-[#161C4D] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="showDescriptor" className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Exibir descritor abaixo do logotipo no site
                  </label>
                </div>
              </div>

              {/* Live Preview Panel */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Prévia em Tempo Real no Site:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {config.brand.logoType === 'vector_default' ? 'Modo Vetorial Oficial' : 'Modo Imagem Personalizada'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center relative shadow-2xs">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-slate-900" />
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Fundo Claro (Ex: Navbar) • Logo Escuro
                      </span>
                    </div>
                    <Logo size="lg" />
                  </div>

                  <div 
                    className="p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-800 relative shadow-2xs"
                    style={{ backgroundColor: config.colors.primaryDark || '#0C1033' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-white" />
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                        Fundo Escuro (Ex: Rodapé) • Logo Claro
                      </span>
                    </div>
                    <Logo variant="white" size="lg" />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CORES & TEMA */}
        {/* ========================================================= */}
        {activeTab === 'colors' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Paleta de Cores do Site</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  As cores selecionadas são aplicadas instantaneamente em botões, tags, fundos e destaques visuais.
                </p>
              </div>

              {/* 1-Click Color Presets */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Paletas Pré-definidas (1 Clique):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = config.colors.presetName === preset.name;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => {
                          updateSection('colors', preset.colors);
                          triggerSaveAlert();
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-[#161C4D] bg-slate-50 ring-2 ring-[#161C4D]/15' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#161C4D]" />}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-lg shadow-2xs" style={{ backgroundColor: preset.colors.primaryNavy }} title="Primária" />
                          <div className="w-6 h-6 rounded-lg shadow-2xs" style={{ backgroundColor: preset.colors.primaryDark }} title="Fundo Escuro" />
                          <div className="w-6 h-6 rounded-lg shadow-2xs" style={{ backgroundColor: preset.colors.accentYellow }} title="Destaque" />
                          <div className="w-6 h-6 rounded-lg shadow-2xs" style={{ backgroundColor: preset.colors.successGreen }} title="Sucesso" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fine-Tuning Color Pickers */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <span className="text-xs font-bold text-slate-700 block">Ajuste Fino das Cores Hexadecimais:</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* Primary Navy */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">Cor Primária (Botões e Títulos)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.colors.primaryNavy}
                        onChange={(e) => {
                          updateSection('colors', { primaryNavy: e.target.value, presetName: 'Customizada' });
                          triggerSaveAlert();
                        }}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                      />
                      <input
                        type="text"
                        value={config.colors.primaryNavy}
                        onChange={(e) => {
                          updateSection('colors', { primaryNavy: e.target.value, presetName: 'Customizada' });
                          triggerSaveAlert();
                        }}
                        className="flex-1 p-2 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 uppercase"
                      />
                    </div>
                  </div>

                  {/* Primary Dark */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">Fundo Escuro (Rodapé e Topo)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.colors.primaryDark}
                        onChange={(e) => {
                          updateSection('colors', { primaryDark: e.target.value, presetName: 'Customizada' });
                          triggerSaveAlert();
                        }}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                      />
                      <input
                        type="text"
                        value={config.colors.primaryDark}
                        onChange={(e) => {
                          updateSection('colors', { primaryDark: e.target.value, presetName: 'Customizada' });
                          triggerSaveAlert();
                        }}
                        className="flex-1 p-2 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 uppercase"
                      />
                    </div>
                  </div>

                  {/* Accent Yellow */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">Cor de Destaque (Amarelo / Accent)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.colors.accentYellow}
                        onChange={(e) => {
                          updateSection('colors', { accentYellow: e.target.value, presetName: 'Customizada' });
                          triggerSaveAlert();
                        }}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                      />
                      <input
                        type="text"
                        value={config.colors.accentYellow}
                        onChange={(e) => {
                          updateSection('colors', { accentYellow: e.target.value, presetName: 'Customizada' });
                          triggerSaveAlert();
                        }}
                        className="flex-1 p-2 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 uppercase"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Theme Live Preview Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Amostra de Elementos com as Cores Atuais:
                </span>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow transition-all"
                    style={{ backgroundColor: config.colors.primaryNavy }}
                  >
                    Botão Primário
                  </button>

                  <button
                    className="px-5 py-2.5 rounded-xl text-slate-950 text-xs font-bold shadow transition-all"
                    style={{ backgroundColor: config.colors.accentYellow }}
                  >
                    Botão de Destaque
                  </button>

                  <div 
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ 
                      backgroundColor: `${config.colors.accentYellow}33`,
                      color: config.colors.primaryDark,
                    }}
                  >
                    Badge / Tag
                  </div>

                  <div 
                    className="p-3 rounded-xl text-white text-xs font-bold flex items-center gap-2"
                    style={{ backgroundColor: config.colors.primaryDark }}
                  >
                    <span>Fundo Escuro</span>
                    <span style={{ color: config.colors.accentYellow }}>• Destaque</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: TIPOGRAFIA & FONTES */}
        {/* ========================================================= */}
        {activeTab === 'fonts' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tipografia & Famílias de Fonte</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecione as fontes do Google Fonts para títulos e corpo de texto. O site atualiza imediatamente.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Heading Font */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">
                    Fonte dos Títulos (Display / Headings):
                  </label>
                  <div className="space-y-2">
                    {headingFontOptions.map((font) => {
                      const isSelected = config.fonts.headingFont === font;
                      return (
                        <div
                          key={font}
                          onClick={() => {
                            updateSection('fonts', { headingFont: font });
                            triggerSaveAlert();
                          }}
                          className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                            isSelected 
                              ? 'border-[#161C4D] bg-slate-50 ring-2 ring-[#161C4D]/10' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <span className="text-sm font-bold text-slate-900 block" style={{ fontFamily: font }}>
                              {font}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Regularize seu imóvel com agilidade
                            </span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#161C4D]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Body Font */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">
                    Fonte do Corpo de Texto (Body / Parágrafos):
                  </label>
                  <div className="space-y-2">
                    {bodyFontOptions.map((font) => {
                      const isSelected = config.fonts.bodyFont === font;
                      return (
                        <div
                          key={font}
                          onClick={() => {
                            updateSection('fonts', { bodyFont: font });
                            triggerSaveAlert();
                          }}
                          className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                            isSelected 
                              ? 'border-[#161C4D] bg-slate-50 ring-2 ring-[#161C4D]/10' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <span className="text-sm font-medium text-slate-900 block" style={{ fontFamily: font }}>
                              {font}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Engenharia, Direito Imobiliário e Inteligência Registral unificados.
                            </span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#161C4D]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Typographic Preview */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Amostra Tipográfica em Tempo Real:
                </span>
                
                <h2 
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                  style={{ fontFamily: config.fonts.headingFont }}
                >
                  Regularize seu imóvel e destrave o valor real do seu patrimônio.
                </h2>

                <p 
                  className="text-sm text-slate-600 leading-relaxed max-w-2xl"
                  style={{ fontFamily: config.fonts.bodyFont }}
                >
                  Engenharia, Direito Imobiliário e Inteligência Registral unificados em um só lugar. Elimine o risco de multas, libere financiamentos bancários e resolva pendências de Habite-se com segurança jurídica.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: TEXTOS DO SITE (CMS DE CONTEÚDO) */}
        {/* ========================================================= */}
        {activeTab === 'texts' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Textos & Conteúdo das Seções</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Edite os títulos, chamadas e informações de contato de toda a página.
                </p>
              </div>

              {/* Top Announcement Bar */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-[#161C4D] uppercase tracking-wider block">
                  1. Barra Superior de Anúncios & Plantão:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Badge de Destaque</label>
                    <input
                      type="text"
                      value={config.topBar.badgeText}
                      onChange={(e) => {
                        updateSection('topBar', { badgeText: e.target.value });
                        triggerSaveAlert();
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Texto de Foco Regional</label>
                    <input
                      type="text"
                      value={config.topBar.announcementText}
                      onChange={(e) => {
                        updateSection('topBar', { announcementText: e.target.value });
                        triggerSaveAlert();
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-[#161C4D] uppercase tracking-wider block">
                  2. Seção Principal (Hero):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Início do Título</label>
                    <input
                      type="text"
                      value={config.hero.headlinePre}
                      onChange={(e) => {
                        updateSection('hero', { headlinePre: e.target.value });
                        triggerSaveAlert();
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Texto Destacado (Amarelo)</label>
                    <input
                      type="text"
                      value={config.hero.headlineHighlight}
                      onChange={(e) => {
                        updateSection('hero', { headlineHighlight: e.target.value });
                        triggerSaveAlert();
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Fim do Título</label>
                    <input
                      type="text"
                      value={config.hero.headlinePost}
                      onChange={(e) => {
                        updateSection('hero', { headlinePost: e.target.value });
                        triggerSaveAlert();
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subtítulo / Proposta de Valor</label>
                  <textarea
                    rows={3}
                    value={config.hero.subheadline}
                    onChange={(e) => {
                      updateSection('hero', { subheadline: e.target.value });
                      triggerSaveAlert();
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Texto do Botão CTA Principal</label>
                    <input
                      type="text"
                      value={config.hero.ctaButtonText}
                      onChange={(e) => {
                        updateSection('hero', { ctaButtonText: e.target.value });
                        triggerSaveAlert();
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Texto do Botão Secundário</label>
                    <input
                      type="text"
                      value={config.hero.whatsappButtonText}
                      onChange={(e) => {
                        updateSection('hero', { whatsappButtonText: e.target.value });
                        triggerSaveAlert();
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Official Contacts */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-[#161C4D] uppercase tracking-wider block">
                  3. Canais de Contato & WhatsApp:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Número do WhatsApp (Apenas Números com DDD)
                    </label>
                    <input
                      type="text"
                      value={config.contact.whatsappNumber}
                      onChange={(e) => {
                        updateSection('contact', { whatsappNumber: e.target.value });
                        triggerSaveAlert();
                      }}
                      placeholder="5511999999999"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                    <span className="text-[10px] text-slate-400">Ex: 5511999999999 (Brasil = 55)</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Telefone Formatado para Exibição</label>
                    <input
                      type="text"
                      value={config.contact.whatsappDisplay}
                      onChange={(e) => {
                        updateSection('contact', { whatsappDisplay: e.target.value });
                        triggerSaveAlert();
                      }}
                      placeholder="(11) 99999-9999"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">E-mail de Contato Oficial</label>
                    <input
                      type="email"
                      value={config.contact.email}
                      onChange={(e) => {
                        updateSection('contact', { email: e.target.value });
                        triggerSaveAlert();
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Horário de Atendimento</label>
                    <input
                      type="text"
                      value={config.contact.hours}
                      onChange={(e) => {
                        updateSection('contact', { hours: e.target.value });
                        triggerSaveAlert();
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Legal Disclaimer & Footer */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-[#161C4D] uppercase tracking-wider block">
                  4. Rodapé & Aviso Jurídico:
                </span>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Texto Institucional (Sobre nós)</label>
                  <textarea
                    rows={2}
                    value={config.footer.aboutText}
                    onChange={(e) => {
                      updateSection('footer', { aboutText: e.target.value });
                      triggerSaveAlert();
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Aviso de Responsabilidade Técnica & Registral</label>
                  <textarea
                    rows={3}
                    value={config.footer.disclaimerText}
                    onChange={(e) => {
                      updateSection('footer', { disclaimerText: e.target.value });
                      triggerSaveAlert();
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: VÍDEO INSTITUCIONAL */}
        {/* ========================================================= */}
        {activeTab === 'video' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Seção de Vídeo Institucional</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adicione um vídeo explicativo da Brasil Legal (YouTube, Vimeo ou link de vídeo direto).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Exibir no Site:</span>
                  <input
                    type="checkbox"
                    checked={config.video.enabled}
                    onChange={(e) => {
                      updateSection('video', { enabled: e.target.checked });
                      triggerSaveAlert();
                    }}
                    className="w-5 h-5 rounded text-[#161C4D] cursor-pointer"
                  />
                </div>
              </div>

              {config.video.enabled && (
                <div className="space-y-4">
                  
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Link do Vídeo (YouTube, Vimeo ou arquivo .MP4) *
                    </label>
                    <input
                      type="url"
                      value={config.video.videoUrl}
                      onChange={(e) => {
                        updateSection('video', { videoUrl: e.target.value });
                        triggerSaveAlert();
                      }}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Compatível com links padrão (youtube.com/watch?v=...), encurtados (youtu.be/...), shorts e Vimeo.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Título da Apresentação</label>
                      <input
                        type="text"
                        value={config.video.title}
                        onChange={(e) => {
                          updateSection('video', { title: e.target.value });
                          triggerSaveAlert();
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Texto do Botão Play</label>
                      <input
                        type="text"
                        value={config.video.buttonText}
                        onChange={(e) => {
                          updateSection('video', { buttonText: e.target.value });
                          triggerSaveAlert();
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Subtítulo / Descrição do Vídeo</label>
                    <textarea
                      rows={2}
                      value={config.video.subtitle}
                      onChange={(e) => {
                        updateSection('video', { subtitle: e.target.value });
                        triggerSaveAlert();
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Imagem de Capa / Thumbnail Personalizada (Opcional)
                    </label>
                    <input
                      type="url"
                      value={config.video.thumbnailUrl}
                      onChange={(e) => {
                        updateSection('video', { thumbnailUrl: e.target.value });
                        triggerSaveAlert();
                      }}
                      placeholder="https://exemplo.com/capa-video.jpg"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                    />
                  </div>

                  {/* Live Video Embed Preview */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Prévia do Player do Vídeo:</span>
                    <div className="max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-300 shadow-md">
                      {videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' ? (
                        <iframe
                          src={videoInfo.embedUrl.replace('autoplay=1', 'autoplay=0')}
                          title="Preview"
                          className="w-full h-full border-0"
                          allowFullScreen
                        />
                      ) : videoInfo.type === 'mp4' ? (
                        <video src={videoInfo.embedUrl} controls className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                          <Play className="w-8 h-8 mb-2 opacity-50" />
                          <span>Insira um link válido do YouTube para pré-visualizar.</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: GESTÃO DO FAQ */}
        {/* ========================================================= */}
        {activeTab === 'faq' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Perguntas Frequentes (FAQ)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adicione, edite ou remova as dúvidas técnicas que aparecem para os clientes.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingFaq({
                      question: '',
                      answer: '',
                      category: 'geral',
                    });
                    setIsAddingFaq(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#161C4D] hover:bg-[#252E75] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Nova Pergunta</span>
                </button>
              </div>

              {/* FAQ List */}
              <div className="space-y-3">
                {config.faq.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.question}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
                        {item.answer}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingFaq(item);
                          setIsAddingFaq(false);
                        }}
                        className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                        title="Editar pergunta"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Editar</span>
                      </button>

                      <button
                        onClick={() => handleDeleteFaqItem(item.id)}
                        className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                        title="Excluir pergunta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Modal / Editor */}
              {editingFaq && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <h3 className="text-base font-bold text-slate-900">
                        {isAddingFaq ? 'Criar Nova Pergunta no FAQ' : 'Editar Pergunta do FAQ'}
                      </h3>
                      <button onClick={() => setEditingFaq(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveFaqItem} className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Categoria</label>
                        <select
                          value={editingFaq.category}
                          onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value as any })}
                          className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                        >
                          <option value="geral">Geral</option>
                          <option value="engenharia">Engenharia & Habite-se</option>
                          <option value="juridico">Jurídico & Cartorial</option>
                          <option value="financeiro">Financeiro / SERO / INSS</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Pergunta *</label>
                        <input
                          type="text"
                          required
                          value={editingFaq.question}
                          onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                          placeholder="Ex: Quanto tempo demora a emissão do Habite-se?"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Resposta Clara & Didática *</label>
                        <textarea
                          rows={4}
                          required
                          value={editingFaq.answer}
                          onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                          placeholder="Explique o processo com transparência..."
                        />
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingFaq(null)}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#161C4D] hover:bg-[#252E75] text-white font-bold"
                        >
                          Salvar Pergunta
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: BACKUP, RESTAURAÇÃO & PADRÕES */}
        {/* ========================================================= */}
        {activeTab === 'backup' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Backup, Importação e Restauração</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proteja suas configurações ou restaure os valores visuais e textuais originais da marca.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Export Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-[#161C4D] font-bold text-sm">
                    <Download className="w-5 h-5 text-amber-500" />
                    <span>Exportar Configurações (.JSON)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Baixe um arquivo contendo todas as cores, fontes, textos, vídeos e configurações do site para arquivamento ou transferência.
                  </p>
                  <button
                    onClick={exportConfigJson}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#161C4D] hover:bg-[#252E75] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Baixar Arquivo JSON de Backup</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-[#161C4D] font-bold text-sm">
                    <Upload className="w-5 h-5 text-emerald-600" />
                    <span>Importar Backup (.JSON)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Restaure um arquivo JSON salvo anteriormente para aplicar instantaneamente todas as preferências.
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const content = event.target?.result as string;
                          if (content && importConfigJson(content)) {
                            alert('Configurações importadas com sucesso!');
                          } else {
                            alert('Arquivo JSON inválido.');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white file:text-slate-800 file:border file:border-slate-300 hover:file:bg-slate-100 file:cursor-pointer"
                  />
                </div>

              </div>

              {/* Danger / Reset Area */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>Zona de Restauração de Padrões</span>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Caso tenha feito alterações indesejadas e queira retornar à identidade visual, cores e textos oficiais originais da Brasil Legal, utilize a restauração abaixo.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={resetToDefaults}
                      className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restaurar Padrões da Brasil Legal</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Deseja recarregar a lista de leads com dados de exemplo da região CIMBAJU?')) {
                          localStorage.removeItem('brasil_legal_leads');
                          loadLeads();
                          alert('Leads de demonstração recarregados!');
                        }
                      }}
                      className="py-2.5 px-4 rounded-xl bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Recarregar Leads de Exemplo (CIMBAJU)
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: INTEGRAÇÃO GITHUB */}
        {/* ========================================================= */}
        {activeTab === 'github' && <GitHubIntegrationTab />}

      </main>

    </div>
  );
};
