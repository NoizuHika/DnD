import React, { useState, useContext } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, Button, StyleSheet, TextInput } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const RegistrationOkEmail: React.FC = () => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOkPress = () => {
    navigation.navigate('LogIn');
  };
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);

  return (
  <ImageBackground
    style={styles.container}
    source={theme.background}
    resizeMode="cover">

    <Text style={[styles.appName, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>DMBook</Text>

    <Text style={[styles.message, { fontSize: fontSize * 1.2, marginVertical: 20 * scaleFactor }]}>{t('Registration_confirmation')}</Text>

    <TouchableOpacity style={styles.okButton} onPress={handleOkPress}>
       <Text style={[styles.okButtonText, { fontSize: fontSize * 1.2 }]}>Ok</Text>
    </TouchableOpacity>

    </ImageBackground>
    );
  };

export default RegistrationOkEmail;