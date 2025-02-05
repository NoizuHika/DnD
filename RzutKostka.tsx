import React, { useState, useContext,useEffect } from 'react';
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
  const { player={}, session={},spell={}} = route?.params || {};
  const [selectedDice, setSelectedDice] = useState([]);
  const [diceValues, setDiceValues] = useState([]);
  const [rotateValues] = useState(diceTypes.map(() => new Animated.Value(0)));
  const { ipv4 } = useContext(UserData);
  const { token } = useAuth();
  const [modifier,setModifier]=useState(null)
  const handleDiceSelection = (index) => {
    const alreadySelected = selectedDice.find((dice) => dice.index === index);
    if (alreadySelected) {
      setSelectedDice(selectedDice.filter((dice) => dice.index !== index));
    } else {
      setSelectedDice([...selectedDice, { index, count: 1 }]);
    }
  };

useEffect(() => {
    applySpellSettings();
  }, [spell]);

  const applySpellSettings = () => {
    if (spell && spell.hit) {
      const dicePattern = /(\d+)d(\d+)/i;
      const hitPattern = /(?:\d+d\d+\s*\+\s*)(\d+)/i;

      const modifierMatch = hitPattern.exec(spell.hit);
      let modifier = modifierMatch ? parseInt(modifierMatch[1], 10) : 0;

      const diceMatch = dicePattern.exec(spell.hit);

        const count = parseInt(diceMatch[1], 10);
        const sides = parseInt(diceMatch[2], 10);

        const diceIndex = diceTypes.findIndex((dice) => dice.sides === sides);

          setSelectedDice([{ index: diceIndex, count }]);
            setModifier(modifier);

    }
}
  const handleRollDice = () => {
    const newDiceValues = [];
    const resultsSummary = [];
    let forFetchResult = '';
    if (spell && spell.hit) {

      selectedDice.forEach(({ index, count }) => {
        const diceResults = Array.from({ length: count }, () =>
            Math.floor(Math.random() * diceTypes[index].sides) + 1
          );

          const modifiedResults = diceResults.map(result => result + (modifier || 0));
           const finalDmg = modifiedResults.reduce((sum, value) => sum + value, 0);

          newDiceValues.push({ index, results: modifiedResults });
        resultsSummary.push(`roll ${diceTypes[index].sides}: ${modifiedResults.join(', ')}`);


          forFetchResult=(`${player.name} dealed  ${finalDmg} ${spell.damageType} dmg`);
           fetchData(forFetchResult)

        Animated.timing(rotateValues[index], {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          rotateValues[index].setValue(0);
        });
      });
  if (navigation && navigation.canGoBack()) {
         navigation.goBack();
         setTimeout(() => {
           navigation.goBack();
         }, 100);}
    } else {
        forFetchResult = [];
      selectedDice.forEach(({ index, count }) => {
        const diceResults = Array.from({ length: count }, () =>
          Math.floor(Math.random() * diceTypes[index].sides) + 1
        );

        newDiceValues.push({ index, results: diceResults });
        resultsSummary.push(`roll ${diceTypes[index].sides}: ${diceResults.join(', ')}`);

        if (player) {
          forFetchResult.push(`${player.name} roll ${diceTypes[index].sides}: ${diceResults.join(', ')}`);
        }

        Animated.timing(rotateValues[index], {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          rotateValues[index].setValue(0);
        });
      });
    }



   if (session && Object.keys(session).length > 0 && Array.isArray(forFetchResult) && forFetchResult.length > 0) {
     fetchData(forFetchResult);

     if (navigation && navigation.canGoBack()) {
       navigation.goBack();

     }
   }


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