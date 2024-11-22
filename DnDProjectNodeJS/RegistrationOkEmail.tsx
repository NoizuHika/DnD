import React, { useState, useContext } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, Button, StyleSheet, TextInput } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const RegistrationOkEmail = () => {
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

    <Text style={[styles.appName, { color: theme.fontColor }]}>DMBook</Text>

    <Text style={styles.message}>{t('Registration_confirmation')}</Text>

    <TouchableOpacity style={styles.okButton} onPress={handleOkPress}>
       <Text style={styles.okButtonText}>Ok</Text>
    </TouchableOpacity>

    </ImageBackground>
    );
  };

export default RegistrationOkEmail;