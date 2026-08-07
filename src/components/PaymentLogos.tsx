'use client';

import React from 'react';

interface PaymentLogoProps {
  name: 'orange' | 'orange_money' | 'ORANGE_MONEY' | 'mtn' | 'mtn_momo' | 'MTN_MOMO' | 'wave' | 'WAVE' | 'moov' | 'moov_money' | 'MOOV_MONEY' | 'djamo' | 'DJAMO' | 'visa' | 'mastercard' | 'card' | 'CARD' | 'cash' | 'CASH' | string;
  size?: number | string; // height/width in px or tailwind class
  className?: string;
  showName?: boolean;
}

export function PaymentLogo({ name, size = 32, className = '', showName = false }: PaymentLogoProps) {
  const norm = (name || '').toLowerCase().replace(/[^a-z_]/g, '');

  let logoSvg: React.ReactNode;
  let displayName = 'Paiement';

  if (norm.includes('orange')) {
    displayName = 'Orange Money';
    logoSvg = (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#FF7900" />
        <path d="M22 68V32H40C45.5 32 49 35.5 49 40.5C49 45.5 45.5 49 40C49 49 49 49 49 49C49 49 55 60 55 68H42.5L37.5 56H30V68H22ZM30 48.5H38.5C41 48.5 42.5 47 42.5 45C42.5 43 41 41.5 38.5 41.5H30V48.5Z" fill="white" />
        <circle cx="68" cy="50" r="14" fill="#000000" />
        <circle cx="68" cy="50" r="8" fill="#FF7900" />
      </svg>
    );
  } else if (norm.includes('mtn') || norm.includes('momo')) {
    displayName = 'MTN MoMo';
    logoSvg = (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#FFCC00" />
        <ellipse cx="50" cy="50" rx="40" ry="24" stroke="#000000" strokeWidth="6" fill="#FFCC00" />
        <text x="50" y="57" fill="#000000" fontFamily="sans-serif" fontWeight="900" fontSize="22" textAnchor="middle" letterSpacing="-1">MTN</text>
        <rect x="25" y="70" width="50" height="12" rx="6" fill="#004A97" />
        <text x="50" y="79" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="800" fontSize="9" textAnchor="middle">MoMo</text>
      </svg>
    );
  } else if (norm.includes('wave')) {
    displayName = 'Wave';
    logoSvg = (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#1DC3F4" />
        <path d="M50 20C40 20 28 35 28 52C28 66 38 78 50 78C62 78 72 66 72 52C72 35 60 20 50 20ZM50 32C55 32 60 40 60 50C60 54 58 58 55 60L45 42C47 36 50 32 50 32Z" fill="#FFFFFF" />
        <path d="M32 52C32 44 36 37 40 34L53 58C47 62 40 60 36 57C33 55 32 53 32 52Z" fill="#0D2C54" />
      </svg>
    );
  } else if (norm.includes('moov')) {
    displayName = 'Moov Money';
    logoSvg = (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#005CA9" />
        <path d="M20 30L38 68H48L66 30H54L43 55L32 30H20Z" fill="#00A859" />
        <circle cx="75" cy="50" r="14" fill="#E30613" />
        <text x="75" y="55" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="14" textAnchor="middle">M</text>
      </svg>
    );
  } else if (norm.includes('djamo')) {
    displayName = 'Djamo';
    logoSvg = (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#4F46E5" />
        <path d="M30 28H50C65 28 72 36 72 50C72 64 65 72 50 72H30V28ZM44 40V60H50C58 60 60 56 60 50C60 44 58 40 50 40H44Z" fill="#06B6D4" />
      </svg>
    );
  } else if (norm.includes('visa')) {
    displayName = 'Visa';
    logoSvg = (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#1A1F71" />
        <text x="50" y="62" fill="#F7B600" fontFamily="serif" fontWeight="900" fontStyle="italic" fontSize="32" textAnchor="middle" letterSpacing="1">VISA</text>
      </svg>
    );
  } else if (norm.includes('mastercard') || norm.includes('card')) {
    displayName = 'Mastercard';
    logoSvg = (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#111827" />
        <circle cx="38" cy="50" r="24" fill="#EB001B" />
        <circle cx="62" cy="50" r="24" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    );
  } else {
    displayName = 'Espèces / Cash';
    logoSvg = (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#10B981" />
        <rect x="20" y="32" width="60" height="36" rx="6" stroke="#FFFFFF" strokeWidth="5" fill="none" />
        <circle cx="50" cy="50" r="10" fill="#FFFFFF" />
      </svg>
    );
  }

  const dimensionStyle = typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : {};
  const sizeClass = typeof size === 'string' ? size : '';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span style={dimensionStyle} className={`inline-block shrink-0 ${sizeClass}`}>
        {logoSvg}
      </span>
      {showName && <span className="font-semibold text-gray-900 text-sm">{displayName}</span>}
    </span>
  );
}

export function PaymentLogosGroup({ className = 'flex flex-wrap items-center gap-3' }: { className?: string }) {
  const providers = ['orange', 'mtn', 'wave', 'moov', 'djamo', 'visa', 'mastercard'];

  return (
    <div className={className}>
      {providers.map((p) => (
        <PaymentLogo key={p} name={p} size={36} className="shadow-sm hover:scale-105 transition-transform" />
      ))}
    </div>
  );
}
