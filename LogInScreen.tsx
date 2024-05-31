import React, { useState, useContext } from 'react';
import { ImageBackground, TouchableOpacity, Image, Text, View, Button, StyleSheet, TextInput } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { UserData } from './UserData';

const LogInScreen = () => {
  const navigation = useNavigation();

  const { t, i18n } = useTranslation();

  const { loginUser } = useContext(UserData);
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

  const handleKontynuacja = () => {
      const user = loginUser(login, password);
      if (user) {
            navigation.navigate('LoggedScreen');
      } else {
        alert(t('Invalid login or password'));
      }
    };

  return (
  <ImageBackground
    style={styles.container}
    source={require('./assets/dungeon.jpeg')}
    resizeMode="cover">

    <Text style={styles.appName}>DMBook</Text>

    {/* Залогинься */}
    <Text style={styles.title}>{t('Log_in')}</Text>

    {/* Новый пользователь */}
    <View style={styles.newUser}>
       <Text style={styles.newUserText}>{t('New_user')}?</Text>
       <TouchableOpacity style={[styles.buttonUser, {width: '200%' }]} onPress={() => {handleRegistrationPress()}}>
           <Text style={styles.buttonUserText}>{t('Create_account')}</Text>
       </TouchableOpacity>
    </View>

    {/* Поле для логина */}
    <Text style={styles.labelLogin}>{t('Login_nick')}</Text>
    <TextInput style={styles.inputLogin}
    value={login}
    onChangeText={setLogin}
    placeholder={t('Login_nick')} />

    {/* Поле для пароля */}
    <Text style={styles.labelPassword}>{t('Pass')}</Text>
    <TextInput style={styles.inputPassword}
    value={password}
    onChangeText={setPassword}
    placeholder={t('Pass')} secureTextEntry={true} />

    {/* Забыл пароль */}
    <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => {handleForgotPassPress()}}>
       <Text style={styles.forgotPasswordButtonText}>{t('Forgot_pass')}?</Text>
    </TouchableOpacity>

    {/* Продолжить */}
    <TouchableOpacity style={styles.continueButton} onPress={() => {handleKontynuacja()}}>
      <Text style={styles.continueButtonText}>{t('Continue')}</Text>
    </TouchableOpacity>

    {/* Разделитель */}
    <View style={styles.separator}>
    <View style={styles.separatorLine} />
       <Text style={styles.separatorText}>{t('or')}</Text>
    <View style={styles.separatorLine} />
    </View>

    {/* аккаунты */}
    <View style={styles.media}>
       <TouchableOpacity style={styles.socialGoogle} onPress={() => {handleKontoGoogle()}}>
          <Image source={require('./assets/google.webp')} style={styles.googleicon} />
          <Text style={styles.socialButtonText}>{t('Use_Google')}</Text>
       </TouchableOpacity>
       <TouchableOpacity style={styles.socialFacebook} onPress={() => {handleKontoFacebook()}}>
          <Image source={require('./assets/facebook.jpg')} style={styles.facebookicon} />
          <Text style={styles.socialButtonText}>{t('Use_Facebook')}</Text>
       </TouchableOpacity>
       <TouchableOpacity style={styles.socialApple} onPress={() => {handleKontoApple()}}>
          <Image source={require('./assets/apple.webp')} style={styles.appleicon} />
          <Text style={styles.socialButtonText}>{t('Use_Apple')}</Text>
       </TouchableOpacity>
    </View>

    <View style={styles.GoBack}>
      <TouchableOpacity style={styles.button} onPress={() => {handleGoBack()}} >
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
  title: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    fontSize: 22,
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#d6d6d6'
  },
  newUser: {
    position: 'absolute',
    top: '27%',
    left: '10%',
    alignItems: 'center',
    marginVertical: 10,
  },
  newUserText: {
    flex: 1,
    color: '#d6d6d6'
  },
  buttonUser: {
    position: 'absolute',
    backgroundColor: 'transparent',
    left: '95%'
  },
  buttonUserText: {
    color: '#007bff',
    textAlign: 'center',
  },
  labelLogin: {
    position: 'absolute',
    top: '35%',
    left: '10%',
    fontSize: 16,
    color: '#d6d6d6'
  },
  labelPassword: {
    position: 'absolute',
    marginTop: '5%',
    left: '10%',
    fontSize: 16,
    color: '#d6d6d6'
  },
  inputLogin: {
    position: 'absolute',
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#d6d6d6',
    borderRadius: 4,
    top: '39%',
    left: '9%',
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginBottom: 20,
    fontSize: 16,
    width: '60%',
    alignSelf: 'flex-start',
  },
  inputPassword: {
    position: 'absolute',
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#d6d6d6',
    top: '51%',
    borderRadius: 4,
    left: '9%',
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginBottom: 20,
    fontSize: 16,
    width: '60%',
    alignSelf: 'flex-start',
  },
  forgotPasswordButtonText: {
    position: 'absolute',
    marginTop: '11%',
    fontSize: 16,
    left: '-40%',
    color: '#007bff',
  },
  continueButton: {
    position: 'absolute',
    top: '58%',
    padding: 25,
    backgroundColor: 'transparent',
  },
  continueButtonText: {
    color: '#d6d6d6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    position: 'absolute',
    top: '65%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#d6d6d6',
  },
  separatorLine: {
    flex: 3,
    height: 1,
    backgroundColor: '#d6d6d6',
  },
  media: {
    position: 'absolute',
    top: '75%',
  },
  socialGoogle: {
    backgroundColor: 'transparent',
    borderColor: '#7F7F7F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1.5,
  },
  socialFacebook: {
    backgroundColor: '#3b5998',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  socialApple: {
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  appleicon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  facebookicon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  googleicon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  socialButtonText: {
    color: '#d6d6d6',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LogInScreen;