import React, { useState, useContext } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const RzutKostka_Bonus = ({ route, navigation }) => {
  const { statValue } = route.params;
  const handleGoBack = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [diceValue, setDiceValue] = useState(null);
  const [rotateValue] = useState(new Animated.Value(0));
  const [result, setResult] = useState(null);

  const handleRollDice = () => {
    setDiceValue(null);
    setResult(null);

    const randomValue = Math.floor(Math.random() * 20) + 1;

    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      rotateValue.setValue(0);
      setTimeout(() => {
        setDiceValue(randomValue);
        setResult(randomValue + parseInt(statValue));
      }, 200);
    });
  };

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <Text style={[styles.appName, { color: theme.fontColor }]}>DMBook</Text>

      <View style={styles.diceContainer}>
        <TouchableOpacity style={styles.diceContainer} onPress={handleRollDice}>
          <Animated.Image
            source={require('./assets/icons/d20.png')}
            style={[styles.diceKostka, { transform: [{ rotate: spin }] }]}
          />
          {diceValue !== null && <Text style={[styles.diceValue, { color: theme.textColor }]}>{diceValue}</Text>}
        </TouchableOpacity>
      </View>

      {result !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTextKostka}>
            {`${diceValue} ${statValue >= 0 ? '+' : ''}${statValue} = ${result}`}
          </Text>
        </View>
      )}

      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default RzutKostka_Bonus;
