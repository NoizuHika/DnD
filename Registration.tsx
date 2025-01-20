import React, { useState, useContext } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';
import { UserData } from './UserData';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const Registration: React.FC = () => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);

  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { registerUser } = useContext(UserData);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRegister = async () => {
    if (password === confirmPassword) {
      const response = await registerUser( login, password, email );
      navigation.navigate('RegistrationOkEmail');
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

      <Text style={[styles.appName, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>DMBook</Text>

    <View style={[styles.GeneralContainerBackground, { marginTop: 50 * scaleFactor }]}>

      <View style={styles.emailContainer}>
        <Text style={[styles.label, { fontSize: fontSize * 1 }]}>{t('Email')}</Text>
        <TextInput
          style={[styles.emailInput, { fontSize: fontSize * 1 }]}
          value={email}
          onChangeText={setEmail}
          placeholder={t('Email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.loginContainer}>
        <Text style={[styles.label, { fontSize: fontSize * 1 }]}>{t('Login_nick')}</Text>
        <TextInput
          style={[styles.loginInput, { fontSize: fontSize * 1 }]}
          placeholder={t('Login_nick')}
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
        />
      </View>

      <View style={[styles.passContainer]}>
        <Text style={[styles.label, { fontSize: fontSize * 1 }]}>{t('Pass')}</Text>
        <TextInput
          style={[styles.passInput, { fontSize: fontSize * 1 }]}
          value={password}
          onChangeText={setPassword}
          placeholder={t('Pass')}
          secureTextEntry
        />
      </View>

      <View style={styles.passContainer}>
        <Text style={[styles.label, { fontSize: fontSize * 1 }]}>{t('Confirm_pass')}</Text>
        <TextInput
          style={[styles.confirmPassInput, { fontSize: fontSize * 1 }]}
          value={confirmPassword}
          placeholder={t('Confirm_pass')}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

    </View>

      <View style={{ height: 100 * scaleFactor }}>
          <WebView
           style={{ height: 150 * scaleFactor }}
            source={require('./assets/captcha.html')}
            onMessage={onCaptchaMessage}
          />
          </View>
      <TouchableOpacity style={[styles.registerButton, { height: 50 * scaleFactor }]} onPress={handleRegister}>
        <Text style={[styles.registerButtonText, { fontSize: fontSize * 1.2 }]}>{t('Sign_up')}</Text>
      </TouchableOpacity>

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

export default Registration;