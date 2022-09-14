import { useTheme } from './hooks/useTheme';

const App = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-full" data-theme={theme === 'light' ? 'light' : 'dark'}>
      <button className="btn m-3" onClick={toggleTheme}>
        {theme}
      </button>
    </div>
  );
};

export default App;
