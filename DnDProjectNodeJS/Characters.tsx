import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const Characters = ({ navigation }) => {
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

     <Text style={[styles.appName, { color: theme.fontColor }]}>DMBook</Text>


      <View style={styles.characterRow}>
              <TouchableOpacity onPress={() => handleCharacterPress('Character1')}>
                <ImageBackground
                  source={require('./assets/assasin.jpeg')}
                  style={styles.characterImage}
                >
                  <Text style={[styles.characterStatus, {color:'rgba(0,255,0,1)' }]}>{t('Available')}</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCharacterPress('Character2')}>
                <ImageBackground
                  source={require('./assets/swordsman.jpeg')}
                  style={styles.characterImage}
                >
                  <Text style={[styles.characterStatus, {color:'red' }]}>{t('In_session')}</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCharacterPress('Character3')}>
                <ImageBackground
                  source={require('./assets/Halfling-W-Druid.jpg')}
                  style={styles.characterImage}
                >
                  <Text style={[styles.characterStatus, {color:'yellow' }]}>{t('To_finish')}</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>

            <View style={styles.characterRow}>
              <TouchableOpacity onPress={() => handleCharacterPress('Character4')}>
                <ImageBackground
                  source={require('./assets/archer.jpeg')}
                  style={styles.characterImage}
                >
                  <Text style={[styles.characterStatus, {color:'rgba(0,255,0,1)' }]}>{t('Available')}</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCharacterPress('Character5')}>
                <ImageBackground
                  source={require('./assets/wizard.jpeg')}
                  style={styles.characterImage}
                >
                  <Text style={[styles.characterStatus, {color:'red' }]}>{t('In_session')}</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCharacterPress('CreateCharacter')}>
                <ImageBackground
                  source={require('./assets/Halfling-M-Warlock.jpg')}
                  style={styles.characterImage}
                >
                  <Text style={[styles.characterStatus, {color:'white' }]}>{t('Create_new')}</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>


      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={() => {handleGoBack()}} >
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      </ImageBackground>
);
};

export default Characters;
