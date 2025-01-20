import React, { useState, useContext } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, Button, StyleSheet, TextInput, email, setEmail } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const ForgotPass: React.FC = () => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSendPress = () => {
     navigation.navigate('EmailSend'); console.log('Send request for password reset to email:', email);
  };

  return (
  <ImageBackground
    style={styles.container}
    source={theme.background}
    resizeMode="cover">

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <Text style={[styles.appName, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>DMBook</Text>

      <View style={[styles.resetForgotPassContainer, { marginVertical: 20 * scaleFactor }]}>
        <Text style={[styles.resetForgotPass, { fontSize: fontSize * 1.2 }]}>{t('Reset_pass')}</Text>
      </View>

    <Text style={[styles.emailForgotPass, { fontSize: fontSize * 1.1, marginBottom: 10 * scaleFactor }]}>{t('Enter_username_or_email')}</Text>

    <TextInput
        style={[styles.emailForgotPassInput, { height: 50 * scaleFactor, paddingHorizontal: 15 * scaleFactor, fontSize: fontSize * 1.1}]}
        placeholder="Username or email"
        value={email}
        onChangeText={setEmail}
    />

    <TouchableOpacity style={[styles.sendForgotPassEmail, { height: 50 * scaleFactor, marginTop: 10 * scaleFactor }]} onPress={handleSendPress}>
      <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 50 * scaleFactor, borderRadius: 10 * scaleFactor }]}>
        <Text style={[styles.sendForgotPassEmailText, { fontSize: fontSize * 1.2 }]}>{t('Send')}</Text>
      </ImageBackground>
    </TouchableOpacity>

    </ImageBackground>
    );
  };

export default ForgotPass;