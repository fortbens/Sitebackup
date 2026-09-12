import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface LogoProps {
  variant?: 'color' | 'white' | 'dark-bg' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDescriptor?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'color',
  size = 'md',
  showDescriptor,
  className = '',
}) => {
  const { config } = useSiteConfig();

  // "white", "dark-bg", and "light" denote a logo placed on a dark background (needs Logo Claro)
  const isForDarkBackground = variant === 'white' || variant === 'dark-bg' || variant === 'light';
  const textColor = isForDarkBackground ? '#FFFFFF' : config.colors.primaryNavy || '#161C4D';
  const yellowColor = config.colors.accentYellow || '#F8C908';
  const subtextColor = isForDarkBackground ? 'text-slate-300' : 'text-slate-600';

  const shouldShowDescriptor = showDescriptor !== undefined 
    ? showDescriptor 
    : config.brand.showDescriptor;

  // Dimension presets
  const sizeMap = {
    sm: { scale: 0.75, height: 38, imgHeight: 'h-8', textScale: 'text-xs' },
    md: { scale: 1, height: 48, imgHeight: 'h-10', textScale: 'text-xs' },
    lg: { scale: 1.3, height: 60, imgHeight: 'h-12', textScale: 'text-sm' },
    xl: { scale: 1.6, height: 74, imgHeight: 'h-16', textScale: 'text-base' },
  };

  const currentSize = sizeMap[size];
  const finalScale = currentSize.scale * (config.brand.logoScale || 1);

  // Determine which custom image to show based on background theme:
  // - On dark background (Rodapé / Dark areas): use Logo Claro (logoLightUrl)
  // - On light background (Navbar / White cards): use Logo Escuro (logoDarkUrl)
  const customImageSource = isForDarkBackground
    ? (config.brand.logoLightUrl || config.brand.customLogoUrl || config.brand.logoDarkUrl)
    : (config.brand.logoDarkUrl || config.brand.customLogoUrl || config.brand.logoLightUrl);

  // If user configured a custom image logo in CMS and an image is available
  if (config.brand.logoType === 'custom_image' && customImageSource) {
    return (
      <div className={`inline-flex flex-col select-none ${className}`}>
        <img
          src={customImageSource}
          alt={config.brand.name || 'Brasil Legal'}
          className={`${currentSize.imgHeight} object-contain transition-transform duration-300 hover:scale-105`}
          style={{
            maxHeight: `${currentSize.height * (config.brand.logoScale || 1)}px`,
          }}
        />
        {shouldShowDescriptor && config.brand.descriptor && (
          <div
            className={`font-sans tracking-[0.16em] uppercase font-semibold text-[9px] sm:text-[10px] mt-1 pl-0.5 ${subtextColor}`}
          >
            {config.brand.descriptor}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="inline-flex items-center gap-2.5 sm:gap-3">
        {/* Vector representation of the 3 stacked documents */}
        <svg
          width={46 * finalScale}
          height={48 * finalScale}
          viewBox="0 0 46 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 transition-transform duration-300 hover:scale-105"
          aria-label="Ícone Brasil Legal"
        >
          {/* Back document */}
          <path
            d="M14 6C14 4.89543 14.8954 4 16 4H34L40 10V40C40 41.1046 39.1046 42 38 42H16C14.8954 42 14 41.1046 14 40V6Z"
            fill={yellowColor}
            opacity="0.65"
            transform="rotate(6 27 23)"
          />
          {/* Middle document */}
          <path
            d="M10 5C10 3.89543 10.8954 3 12 3H30L36 9V39C36 40.1046 35.1046 41 34 41H12C10.8954 41 10 40.1046 10 39V5Z"
            fill={yellowColor}
            opacity="0.85"
            transform="rotate(3 23 22)"
          />
          {/* Front document */}
          <g filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.06))">
            <rect
              x="3"
              y="4"
              width="28"
              height="36"
              rx="4"
              fill={yellowColor}
            />
            {/* Folded corner */}
            <path
              d="M23 4V10C23 11.1046 23.8954 12 25 12H31L23 4Z"
              fill={isForDarkBackground ? '#E5B700' : '#EAB308'}
            />
            {/* Document text lines */}
            <line x1="8" y1="17" x2="26" y2="17" stroke={textColor} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <line x1="8" y1="22" x2="26" y2="22" stroke={textColor} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <line x1="8" y1="27" x2="26" y2="27" stroke={textColor} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <line x1="8" y1="32" x2="21" y2="32" stroke={textColor} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          </g>
        </svg>

        {/* Custom Brand Lettering "BRAS!L LEGAL" */}
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline font-display font-extrabold tracking-tight" style={{ fontSize: `${22 * finalScale}px` }}>
            <span style={{ color: textColor }}>BRAS</span>
            {/* Exclamation point icon replacement for "I" */}
            <span className="inline-flex flex-col items-center mx-[1.5px] relative" style={{ top: '-1px' }}>
              <span
                className="rounded-sm"
                style={{
                  backgroundColor: yellowColor,
                  width: `${3.5 * finalScale}px`,
                  height: `${13 * finalScale}px`,
                }}
              />
              <span
                className="rounded-full mt-[2px]"
                style={{
                  backgroundColor: yellowColor,
                  width: `${3.5 * finalScale}px`,
                  height: `${3.5 * finalScale}px`,
                }}
              />
            </span>
            <span style={{ color: textColor }}>L</span>
          </div>

          <div
            className="flex items-baseline font-display font-extrabold tracking-wider -mt-[2px]"
            style={{ fontSize: `${20 * finalScale}px` }}
          >
            <span style={{ color: textColor }}>L</span>
            {/* Stylized 'E' from logo in accent yellow */}
            <span
              className="inline-flex items-center justify-center font-black mx-[1px]"
              style={{ color: yellowColor }}
            >
              E
            </span>
            <span style={{ color: textColor }}>GAL</span>
          </div>
        </div>
      </div>

      {/* Official Descriptor */}
      {shouldShowDescriptor && (
        <div
          className={`font-sans tracking-[0.16em] uppercase font-semibold text-[9px] sm:text-[10px] mt-1 pl-0.5 ${subtextColor}`}
        >
          {config.brand.descriptor || 'Regularização Imobiliária Integrada'}
        </div>
      )}
    </div>
  );
};
