'use client';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

interface QRCodeProps {
  data: string;
  title?: string;
  subtitle?: string;
  size?: number;
  showDownload?: boolean;
  showShare?: boolean;
  className?: string;
}

export default function QRCodeDisplay({ data, title, subtitle, size = 200, showDownload = true, showShare = true, className = '' }: QRCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const svg = document.querySelector(`#qr-${data.replace(/\W/g, '')} svg`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = size + 40;
      canvas.height = size + 80;
      ctx!.fillStyle = '#ffffff';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      ctx!.drawImage(img, 20, 10, size, size);
      ctx!.fillStyle = '#1a1a1a';
      ctx!.font = 'bold 12px Inter, sans-serif';
      ctx!.textAlign = 'center';
      if (title) ctx!.fillText(title, canvas.width / 2, size + 35);
      ctx!.font = '10px Inter, sans-serif';
      ctx!.fillStyle = '#666';
      if (subtitle) ctx!.fillText(subtitle, canvas.width / 2, size + 50);
      const link = document.createElement('a');
      link.download = `autoafrique-${data.replace(/\W/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: title || 'AutoAfrique', text: subtitle || data, url: data });
      } catch {}
    } else {
      navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div id={`qr-${data.replace(/\W/g, '')}`} className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
        <QRCodeSVG value={data} size={size} level="H" includeMargin={false}
          fgColor="#1a1a1a" bgColor="#ffffff"
          imageSettings={{ src: '', height: 0, width: 0, excavate: false }} />
      </div>
      {title && <p className="mt-3 text-sm font-bold text-gray-900">{title}</p>}
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      <div className="flex gap-2 mt-3">
        {showDownload && (
          <button onClick={handleDownload} className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-medium transition flex items-center gap-1">
            📥 Télécharger
          </button>
        )}
        {showShare && (
          <button onClick={handleShare} className="px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-xs font-medium transition flex items-center gap-1">
            📤 Partager
          </button>
        )}
        <button onClick={handleCopy} className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-medium transition flex items-center gap-1">
          {copied ? '✓ Copié' : '📋 Copier'}
        </button>
      </div>
    </div>
  );
}
