import ThemeToggle from './ThemeToggle';
import { TbWindmill } from 'react-icons/tb';
import { IconContext } from 'react-icons';

const Header = () => {
  return (
    <header className="fixed w-full backdrop-blur-lg shadow-lg">
      <IconContext.Provider value={{ size: '20' }}>
        <div className="navbar justify-between gap-1">
          <a className="btn btn-ghost normal-case text-xl">
            <TbWindmill />
            <span className="ml-2">Sora</span>
          </a>
          <ThemeToggle />
        </div>
      </IconContext.Provider>
    </header>
  );
};

export default Header;
