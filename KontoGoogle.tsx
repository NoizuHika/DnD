import React from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';

// @ts-ignore
const KontoGoogle = ({ navigation }) => {

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >
       <Text style={styles.appName}>DMBook</Text>

       <Text style={styles.cos}>Google</Text>

       <View style={styles.GoBack}>
         <TouchableOpacity  onPress={handleGoBack} >
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
    cos: {
          color: '#d6d6d6',
          fontSize: 20,
          position: 'absolute',
          top: '50%',
        }
});

export default KontoGoogle;
