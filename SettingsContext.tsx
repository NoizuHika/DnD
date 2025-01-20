import React, { createContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  fontSize: number;
  scaleFactor: number;
  setFontSize: (size: number) => void;
  setScaleFactor: (factor: number) => void;
}

export const SettingsContext = createContext<SettingsContextType>({
  fontSize: 16,
  scaleFactor: 1,
  setFontSize: () => {},
  setScaleFactor: () => {},
});

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [fontSize, setFontSize] = useState(16);
  const [scaleFactor, setScaleFactor] = useState(1);

  return (
    <SettingsContext.Provider value={{ fontSize, scaleFactor, setFontSize, setScaleFactor }}>
      {children}
    </SettingsContext.Provider>
  );
};