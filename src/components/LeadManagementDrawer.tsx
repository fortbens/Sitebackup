import React, { useState, useEffect } from 'react';
import { 
  Users, 
  X, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  FileText,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { StoredLead } from '../types';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger?: number;
}

export const LeadManagementDrawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  refreshTrigger = 0,
}) => {
  const [leads, setLeads] = useState<StoredLead[]>([]);

  const loadLeads = () => {
    try {
      const data = localStorage.getItem('brasil_legal_leads');
      if (data) {
        setLeads(JSON.parse(data));
      } else {
        // Seed with sample initial inquiry for preview realism
        const initialSample: StoredLead[] = [
          {
            id: 'demo_1',
            propertyType: 'casa',
            irregularities: ['construcao_nao_averbada', 'sem_habite_se'],
            location: 'caieiras',
            urgency: 'venda_urgente',
            estimatedValue: 750000,
            hasPlanta: true,
            name: 'Ricardo Silveira',
            phone: '(11) 98765-4321',
            email: 'ricardo.silveira@email.com',
            notes: 'Casa ampliada no bairro Serpa em Caieiras com piscina e edícula não averbadas. Comprador quer financiar pela Caixa.',
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            status: 'novo',
          },
          {
            id: 'demo_2',
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
          },
        ];
        setLeads(initialSample);
        localStorage.setItem('brasil_legal_leads', JSON.stringify(initialSample));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLeads();
    }
  }, [isOpen, refreshTrigger]);

  const updateStatus = (id: string, newStatus: StoredLead['status']) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
    setLeads(updated);
    localStorage.setItem('brasil_legal_leads', JSON.stringify(updated));
  };

  const deleteLead = (id: string) => {
    if (confirm('Deseja excluir este lead?')) {
      const updated = leads.filter((l) => l.id !== id);
      setLeads(updated);
      localStorage.setItem('brasil_legal_leads', JSON.stringify(updated));
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) {
      alert('Nenhum lead para exportar.');
      return;
    }

    const headers = ['Data', 'Nome', 'Telefone', 'Email', 'Local', 'Tipo Imóvel', 'Valor Estimado', 'Status', 'Observações'];
    const rows = leads.map((l) => [
      new Date(l.createdAt).toLocaleDateString('pt-BR'),
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.location}"`,
      `"${l.propertyType}"`,
      l.estimatedValue,
      `"${l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_brasil_legal_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-5 bg-[#0C1033] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-400 text-slate-950">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Painel de Leads & Diagnósticos</h3>
              <p className="text-xs text-slate-400">
                {leads.length} solicitação(ões) capturada(s)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Leads List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          {leads.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm">Nenhum lead recebido ainda.</p>
              <p className="text-xs text-slate-400 mt-1">Preencha o formulário de diagnóstico na página para testar.</p>
            </div>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <span>{lead.name}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        lead.status === 'novo' ? 'bg-amber-100 text-amber-900' :
                        lead.status === 'em_contato' ? 'bg-blue-100 text-blue-900' :
                        'bg-emerald-100 text-emerald-900'
                      }`}>
                        {lead.status === 'novo' ? 'Novo Lead' :
                         lead.status === 'em_contato' ? 'Em Contato' : 'Proposta'}
                      </span>
                    </h4>
                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span className="capitalize">{lead.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="text-slate-300 hover:text-rose-500 p-1"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Tipo & Valor</span>
                    <span className="font-semibold text-slate-800 capitalize">{lead.propertyType}</span> • R$ {lead.estimatedValue.toLocaleString('pt-BR')}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Urgência</span>
                    <span className="font-semibold text-slate-800">{lead.urgency.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                {/* Notes if any */}
                {lead.notes && (
                  <p className="text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100 italic">
                    "{lead.notes}"
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(lead.name)}%2C%20aqui%20%C3%A9%20da%20Brasil%20Legal.%20Recebemos%20sua%20solicita%C3%A7%C3%A3o%20de%20diagn%C3%B3stico%20para%20o%20im%C3%B3vel%20em%20${encodeURIComponent(lead.location)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{lead.phone}</span>
                    </a>

                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">E-mail</span>
                      </a>
                    )}
                  </div>

                  {/* Status toggle */}
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value as StoredLead['status'])}
                    className="text-xs py-1 px-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
                  >
                    <option value="novo">Novo</option>
                    <option value="em_contato">Em Contato</option>
                    <option value="proposta_enviada">Proposta</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Dados salvos localmente de forma segura.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
