import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const Characters: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const handleGoBack = () => {
     navigation.navigate('LoggedScreen');
  };

  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const handleCharacterPress = (characterName) => {
     console.log(`Character ${characterName} pressed`);
     navigation.navigate(characterName);
  };

  return (
  <ImageBackground
         source={theme.background}
         style={styles.container}
       >

     <Text style={[styles.appName, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>DMBook</Text>


      <View style={styles.characterRow}>
              <TouchableOpacity onPress={() => handleCharacterPress('Character1')}>
                <ImageBackground
                  source={require('./assets/assasin.jpeg')}
                  style={[styles.characterImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]}
                >
                  <Text style={[styles.characterStatus, { color: 'rgba(0,255,0,1)', fontSize: fontSize * 0.8 }]}>{t('Available')}</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCharacterPress('Character2')}>
                <ImageBackground
                  source={require('./assets/swordsman.jpeg')}
                  style={[styles.characterImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]}
                >
                  <Text style={[styles.characterStatus, {color:'red', fontSize: fontSize * 0.8 }]}>{t('In_session')}</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCharacterPress('Character3')}>
                <ImageBackground
                  source={require('./assets/Halfling-W-Druid.jpg')}
                  style={[styles.characterImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]}
                >
                  <Text style={[styles.characterStatus, {color:'yellow', fontSize: fontSize * 0.8 }]}>{t('To_finish')}</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>

            <View style={styles.characterRow}>
              <TouchableOpacity onPress={() => handleCharacterPress('Character4')}>
                <ImageBackground
                  source={require('./assets/archer.jpeg')}
                  style={[styles.characterImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]}
                >
                  <Text style={[styles.characterStatus, {color:'rgba(0,255,0,1)', fontSize: fontSize * 0.8 }]}>{t('Available')}</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCharacterPress('Character5')}>
                <ImageBackground
                  source={require('./assets/wizard.jpeg')}
                  style={[styles.characterImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]}
                >
                  <Text style={[styles.characterStatus, {color:'red', fontSize: fontSize * 0.8 }]}>{t('In_session')}</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCharacterPress('CreateCharacter')}>
                <ImageBackground
                  source={require('./assets/Halfling-M-Warlock.jpg')}
                  style={[styles.characterImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]}
                >
                  <Text style={[styles.characterStatus, {color:'white', fontSize: fontSize * 0.8 }]}>{t('Create_new')}</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>


      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      </ImageBackground>
);
};

export default Characters;
