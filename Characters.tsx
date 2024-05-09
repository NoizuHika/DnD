import React from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const handleGoBack = () => {
     navigation.navigate('LoggedScreen');
  };

  const handleCharacterPress = (characterName) => {
     //proba na przyszlosc czy dziala
     console.log(`Character ${characterName} pressed`);
  };

  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >

      <Text style={styles.appName}>DMBook</Text>


      <View style={styles.characterRow}>
              <TouchableOpacity onPress={() => handleCharacterPress('Character1')}>
                <ImageBackground
                  source={require('./assets/assasin.png')}
                  style={styles.characterImage}
                >
                  <Text style={[styles.characterStatus, {color:'rgba(0,255,0,1)' }]}>Available</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCharacterPress('Character2')}>
                <ImageBackground
                  source={require('./assets/swordsman.png')}
                  style={styles.characterImage}
                >
                  <Text style={[styles.characterStatus, {color:'red' }]}>In session</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCharacterPress('Character3')}>
                <ImageBackground
                  source={require('./assets/magician.png')}
                  style={styles.characterImage}
                >
                  <Text style={[styles.characterStatus, {color:'yellow' }]}>To finish</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>

            <View style={styles.characterRow}>
              <TouchableOpacity onPress={() => handleCharacterPress('Character4')}>
                <ImageBackground
                  source={require('./assets/archer.png')}
                  style={styles.characterImage}
                >
                  <Text style={[styles.characterStatus, {color:'rgba(0,255,0,1)' }]}>Available</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCharacterPress('Character5')}>
                <ImageBackground
                  source={require('./assets/wizard.png')}
                  style={styles.characterImage}
                >
                  <Text style={[styles.characterStatus, {color:'red' }]}>In session</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCharacterPress('NewCharacter')}>
                <ImageBackground
                  source={require('./assets/add_new.png')}
                  style={styles.characterImage}
                >
                  <Text style={[styles.characterStatus, {color:'white' }]}>Create new</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>


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
  characterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  characterImage: {
    width: 100,
    height: 100,
    margin: 10,
    justifyContent: 'flex-end',
  },
    characterStatus: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    textAlign: 'center',
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

export default HomeScreen;
