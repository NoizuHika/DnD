import React from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';

const LoggedScreen = ({ navigation }) => {
  const handleLoginPress = () => {
        navigation.navigate('LogIn');
  };
  const handleRegistrationPress = () => {
        navigation.navigate('RzutKostka');
  };
  const handleCharactersPress = () => {
        navigation.navigate('Characters');
  };

  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >
       <Text style={styles.appName}>DMBook</Text>


       <View style={[styles.buttonContainer, {bottom: '50%' }]}>
          <TouchableOpacity style={styles.button} onPress={() => {handleCharactersPress()}}>
                <Text style={styles.buttonText}>Characters</Text>
          </TouchableOpacity>
       </View>
       <View style={[styles.buttonContainer, {bottom: '30%' }]}>
          <TouchableOpacity style={styles.button} onPress={() => {handleLoginPress()}}>
                <Text style={styles.buttonText}>Log out</Text>
          </TouchableOpacity>
       </View>
       <View style={[styles.buttonContainer, { bottom: '40%' }]}>
          <TouchableOpacity style={styles.button} onPress={() => {handleRegistrationPress()}}>
                <Text style={styles.buttonText}>Roll dice</Text>
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

export default LoggedScreen;
