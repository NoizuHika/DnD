import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English', flag: require('./assets/flags/English.png') },
  { code: 'pl', label: 'Polski', flag: require('./assets/flags/Polish.png') },
  { code: 'ua', label: 'Українська', flag: require('./assets/flags/Ukraine.png') },
  { code: 'ru', label: 'Русский', flag: require('./assets/flags/russia.png') }
];

const HomeScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setCurrentLang(code);
    setDropdownVisible(false);
  };

  const handleLoginPress = () => {
        navigation.navigate('LogIn');
  };
  const handleRegistrationPress = () => {
        navigation.navigate('Registration');
  };
  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >
       <Text style={styles.appName}>DMBook</Text>
       <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {handleLoginPress()}}>
                <Text style={styles.buttonText}>{t('Login')}</Text>
          </TouchableOpacity>
       </View>

       <View style={[styles.buttonContainer, { bottom: 180 }]}>
          <TouchableOpacity style={styles.button} onPress={() => {handleRegistrationPress()}}>
                <Text style={styles.buttonText}>{t('Registration')}</Text>
          </TouchableOpacity>
       </View>

      <View style={styles.flagsContainer}>
        <TouchableOpacity onPress={() => setDropdownVisible(!isDropdownVisible)}>
          <Image source={languages.find(lang => lang.code === currentLang).flag} style={styles.flag} />
        </TouchableOpacity>
        {isDropdownVisible && (
          <View style={styles.dropdown}>
            {languages.filter(lang => lang.code !== currentLang).map((lang) => (
              <TouchableOpacity key={lang.code} onPress={() => changeLanguage(lang.code)} style={styles.flagButton}>
                <Image source={lang.flag} style={styles.flag} />
              </TouchableOpacity>
            ))}
          </View>
        )}

      </View>
      </ImageBackground>
);
};
//  <Text style={styles.flagLabel}>{lang.label}</Text>
//  ; console.log('Кнопка "Регистрация" нажата')

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
  appName: {
      position: 'absolute',
      top: '16%',
      fontSize: 24,
      color: '#7F7F7F',
    },

  flagsContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  dropdown: {
    marginTop: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    elevation: 5,
  },
  flagButton: {
    marginVertical: 5,
  },
  flag: {
    width: 50,
    height: 30,
  },


  buttonContainer: {
      position: 'absolute',
      bottom: '35%',
      width: '30%',
      backgroundColor: 'transparent',
      borderColor: '#7F7F7F',
      alignItems: 'center',
      borderRadius: 10,
      borderWidth: 1.5,
    },
  buttonText: {
      color: '#d6d6d6',
    },
});

export default HomeScreen;
