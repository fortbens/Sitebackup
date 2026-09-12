import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  X, 
  ShieldCheck, 
  Scale, 
  Compass, 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { TeamMember } from '../../types';

import photoCarlos from '../../assets/images/team_lawyer_carlos_1789239401585.jpg';
import photoGabriela from '../../assets/images/team_engineer_gabriela_1789239411935.jpg';
import photoMarcelo from '../../assets/images/team_architect_marcelo_1789239422294.jpg';
import photoVanessa from '../../assets/images/team_notary_vanessa_1789239431968.jpg';

const PRESET_PORTRAITS = [
  { label: 'Advogado Dr. Carlos', url: photoCarlos },
  { label: 'Engenheira Engª Gabriela', url: photoGabriela },
  { label: 'Arquiteto Arq. Marcelo', url: photoMarcelo },
  { label: 'Consultora Dra. Vanessa', url: photoVanessa },
];

export const TeamManagerTab: React.FC = () => {
  const { config, updateSection } = useSiteConfig();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const team = config.team || [];

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleTeamSection = (enabled: boolean) => {
    updateSection('teamSection', { enabled });
    triggerNotification(`Seção da equipe ${enabled ? 'ativada' : 'desativada'} no site.`);
  };

  const handleOpenAdd = () => {
    setEditingMember({
      id: `team_${Date.now()}`,
      name: '',
      role: '',
      credential: '',
      pillar: 'juridico',
      bio: '',
      specialties: [],
      photoUrl: photoCarlos,
      email: '',
      whatsapp: '',
      featured: true,
      displayOrder: team.length + 1,
    });
    setIsAddingMember(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsAddingMember(false);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    if (!editingMember.name.trim() || !editingMember.role.trim()) {
      alert('Preencha ao menos o nome e o cargo do especialista.');
      return;
    }

    let updatedTeam: TeamMember[];
    if (isAddingMember) {
      updatedTeam = [...team, editingMember];
      triggerNotification('Novo especialista adicionado à equipe com sucesso!');
    } else {
      updatedTeam = team.map((m) => (m.id === editingMember.id ? editingMember : m));
      triggerNotification('Dados do especialista atualizados com sucesso!');
    }

    updateSection('team', updatedTeam);
    setEditingMember(null);
    setIsAddingMember(false);
  };

  const handleDeleteMember = (id: string) => {
    const member = team.find((m) => m.id === id);
    if (confirm(`Tem certeza que deseja remover ${member?.name || 'este especialista'} da equipe?`)) {
      const updated = team.filter((m) => m.id !== id);
      updateSection('team', updated);
      triggerNotification('Especialista removido da equipe.');
    }
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= team.length) return;

    const updated = [...team];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    // Re-assign displayOrder
    const reordered = updated.map((m, idx) => ({ ...m, displayOrder: idx + 1 }));
    updateSection('team', reordered);
    triggerNotification('Ordem dos especialistas atualizada.');
  };

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve possuir no máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result && editingMember) {
        setEditingMember({ ...editingMember, photoUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const getPillarColor = (pillar: TeamMember['pillar']) => {
    switch (pillar) {
      case 'juridico':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'engenharia':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'urbanistico':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cartorial':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Overview Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Equipe Multidisciplinar de Especialistas
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Gerencie os engenheiros, advogados notariais, arquitetos e consultores cartorários exibidos tanto no site quanto nas consultas de diagnóstico.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-[#161C4D] hover:bg-[#0C1033] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Adicionar Novo Especialista</span>
            </button>
          </div>
        </div>

        {/* Section Visibility & Display Settings */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Exibir Seção no Site</span>
              <span className="text-[11px] text-slate-500">Habilita ou oculta o bloco "Nossa Equipe"</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.teamSection.enabled}
                onChange={(e) => handleToggleTeamSection(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Título da Seção</label>
              <input
                type="text"
                value={config.teamSection.title}
                onChange={(e) => updateSection('teamSection', { title: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge Superior</label>
              <input
                type="text"
                value={config.teamSection.badgeText}
                onChange={(e) => updateSection('teamSection', { badgeText: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Membros Cadastrados ({team.length})
          </h3>
          <span className="text-xs text-slate-500">
            Arraste ou use as setas para definir a ordem de exibição no site
          </span>
        </div>

        {team.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">Nenhum membro cadastrado</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Clique no botão abaixo para adicionar o primeiro especialista.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Especialista</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={member.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs group"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative mb-4">
                    <div className="aspect-square w-28 h-28 mx-auto rounded-2xl overflow-hidden border-2 border-slate-200 group-hover:border-amber-400 transition-colors shadow-xs bg-slate-200">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover object-center"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white font-bold text-2xl">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-amber-400 whitespace-nowrap shadow-xs">
                      {member.credential || 'Registro'}
                    </span>
                  </div>

                  {/* Pillar Badge */}
                  <div className="text-center mt-3 mb-1">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPillarColor(member.pillar)}`}>
                      {member.pillar.toUpperCase()}
                    </span>
                  </div>

                  {/* Name and Role */}
                  <div className="text-center">
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                      {member.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {member.role}
                    </p>
                  </div>

                  {/* Bio Preview */}
                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-3 text-center leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Specialties Pills */}
                  {member.specialties && member.specialties.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1 justify-center">
                      {member.specialties.slice(0, 3).map((spec, i) => (
                        <span key={i} className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Bottom Bar */}
                <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(index, 'down')}
                      disabled={index === team.length - 1}
                      className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="px-2 py-1 rounded bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3 h-3 text-amber-600" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-1 rounded text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 cursor-pointer transition-colors"
                      title="Excluir especialista"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Add Team Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isAddingMember ? 'Adicionar Novo Especialista' : `Editar: ${editingMember.name}`}
                </h3>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="mt-6 space-y-5">
              
              {/* Photo Management Section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">
                  Foto do Especialista
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-sm shrink-0 bg-slate-200">
                    {editingMember.photoUrl ? (
                      <img
                        src={editingMember.photoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Upload or Preset Options */}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        <span>Carregar Foto (PNG/JPG)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Ou selecione um dos retratos profissionais pré-carregados:
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {PRESET_PORTRAITS.map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditingMember({ ...editingMember, photoUrl: preset.url })}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
                            editingMember.photoUrl === preset.url
                              ? 'bg-amber-400 text-slate-950 border-amber-400'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Check className={`w-3 h-3 ${editingMember.photoUrl === preset.url ? 'inline' : 'hidden'}`} />
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Image URL Input */}
                    <div className="pt-1">
                      <input
                        type="url"
                        placeholder="Ou cole uma URL externa de imagem (https://...)"
                        value={editingMember.photoUrl.startsWith('data:') ? '' : editingMember.photoUrl}
                        onChange={(e) => setEditingMember({ ...editingMember, photoUrl: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    placeholder="Ex: Dr. Carlos Eduardo Medeiros"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cargo / Especialidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    placeholder="Ex: Diretor Jurídico & Notarial"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registro Profissional (OAB, CREA, CAU) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.credential}
                    onChange={(e) => setEditingMember({ ...editingMember, credential: e.target.value })}
                    placeholder="Ex: OAB/SP 312.450 ou CREA-SP 506.918"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilar Institucional
                  </label>
                  <select
                    value={editingMember.pillar}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        pillar: e.target.value as TeamMember['pillar'],
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-hidden"
                  >
                    <option value="juridico">Direito Imobiliário & Notarial</option>
                    <option value="engenharia">Engenharia Civil & As-Built</option>
                    <option value="urbanistico">Arquitetura & Urbanismo</option>
                    <option value="cartorial">Inteligência Cartorial</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Biografia / Resumo Profissional
                </label>
                <textarea
                  rows={3}
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  placeholder="Descreva a experiência, atuação nos cartórios locais da região e diferencial técnico..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-hidden leading-relaxed"
                />
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Especialidades Principais (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={editingMember.specialties?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      specialties: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Ex: Usucapião Extrajudicial, Adjudicação Compulsória, Projetos As-Built"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-hidden"
                />
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mail Direto (Opcional)
                  </label>
                  <input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                    placeholder="especialista@brasillegal.imb.br"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Direto (Opcional)
                  </label>
                  <input
                    type="text"
                    value={editingMember.whatsapp || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, whatsapp: e.target.value })}
                    placeholder="5511999999999"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-hidden"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#161C4D] hover:bg-[#0C1033] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Salvar Especialista
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
