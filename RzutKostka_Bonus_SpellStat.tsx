import React, { useState, useContext } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { useAuth } from './AuthContext';
import { UserData } from './UserData';

Appearance.setColorScheme('light');

const RzutKostka_Bonus_SpellStat: React.FC = ({ route, navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { statValue, spell } = route.params;

  const handleGoBack = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { token } = useAuth();
  const { player,session ={} } = route.params;
  const [diceValue, setDiceValue] = useState(null);
  const [rotateValue] = useState(new Animated.Value(0));
  const [result, setResult] = useState(null);
  const { ipv4 } = useContext(UserData);
  const [answer, setAnswer] = useState(null);

const handleRollDice = () => {
  setDiceValue(null);
  setResult(null);

  console.log(statValue);

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

     const finalResult = statValue && statValue !== 'None' && !isNaN(statValue)
             ? randomValue + parseInt(statValue)
             : randomValue;
      setResult(finalResult);


      if (session && Object.keys(session).length > 0) {

        const answerMessage = `${player.name} rolls for ${spell.name}: ${finalResult}`;
        setAnswer(answerMessage);

        fetchData(answerMessage);
        if (finalResult > 10){
            if (spell.hit){
            navigation.navigate('RzutKostka', { player:player,spell:spell,session: session });
            }
            else{navigation.goBack();
                }
            }
      }
    }, 200);
  });
};

const fetchData = async (answerMessage) => {
  try {
    console.log(answerMessage);
    const sessionResponse = await fetch(`http://${ipv4}:8000/sessions/addToLogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        token: token.toString(),
        log: answerMessage,
        sessionID: session.id,
      }),
    });

    if (!sessionResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    const ans = await sessionResponse.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <Text style={[styles.appName, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>DMBook</Text>

      <View style={styles.diceRollLabelContainer}>
        <Text style={[styles.diceRollLabelText, { color: theme.textColor, fontSize: fontSize * 1.2 }]}>
          {spell.name ? `${t('Roll for spell')} \n ${spell.name}` : `${t('Roll for stat')} ${statValue}`}
        </Text>
      </View>

      <View style={styles.diceContainer}>
        <TouchableOpacity style={styles.diceContainer} onPress={handleRollDice}>
          <Animated.Image
            source={theme.icons.d20}
            style={[styles.diceKostka, { transform: [{ rotate: spin }], width: 200 * scaleFactor, height: 200 * scaleFactor }]}
          />
          {diceValue !== null && <Text style={[styles.diceValue, { color: theme.diceColor, fontSize: fontSize * 1.5 }]}>{diceValue}</Text>}
        </TouchableOpacity>
      </View>

      {result !== null && (
        <View style={styles.resultContainer}>
          <Text style={[styles.resultTextKostka, { fontSize: fontSize * 1.2 }]}>
            {`${t('Result')}: ${diceValue} ${statValue && statValue !== 'None' && !isNaN(statValue) ? (statValue >= 0 ? '+' : '') + statValue : ''} = ${result}`}
          </Text>
        </View>
      )}

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default RzutKostka_Bonus_SpellStat;