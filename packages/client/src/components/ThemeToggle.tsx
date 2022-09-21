import { TbMoon, TbSun } from 'react-icons/tb';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const { themeValue, toggleTheme } = useTheme('light');

  return (
    <button type="button" onClick={toggleTheme} className="btn btn-ghost" aria-label="Theme toggle">
      {themeValue === 'light' ? <TbSun /> : <TbMoon />}
    </button>
  );
};

export default ThemeToggle;
