import React, { useState, useContext } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, Button, StyleSheet, TextInput } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';
import { UserData } from './UserData';

const Registration = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captcha, setCaptcha] = useState('');

  const { t, i18n } = useTranslation();
  const { registerUser, clearUsers } = useContext(UserData);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRegister = () => {
    if (password === confirmPassword) {
      registerUser({ email, login, password });
      navigation.navigate('RegistrationOkEmail');
    } else {
      alert(t('Passwords do not match'));
    }
  };

  return (
    <ImageBackground

      style={styles.container}
      source={require('./assets/dungeon.jpeg')}
      resizeMode="cover"
    >
      <WebView
        source={require('./assets/captcha.html')}
        style={{ flex: 1 }}
      />

      <Text style={styles.appName}>DMBook</Text>

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

      <View style={styles.captchaContainer}>
      <Text style={styles.label}>{t('Enter_captcha')}</Text>
      <TextInput
        style={styles.captchaInput}
        placeholder="Captcha"
        value={captcha}
        onChangeText={setCaptcha}
      />
      </View>

       <TouchableOpacity onPress={() => {clearUsers()}}>
           <Text>Clear Users</Text>
       </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>{t('Sign_up')}</Text>
      </TouchableOpacity>

      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack} >
          <Text style={styles.GoBackText}>{t('Go_back')}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  appName: {
    position: 'absolute',
    top: '16%',
    fontSize: 24,
    color: '#7F7F7F',
  },
  GoBack: {
    position: 'absolute',
    top: 42,
    left: 20,
    width: '20%',
    borderColor: '#7F7F7F',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
  },
  GoBackText: {
    color: '#d6d6d6',
  },
  emailContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 30,
   marginHorizontal: 10,
  },
 loginContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 30,
   marginHorizontal: 10,
  },
  passContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 10,
  },
  captchaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 10,
  },
  label: {
    color: '#d6d6d6',
    fontSize: 16,
    marginBottom: 5,
    marginRight: 10,
  },
  emailInput: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#d6d6d6',
    borderRadius: 4,
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontSize: 16,
    flex: 1,
  },
  loginInput: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#d6d6d6',
    borderRadius: 4,
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontSize: 16,
    flex: 1,
  },
  passInput: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#d6d6d6',
    borderRadius: 4,
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontSize: 16,
    flex: 1,
  },
  confirmPassInput: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#d6d6d6',
    borderRadius: 4,
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontSize: 16,
    flex: 1,
  },
  captchaInput: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#d6d6d6',
    borderRadius: 4,
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontSize: 16,
    flex: 1,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#d6d6d6',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Registration;
