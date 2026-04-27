'use client';

import React from 'react';
import Link from 'next/link';

interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  external?: boolean;
  target?: string;
  onClick?: () => void;
  tint?: string;
}

export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = '',
  style = {},
  href,
  external,
  target,
  onClick,
  tint = 'rgba(255, 255, 255, 0.18)',
}) => {
  const glassStyle: React.CSSProperties = {
    boxShadow: '0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)',
    transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 2.2)',
    ...style,
  };

  const content = (
    <div
      className={`relative flex font-semibold overflow-hidden text-white cursor-pointer transition-all duration-700 ${className}`}
      style={glassStyle}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          borderRadius: 'inherit',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          filter: 'url(#glass-distortion)',
          isolation: 'isolate',
        }}
      />
      <div
        className="absolute inset-0 z-10"
        style={{ borderRadius: 'inherit', background: tint }}
      />
      <div
        className="absolute inset-0 z-20 overflow-hidden"
        style={{
          borderRadius: 'inherit',
          boxShadow:
            'inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.5)',
        }}
      />
      <div className="relative z-30 w-full">{children}</div>
    </div>
  );

  if (!href) return content;
  if (external) {
    return (
      <a
        href={href}
        target={target ?? '_blank'}
        rel="noopener noreferrer"
        className="inline-block"
        style={{ textDecoration: 'none' }}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className="inline-block" style={{ textDecoration: 'none' }}>
      {content}
    </Link>
  );
};

export const GlassButton: React.FC<{
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  tint?: string;
}> = ({ children, href, external, onClick, className = '', tint }) => (
  <GlassEffect
    href={href}
    external={external}
    onClick={onClick}
    tint={tint}
    className={`rounded-2xl px-7 py-4 hover:px-8 ${className}`}
  >
    <div
      className="transition-all duration-700 hover:scale-[0.98] whitespace-nowrap"
      style={{ transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 2.2)' }}
    >
      {children}
    </div>
  </GlassEffect>
);

export const GlassFilter: React.FC = () => (
  <svg style={{ display: 'none' }} aria-hidden>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="200"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);
