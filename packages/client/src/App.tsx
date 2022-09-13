import { useState } from 'react';

type Theme = 'light' | 'dark';

const App = () => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div className="h-full" data-theme={theme === 'light' ? 'light' : 'dark'}>
      <button className="btn m-3" onClick={toggleTheme}>
        {theme}
      </button>
    </div>
  );
};

export default App;
