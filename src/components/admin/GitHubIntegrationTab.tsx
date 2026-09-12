import React, { useState } from 'react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { GitHubConfig, GitHubSyncLog } from '../../types';
import {
  Github,
  GitBranch,
  GitCommit,
  UploadCloud,
  DownloadCloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Eye,
  EyeOff,
  Key,
  FolderGit2,
  FileCode2,
  Database,
  History,
  Trash2,
  Zap,
  Play,
  HelpCircle,
  Clock,
  ShieldCheck,
  Server,
  Terminal,
  Copy,
  Check
} from 'lucide-react';

export const GitHubIntegrationTab: React.FC = () => {
  const { config, updateSection, updateConfig } = useSiteConfig();
  const ghConfig = config.github || {
    enabled: false,
    repoOwner: '',
    repoName: '',
    branch: 'main',
    token: '',
    autoSync: false,
    configPath: 'config/site-config.json',
    leadsPath: 'data/leads-backup.json',
    syncLogs: [],
  };

  const [showToken, setShowToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [showCpanelGuide, setShowCpanelGuide] = useState(false);
  const [copiedCpanel, setCopiedCpanel] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    details?: string;
    commitUrl?: string;
  } | null>(null);

  const [repoDetails, setRepoDetails] = useState<{
    fullName: string;
    isPrivate: boolean;
    defaultBranch: string;
    description: string;
    stars: number;
    ownerAvatar: string;
    lastCommitMessage?: string;
    lastCommitAuthor?: string;
    lastCommitDate?: string;
  } | null>(null);

  const [showInstructions, setShowInstructions] = useState(false);

  // Helper to log actions
  const addLog = (
    action: GitHubSyncLog['action'],
    status: GitHubSyncLog['status'],
    message: string,
    commitSha?: string
  ) => {
    const newLog: GitHubSyncLog = {
      id: `gh_log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      action,
      status,
      message,
      commitSha,
    };
    const updatedLogs = [newLog, ...(ghConfig.syncLogs || [])].slice(0, 30);
    updateSection('github', {
      syncLogs: updatedLogs,
      lastSync: status === 'success' ? new Date().toISOString() : ghConfig.lastSync,
      lastCommitSha: commitSha || ghConfig.lastCommitSha,
    });
  };

  // Base64 helper for UTF-8 strings
  const utf8ToBase64 = (str: string) => {
    return window.btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  };

  // Base64 decoder for UTF-8 strings
  const base64ToUtf8 = (str: string) => {
    return decodeURIComponent(
      Array.prototype.map
        .call(window.atob(str), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  };

  // 1. Test connection to GitHub
  const handleTestConnection = async () => {
    if (!ghConfig.repoOwner.trim() || !ghConfig.repoName.trim()) {
      setFeedback({
        type: 'error',
        message: 'Preencha o Proprietário (usuário/org) e o Nome do Repositório.',
      });
      return;
    }

    setTesting(true);
    setFeedback(null);

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (ghConfig.token.trim()) {
      headers.Authorization = `Bearer ${ghConfig.token.trim()}`;
    }

    try {
      const repoUrl = `https://api.github.com/repos/${ghConfig.repoOwner.trim()}/${ghConfig.repoName.trim()}`;
      const res = await fetch(repoUrl, { headers });

      if (!res.ok) {
        let errDesc = 'Repositório não encontrado ou token inválido.';
        if (res.status === 401) errDesc = 'Token do GitHub inválido ou expirado.';
        if (res.status === 404) errDesc = 'Repositório não encontrado. Se for privado, inclua um token com permissão "repo".';
        if (res.status === 403) errDesc = 'Limite de requisições excedido ou falta de permissão.';

        addLog('test_connection', 'error', `Falha no teste: ${errDesc}`);
        updateSection('github', { enabled: false });
        setFeedback({
          type: 'error',
          message: `Erro na conexão (${res.status})`,
          details: errDesc,
        });
        setRepoDetails(null);
        return;
      }

      const repoData = await res.json();

      // Also get latest commit on branch
      let commitMessage = '';
      let commitAuthor = '';
      let commitDate = '';
      const branchName = ghConfig.branch.trim() || repoData.default_branch || 'main';

      try {
        const commitRes = await fetch(`${repoUrl}/commits/${branchName}`, { headers });
        if (commitRes.ok) {
          const commitData = await commitRes.json();
          commitMessage = commitData.commit?.message?.split('\n')[0] || '';
          commitAuthor = commitData.commit?.author?.name || commitData.author?.login || '';
          commitDate = commitData.commit?.author?.date || '';
        }
      } catch (e) {
        console.warn('Could not fetch latest commit', e);
      }

      setRepoDetails({
        fullName: repoData.full_name,
        isPrivate: repoData.private,
        defaultBranch: repoData.default_branch,
        description: repoData.description || 'Sem descrição cadastrada no GitHub.',
        stars: repoData.stargazers_count || 0,
        ownerAvatar: repoData.owner?.avatar_url || '',
        lastCommitMessage: commitMessage,
        lastCommitAuthor: commitAuthor,
        lastCommitDate: commitDate,
      });

      updateSection('github', { enabled: true });
      addLog('test_connection', 'success', `Conectado com sucesso ao repositório ${repoData.full_name}`);

      setFeedback({
        type: 'success',
        message: 'Conexão com o GitHub estabelecida com sucesso!',
        details: `Repositório "${repoData.full_name}" verificado (${repoData.private ? 'Privado' : 'Público'}).`,
      });
    } catch (err: any) {
      addLog('test_connection', 'error', `Falha de rede: ${err.message || err}`);
      setFeedback({
        type: 'error',
        message: 'Falha ao conectar com o GitHub',
        details: 'Verifique sua conexão de internet e as credenciais inseridas.',
      });
    } finally {
      setTesting(false);
    }
  };

  // 2. Push Configuration to GitHub
  const handlePushConfig = async () => {
    if (!ghConfig.token.trim()) {
      setFeedback({
        type: 'error',
        message: 'Token de Acesso (PAT) Obrigatório',
        details: 'Para enviar commits ao GitHub, é necessário fornecer um Personal Access Token com escopo de escrita (repo).',
      });
      return;
    }

    if (!ghConfig.repoOwner.trim() || !ghConfig.repoName.trim()) {
      setFeedback({
        type: 'error',
        message: 'Configure o proprietário e o repositório antes de sincronizar.',
      });
      return;
    }

    setPushing(true);
    setFeedback(null);

    const owner = ghConfig.repoOwner.trim();
    const repo = ghConfig.repoName.trim();
    const branch = ghConfig.branch.trim() || 'main';
    const filePath = (ghConfig.configPath.trim() || 'config/site-config.json').replace(/^\/+/, '');

    const headers = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${ghConfig.token.trim()}`,
      'Content-Type': 'application/json',
    };

    try {
      // Step A: Check if the file already exists to get its sha
      let existingSha: string | undefined = undefined;
      const checkUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
      const checkRes = await fetch(checkUrl, { headers });

      if (checkRes.ok) {
        const fileInfo = await checkRes.json();
        existingSha = fileInfo.sha;
      }

      // Step B: Build payload
      // Sanitize config to avoid storing the token itself in the public file if desired, or keep it clean
      const configToExport = {
        ...config,
        _exportedAt: new Date().toISOString(),
        _exporter: 'Brasil Legal CMS Admin',
      };

      const jsonString = JSON.stringify(configToExport, null, 2);
      const base64Content = utf8ToBase64(jsonString);

      const commitMessage = `chore(cms): backup automático das configurações do site [${new Date().toLocaleDateString('pt-BR')}]`;

      const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const bodyPayload: any = {
        message: commitMessage,
        content: base64Content,
        branch,
      };
      if (existingSha) {
        bodyPayload.sha = existingSha;
      }

      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(bodyPayload),
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(errJson.message || `Erro HTTP ${putRes.status}`);
      }

      const putData = await putRes.json();
      const newSha = putData.commit?.sha || putData.content?.sha;
      const shortSha = newSha ? newSha.substring(0, 7) : '';
      const commitUrl = putData.commit?.html_url || `https://github.com/${owner}/${repo}/commit/${newSha}`;

      addLog('push_config', 'success', `Arquivo "${filePath}" salvo no branch ${branch} (${shortSha})`, shortSha);

      setFeedback({
        type: 'success',
        message: 'Configurações sincronizadas com o GitHub!',
        details: `Commit gerado com sucesso no branch ${branch}: ${commitMessage}`,
        commitUrl,
      });
    } catch (err: any) {
      addLog('push_config', 'error', `Falha ao salvar: ${err.message || err}`);
      setFeedback({
        type: 'error',
        message: 'Erro ao enviar para o GitHub',
        details: err.message || 'Verifique as permissões de escrita do seu token.',
      });
    } finally {
      setPushing(false);
    }
  };

  // 3. Export Leads to GitHub
  const handleExportLeads = async () => {
    if (!ghConfig.token.trim()) {
      setFeedback({
        type: 'error',
        message: 'Token de Acesso (PAT) Obrigatório',
        details: 'Para enviar os leads ao repositório, configure seu Personal Access Token.',
      });
      return;
    }

    setPushing(true);
    setFeedback(null);

    const owner = ghConfig.repoOwner.trim();
    const repo = ghConfig.repoName.trim();
    const branch = ghConfig.branch.trim() || 'main';
    const filePath = (ghConfig.leadsPath.trim() || 'data/leads-backup.json').replace(/^\/+/, '');

    const headers = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${ghConfig.token.trim()}`,
      'Content-Type': 'application/json',
    };

    try {
      // Get leads from local storage
      const savedLeads = localStorage.getItem('brasil_legal_leads');
      const parsedLeads = savedLeads ? JSON.parse(savedLeads) : [];

      let existingSha: string | undefined = undefined;
      const checkUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
      const checkRes = await fetch(checkUrl, { headers });
      if (checkRes.ok) {
        const fileInfo = await checkRes.json();
        existingSha = fileInfo.sha;
      }

      const jsonString = JSON.stringify(
        {
          total: parsedLeads.length,
          updatedAt: new Date().toISOString(),
          leads: parsedLeads,
        },
        null,
        2
      );

      const base64Content = utf8ToBase64(jsonString);
      const commitMessage = `data(leads): backup de ${parsedLeads.length} leads comerciais [${new Date().toLocaleDateString('pt-BR')}]`;

      const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: commitMessage,
          content: base64Content,
          branch,
          sha: existingSha,
        }),
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(errJson.message || `Erro HTTP ${putRes.status}`);
      }

      const putData = await putRes.json();
      const newSha = putData.commit?.sha;
      const shortSha = newSha ? newSha.substring(0, 7) : '';

      addLog('export_leads', 'success', `Backup de ${parsedLeads.length} leads salvo em "${filePath}"`, shortSha);

      setFeedback({
        type: 'success',
        message: `${parsedLeads.length} leads exportados para o GitHub!`,
        details: `Arquivo "${filePath}" atualizado no branch ${branch}.`,
        commitUrl: putData.commit?.html_url,
      });
    } catch (err: any) {
      addLog('export_leads', 'error', `Falha ao exportar leads: ${err.message || err}`);
      setFeedback({
        type: 'error',
        message: 'Erro ao exportar leads para o GitHub',
        details: err.message,
      });
    } finally {
      setPushing(false);
    }
  };

  // 4. Pull Configuration from GitHub
  const handlePullConfig = async () => {
    if (!ghConfig.repoOwner.trim() || !ghConfig.repoName.trim()) {
      setFeedback({
        type: 'error',
        message: 'Preencha o proprietário e o repositório para carregar a configuração.',
      });
      return;
    }

    if (!window.confirm('Deseja substituir as configurações atuais do site pelas configurações salvas neste repositório GitHub?')) {
      return;
    }

    setPulling(true);
    setFeedback(null);

    const owner = ghConfig.repoOwner.trim();
    const repo = ghConfig.repoName.trim();
    const branch = ghConfig.branch.trim() || 'main';
    const filePath = (ghConfig.configPath.trim() || 'config/site-config.json').replace(/^\/+/, '');

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (ghConfig.token.trim()) {
      headers.Authorization = `Bearer ${ghConfig.token.trim()}`;
    }

    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
      const res = await fetch(url, { headers });

      if (!res.ok) {
        throw new Error(`Arquivo "${filePath}" não encontrado no branch "${branch}".`);
      }

      const fileData = await res.json();
      if (!fileData.content) {
        throw new Error('Conteúdo do arquivo não recebido da API do GitHub.');
      }

      const cleanBase64 = fileData.content.replace(/\s/g, '');
      const rawJson = base64ToUtf8(cleanBase64);
      const parsedConfig = JSON.parse(rawJson);

      // Apply to context
      updateConfig((prev) => ({
        ...prev,
        ...parsedConfig,
        // Retain current GitHub config token for safety if needed
        github: {
          ...ghConfig,
          ...(parsedConfig.github || {}),
          token: ghConfig.token || parsedConfig.github?.token || '',
          lastSync: new Date().toISOString(),
        },
      }));

      addLog('pull_config', 'success', `Configurações puxadas de "${filePath}" com sucesso`);

      setFeedback({
        type: 'success',
        message: 'Configurações importadas do GitHub com sucesso!',
        details: 'O site foi atualizado com base no arquivo salvo no repositório.',
      });
    } catch (err: any) {
      addLog('pull_config', 'error', `Falha ao puxar do GitHub: ${err.message || err}`);
      setFeedback({
        type: 'error',
        message: 'Falha ao importar do GitHub',
        details: err.message,
      });
    } finally {
      setPulling(false);
    }
  };

  // 5. Trigger Repository Dispatch (for CI/CD Deploy)
  const handleTriggerDispatch = async () => {
    if (!ghConfig.token.trim()) {
      setFeedback({
        type: 'error',
        message: 'Token de Acesso Obrigatório para Disparar Ações',
      });
      return;
    }

    setDispatching(true);
    setFeedback(null);

    const owner = ghConfig.repoOwner.trim();
    const repo = ghConfig.repoName.trim();

    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${ghConfig.token.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'cms_deploy_trigger',
          client_payload: {
            triggeredBy: 'Brasil Legal CMS',
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Erro HTTP ${res.status}`);
      }

      addLog('trigger_dispatch', 'success', 'Evento repository_dispatch enviado com sucesso');
      setFeedback({
        type: 'success',
        message: 'Disparo de Deploy enviado ao GitHub Actions!',
        details: 'Se houver um workflow configurado para o evento "repository_dispatch", ele foi iniciado.',
      });
    } catch (err: any) {
      addLog('trigger_dispatch', 'error', `Falha no disparo: ${err.message || err}`);
      setFeedback({
        type: 'error',
        message: 'Erro ao disparar GitHub Actions',
        details: err.message,
      });
    } finally {
      setDispatching(false);
    }
  };

  // Clear logs
  const handleClearLogs = () => {
    if (window.confirm('Deseja limpar o histórico de logs de sincronização?')) {
      updateSection('github', { syncLogs: [] });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Banner & Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Integração com GitHub</h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    ghConfig.enabled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {ghConfig.enabled ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Conectado</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 text-slate-400" />
                      <span>Desconectado</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Sincronize as configurações do site, faça backups de leads e controle versões direto no seu repositório Git.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>{showInstructions ? 'Ocultar Tutorial' : 'Como Gerar Token'}</span>
            </button>

            <button
              onClick={handleTestConnection}
              disabled={testing || !ghConfig.repoOwner || !ghConfig.repoName}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#161C4D] hover:bg-[#252E75] disabled:opacity-50 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Verificando...' : 'Testar Conexão'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert Message */}
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs flex items-start gap-3 animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : feedback.type === 'error'
                ? 'bg-rose-50 text-rose-900 border border-rose-200'
                : 'bg-blue-50 text-blue-900 border border-blue-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : feedback.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-bold">{feedback.message}</div>
              {feedback.details && <div className="mt-0.5 text-slate-600">{feedback.details}</div>}
              {feedback.commitUrl && (
                <a
                  href={feedback.commitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#161C4D] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver commit no GitHub</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Tutorial / Token Guidance Accordion */}
        {showInstructions && (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Key className="w-4 h-4 text-amber-600" />
              <span>Como gerar um Personal Access Token (PAT) no GitHub em 3 passos:</span>
            </div>
            <ol className="text-xs text-amber-950/80 space-y-1.5 list-decimal list-inside leading-relaxed pl-1">
              <li>
                Acesse suas configurações de tokens no GitHub:{' '}
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=Brasil+Legal+CMS+Sync"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold underline text-amber-900 hover:text-amber-950 inline-flex items-center gap-1"
                >
                  Criar Novo Token (repo) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                Dê uma descrição (ex: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">Brasil Legal CMS</code>), defina o prazo de validade e marque o escopo <strong>repo</strong> (acesso completo a repositórios).
              </li>
              <li>
                Clique em <strong>Generate token</strong>, copie o código gerado (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">ghp_...</code>) e cole no campo "Personal Access Token" abaixo.
              </li>
            </ol>
          </div>
        )}

        {/* Credentials Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Proprietário / Usuário / Organização: <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="ex: falacarnairo ou empresa-proptech"
                value={ghConfig.repoOwner}
                onChange={(e) => updateSection('github', { repoOwner: e.target.value })}
                className="w-full p-2.5 pl-9 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#161C4D] focus:ring-1 focus:ring-[#161C4D]"
              />
              <Github className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Seu nome de usuário ou organização no GitHub.</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nome do Repositório: <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="ex: brasil-legal-site ou landing-regularizacao"
                value={ghConfig.repoName}
                onChange={(e) => updateSection('github', { repoName: e.target.value })}
                className="w-full p-2.5 pl-9 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#161C4D] focus:ring-1 focus:ring-[#161C4D]"
              />
              <FolderGit2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Nome exato do repositório no GitHub.</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Branch de Destino:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="main"
                value={ghConfig.branch}
                onChange={(e) => updateSection('github', { branch: e.target.value })}
                className="w-full p-2.5 pl-9 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-[#161C4D] focus:ring-1 focus:ring-[#161C4D]"
              />
              <GitBranch className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Normalmente "main" ou "master".</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Personal Access Token (PAT): <span className="text-slate-400 font-normal">(Necessário para escrita/commits)</span>
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={ghConfig.token}
                onChange={(e) => updateSection('github', { token: e.target.value })}
                className="w-full p-2.5 pl-9 pr-10 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:border-[#161C4D] focus:ring-1 focus:ring-[#161C4D]"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                title={showToken ? 'Ocultar token' : 'Mostrar token'}
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Token com permissão de escrita <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">repo</code>.
            </span>
          </div>
        </div>

        {/* Paths & Sync options */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-amber-600" />
            <span>Caminhos dos Arquivos no Repositório:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Caminho do Arquivo de Configuração (JSON):
              </label>
              <input
                type="text"
                value={ghConfig.configPath || 'config/site-config.json'}
                onChange={(e) => updateSection('github', { configPath: e.target.value })}
                placeholder="config/site-config.json"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Caminho do Backup de Leads (JSON):
              </label>
              <input
                type="text"
                value={ghConfig.leadsPath || 'data/leads-backup.json'}
                onChange={(e) => updateSection('github', { leadsPath: e.target.value })}
                placeholder="data/leads-backup.json"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Live Repository Summary Card (if tested/loaded) */}
        {repoDetails && (
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {repoDetails.ownerAvatar && (
                  <img
                    src={repoDetails.ownerAvatar}
                    alt="Owner"
                    className="w-7 h-7 rounded-full border border-slate-700"
                  />
                )}
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span>{repoDetails.fullName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {repoDetails.isPrivate ? 'Privado' : 'Público'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{repoDetails.description}</div>
                </div>
              </div>

              <a
                href={`https://github.com/${repoDetails.fullName}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
              >
                <span>Ver no GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {repoDetails.lastCommitMessage && (
              <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <GitCommit className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-400">Último commit:</span>
                  <span className="font-mono text-slate-200 truncate font-semibold">
                    "{repoDetails.lastCommitMessage}"
                  </span>
                </div>
                {repoDetails.lastCommitAuthor && (
                  <div className="text-[11px] text-slate-400 shrink-0">
                    por {repoDetails.lastCommitAuthor}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Trigger Buttons */}
        <div className="pt-4 border-t border-slate-200">
          <span className="text-xs font-bold text-slate-700 block mb-3">
            Ações de Sincronização & Versão:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Push Config */}
            <button
              onClick={handlePushConfig}
              disabled={pushing || !ghConfig.token || !ghConfig.repoOwner || !ghConfig.repoName}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
              title="Salva as configurações do site como commit no GitHub"
            >
              <UploadCloud className={`w-5 h-5 ${pushing ? 'animate-bounce' : ''}`} />
              <span>Salvar no GitHub (Push)</span>
              <span className="text-[10px] font-normal text-emerald-100">Atualizar config do site</span>
            </button>

            {/* 2. Pull Config */}
            <button
              onClick={handlePullConfig}
              disabled={pulling || !ghConfig.repoOwner || !ghConfig.repoName}
              className="p-3 rounded-xl bg-[#161C4D] hover:bg-[#252E75] text-white text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
              title="Lê o arquivo do GitHub e atualiza o site"
            >
              <DownloadCloud className={`w-5 h-5 ${pulling ? 'animate-bounce' : ''}`} />
              <span>Puxar do GitHub (Pull)</span>
              <span className="text-[10px] font-normal text-slate-300">Importar alterações remotas</span>
            </button>

            {/* 3. Export Leads */}
            <button
              onClick={handleExportLeads}
              disabled={pushing || !ghConfig.token || !ghConfig.repoOwner || !ghConfig.repoName}
              className="p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
              title="Exporta todos os leads recebidos para o repositório"
            >
              <Database className="w-5 h-5" />
              <span>Backup de Leads</span>
              <span className="text-[10px] font-normal text-slate-800">Enviar leads para o repo</span>
            </button>

            {/* 4. Trigger Deploy Dispatch */}
            <button
              onClick={handleTriggerDispatch}
              disabled={dispatching || !ghConfig.token || !ghConfig.repoOwner || !ghConfig.repoName}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
              title="Dispara evento repository_dispatch para CI/CD e deploys automáticos"
            >
              <Play className={`w-5 h-5 text-amber-400 ${dispatching ? 'animate-spin' : ''}`} />
              <span>Disparar Deploy (CI/CD)</span>
              <span className="text-[10px] font-normal text-slate-300">Workflow Dispatch</span>
            </button>
          </div>
        </div>

        {/* Homehost & cPanel Git Deployment Guide */}
        <div className="pt-4 border-t border-slate-200">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-[#161C4D]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Implantação na Homehost / cPanel (Git Version Control)</h4>
                  <p className="text-[11px] text-slate-500">
                    Solução para o erro "The system cannot deploy - Um arquivo .cpanel.yml válido existe"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCpanelGuide(!showCpanelGuide)}
                className="text-xs font-bold text-[#161C4D] hover:underline cursor-pointer"
              >
                {showCpanelGuide ? 'Recolher Detalhes' : 'Ver Instruções da Homehost'}
              </button>
            </div>

            {showCpanelGuide && (
              <div className="pt-3 border-t border-slate-200 space-y-3 text-xs text-slate-700 animate-in fade-in">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] leading-relaxed">
                  <strong>Arquivos gerados no projeto:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    <li><code className="font-mono bg-emerald-100 px-1 py-0.2 rounded font-bold">.cpanel.yml</code> — arquivo obrigatório exigido pelo cPanel da Homehost para copiar os arquivos no <code className="font-mono">public_html</code>.</li>
                    <li><code className="font-mono bg-emerald-100 px-1 py-0.2 rounded font-bold">public/.htaccess</code> — regras do Apache para que as rotas como <code className="font-mono">/painel</code> funcionem sem erro 404.</li>
                    <li><code className="font-mono bg-emerald-100 px-1 py-0.2 rounded font-bold">.github/workflows/deploy.yml</code> — automação via GitHub Actions.</li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-slate-900">Conteúdo do arquivo .cpanel.yml incluído no projeto:</div>
                  <div className="relative">
                    <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
{`---
deployment:
  tasks:
    - export DEPLOYPATH=$HOME/public_html
    - /bin/mkdir -p $DEPLOYPATH
    - /bin/cp -rf dist/* $DEPLOYPATH 2>/dev/null || /bin/cp -rf * $DEPLOYPATH
    - /bin/cp -f public/.htaccess $DEPLOYPATH 2>/dev/null || /bin/cp -f .htaccess $DEPLOYPATH 2>/dev/null || true`}
                    </pre>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`---\ndeployment:\n  tasks:\n    - export DEPLOYPATH=$HOME/public_html\n    - /bin/mkdir -p $DEPLOYPATH\n    - /bin/cp -rf dist/* $DEPLOYPATH 2>/dev/null || /bin/cp -rf * $DEPLOYPATH\n    - /bin/cp -f public/.htaccess $DEPLOYPATH 2>/dev/null || /bin/cp -f .htaccess $DEPLOYPATH 2>/dev/null || true\n`);
                        setCopiedCpanel(true);
                        setTimeout(() => setCopiedCpanel(false), 2000);
                      }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[10px] flex items-center gap-1 font-sans"
                    >
                      {copiedCpanel ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-[11px] leading-relaxed">
                  <strong>Passo a passo no cPanel da Homehost:</strong>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Faça o commit e push dos arquivos para o seu repositório no GitHub.</li>
                    <li>No cPanel da Homehost, abra <strong>Git™ Version Control</strong> e localize seu repositório.</li>
                    <li>Clique em <strong>Manage</strong> (Gerenciar) e depois na aba <strong>Pull or Deploy</strong>.</li>
                    <li>Clique no botão <strong>Update from Remote</strong> (para puxar os novos arquivos incluindo o <code className="font-mono bg-amber-100 px-1 py-0.2 rounded font-bold">.cpanel.yml</code>).</li>
                    <li>Clique em <strong>Deploy HEAD Commit</strong>. O cPanel executará a publicação sem erros!</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sync History & Activity Logs */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-800">Histórico de Atividades no GitHub</span>
              {ghConfig.syncLogs && ghConfig.syncLogs.length > 0 && (
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">
                  {ghConfig.syncLogs.length}
                </span>
              )}
            </div>

            {ghConfig.syncLogs && ghConfig.syncLogs.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Limpar Histórico</span>
              </button>
            )}
          </div>

          {ghConfig.syncLogs && ghConfig.syncLogs.length > 0 ? (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              {ghConfig.syncLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-white text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {log.status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <div className="truncate">
                      <span className="font-semibold text-slate-800">{log.message}</span>
                      {log.commitSha && (
                        <span className="ml-1.5 font-mono text-[10px] bg-slate-100 px-1 py-0.2 rounded text-slate-600">
                          {log.commitSha}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(log.timestamp).toLocaleTimeString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Nenhuma sincronização recente registrada. Faça um teste de conexão ou salve as configurações no GitHub.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
