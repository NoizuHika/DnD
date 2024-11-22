import React, { useState, useContext } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, Button, StyleSheet, TextInput, email, setEmail } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

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

    <Text style={styles.appName}>DMBook</Text>

    <View style={styles.separator}>
      <View style={styles.resetPassContainer}>
        <Text style={styles.resetPass}>{t('Reset_pass')}</Text>
        <View style={styles.separatorLine} />
      </View>
    </View>

    <View style={styles.GoBack}>
       <TouchableOpacity style={styles.button} onPress={handleGoBack} >
           <Text style={styles.GoBackText}>{t('Go_back')}</Text>
       </TouchableOpacity>
    </View>

    <Text style={styles.email}>{t('Enter_username_or_email')}</Text>

    <TextInput
        style={styles.emailInput}
        placeholder="Username or email"
        value={email}
        onChangeText={setEmail}
    />

    <TouchableOpacity style={styles.sendEmail} onPress={handleSendPress}>
        <Text style={styles.sendEmailText}>{t('Send')}</Text>
    </TouchableOpacity>

    </ImageBackground>
    );
  };

export default ForgotPass;