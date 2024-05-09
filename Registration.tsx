import React, { useState } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, Button, StyleSheet, TextInput } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

const Registration = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captcha, setCaptcha] = useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRegister = () => {
    // логика для обработки регистрации, например валидация полей и отправка данных на сервер
    navigation.navigate('RegistrationOkEmail');
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require('./assets/dungeon.jpeg')}
      resizeMode="cover">

      <WebView
                source={require('./assets/captcha.html')}
                style={{ flex: 1 }}
            />

      <Text style={styles.appName}>DMBook</Text>

      <View style={styles.inputContainer}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      </View>

      <View style={styles.inputContainer}>
      <Text style={styles.label}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Login"
        value={login}
        onChangeText={setLogin}
        autoCapitalize="none"
      />
      </View>

      <View style={[styles.inputContainer1, {left: '0%'}]}>
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input0}
        value={password}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />
      </View>

      <View style={styles.inputContainer1}>
      <Text style={styles.label}>Confirm password</Text>
      <TextInput
        style={styles.input1}
        value={confirmPassword}
        placeholder="Password"
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      </View>

      <View style={styles.inputContainer2}>
      <Text style={styles.label}>Enter the captcha</Text>
      <TextInput
        style={styles.input2}
        placeholder="Captcha"
        value={captcha}
        onChangeText={setCaptcha}
      />
      </View>


      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Sign up</Text>
      </TouchableOpacity>

      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack} >
          <Text style={styles.GoBackText}>Go back</Text>
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
    top: '5%',
    left: '5%',
    width: '20%',
    borderColor: '#7F7F7F',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
  },
  GoBackText: {
    color: '#d6d6d6',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  inputContainer1: {
    left: '0%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  inputContainer2: {
    left: '0%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    color: '#d6d6d6',
    fontSize: 16,
    marginBottom: 5,
    marginRight: 10,
  },
  input0: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#d6d6d6',
    borderRadius: 4,
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontSize: 16,
    width: '72%',
  },
  input: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#d6d6d6',
    borderRadius: 4,
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontSize: 16,
    width: '80%',
  },
  input1: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#d6d6d6',
    borderRadius: 4,
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontSize: 16,
    width: '60%',
  },
  input2: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#d6d6d6',
    borderRadius: 4,
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontSize: 16,
    width: '62%',
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
