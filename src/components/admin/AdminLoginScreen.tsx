import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  AlertCircle, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  Check, 
  Copy,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { Logo } from '../Logo';

interface AdminLoginScreenProps {
  onBackToSite: () => void;
  onLoginSuccess?: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onBackToSite, onLoginSuccess }) => {
  const { login, failedAttempts, lockoutTimeRemaining } = useAuth();
  const { config } = useSiteConfig();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Informe o usuário/e-mail e a senha de administrador.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(identifier, password, rememberMe);
      if (!res.success) {
        setErrorMessage(res.error || 'Falha na autenticação.');
      } else {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } catch {
      setErrorMessage('Ocorreu um erro ao processar o login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setIdentifier('admin@brasillegal.imb.br');
    setPassword('brasillegal2025');
    setErrorMessage('');
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLocked = lockoutTimeRemaining > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Dynamic Background Accents */}
      <div 
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{ backgroundColor: config.colors.primaryNavy || '#161C4D' }}
      />
      <div 
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ backgroundColor: config.colors.accentYellow || '#F8C908' }}
      />

      {/* Top Bar Header with Return Button */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Retornar ao Site Público</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline font-medium">Ambiente Protegido com Criptografia SHA-256</span>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          
          {/* Brand Logo & Heading */}
          <div className="text-center mb-8">
            <div className="inline-block mb-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
              <Logo size="md" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-3">
              <Lock className="w-3 h-3" />
              <span>Painel de Gestão</span>
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">
              Acesso Administrativo
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Controle de leads, personalização visual da marca, gestão da equipe multidisciplinar e configurações.
            </p>
          </div>

          {/* Lockout Notification if locked */}
          {isLocked ? (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 animate-pulse">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    Acesso Temporariamente Bloqueado
                  </h4>
                  <p className="text-xs text-rose-200/90 mt-0.5">
                    Múltiplas tentativas incorretas consecutivas. Aguarde a liberação do sistema de segurança:
                  </p>
                  <p className="text-lg font-black text-white mt-1 font-mono">
                    {formatTime(lockoutTimeRemaining)}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Error Message */}
          {errorMessage && !isLocked && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in-50">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Usuário ou E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLocked || isLoading}
                  placeholder="admin@brasillegal.imb.br ou admin"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-sm text-white placeholder-slate-500 transition-all outline-hidden disabled:opacity-50"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Senha de Administrador
                </label>
                {failedAttempts > 0 && !isLocked && (
                  <span className="text-[11px] text-amber-400 font-semibold">
                    {5 - failedAttempts} tentativa(s) restante(s)
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked || isLoading}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-slate-950/80 border border-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-sm text-white placeholder-slate-500 transition-all outline-hidden disabled:opacity-50"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Security Policy */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLocked || isLoading}
                  className="w-4 h-4 rounded-sm border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400/20 focus:ring-offset-0"
                />
                <span>Lembrar neste navegador</span>
              </label>

              <span className="text-slate-500 text-[11px]">Sessão Segura</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLocked || isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-lg hover:shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Acessar Painel Administrativo</span>
                </>
              )}
            </button>
          </form>

          {/* Default Credentials Helper Card for seamless test & access */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/60 text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Credenciais de Acesso Inicial</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer"
                >
                  Preencher dados
                </button>
              </div>

              <div className="space-y-1.5 text-slate-300 text-[11px] font-mono">
                <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <span><strong>Usuário:</strong> admin@brasillegal.imb.br</span>
                  <button
                    onClick={() => handleCopy('admin@brasillegal.imb.br', 'user')}
                    className="text-slate-400 hover:text-white ml-2 p-1"
                    title="Copiar usuário"
                  >
                    {copiedField === 'user' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <span><strong>Senha:</strong> brasillegal2025</span>
                  <button
                    onClick={() => handleCopy('brasillegal2025', 'pass')}
                    className="text-slate-400 hover:text-white ml-2 p-1"
                    title="Copiar senha"
                  >
                    {copiedField === 'pass' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                <Info className="w-3 h-3 shrink-0" />
                <span>Você pode alterar o usuário, e-mail e senha na aba "Perfil & Segurança" após o login.</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-600 text-xs relative z-10">
        <p>© {new Date().getFullYear()} BRASIL LEGAL — Regularização Imobiliária Integrada. Acesso confidencial autorizado.</p>
      </footer>

    </div>
  );
};
