import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, SecurityLog } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<AdminUser>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetDefaultCredentials: () => Promise<void>;
  securityLogs: SecurityLog[];
  failedAttempts: number;
  lockoutTimeRemaining: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_CREDENTIALS_KEY = 'brasil_legal_auth_credentials';
const AUTH_SESSION_KEY = 'brasil_legal_auth_session';
const SECURITY_LOGS_KEY = 'brasil_legal_security_logs';
const FAILED_ATTEMPTS_KEY = 'brasil_legal_failed_attempts';
const LOCKOUT_UNTIL_KEY = 'brasil_legal_lockout_until';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 180; // 3 minutes lockout on brute-force

// Helper: Hash password with SHA-256 + salt using Web Crypto API
async function hashWithSalt(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${password}:${salt}:brasil_legal_secure_token`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

const DEFAULT_SALT = 'bl_salt_98e1f0c24a73b';
const DEFAULT_INITIAL_PASSWORD = 'brasillegal2025';

const DEFAULT_ADMIN_USER: AdminUser = {
  id: 'admin_primary',
  username: 'admin',
  email: 'admin@brasillegal.imb.br',
  name: 'Diretoria Técnica Brasil Legal',
  role: 'Administrador do Sistema & Gestor Imobiliário',
  avatarUrl: '',
  phone: '(11) 98765-4321',
  createdAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number>(0);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState<number>(0);

  // Initialize and check credentials setup
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Load security logs
        const storedLogs = localStorage.getItem(SECURITY_LOGS_KEY);
        if (storedLogs) {
          setSecurityLogs(JSON.parse(storedLogs));
        }

        // Check credentials existence; if none, seed default credentials
        let creds = localStorage.getItem(AUTH_CREDENTIALS_KEY);
        if (!creds) {
          const hash = await hashWithSalt(DEFAULT_INITIAL_PASSWORD, DEFAULT_SALT);
          const initialData = {
            salt: DEFAULT_SALT,
            passwordHash: hash,
            user: DEFAULT_ADMIN_USER,
          };
          localStorage.setItem(AUTH_CREDENTIALS_KEY, JSON.stringify(initialData));
        }

        // Check lockout state
        const storedLockout = localStorage.getItem(LOCKOUT_UNTIL_KEY);
        if (storedLockout) {
          const lockTime = parseInt(storedLockout, 10);
          if (lockTime > Date.now()) {
            setLockoutUntil(lockTime);
          } else {
            localStorage.removeItem(LOCKOUT_UNTIL_KEY);
            localStorage.removeItem(FAILED_ATTEMPTS_KEY);
          }
        }

        const storedAttempts = localStorage.getItem(FAILED_ATTEMPTS_KEY);
        if (storedAttempts) {
          setFailedAttempts(parseInt(storedAttempts, 10));
        }

        // Check active session (sessionStorage or localStorage)
        const session = localStorage.getItem(AUTH_SESSION_KEY) || sessionStorage.getItem(AUTH_SESSION_KEY);
        if (session) {
          const parsed = JSON.parse(session);
          // Check expiration (24 hours validity)
          if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
            setCurrentUser(parsed.user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem(AUTH_SESSION_KEY);
            sessionStorage.removeItem(AUTH_SESSION_KEY);
          }
        }
      } catch (err) {
        console.error('Auth initialization error', err);
      }
    };

    initAuth();
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutUntil <= Date.now()) {
      setLockoutTimeRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutTimeRemaining(remaining);
      if (remaining <= 0) {
        setLockoutUntil(0);
        setFailedAttempts(0);
        localStorage.removeItem(LOCKOUT_UNTIL_KEY);
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const addSecurityLog = (action: SecurityLog['action'], details: string) => {
    const newLog: SecurityLog = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    setSecurityLogs((prev) => {
      const updated = [newLog, ...prev].slice(0, 50); // Keep last 50 logs
      localStorage.setItem(SECURITY_LOGS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const login = async (
    identifier: string,
    password: string,
    rememberMe: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    // Check if locked out
    if (lockoutUntil > Date.now()) {
      const secondsLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
      return {
        success: false,
        error: `Acesso temporariamente bloqueado por motivos de segurança. Tente novamente em ${secondsLeft} segundos.`,
      };
    }

    const trimmedId = identifier.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedId || !trimmedPass) {
      return { success: false, error: 'Por favor, informe o usuário/e-mail e a senha.' };
    }

    try {
      const rawCreds = localStorage.getItem(AUTH_CREDENTIALS_KEY);
      if (!rawCreds) {
        return { success: false, error: 'Erro de sistema: credenciais não inicializadas.' };
      }

      const creds = JSON.parse(rawCreds);
      const computedHash = await hashWithSalt(trimmedPass, creds.salt);

      const isValidUser =
        trimmedId === creds.user.username.toLowerCase() ||
        trimmedId === creds.user.email.toLowerCase();

      const isValidPass = computedHash === creds.passwordHash;

      if (!isValidUser || !isValidPass) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        localStorage.setItem(FAILED_ATTEMPTS_KEY, nextAttempts.toString());

        addSecurityLog(
          'login_failed',
          `Tentativa inválida para o usuário "${trimmedId}". Tentativa ${nextAttempts} de ${MAX_FAILED_ATTEMPTS}.`
        );

        if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_DURATION_SECONDS * 1000;
          setLockoutUntil(lockTime);
          localStorage.setItem(LOCKOUT_UNTIL_KEY, lockTime.toString());
          addSecurityLog(
            'lockout',
            `Bloqueio temporário ativado após ${MAX_FAILED_ATTEMPTS} tentativas consecutivas incorretas.`
          );
          return {
            success: false,
            error: `Múltiplas tentativas incorretas. Acesso bloqueado por segurança por ${LOCKOUT_DURATION_SECONDS / 60} minutos.`,
          };
        }

        const remainingTries = MAX_FAILED_ATTEMPTS - nextAttempts;
        return {
          success: false,
          error: `Credenciais incorretas. Você possui mais ${remainingTries} tentativa${remainingTries === 1 ? '' : 's'} antes do bloqueio.`,
        };
      }

      // Success: Reset failed attempts & lockout
      setFailedAttempts(0);
      setLockoutUntil(0);
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_UNTIL_KEY);

      const updatedUser: AdminUser = {
        ...creds.user,
        lastLogin: new Date().toISOString(),
      };

      // Save updated user in credentials
      creds.user = updatedUser;
      localStorage.setItem(AUTH_CREDENTIALS_KEY, JSON.stringify(creds));

      // Create session
      const sessionData = {
        user: updatedUser,
        token: `bl_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        expiresAt: Date.now() + (rememberMe ? 30 * 24 * 3600 * 1000 : 8 * 3600 * 1000), // 30 days or 8 hours
      };

      if (rememberMe) {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData));
      }

      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      addSecurityLog('login_success', `Login de administrador realizado com sucesso para "${updatedUser.name}".`);

      return { success: true };
    } catch (e) {
      console.error('Login process error', e);
      return { success: false, error: 'Falha interna durante a validação de segurança.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    if (currentUser) {
      addSecurityLog('session_logout', `Sessão encerrada voluntariamente para "${currentUser.name}".`);
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data: Partial<AdminUser>): Promise<{ success: boolean; error?: string }> => {
    try {
      const rawCreds = localStorage.getItem(AUTH_CREDENTIALS_KEY);
      if (!rawCreds) return { success: false, error: 'Credenciais não encontradas.' };

      const creds = JSON.parse(rawCreds);
      const updatedUser: AdminUser = {
        ...creds.user,
        ...data,
      };

      creds.user = updatedUser;
      localStorage.setItem(AUTH_CREDENTIALS_KEY, JSON.stringify(creds));

      // Update current session
      const session = localStorage.getItem(AUTH_SESSION_KEY) || sessionStorage.getItem(AUTH_SESSION_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        parsed.user = updatedUser;
        if (localStorage.getItem(AUTH_SESSION_KEY)) {
          localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(parsed));
        } else {
          sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(parsed));
        }
      }

      setCurrentUser(updatedUser);
      addSecurityLog('profile_updated', `Dados de perfil de administrador atualizados (${updatedUser.name}).`);
      return { success: true };
    } catch (e) {
      console.error('Profile update error', e);
      return { success: false, error: 'Falha ao salvar dados de perfil.' };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'A nova senha deve possuir no mínimo 6 caracteres.' };
    }

    try {
      const rawCreds = localStorage.getItem(AUTH_CREDENTIALS_KEY);
      if (!rawCreds) return { success: false, error: 'Registro de segurança não localizado.' };

      const creds = JSON.parse(rawCreds);
      const currentHash = await hashWithSalt(currentPassword.trim(), creds.salt);

      if (currentHash !== creds.passwordHash) {
        addSecurityLog('password_changed', 'Tentativa de alteração de senha rejeitada (senha atual incorreta).');
        return { success: false, error: 'A senha atual informada está incorreta.' };
      }

      // Generate a new salt and compute hash for security
      const newSalt = generateSalt();
      const newHash = await hashWithSalt(newPassword.trim(), newSalt);

      creds.salt = newSalt;
      creds.passwordHash = newHash;
      localStorage.setItem(AUTH_CREDENTIALS_KEY, JSON.stringify(creds));

      addSecurityLog('password_changed', 'Senha mestre do administrador alterada com sucesso.');
      return { success: true };
    } catch (e) {
      console.error('Password change error', e);
      return { success: false, error: 'Falha ao processar atualização de senha.' };
    }
  };

  const resetDefaultCredentials = async () => {
    const salt = generateSalt();
    const hash = await hashWithSalt(DEFAULT_INITIAL_PASSWORD, salt);
    const initialData = {
      salt,
      passwordHash: hash,
      user: DEFAULT_ADMIN_USER,
    };
    localStorage.setItem(AUTH_CREDENTIALS_KEY, JSON.stringify(initialData));
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_UNTIL_KEY);
    setFailedAttempts(0);
    setLockoutUntil(0);
    addSecurityLog('password_changed', 'Credenciais de administrador redefinidas para o padrão de fábrica.');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        updateProfile,
        changePassword,
        resetDefaultCredentials,
        securityLogs,
        failedAttempts,
        lockoutTimeRemaining,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
