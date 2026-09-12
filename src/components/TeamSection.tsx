import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Compass, 
  FileText, 
  Building2, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { TeamMember } from '../types';

interface TeamSectionProps {
  onConsultTeam?: (member?: TeamMember) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ onConsultTeam }) => {
  const { config } = useSiteConfig();

  const rawTeam: TeamMember[] = Array.isArray(config.team)
    ? config.team
    : (typeof config.team === 'object' && config.team !== null ? Object.values(config.team) : []);

  if (!config.teamSection?.enabled || rawTeam.length === 0) {
    return null;
  }

  // Sort team members by displayOrder
  const sortedTeam = [...rawTeam].sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));

  const getPillarBadge = (pillar: TeamMember['pillar']) => {
    switch (pillar) {
      case 'juridico':
        return {
          icon: <Scale className="w-3.5 h-3.5" />,
          label: 'Direito Notarial & Registral',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      case 'engenharia':
        return {
          icon: <Compass className="w-3.5 h-3.5" />,
          label: 'Engenharia Civil & As-Built',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'urbanistico':
        return {
          icon: <Building2 className="w-3.5 h-3.5" />,
          label: 'Arquitetura & Zoneamento',
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
        };
      case 'cartorial':
        return {
          icon: <FileText className="w-3.5 h-3.5" />,
          label: 'Inteligência Cartorária',
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
        };
      default:
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          label: 'Especialista Técnico',
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
        };
    }
  };

  const cleanPhone = (config.contact.whatsappNumber || '5511999999999').replace(/\D/g, '');

  const handleContactMember = (member: TeamMember) => {
    if (onConsultTeam) {
      onConsultTeam(member);
      return;
    }
    const msg = encodeURIComponent(
      `Olá! Gostaria de uma consultoria com ${member.name} (${member.role}) a respeito da regularização do meu imóvel.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="equipe" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Subtle background glow */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ backgroundColor: config.colors.primaryNavy }}
      />
      <div 
        className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ backgroundColor: config.colors.accentYellow }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200/60 bg-amber-50/80 text-amber-950 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{config.teamSection.badgeText || 'Corpo Técnico Multidisciplinar'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {config.teamSection.title || 'Especialistas Integrados em Engenharia, Direito & Cartórios'}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {config.teamSection.subtitle ||
              'Unificamos engenheiros credenciados no CREA, advogados especialistas em Direito Imobiliário pela OAB e consultores registrais com trânsito diário nos cartórios da região de Caieiras e CIMBAJU.'}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedTeam.map((member) => {
            const pillarInfo = getPillarBadge(member.pillar);
            return (
              <div
                key={member.id}
                className="group relative bg-slate-50/80 hover:bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-amber-400/80 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Photo Frame */}
                  <div className="relative mb-5 mx-auto max-w-[200px]">
                    <div className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 group-hover:border-amber-400 transition-colors shadow-sm bg-slate-200">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            // If custom photo fails to load, gracefully hide broken img
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white font-bold text-3xl">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Official Registration Badge floating */}
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide bg-slate-900 text-amber-400 border border-slate-700 shadow-md">
                      {member.credential}
                    </div>
                  </div>

                  {/* Pillar Category Pill */}
                  <div className="flex justify-center mt-3 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${pillarInfo.bg}`}>
                      {pillarInfo.icon}
                      <span>{pillarInfo.label}</span>
                    </span>
                  </div>

                  {/* Name & Role */}
                  <div className="text-center mt-2">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#161C4D] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {member.role}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="mt-3.5 text-xs text-slate-600 leading-relaxed text-center line-clamp-4">
                    {member.bio}
                  </p>

                  {/* Specialties Pills */}
                  {member.specialties && member.specialties.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 flex flex-wrap gap-1.5 justify-center">
                      {member.specialties.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium bg-white text-slate-700 border border-slate-200 rounded-md px-2 py-0.5 shadow-2xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Action */}
                <div className="mt-6 pt-3">
                  <button
                    onClick={() => handleContactMember(member)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-[#161C4D] hover:text-white border border-slate-300 hover:border-[#161C4D] transition-all flex items-center justify-center gap-1.5 shadow-2xs group/btn cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-500 group-hover/btn:text-amber-400" />
                    <span>Consultar Caso com {member.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Multi-disciplinary Guarantee Banner */}
        <div className="mt-14 p-6 sm:p-8 bg-slate-900 text-white rounded-3xl border border-slate-800 relative overflow-hidden shadow-xl">
          <div 
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ backgroundColor: config.colors.accentYellow }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md"
                style={{ backgroundColor: config.colors.accentYellow }}
              >
                <ShieldCheck className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Eliminamos o impasse entre Projetistas e Advogados
                </h4>
                <p className="mt-1 text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Na contratação tradicional, o engenheiro culpa o advogado pela demora e o advogado diz que a planta está incompleta. Na <strong>BRASIL LEGAL</strong>, a responsabilidade técnica perante o CREA, a Prefeitura e o Oficial do Cartório de Registro de Imóveis é assumida por uma única equipe integrada.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  const el = document.getElementById('diagnostico');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-xl text-xs font-extrabold text-slate-950 transition-all transform hover:scale-105 shadow-md flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: config.colors.accentYellow }}
              >
                <span>Solicitar Análise de Imóvel com a Equipe</span>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
