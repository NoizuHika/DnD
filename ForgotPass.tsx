import React, { useState, useContext } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, Button, StyleSheet, TextInput, email, setEmail } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';

Appearance.setColorScheme('light');

const ForgotPass = () => {
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

      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={() => {handleGoBack()}} >
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <Text style={[styles.appName, { color: theme.fontColor }]}>DMBook</Text>

      <View style={styles.resetForgotPassContainer}>
        <Text style={styles.resetForgotPass}>{t('Reset_pass')}</Text>
      </View>

    <Text style={styles.emailForgotPass}>{t('Enter_username_or_email')}</Text>

    <TextInput
        style={styles.emailForgotPassInput}
        placeholder="Username or email"
        value={email}
        onChangeText={setEmail}
    />

    <TouchableOpacity style={styles.sendForgotPassEmail} onPress={handleSendPress}>
      <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
        <Text style={styles.sendForgotPassEmailText}>{t('Send')}</Text>
      </ImageBackground>
    </TouchableOpacity>

    </ImageBackground>
    );
  };

export default ForgotPass;