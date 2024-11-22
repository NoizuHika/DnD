import React, { useState, useContext } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';
import { UserData } from './UserData';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const Registration = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);

  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { registerUser, clearUsers } = useContext(UserData);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRegister = () => {
    if (password === confirmPassword && captchaToken) {
      registerUser({ email, login, password });
      navigation.navigate('RegistrationOkEmail');
    } else if (!captchaToken) {
      Alert.alert(t('Captcha is required'));
    } else {
      Alert.alert(t('Passwords do not match'));
    }
  };

  const onCaptchaMessage = (event) => {
    const token = event.nativeEvent.data;
    if (token) {
      setCaptchaToken(token);
      Alert.alert(t('Captcha verified!'));
    }
  };

  return (
    <ImageBackground
      style={styles.containerReg}
      source={theme.background}
      resizeMode="cover"
    >
      <WebView
        source={require('./assets/captcha.html')}
        style={{ height: 150 }}
        onMessage={onCaptchaMessage}
      />

      <Text style={[styles.appName, { color: theme.fontColor }]}>DMBook</Text>

      <View style={styles.emailContainer}>
        <Text style={styles.label}>{t('Email')}</Text>
        <TextInput
          style={styles.emailInput}
          value={email}
          onChangeText={setEmail}
          placeholder={t('Email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.label}>{t('Login_nick')}</Text>
        <TextInput
          style={styles.loginInput}
          placeholder={t('Login_nick')}
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
        />
      </View>

      <View style={[styles.passContainer]}>
        <Text style={styles.label}>{t('Pass')}</Text>
        <TextInput
          style={styles.passInput}
          value={password}
          onChangeText={setPassword}
          placeholder={t('Pass')}
          secureTextEntry
        />
      </View>

      <View style={styles.passContainer}>
        <Text style={styles.label}>{t('Confirm_pass')}</Text>
        <TextInput
          style={styles.confirmPassInput}
          value={confirmPassword}
          placeholder={t('Confirm_pass')}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity onPress={clearUsers}>
        <Text>Clear Users</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>{t('Sign_up')}</Text>
      </TouchableOpacity>

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

export default Registration;
