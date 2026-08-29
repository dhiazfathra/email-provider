"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_TOGGLES,
  EMAILS,
  type Category,
  type ToggleKey,
} from "@/lib/mock/mail";
import { useViewport } from "@/lib/useViewport";

/** Palette for one theme. The dark values come straight from the mockup. */
export type Theme = {
  dark: boolean;
  bg: string;
  fg: string;
  glass: string;
  edge: string;
  card: string;
  cardEdge: string;
  accent: string;
  accentSoft: string;
  chipBg: string;
  chipFg: string;
  selected: string;
  rowHover: string;
  soft: (alpha: number) => string;
};

function makeTheme(dark: boolean): Theme {
  const soft = (a: number) =>
    dark ? `rgba(226,232,255,${a})` : `rgba(38,35,74,${a})`;
  const accentSoft = dark ? "#a9a6f8" : "#5b57c8";
  return {
    dark,
    bg: dark
      ? "linear-gradient(150deg,#141428 0%,#1b1733 40%,#101f2b 100%)"
      : "linear-gradient(150deg,#eef2ff 0%,#f6f0ff 40%,#eafaff 100%)",
    fg: dark ? "#e8e9ff" : "#26234a",
    glass: dark ? "rgba(38,36,66,.55)" : "rgba(255,255,255,.5)",
    edge: dark ? "rgba(148,150,220,.18)" : "rgba(255,255,255,.75)",
    card: dark ? "rgba(52,50,86,.5)" : "rgba(255,255,255,.6)",
    cardEdge: dark ? "rgba(148,150,220,.16)" : "rgba(255,255,255,.88)",
    accent: dark ? "#b5b2ff" : "#4c46b8",
    accentSoft,
    chipBg: dark ? "rgba(124,126,242,.3)" : "rgba(124,126,242,.14)",
    chipFg: accentSoft,
    selected: dark ? "rgba(124,126,242,.28)" : "rgba(255,255,255,.8)",
    rowHover: dark ? "rgba(124,126,242,.22)" : "rgba(255,255,255,.85)",
    soft,
  };
}

type MailState = {
  theme: Theme;
  toggles: Record<ToggleKey, boolean>;
  flip: (key: ToggleKey) => void;
  category: Category;
  setCategory: (c: Category) => void;
  selectedId: string;
  setSelectedId: (id: string) => void;
  railCollapsed: boolean;
  toggleRail: () => void;
  /** Breakpoints from the mockup: mobile < 720, tablet < 1120. */
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

const MailContext = createContext<MailState | null>(null);

export function MailProvider({ children }: { children: ReactNode }) {
  const [toggles, setToggles] = useState(DEFAULT_TOGGLES);
  const [category, setCategory] = useState<Category>("Primary");
  const [selectedId, setSelectedId] = useState(EMAILS[0].id);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const { width } = useViewport();

  const isMobile = width < 720;
  const isTablet = width >= 720 && width < 1120;

  const value = useMemo<MailState>(
    () => ({
      theme: makeTheme(toggles.dark),
      toggles,
      flip: (key) => setToggles((p) => ({ ...p, [key]: !p[key] })),
      category,
      setCategory,
      selectedId,
      setSelectedId,
      railCollapsed,
      toggleRail: () => setRailCollapsed((c) => !c),
      isMobile,
      isTablet,
      isDesktop: !isMobile && !isTablet,
    }),
    [toggles, category, selectedId, railCollapsed, isMobile, isTablet],
  );

  return (
    <MailContext.Provider value={value}>{children}</MailContext.Provider>
  );
}

export function useMail() {
  const ctx = useContext(MailContext);
  if (!ctx) throw new Error("useMail must be used inside MailProvider");
  return ctx;
}

/** The selected thread, or the first one if the id no longer resolves. */
export function useSelectedThread() {
  const { selectedId } = useMail();
  return EMAILS.find((e) => e.id === selectedId) ?? EMAILS[0];
}
