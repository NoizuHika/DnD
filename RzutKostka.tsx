import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity,route, Animated, Easing, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { UserData } from './UserData';
import { useAuth } from './AuthContext';

Appearance.setColorScheme('light');

const diceTypes = [
  { sides: 4, image: require('./assets/dice/d4.png') },
  { sides: 6, image: require('./assets/dice/d6.png') },
  { sides: 8, image: require('./assets/dice/d8.png') },
  { sides: 10, image: require('./assets/dice/d10.png') },
  { sides: 12, image: require('./assets/dice/d12.png') },
  { sides: 20, image: require('./assets/icons/d20.png') },
  { sides: 100, image: require('./assets/dice/d100.png') },
];

const RzutKostka: React.FC = ({ route,navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { t } = useTranslation();
  const { theme, addDiceResult } = useContext(ThemeContext);
  const { player={}, session={} } = route.params;

  const [selectedDice, setSelectedDice] = useState([]);
  const [diceValues, setDiceValues] = useState([]);
  const [rotateValues] = useState(diceTypes.map(() => new Animated.Value(0)));
  const { ipv4 } = useContext(UserData);
  const { token } = useAuth();
  const handleDiceSelection = (index) => {
    const alreadySelected = selectedDice.find((dice) => dice.index === index);
    if (alreadySelected) {
      setSelectedDice(selectedDice.filter((dice) => dice.index !== index));
    } else {
      setSelectedDice([...selectedDice, { index, count: 1 }]);
    }
  };

  const handleRollDice = () => {
    const newDiceValues = [];
    const resultsSummary = [];

    selectedDice.forEach(({ index, count }) => {
      const diceResults = [];
      for (let i = 0; i < count; i++) {
        const randomValue = Math.floor(Math.random() * diceTypes[index].sides) + 1;
        diceResults.push(randomValue);
      }
      newDiceValues.push({ index, results: diceResults });
      resultsSummary.push(`${player.name} roll ${diceTypes[index].sides}: ${diceResults.join(', ')}`);

      Animated.timing(rotateValues[index], {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        rotateValues[index].setValue(0);
      });
    });

    fetchData(resultsSummary);
    setDiceValues(newDiceValues);
    addDiceResult(resultsSummary.join(' | Dice '));
  };

  const handleDiceCountChange = (index, change) => {
    const updatedDice = selectedDice.map((dice) => {
      if (dice.index === index) {
        const newCount = Math.max(dice.count + change, 1);
        return { ...dice, count: newCount };
      }
      return dice;
    });
    setSelectedDice(updatedDice);
  };

  const handleReset = () => {
    setSelectedDice([]);
    setDiceValues([]);
  };

  const renderDice = (dice, index) => {
    const spin = rotateValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const isSelected = selectedDice.find((dice) => dice.index === index);

    return (
      <TouchableOpacity
        key={index}
        style={[styles.diceContainerRzut, isSelected && styles.selectedDice, { width: 100 * scaleFactor, height: 105 * scaleFactor }]}
        onPress={() => handleDiceSelection(index)}
      >
        {isSelected && (
          <View style={styles.counterContainer}>
            <TouchableOpacity onPress={() => handleDiceCountChange(index, -1)} style={[styles.counterButton, { height: 20 * scaleFactor, width: 20 * scaleFactor }]}>
              <Text style={[styles.counterText, { fontSize: fontSize }]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.counterValue, { fontSize: fontSize }]}>{isSelected.count}</Text>
            <TouchableOpacity onPress={() => handleDiceCountChange(index, 1)} style={[styles.counterButton, { height: 20 * scaleFactor, width: 20 * scaleFactor }]}>
              <Text style={[styles.counterText, { fontSize: fontSize }]}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        <Animated.Image source={dice.image} style={[styles.diceRzut, { transform: [{ rotate: spin }], height: 80 * scaleFactor, width: 80 * scaleFactor }]} />
      </TouchableOpacity>
    );
  };
  const fetchData = async (resultsSummary) => {
            try {
                const sessionResponse = await fetch(`http://${ipv4}:8000/sessions/addToLogs`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'accept': 'application/json'
                            },
                            body: JSON.stringify({ token: token.toString(),log:resultsSummary.toString(),sessionID:session.id }),
                        });


                if (!sessionResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                    const answer = await sessionResponse.json();
                    console.log(answer)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
  };

  const renderResults = () => {
    return diceValues.map(({ index, results }) => (
      <View key={index} style={styles.resultContainer}>
        <Text style={[styles.resultText, { fontSize: fontSize }]}>
          d{diceTypes[index].sides}: {results.join(', ')}
        </Text>
      </View>
    ));
  };

  return (
    <ImageBackground source={theme.background} style={styles.container}>
     <ScrollView contentContainerStyle={styles.scrollContainerRzut}>
      <View style={styles.diceGrid}>
        {diceTypes.map((dice, index) => renderDice(dice, index))}
      </View>

      <View style={styles.buttonContainerRzut}>
        <TouchableOpacity style={[styles.rollButton, { height: 50 * scaleFactor, width: 100 * scaleFactor }]} onPress={handleRollDice}>
          <Text style={[styles.rollButtonText, { fontSize: fontSize }]}>{t('Roll')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.resetButton, { height: 50 * scaleFactor, width: 100 * scaleFactor }]} onPress={handleReset}>
          <Text style={[styles.resetButtonText, { fontSize: fontSize }]}>{t('Reset')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>{renderResults()}</View>

     </ScrollView>

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

    </ImageBackground>
  );
};

export default RzutKostka;