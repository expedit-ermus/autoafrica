'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Locale, translations } from '@/lib/i18n';
import { AuthUser } from '@/shared/types';

interface AppContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (typeof translations)[Locale];
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType>({
  locale: 'fr',
  setLocale: () => {},
  t: translations.fr,
  user: null,
  setUser: () => {},
  sidebarOpen: false,
  setSidebarOpen: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppContext.Provider value={{ locale, setLocale, t: translations[locale], user, setUser, sidebarOpen, setSidebarOpen }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
