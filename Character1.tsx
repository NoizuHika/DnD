import React from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';

const Character1 = ({ navigation }) => {
  const handleGoBack = () => {
     navigation.navigate('Characters');
  };


  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >

      <Text style={styles.appName}></Text>

      <Text style={styles.appName}>1</Text>


       <View style={styles.GoBack}>
      <TouchableOpacity style={styles.button} onPress={() => {handleGoBack()}} >
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
    });

export default Character1;
