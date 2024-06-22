import React, {useState} from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';

const RzutKostka = ({ navigation }) => {
  const handleGoBack = () => {
      navigation.navigate('Character1');
    };
  const { t, i18n } = useTranslation();

  const [diceValue, setDiceValue] = useState(null);
  const [rotateValue] = useState(new Animated.Value(0));

  const handleRollDice = () => {
  const randomValue = Math.floor(Math.random() * 20) + 1;
  setDiceValue(null);
     Animated.timing(
       rotateValue,
       {
         toValue: 1,
         duration: 1000,
         easing: Easing.linear,
         useNativeDriver: true,
       }
       ).start(() => {
         rotateValue.setValue(0);
         setTimeout(() => {
            setDiceValue(randomValue)});
     });
  };

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >

      <Text style={styles.appName}>DMBook</Text>

      <View style={styles.diceContainer}>
          <TouchableOpacity style={styles.diceContainer} onPress={handleRollDice}>
              <Animated.Image
                source={require('./assets/d20.png')}
                style={[styles.dice, { transform: [{ rotate: spin }] }]}
              />
              <Text style={styles.diceValue}>{diceValue}</Text>
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
  diceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceValue: {
    position: 'absolute',
    fontSize: 48,
    fontWeight: 'bold',
    color: '#d6d6d6',
  },
  dice: {
    width: 200,
    height: 200,
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
});

export default RzutKostka;
