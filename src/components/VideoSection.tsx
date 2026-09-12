import React, { useState } from 'react';
import { Play, Sparkles, ShieldCheck, CheckCircle2, Maximize2, ExternalLink } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export const getEmbedVideoUrl = (url: string): { type: 'youtube' | 'vimeo' | 'mp4' | 'unknown'; embedUrl: string } => {
  if (!url) return { type: 'unknown', embedUrl: '' };

  const trimmed = url.trim();

  // YouTube
  // Standard watch: https://www.youtube.com/watch?v=xyz
  // Short URL: https://youtu.be/xyz
  // Shorts: https://www.youtube.com/shorts/xyz
  // Embed: https://www.youtube.com/embed/xyz
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // MP4 file
  if (trimmed.endsWith('.mp4') || trimmed.includes('.mp4?')) {
    return {
      type: 'mp4',
      embedUrl: trimmed,
    };
  }

  return {
    type: 'unknown',
    embedUrl: trimmed,
  };
};

interface VideoSectionProps {
  onStartDiagnostic?: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ onStartDiagnostic }) => {
  const { config } = useSiteConfig();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!config.video.enabled) {
    return null;
  }

  const { type, embedUrl } = getEmbedVideoUrl(config.video.videoUrl);

  return (
    <section id="video-institucional" className="py-16 sm:py-24 bg-[#0C1033] text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: config.colors.accentYellow }}
      />
      <div 
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: config.colors.primaryNavy }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border"
            style={{
              backgroundColor: 'rgba(248, 201, 8, 0.12)',
              color: config.colors.accentYellow,
              borderColor: 'rgba(248, 201, 8, 0.25)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apresentação Oficial em Vídeo</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
            {config.video.title}
          </h2>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            {config.video.subtitle}
          </p>
        </div>

        {/* Video Player Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-900 aspect-video group">
            
            {isPlaying ? (
              type === 'mp4' ? (
                <video
                  src={embedUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                >
                  Seu navegador não suporta vídeos HTML5.
                </video>
              ) : (
                <iframe
                  src={embedUrl}
                  title={config.video.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )
            ) : (
              // Cover Preview with Play Button
              <div 
                className="relative w-full h-full flex items-center justify-center cursor-pointer bg-cover bg-center"
                style={{
                  backgroundImage: config.video.thumbnailUrl 
                    ? `url(${config.video.thumbnailUrl})`
                    : `linear-gradient(135deg, ${config.colors.primaryDark} 0%, ${config.colors.primaryNavy} 100%)`,
                }}
                onClick={() => setIsPlaying(true)}
              >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] transition-colors group-hover:bg-slate-950/40" />

                {/* Vector architectural overlay effect if no thumbnail */}
                {!config.video.thumbnailUrl && (
                  <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                    <ShieldCheck className="w-96 h-96 text-white" />
                  </div>
                )}

                {/* Central Play Button */}
                <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all transform group-hover:scale-110"
                    style={{ 
                      backgroundColor: config.colors.accentYellow,
                      color: '#0F172A',
                    }}
                  >
                    <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-current ml-1" />
                  </div>

                  <div>
                    <span className="text-base sm:text-lg font-bold text-white block">
                      {config.video.buttonText || 'Assistir Vídeo Explicativo'}
                    </span>
                    <span className="text-xs text-slate-300">
                      Clique para reproduzir (Duração aproximada: 2 min)
                    </span>
                  </div>
                </div>

                {/* Bottom badges */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-slate-300 pointer-events-none">
                  <div className="flex items-center gap-2 bg-slate-950/70 px-3 py-1.5 rounded-full border border-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Engenharia & Regularização Notarial</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/70 px-3 py-1.5 rounded-full border border-slate-700">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>HD 1080p</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Quick Callout Below Video */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-center sm:text-left">
              <div className="text-sm font-bold text-white">Prefere uma avaliação direta da sua matrícula?</div>
              <div className="text-xs text-slate-300 mt-0.5">Nosso diagnóstico preliminar identifica as pendências da prefeitura e cartório em 48h.</div>
            </div>

            {onStartDiagnostic && (
              <button
                onClick={onStartDiagnostic}
                className="shrink-0 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all transform hover:scale-105"
                style={{
                  backgroundColor: config.colors.accentYellow,
                  color: '#0C1033',
                }}
              >
                Fazer Diagnóstico Sem Custo
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
