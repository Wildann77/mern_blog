import { useSelector } from 'react-redux';

import React from 'react';

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-background text-foreground min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
