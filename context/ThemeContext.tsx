"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeType =
  | "default"
  | "emerald"
  | "sunset"
  | "royal"
  | "rose"
  | "ocean";

interface ThemeColors {
  primary: string;
  accent: string;
  glow: string;
}

const themes: Record<ThemeType, ThemeColors> = {
  default: {
    primary: "#0d59f2",
    accent: "#3b82f6",
    glow: "rgba(13, 89, 242, 0.4)",
  },
  emerald: {
    primary: "#10b981",
    accent: "#34d399",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  sunset: {
    primary: "#f59e0b",
    accent: "#fbbf24",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  royal: {
    primary: "#8b5cf6",
    accent: "#a78bfa",
    glow: "rgba(139, 92, 246, 0.4)",
  },
  rose: {
    primary: "#f43f5e",
    accent: "#fb7185",
    glow: "rgba(244, 63, 94, 0.4)",
  },
  ocean: {
    primary: "#0ea5e9",
    accent: "#38bdf8",
    glow: "rgba(14, 165, 233, 0.4)",
  },
};

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  availableThemes: ThemeType[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemeType>("default");

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as ThemeType;
    if (savedTheme && themes[savedTheme]) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    const colors = themes[theme];
    const root = document.documentElement;
    root.style.setProperty("--color-primary", colors.primary);
    root.style.setProperty("--color-primary-blue", colors.primary);
    root.style.setProperty("--color-accent-blue", colors.accent);
    root.style.setProperty("--primary-glow-color", colors.glow);

    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        availableThemes: Object.keys(themes) as ThemeType[],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
