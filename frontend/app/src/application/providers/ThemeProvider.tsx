import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorage } from '../../core/storage/localStorage';
import { StyleSheet } from 'react-native';

interface ThemeColors {
  primary: string;
  bg: string;
  cardBg: string;
  textMain: string;
  textMuted: string;
  divider: string;
  sectionTitle: string;
  avatarBg: string;
  avatarText: string;
  profileBorder: string;
  border: string;
  roleBadgeBg: string;
  roleBadgeText: string;
}

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => Promise<void>;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadDarkMode = async () => {
      try {
        const darkVal = await localStorage.getItem<boolean>('@settings_dark_mode');
        if (darkVal !== null) {
          setIsDarkMode(darkVal);
        }
      } catch (err) {
        console.error('Failed to load global dark mode preference', err);
      }
    };
    loadDarkMode();
  }, []);

  const toggleDarkMode = async () => {
    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await localStorage.setItem('@settings_dark_mode', newValue);
    } catch (err) {
      console.error(err);
    }
  };

  const setDarkMode = async (value: boolean) => {
    try {
      setIsDarkMode(value);
      await localStorage.setItem('@settings_dark_mode', value);
    } catch (err) {
      console.error(err);
    }
  };

  const colors: ThemeColors = {
    primary: '#4338CA',
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textMain: isDarkMode ? '#F1F5F9' : '#0F172A',
    textMuted: isDarkMode ? '#94A3B8' : '#64748B',
    divider: isDarkMode ? '#334155' : '#F1F5F9',
    sectionTitle: isDarkMode ? '#64748B' : '#94A3B8',
    avatarBg: isDarkMode ? '#312E81' : '#EEF2FF',
    avatarText: isDarkMode ? '#C7D2FE' : '#4F46E5',
    profileBorder: isDarkMode ? '#4338CA' : '#C7D2FE',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    roleBadgeBg: isDarkMode ? '#312E81' : '#EEF2FF',
    roleBadgeText: isDarkMode ? '#C7D2FE' : '#4F46E5',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * A beautiful, highly-efficient utility hook that dynamically translates static style sheets
 * to support real-time Dark Mode.
 */
export const useThemeStyles = <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(staticStyles: T): T => {
  const { isDarkMode } = useTheme();

  return React.useMemo(() => {
    if (!isDarkMode) return staticStyles;

    const mappedStyles: any = {};

    for (const key in staticStyles) {
      if (Object.prototype.hasOwnProperty.call(staticStyles, key)) {
        const styleObj = { ...staticStyles[key] } as any;
        
        // Dynamic background colors translation
        if (styleObj.backgroundColor) {
          const bg = styleObj.backgroundColor.toString().toLowerCase();
          if (bg === '#f8fafc' || bg === '#f1f5f9' || bg === '#f8fafc' || bg === '#fafafa') {
            styleObj.backgroundColor = '#0F172A';
          } else if (bg === '#ffffff' || bg === '#fff') {
            styleObj.backgroundColor = '#1E293B';
          } else if (bg === '#eef2f7' || bg === '#e2e8f0' || bg === '#d9e2f0' || bg === '#e5e7eb') {
            styleObj.backgroundColor = '#334155';
          } else if (bg === '#eff6ff' || bg === '#eef2ff' || bg === '#f0f9ff' || bg === '#e0f2fe' || bg === '#ecfdf5' || bg === '#fffbeb' || bg === '#fef2f2') {
            styleObj.backgroundColor = '#312E81';
          }
        }

        // Dynamic text colors translation
        if (styleObj.color) {
          const color = styleObj.color.toString().toLowerCase();
          if (color === '#0f172a' || color === '#07162e' || color === '#1e293b' || color === '#334155' || color === '#374151' || color === '#111827' || color === '#1e293b') {
            styleObj.color = '#F1F5F9';
          } else if (color === '#64748b' || color === '#475569' || color === '#40516d' || color === '#4f5e7b' || color === '#3b4b66') {
            styleObj.color = '#94A3B8';
          } else if (color === '#94a3b8' || color === '#8b9bb7' || color === '#cbd5e1' || color === '#94a3b8') {
            styleObj.color = '#64748B';
          }
        }

        // Dynamic borders translation
        if (styleObj.borderColor) {
          const border = styleObj.borderColor.toString().toLowerCase();
          if (border === '#eef2f7' || border === '#e2e8f0' || border === '#d9e2f0' || border === '#e5e7eb') {
            styleObj.borderColor = '#334155';
          }
        }

        if (styleObj.borderBottomColor) {
          const borderBottom = styleObj.borderBottomColor.toString().toLowerCase();
          if (borderBottom === '#eef2f7' || borderBottom === '#e2e8f0' || borderBottom === '#d9e2f0' || borderBottom === '#e5e7eb') {
            styleObj.borderBottomColor = '#334155';
          }
        }

        mappedStyles[key] = styleObj;
      }
    }

    return mappedStyles as T;
  }, [staticStyles, isDarkMode]);
};
