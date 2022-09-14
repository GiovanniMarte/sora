import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';

type Theme = 'light' | 'dark';

export const useTheme = (base: Theme) => {
  const [storedValue, setValue] = useLocalStorage<Theme>('theme', base);
  const [themeValue, setThemeValue] = useState<Theme>(storedValue);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeValue);
  }, [themeValue]);

  const toggleTheme = () => {
    const nextTheme = themeValue === 'light' ? 'dark' : 'light';
    setThemeValue(nextTheme);
    setValue(nextTheme);
  };

  return {
    themeValue,
    setThemeValue,
    toggleTheme,
  };
};
