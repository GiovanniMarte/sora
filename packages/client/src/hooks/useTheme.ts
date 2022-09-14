import { useState } from 'react';
import useLocalStorage from './useLocalStorage';

type Theme = 'light' | 'dark';

export const useTheme = (base: Theme = 'light') => {
  const [storedValue, setValue] = useLocalStorage<Theme>('theme', base);
  const [theme, setTheme] = useState<Theme>(storedValue);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    setValue(nextTheme);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
  };
};
