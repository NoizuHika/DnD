import React, { createContext, useState } from 'react';

const ThemeContext = createContext();
//    backgroundColor: 'rgba(0,0,0,0.8)',
const themes = {
  theme1: {
    backgroundButton: require('../assets/font/font1.png'),
    background: require('../assets/font/dungeon.jpeg'),
    icons: {
      login: require('../assets/icons/login.png'),
      register: require('../assets/icons/register.png'),
      characters: require('../assets/icons/characters.png'),
      rolldice: require('../assets/icons/rolldice.png'),
      logout: require('../assets/icons/logout.png'),
      yourcamp: require('../assets/icons/campaign.png'),
      yourbook: require('../assets/icons/book.png'),
      library: require('../assets/icons/library.png'),
      spells: require('../assets/icons/spells.png'),
      items: require('../assets/icons/item.png'),
      feats: require('../assets/icons/feat.png'),
      settings: require('../assets/icons/settings.png'),
      images: require('../assets/icons/image.png'),
      notes: require('../assets/icons/notes.png'),
      playersession: require('../assets/icons/dmbook.png'),
      PlayerToDM: require('../assets/icons/PlayerToDM.png'),
      DMToPlayer: require('../assets/icons/DMToPlayer.png'),
      },
      fontColor: '#d6d6d6',
      textColor: '#d6d6d6',
      textHome: '#d6d6d6',
      fontSize: 20,
      fontStyle: 'italic',
      textShadowColor: 'black',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 2,
      flex: 1,
      textAlign: 'center',
  },
  theme2: {
    backgroundButton: require('../assets/font/font1.png'),
    background: require('../assets/font/background1.jpg'),
    icons: {
      login: require('../assets/icons/login1.png'),
      register: require('../assets/icons/register1.png'),
      characters: require('../assets/icons/characters1.png'),
      rolldice: require('../assets/icons/rolldice1.png'),
      logout: require('../assets/icons/logout1.png'),
      yourcamp: require('../assets/icons/campaign1.png'),
      yourbook: require('../assets/icons/book1.png'),
      library: require('../assets/icons/library1.png'),
      spells: require('../assets/icons/spells1.png'),
      items: require('../assets/icons/item1.png'),
      feats: require('../assets/icons/feat1.png'),
      settings: require('../assets/icons/settings1.png'),
      images: require('../assets/icons/image1.png'),
      notes: require('../assets/icons/notes1.png'),
      playersession: require('../assets/icons/dmbook1.png'),
      PlayerToDM: require('../assets/icons/PlayerToDM1.png'),
      DMToPlayer: require('../assets/icons/DMToPlayer1.png'),
    },
    fontColor: '#ffd700',
    textColor: '#000000',
    textHome: '#fc0000',
    fontSize: 20,
    fontStyle: 'italic',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    flex: 1,
    textAlign: 'center',
  },
  customTheme: {
    background: null,
    icons: null,
    fontColor: '#d6d6d6',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.theme1);
  const [diceResults, setDiceResults] = useState([]);

  const changeTheme = (themeName) => {
    setTheme(themes[themeName]);
  };

  const addDiceResult = (result) => {
    setDiceResults((prevResults) => [...prevResults, result]);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, diceResults, addDiceResult }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };