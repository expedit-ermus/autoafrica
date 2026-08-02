'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useState, useEffect, useRef } from 'react';

const menuItems = [
  { key: 'dashboard', icon: 'home', href: '/dashboard', badge: 0 },
  { key: 'marketplace', icon: 'store', href: '/dashboard/marketplace', badge: 0 },
  { key: 'vehicles', icon: 'car', href: '/dashboard/vehicles', badge: 0 },
  { key: 'suppliers', icon: 'truck', href: '/dashboard/suppliers', badge: 0 },
  { key: 'purchaseOrders', icon: 'clipboard', href: '/dashboard/purchase-orders', badge: 0 },
  { key: 'containers', icon: 'shipping', href: '/dashboard/containers', badge: 0 },
  { key: 'customs', icon: 'shield-check', href: '/dashboard/customs', badge: 0 },
  { key: 'delivery', icon: 'truck-delivery', href: '/dashboard/delivery', badge: 0 },
  { key: 'notifications', icon: 'bell', href: '/dashboard/notifications', badge: 0 },
  { key: 'orders', icon: 'file-text', href: '/dashboard/orders', badge: 5 },
  { key: 'inventory', icon: 'package', href: '/dashboard/inventory', badge: 0 },
  { key: 'crm', icon: 'users', href: '/dashboard/crm', badge: 12 },
  { key: 'finance', icon: 'dollar-sign', href: '/dashboard/finance', badge: 0 },
  { key: 'payments', icon: 'credit-card', href: '/dashboard/payments', badge: 0 },
  { key: 'analytics', icon: 'bar-chart-2', href: '/dashboard/analytics', badge: 0 },
  { key: 'admin', icon: 'shield', href: '/dashboard/admin', badge: 0 },
  { key: 'settings', icon: 'settings', href: '/dashboard/settings', badge: 0 },
  { key: 'help', icon: 'help-circle', href: '/dashboard/help', badge: 0 },
];

const mobileTabKeys = ['dashboard', 'marketplace', 'orders', 'inventory', 'crm'];

function SvgIcon({ name, className = 'w-5 h-5' }: { name: string; className?: string }) {
  const props = { className, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.5 };
  switch (name) {
    case 'home':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>);
    case 'package':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>);
    case 'store':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>);
    case 'car':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>);
    case 'truck':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>);
    case 'truck-delivery':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>);
    case 'clipboard':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>);
    case 'shipping':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>);
    case 'shield-check':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>);
    case 'shopping-cart':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>);
    case 'file-text':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>);
    case 'bell':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>);
    case 'users':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>);
    case 'dollar-sign':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
    case 'credit-card':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>);
    case 'bar-chart-2':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>);
    case 'user':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>);
    case 'settings':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
    case 'help-circle':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>);
    case 'shield':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>);
    case 'more-horizontal':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>);
    case 'x':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
    case 'chevron-left':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>);
    case 'chevron-right':
      return (<svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>);
    default:
      return null;
  }
}

export default function Sidebar() {
  const { t, user, sidebarOpen, setSidebarOpen } = useApp();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Closing the menu on route change is a single, non-cascading update; there is no
  // simpler pattern that satisfies both this rule and react-hooks/refs (which forbids
  // the ref-comparison alternative).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMoreOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  const tabItems = menuItems.filter((item) => mobileTabKeys.includes(item.key));
  const moreItems = menuItems.filter((item) => !mobileTabKeys.includes(item.key));
  const activeMoreItem = moreItems.find((item) => isActive(item.href));

  const handleDesktopEnter = () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); setExpanded(true); };
  const handleDesktopLeave = () => { hoverTimeoutRef.current = setTimeout(() => setExpanded(false), 150); };

  return (
    <>
      {/* ─── Desktop sidebar ─── */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-full z-50 flex-col transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: '#0F172A',
          width: expanded ? '240px' : '72px',
        }}
        onMouseEnter={handleDesktopEnter}
        onMouseLeave={handleDesktopLeave}
      >
        {/* Top gradient line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400" />

        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/25">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span
              className="text-white font-bold text-[15px] whitespace-nowrap overflow-hidden transition-all duration-300"
              style={{ maxWidth: expanded ? '160px' : '0px', opacity: expanded ? 1 : 0 }}
            >
              AutoAfrique
            </span>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto scrollbar-thin">
          <div className="space-y-1">
            {menuItems.map(({ key, icon, href, badge }) => {
              const active = isActive(href);
              return (
                <Link
                  key={key}
                  href={href}
                  className={`relative flex items-center h-11 rounded-xl transition-all duration-200 group ${
                    active
                      ? 'bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent text-orange-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                  style={{
                    paddingLeft: expanded ? '12px' : '0',
                    paddingRight: expanded ? '12px' : '0',
                    justifyContent: expanded ? 'flex-start' : 'center',
                    boxShadow: active ? '0 0 20px rgba(249, 115, 22, 0.15)' : 'none',
                  }}
                >
                  {/* Active left border */}
                  {active && (
                    <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-orange-400 to-orange-600 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                  )}

                  <div className={`flex-shrink-0 w-5 h-5 transition-transform duration-200 ${active ? 'text-orange-400' : 'text-slate-400 group-hover:text-white'}`}>
                    <SvgIcon name={icon} />
                  </div>

                  <span
                    className="ml-3 text-[13px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300"
                    style={{ maxWidth: expanded ? '160px' : '0px', opacity: expanded ? 1 : 0 }}
                  >
                    {t.nav[key as keyof typeof t.nav]}
                  </span>

                  {/* Badge */}
                  {badge > 0 && (
                    <span
                      className={`absolute flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300 ${
                        expanded ? 'right-3' : 'top-1.5 -right-0.5'
                      }`}
                    >
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info */}
        <div
          className={`border-t border-white/[0.06] p-3 transition-all duration-300 ${
            expanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {user && (
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 ring-2 ring-orange-500/20">
                <span className="text-white text-xs font-bold">
                  {(user.firstName || 'U')[0]}{(user.lastName || '')[0]}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.firstName || 'User'} {user.lastName || ''}</p>
                <p className="text-slate-400 text-xs truncate">{user.email || ''}</p>
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
          style={{ opacity: expanded ? 1 : 0 }}
        >
          <SvgIcon name={expanded ? 'chevron-left' : 'chevron-right'} className="w-3.5 h-3.5" />
        </button>
      </aside>

      {/* ─── Mobile overlay ─── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── Mobile bottom tab bar ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div
          className="bg-white/80 backdrop-blur-xl border-t border-white/20"
          style={{
            boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.08), 0 -1px 6px rgba(0, 0, 0, 0.04)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="flex items-center justify-around h-[64px] max-w-lg mx-auto px-2">
            {tabItems.map(({ key, icon, href, badge }) => {
              const active = isActive(href);
              return (
                <Link
                  key={key}
                  href={href}
                  className={`relative flex flex-col items-center justify-center w-14 h-full transition-all duration-200 rounded-2xl ${
                    active
                      ? 'text-orange-500 bg-orange-500/10'
                      : 'text-gray-400 active:scale-90'
                  }`}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute -top-0.5 w-6 h-[3px] rounded-b-full bg-gradient-to-r from-orange-400 to-orange-500 shadow-[0_2px_8px_rgba(249,115,22,0.4)]" />
                  )}

                  <div className={`relative transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                    <SvgIcon name={icon} className="w-[22px] h-[22px]" />

                    {/* Badge */}
                    {badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-[14px] h-[14px] px-[3px] text-[8px] font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-sm">
                        {badge > 99 ? '99+' : badge}
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] mt-1.5 leading-none font-medium transition-colors ${active ? 'text-orange-500' : ''}`}>
                    {t.nav[key as keyof typeof t.nav]}
                  </span>
                </Link>
              );
            })}

            {/* More button */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex flex-col items-center justify-center w-14 h-full transition-all duration-200 rounded-2xl ${
                  activeMoreItem ? 'text-orange-500 bg-orange-500/10' : moreOpen ? 'text-gray-900 bg-gray-100' : 'text-gray-400 active:scale-90'
                }`}
              >
                <div className={`transition-transform duration-200 ${moreOpen ? 'rotate-90' : ''}`}>
                  <SvgIcon name={moreOpen ? 'x' : 'more-horizontal'} className="w-[22px] h-[22px]" />
                </div>
                <span className="text-[10px] mt-1.5 font-medium leading-none">Plus</span>
              </button>

              {/* More menu popup */}
              {moreOpen && (
                <div className="absolute bottom-full right-0 mb-3 w-56 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white/95 backdrop-blur-xl animate-fade-in">
                  <div className="p-2">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">More</p>
                    </div>
                    {moreItems.map(({ key, icon, href, badge }) => {
                      const active = isActive(href);
                      return (
                        <Link
                          key={key}
                          href={href}
                          onClick={() => setMoreOpen(false)}
                          className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                            active
                              ? 'bg-orange-50 text-orange-600 font-semibold'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <SvgIcon name={icon} className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium flex-1">{t.nav[key as keyof typeof t.nav]}</span>
                          {badge > 0 && (
                            <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                              {badge > 99 ? '99+' : badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
