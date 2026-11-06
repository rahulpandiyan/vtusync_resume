'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { EditorSection } from './header/resume-editor-tabs';

interface EditorSectionContextValue {
  section: EditorSection;
  setSection: (section: EditorSection) => void;
  isSyncAiOpen: boolean;
  setIsSyncAiOpen: (open: boolean) => void;
  isScoreOpen: boolean;
  setIsScoreOpen: (open: boolean) => void;
}

const EditorSectionContext = createContext<EditorSectionContextValue>({
  section: 'basic',
  setSection: () => {},
  isSyncAiOpen: false,
  setIsSyncAiOpen: () => {},
  isScoreOpen: false,
  setIsScoreOpen: () => {},
});

export function EditorSectionProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<EditorSection>('basic');
  const [isSyncAiOpen, setIsSyncAiOpen] = useState(false);
  const [isScoreOpen, setIsScoreOpen] = useState(false);

  const setSectionStable = useCallback((s: EditorSection) => setSection(s), []);

  const value = useMemo(() => ({
    section,
    setSection: setSectionStable,
    isSyncAiOpen,
    setIsSyncAiOpen,
    isScoreOpen,
    setIsScoreOpen,
  }), [section, setSectionStable, isSyncAiOpen, isScoreOpen]);

  return <EditorSectionContext.Provider value={value}>{children}</EditorSectionContext.Provider>;
}

export function useEditorSection() {
  return useContext(EditorSectionContext);
}
