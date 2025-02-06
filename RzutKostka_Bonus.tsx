import React, { useState, useContext,useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { useAuth } from './AuthContext';
import { UserData } from './UserData';

Appearance.setColorScheme('light');

const RzutKostka_Bonus: React.FC = ({ route, navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { statValue, statName } = route.params;
  const handleGoBack = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { token } = useAuth();
  const { player, session ={} } = route.params;
  const [diceValue, setDiceValue] = useState(null);
  const [rotateValue] = useState(new Animated.Value(0));
  const [result, setResult] = useState(null);
  const [answer, setAnswer] = useState(null);
  const { ipv4 } = useContext(UserData);
useEffect(() => {
  if (answer && answer.trim().length > 0 && session) {
    fetchData(answer);
  }
}, [answer]);
  const attributes = {
    STR: t('Strength'),
    DEX: t('Dexterity'),
    CON: t('Constitution'),
    INT: t('Intelligence'),
    WIS: t('Wisdom'),
    CHA: t('Charisma'),
  };

const handleRollDice = () => {
  setDiceValue(null);
  setResult(null);



  Animated.timing(rotateValue, {
    toValue: 1,
    duration: 1000,
    easing: Easing.linear,
    useNativeDriver: true,
  }).start(() => {
    rotateValue.setValue(0);
  });


  const randomValue = Math.floor(Math.random() * 20) + 1;
  setDiceValue(randomValue);

  const finalStatValue = isNaN(statValue) || statValue === 'None' ? 0 : parseInt(statValue);

  const finalResult = randomValue + finalStatValue;
  setResult(finalResult);

  setAnswer(`${player.name} rolls for ${statName}: ${finalResult} (${randomValue}${finalStatValue >= 0 ? '+' : ''}${finalStatValue})`);
};

  const fetchData = async (answer) => {
            try {
                console.log(answer)
                const sessionResponse = await fetch(`http://${ipv4}:8000/sessions/addToLogs`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'accept': 'application/json'
                            },
                            body: JSON.stringify({ token: token.toString(),log:answer,sessionID:session.id }),
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
          {`${t('Roll for')} ${attributes[statName] ?? 'attack'}`}
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
            {`${t('Result')}: ${diceValue} ${statValue >= 0 ? '+' : ''} ${statValue} = ${result}`}
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

export default RzutKostka_Bonus;