import { TbSun, TbMoon } from 'react-icons/tb';
import { IconContext } from 'react-icons/lib';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const { themeValue, toggleTheme } = useTheme('dark');

  return (
    <button onClick={toggleTheme} className="btn">
      <IconContext.Provider value={{ size: '20' }}>
        {themeValue === 'light' ? <TbSun /> : <TbMoon />}
      </IconContext.Provider>
    </button>
  );
};

export default ThemeToggle;
