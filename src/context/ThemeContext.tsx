import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 移出 Provider 外以便在初始化 state 時使用
const getInitialTheme = (): Theme => {
  console.log('getInitialTheme called');

  // 如果在伺服器端渲染，無法訪問 localStorage 和 window
  console.log('typeof window', typeof window);
  if (typeof window === 'undefined') return 'light';

  // 檢查localStorage中是否有保存的主題
  const savedTheme = localStorage.getItem('theme') as Theme;
  console.log('savedTheme', savedTheme);
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) return savedTheme;

  // 從系統偏好獲取
  console.log('window.matchMedia', window.matchMedia('(prefers-color-scheme: dark)').matches);
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 使用函數直接初始化 state，避免閃爍
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // 監聽系統偏好變化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 只有當使用者沒有手動設置主題時，才跟隨系統變化
    const handleChange = (e: MediaQueryListEvent) => {
      const userSetTheme = localStorage.getItem('theme');
      if (!userSetTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    // 新版 API 用 addEventListener，舊版用 addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // @ts-ignore - 向後兼容舊版瀏覽器
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // @ts-ignore - 向後兼容舊版瀏覽器
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // 當主題改變時，更新 document 的 data-theme 屬性和 localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};