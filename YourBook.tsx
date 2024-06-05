import React from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

const DMPage = ({ navigation }) => {
  const handleLoginPress = () => {
        navigation.navigate('LogIn');
  };

  const { t, i18n } = useTranslation();

  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >
       <Text style={styles.appName}>DMBook</Text>


       <View style={[styles.buttonContainer, {bottom: '30%' }]}>
          <TouchableOpacity style={styles.button} onPress={() => {handleLoginPress()}}>
                <Text style={styles.buttonText}>{t('Log_out')}</Text>
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
      width: '50%',
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

export default DMPage;
