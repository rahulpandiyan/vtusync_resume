'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface SidebarCollapseContextValue {
  collapsed: boolean;
  toggle: () => void;
}

const SidebarCollapseContext = createContext<SidebarCollapseContextValue>({
  collapsed: false,
  toggle: () => {},
});

export function SidebarCollapseProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('resusync-sidebar-collapsed') === '1') setCollapsed(true);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('resusync-sidebar-collapsed', collapsed ? '1' : '0');
    } catch {
      // ignore
    }
  }, [collapsed, hydrated]);

  const toggle = useCallback(() => setCollapsed(v => !v), []);
  const value = useMemo(() => ({ collapsed, toggle }), [collapsed, toggle]);

  return <SidebarCollapseContext.Provider value={value}>{children}</SidebarCollapseContext.Provider>;
}

export function useSidebarCollapse() {
  return useContext(SidebarCollapseContext);
}
