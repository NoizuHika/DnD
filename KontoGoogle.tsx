import React from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

const KontoGoogle = ({ navigation }) => {

  const handleGoBack = () => {
    navigation.goBack();
  };
  const { t, i18n } = useTranslation();

  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >
       <Text style={styles.appName}>DMBook</Text>

       <Text style={styles.cos}>Google</Text>

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
    cos: {
          color: '#d6d6d6',
          fontSize: 20,
          position: 'absolute',
          top: '50%',
        }
});

export default KontoGoogle;
