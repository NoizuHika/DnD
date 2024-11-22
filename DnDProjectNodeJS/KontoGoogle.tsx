import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const KontoGoogle = ({ navigation }) => {

  const handleGoBack = () => {
    navigation.goBack();
  };
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);

  return (
  <ImageBackground
         source={theme.background}
         style={styles.container}
       >
      <Text style={[styles.appName, { color: theme.fontColor }]}>DMBook</Text>

       <Text style={styles.cos}>Google</Text>

      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      </ImageBackground>
);
};

export default KontoGoogle;
