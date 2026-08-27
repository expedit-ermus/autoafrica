'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function WhatsAppWidget() {
  const { locale } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  useEffect(() => {
    // Show widget with a small delay for smooth entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Setup intersection observer to detect footer
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsFooterVisible(entries[0].isIntersecting);
      },
      { rootMargin: '50px' }
    );

    observer.observe(footer);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (isDismissed) return null;

  const phoneNumber = '+2250700000000';
  const message = L(
    'Bonjour AutoAfrique, je cherche une pièce auto...',
    'Hello AutoAfrique, I am looking for a car part...'
  );
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div 
      className={`fixed right-6 z-50 transition-all duration-500 ease-out flex flex-col items-end gap-2
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        ${isFooterVisible ? 'bottom-24 md:bottom-32' : 'bottom-6'}
      `}
    >
      <div className="relative group">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20b858] text-white rounded-full shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 hover:scale-105 active:scale-95"
          aria-label={L('Nous contacter sur WhatsApp', 'Contact us on WhatsApp')}
          title={L("Besoin d'aide ? Contactez-nous sur WhatsApp", "Need help? Contact us on WhatsApp")}
        >
          {/* Notification Badge */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#FF6B35] border-2 border-white rounded-full animate-pulse"></span>
          
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-8 h-8 md:w-9 md:h-9"
          >
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 1.706.44 3.313 1.22 4.723L2.25 21.75l5.174-1.157A9.702 9.702 0 0012 21.75c5.385 0 9.75-4.365 9.75-9.75s-4.365-9.75-9.75-9.75zm4.846 13.567c-.206.582-1.196 1.107-1.688 1.159-.444.047-.999.083-2.915-.713-2.34-1.04-3.83-3.415-3.947-3.571-.115-.157-.941-1.25-.941-2.384 0-1.134.582-1.688.788-1.921.206-.233.447-.291.597-.291.151 0 .302 0 .428.006.132.006.31-.052.484.368.181.442.597 1.458.65 1.564.052.105.086.233.01.39-.077.157-.116.255-.233.39-.115.136-.245.298-.35.415-.116.12-.236.253-.102.484.133.232.594.986 1.275 1.596.883.788 1.621 1.037 1.854 1.152.232.115.367.098.503-.057.135-.156.582-.676.737-.91.155-.233.31-.192.518-.115.207.076 1.309.617 1.534.73.224.113.375.17.428.266.052.096.052.56-.154 1.141z" clipRule="evenodd" />
          </svg>
        </a>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -left-2 bg-white text-slate-500 hover:text-slate-800 border border-slate-200 rounded-full p-1 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 z-10"
          aria-label={L('Fermer le widget WhatsApp', 'Close WhatsApp widget')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
