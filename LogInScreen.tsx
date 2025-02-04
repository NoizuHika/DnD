import React, { useState, useContext } from 'react';
import { ImageBackground, TouchableOpacity, Image, Text, View, Button, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { UserData } from './UserData';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { useAuth } from './AuthContext';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const LogInScreen: React.FC = () => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);

  const navigation = useNavigation();

  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const { loginUser } = useContext(UserData);
  const {setToken} = useAuth();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistrationPress = () => {
    navigation.navigate('Registration');
  };
  const handleGoBack = () => {
    navigation.navigate('Home');
  };
  const handleForgotPassPress = () => {
    navigation.navigate('ForgotPass');
  };

  const handleKontoGoogle = () => {
    navigation.navigate('KontoGoogle');
  };

  const handleKontoFacebook = () => {
    navigation.navigate('KontoFacebook');
  };

  const handleKontoApple = () => {
    navigation.navigate('KontoApple');
  };

  const handleKontynuacja = async () => {
      const loggedIn = await loginUser(login, password, setToken);
      if (loggedIn) {
            navigation.navigate('SelectionRole');
            const { setToken } = useAuth();
      } else {
        alert(t('Invalid login or password'));
      }
    };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
  <TouchableWithoutFeedback onPress={dismissKeyboard}>
  <ImageBackground
    style={[styles.container, { flex: 1 }]}
    source={theme.background}
    resizeMode="cover">

    <Text style={[styles.appName, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>DMBook</Text>

    <View style={[styles.logInContainerBackground, { padding: 20 * scaleFactor }]}>
      <Text style={[styles.titleLogin, { fontSize: fontSize * 1.2 }]}>{t('Log in')}</Text>

      <View style={styles.newUser}>
       <Text style={[styles.newUserText, { fontSize: fontSize * 1 }]}>{t('New_user')}?</Text>
        <TouchableOpacity style={styles.buttonUser} onPress={handleRegistrationPress}>
          <Text style={[styles.buttonUserText, { fontSize: fontSize * 1 }]}>{t('Create_account')}</Text>
        </TouchableOpacity>
      </View>

     <View style={styles.inputLoginPageContainer}>
      <Text style={[styles.labelLogin, { fontSize: fontSize * 1 }]}>{t('Login_nick')}</Text>
      <TextInput
        style={[styles.inputLogin, { fontSize: fontSize * 1 }]}
        value={login}
        onChangeText={setLogin}
        placeholder={t('Login_nick')}
        placeholderTextColor="#a1a1a1"
      />

      <Text style={[styles.labelPassword, { fontSize: fontSize * 1 }]}>{t('Pass')}</Text>
      <TextInput
        style={[styles.inputPassword, { fontSize: fontSize * 1 }]}
        value={password}
        onChangeText={setPassword}
        placeholder={t('Pass')}
        placeholderTextColor="#a1a1a1"
        secureTextEntry={true}
      />
     </View>

      <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassPress}>
        <Text style={[styles.forgotPasswordButtonText, { fontSize: fontSize * 1 }]}>{t('Forgot_pass')}?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.continueButton} onPress={handleKontynuacja}>
       <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackgroundContinueLogin, { height: 50 * scaleFactor, width: 200 * scaleFactor }]}>
        <Text style={[styles.continueButtonText, { fontSize: fontSize * 1.2 }]}>{t('Continue')}</Text>
       </ImageBackground>
      </TouchableOpacity>

    </View>

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

    </ImageBackground>
   </TouchableWithoutFeedback>
  );
};

export default LogInScreen;