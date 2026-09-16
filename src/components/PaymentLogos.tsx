'use client';

import React from 'react';

interface PaymentLogoProps {
  // Les quatre moyens que `payments/providers/registry.ts` sert reellement.
  // Djamo, Visa, Mastercard, CARD et CASH ont ete retires : le composant
  // dessinait leur logo sans qu'aucun adaptateur ne les honore.
  name: 'orange' | 'orange_money' | 'ORANGE_MONEY' | 'mtn' | 'mtn_momo' | 'MTN_MOMO' | 'wave' | 'WAVE' | 'moov' | 'moov_money' | 'MOOV_MONEY' | string;
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
        <text x="50" y="45" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="18" textAnchor="middle" letterSpacing="-0.5">orange</text>
        <rect x="18" y="54" width="64" height="24" rx="8" fill="#000000" />
        <text x="50" y="71" fill="#FF7900" fontFamily="sans-serif" fontWeight="900" fontSize="13" textAnchor="middle" letterSpacing="1">MONEY</text>
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
  } else {
    // Repli neutre. Il dessinait auparavant un billet legende « Especes /
    // Cash » : un moyen de paiement inconnu se presentait donc comme un
    // paiement en especes, que la plateforme n'encaisse pas. Le nom recu est
    // affiche tel quel, sans etre traduit en une methode inventee (D61).
    displayName = name;
    logoSvg = (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#64748B" />
        <rect x="22" y="34" width="56" height="32" rx="6" stroke="#FFFFFF" strokeWidth="5" fill="none" />
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
  // Les quatre moyens de paiement reellement servis par
  // `payments/providers/registry.ts`. Djamo, Visa et Mastercard etaient
  // affiches sans qu'aucun adaptateur ne les honore.
  const providers = ['orange', 'mtn', 'wave', 'moov'];

  return (
    <div className={className}>
      {providers.map((p) => (
        <PaymentLogo key={p} name={p} size={36} className="shadow-sm hover:scale-105 transition-transform" />
      ))}
    </div>
  );
}
