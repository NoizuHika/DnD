import React from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const handleLoginPress = () => {
        navigation.navigate('LoggedIn');
  };
  const handleRegistrationPress = () => {
        navigation.navigate('Registration');
  };
  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >
       <Text style={styles.appName}>DMBook</Text>
       <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {handleLoginPress(); console.log('Кнопка "Логин" нажата')}}>
                <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
       </View>
       <View style={[styles.buttonContainer, { bottom: 180 }]}>
          <TouchableOpacity style={styles.button} onPress={() => {handleRegistrationPress(); console.log('Кнопка "Регистрация" нажата')}}>
                <Text style={styles.buttonText}>Registration</Text>
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
  buttonContainer: {
      position: 'absolute',
      bottom: '35%',
      width: '30%',
      backgroundColor: 'transparent',
      borderColor: '#7F7F7F',
      alignItems: 'center',
      borderRadius: 10,
      borderWidth: 1.5,
    },
  buttonText: {
      color: '#d6d6d6',
    },
});

export default HomeScreen;
