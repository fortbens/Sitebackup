import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Phone, 
  Save, 
  LogOut, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Eye, 
  EyeOff, 
  Upload, 
  RotateCcw,
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminUser, SecurityLog } from '../../types';

interface AdminProfileTabProps {
  onLogout: () => void;
}

export const AdminProfileTab: React.FC<AdminProfileTabProps> = ({ onLogout }) => {
  const { currentUser, updateProfile, changePassword, resetDefaultCredentials, securityLogs } = useAuth();

  // Profile Form State
  const [name, setName] = useState(currentUser?.name || 'Diretoria Técnica');
  const [role, setRole] = useState(currentUser?.role || 'Administrador do Sistema');
  const [email, setEmail] = useState(currentUser?.email || 'admin@brasillegal.imb.br');
  const [username, setUsername] = useState(currentUser?.username || 'admin');
  const [phone, setPhone] = useState(currentUser?.phone || '(11) 98765-4321');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Status Alerts
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    if (!name.trim() || !email.trim() || !username.trim()) {
      setProfileErrorMsg('Nome, usuário e e-mail são obrigatórios.');
      return;
    }

    const res = await updateProfile({
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      username: username.trim(),
      phone: phone.trim(),
      avatarUrl: avatarUrl.trim(),
    });

    if (res.success) {
      setProfileSuccessMsg('Dados do perfil de administrador salvos com sucesso!');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    } else {
      setProfileErrorMsg(res.error || 'Erro ao atualizar perfil.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccessMsg('');
    setPassErrorMsg('');

    if (!currentPassword) {
      setPassErrorMsg('Informe sua senha atual para autorizar a alteração.');
      return;
    }

    if (newPassword.length < 6) {
      setPassErrorMsg('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassErrorMsg('A confirmação da nova senha não confere.');
      return;
    }

    const res = await changePassword(currentPassword, newPassword);

    if (res.success) {
      setPassSuccessMsg('Senha de administrador alterada e recriptografada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccessMsg(''), 4000);
    } else {
      setPassErrorMsg(res.error || 'Falha ao alterar senha.');
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('A foto deve ter no máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetFactory = async () => {
    if (
      confirm(
        'ATENÇÃO: Deseja redefinir as credenciais de administrador para o padrão de fábrica?\nUsuário: admin@brasillegal.imb.br\nSenha: brasillegal2025'
      )
    ) {
      await resetDefaultCredentials();
      alert('Credenciais redefinidas com sucesso.');
    }
  };

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: 'Fraca', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Média', color: 'bg-amber-500' };
    return { score: 3, label: 'Forte (Recomendada)', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Info Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-md">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{name.charAt(0)}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-white shadow-xs" title="Sessão Ativa">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                Administrador
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{role}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Último acesso: {currentUser?.lastLogin ? new Date(currentUser.lastLogin).toLocaleString('pt-BR') : 'Sessão atual'}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Encerrar Sessão (Logout)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile Details Edit Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
            <User className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Dados do Perfil de Administrador
            </h3>
          </div>

          {profileSuccessMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          {profileErrorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{profileErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome de Exibição
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dr. Roberto Guimarães"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-400 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cargo / Título Institucional
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex: Diretor Técnico & Gestor Geral"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-400 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Usuário de Login (ID)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-400 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-mail Oficial
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@brasillegal.imb.br"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-400 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-400 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Foto de Perfil / Avatar
              </label>
              <div className="flex items-center gap-3">
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer border border-slate-200">
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>Carregar Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Ou cole uma URL de imagem..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-hidden"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#161C4D] hover:bg-[#0C1033] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>Salvar Alterações de Perfil</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password & Cryptographic Protection Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
              <KeyRound className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Proteção & Alteração de Senha
                </h3>
                <span className="text-[11px] text-slate-500">
                  Criptografia SHA-256 local com Salt e proteção anti-força bruta
                </span>
              </div>
            </div>

            {passSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passSuccessMsg}</span>
              </div>
            )}

            {passErrorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Senha Atual *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite a senha atual"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-400 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nova Senha * (Mínimo 6 caracteres)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite a nova senha segura"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-400 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Força da Senha:</span>
                      <span className="font-bold text-slate-800">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirmar Nova Senha *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-400 outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Atualizar e Criptografar Senha</span>
                </button>
              </div>
            </form>
          </div>

          {/* Factory Reset Danger Zone */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Esqueceu a senha mestra?</span>
            <button
              onClick={handleResetFactory}
              className="text-amber-700 hover:text-amber-900 font-semibold underline underline-offset-2 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Redefinir Credenciais de Fábrica</span>
            </button>
          </div>
        </div>

      </div>

      {/* Security Audit Logs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Histórico de Auditoria & Atividades de Segurança
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Registro das últimas tentativas e acessos
          </span>
        </div>

        {securityLogs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            Nenhum evento registrado ainda.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {securityLogs.map((log) => {
              const isSuccess = log.action === 'login_success' || log.action === 'password_changed';
              const isFail = log.action === 'login_failed' || log.action === 'lockout';
              return (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isSuccess ? 'bg-emerald-500' : isFail ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                    />
                    <span className="text-slate-800 font-medium">{log.details}</span>
                  </div>
                  <span className="text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
