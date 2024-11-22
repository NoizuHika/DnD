import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const diceTypes = [
  { sides: 4, image: require('./assets/dice/d4.png') },
  { sides: 6, image: require('./assets/dice/d6.png') },
  { sides: 8, image: require('./assets/dice/d8.png') },
  { sides: 10, image: require('./assets/dice/d10.png') },
  { sides: 12, image: require('./assets/dice/d12.png') },
  { sides: 20, image: require('./assets/icons/d20.png') },
  { sides: 100, image: require('./assets/dice/d100.png') },
];

const RzutKostka = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme, addDiceResult } = useContext(ThemeContext);

  const [selectedDice, setSelectedDice] = useState([]);
  const [diceValues, setDiceValues] = useState([]);
  const [rotateValues] = useState(diceTypes.map(() => new Animated.Value(0)));

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
      resultsSummary.push(`${diceTypes[index].sides}: ${diceResults.join(', ')}`);

      Animated.timing(rotateValues[index], {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        rotateValues[index].setValue(0);
      });
    });

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
        style={[styles.diceContainerRzut, isSelected && styles.selectedDice]}
        onPress={() => handleDiceSelection(index)}
      >
        {isSelected && (
          <View style={styles.counterContainer}>
            <TouchableOpacity onPress={() => handleDiceCountChange(index, -1)} style={styles.counterButton}>
              <Text style={styles.counterText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{isSelected.count}</Text>
            <TouchableOpacity onPress={() => handleDiceCountChange(index, 1)} style={styles.counterButton}>
              <Text style={styles.counterText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        <Animated.Image source={dice.image} style={[styles.diceRzut, { transform: [{ rotate: spin }] }]} />
      </TouchableOpacity>
    );
  };

  const renderResults = () => {
    return diceValues.map(({ index, results }) => (
      <View key={index} style={styles.resultContainer}>
        <Text style={styles.resultText}>
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
        <TouchableOpacity style={styles.rollButton} onPress={handleRollDice}>
          <Text style={styles.rollButtonText}>{t('Roll')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>{t('Reset')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>{renderResults()}</View>


      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
     </ScrollView>
    </ImageBackground>
  );
};

export default RzutKostka;
