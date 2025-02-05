import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { useAuth } from './AuthContext';
import { UserData } from './UserData';
Appearance.setColorScheme('light');

const CreateCharacter5: React.FC = ({ navigation, route }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { selectedClassInfo, nickname,description2,race,playerClass, image, attributes,alignment,background } = route.params;
  const [gold, setGold] = useState({ copper: '0', silver: '0', gold: '0', platinum: '0' });
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
   const { ipv4 } = useContext(UserData);
     const { token } = useAuth();
  const startingEquipment = {
    Bard: {
      items: [
        { name: 'Any simple weapon', type: 'weapon' },
        { name: 'Any musical instrument', type: 'instrument' },
        { name: 'Leather armor', type: 'armor' },
        { name: 'Dagger', type: 'weapon' },
      ],
      gold: 0
    },
    Barbarian: {
      items: [
        { name: 'Greataxe or any martial weapon', type: 'weapon' },
        { name: 'Two handaxes or any simple weapon', type: 'weapon' },
      ],
      gold: 0
    },
  };
const addCharacter = async () => {

  try {
     const requestBody = {
    description: description2,
    name:nickname,
    race:race,
    firstClass:playerClass,
    token: token,
    strScore:attributes.Strength,
  	dexScore:attributes.Dexterity,
  	conScore:attributes.Constitution,
  	intScore:attributes.Intelligence,
  	wisScore:attributes.Wisdom,
  	chaScore:attributes.Charisma,
    alignment: alignment,
    background: background,
    money: moneyforPlayer(totalGold)
};
         console.log(requestBody)
    const response = await fetch(`http://${ipv4}:8000/characters/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    console.log('New Feat:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

}
  const moneyforPlayer =()=>{
      const copperValue = parseInt(gold.copper, 10) || 0;
           const silverValue = parseInt(gold.silver, 10) || 0;
           const goldValue = parseInt(gold.gold, 10) || 0;
           const platinumValue = parseInt(gold.platinum, 10) || 0;
      money = copperValue + (silverValue * 10) + (goldValue * 100) + (platinumValue * 1000)
      return money;
      };
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
      addCharacter();
    navigation.navigate('LoggedScreen');
  };

  const handleFocus = (field) => {
    if (gold[field] === '0') {
      setGold({ ...gold, [field]: '' });
    }
  };

  const handleBlur = (field) => {
    if (gold[field] === '') {
      setGold({ ...gold, [field]: '0' });
    }
  };

  const calculateTotalGold = () => {
     const copperValue = parseInt(gold.copper, 10) || 0;
     const silverValue = parseInt(gold.silver, 10) || 0;
     const goldValue = parseInt(gold.gold, 10) || 0;
     const platinumValue = parseInt(gold.platinum, 10) || 0;

     const totalGold = (copperValue / 100) + (silverValue / 10) + goldValue + (platinumValue * 10);
     return totalGold;
   };

  const totalGold = calculateTotalGold();
  const formattedTotalGold = totalGold > 999 ? totalGold.toLocaleString() : totalGold.toFixed(2);
  const equipment = startingEquipment[selectedClassInfo];

  return (
    <ImageBackground
         source={theme.background}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>{t('Choose Starting Equipment or Gold')}</Text>
        <Text style={[styles.subtitle, { fontSize: fontSize * 1.2 }]}>{t('Starting Equipment')}:</Text>

        {equipment && (
          <FlatList
            data={equipment.items}
            renderItem={({ item }) => <Text style={[styles.item, { fontSize: fontSize }]}>{item.name}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
        )}

        <Text style={[styles.subtitle, { fontSize: fontSize * 1.2 }]}>{t('Or choose starting gold')}:</Text>
        <View style={styles.goldInputContainer}>
          {['copper', 'silver', 'gold', 'platinum'].map((field) => (
            <View key={field} style={styles.goldInputWrapper}>
              <Text style={[styles.subtitle, { fontSize: fontSize }]}>{field.charAt(0).toUpperCase() + field.slice(1)}: </Text>
              <TextInput
                style={[styles.goldInput, { height: 40 * scaleFactor, fontSize: fontSize }]}
                keyboardType="numeric"
                onFocus={() => handleFocus(field)}
                onBlur={() => handleBlur(field)}
                onChangeText={(value) => setGold({ ...gold, [field]: value })}
                value={gold[field]}
              />
            </View>
          ))}
        </View>
        <Text style={[styles.totalGold, { fontSize: fontSize * 1.2 }]}>{t('Total Gold')}: {formattedTotalGold}</Text>
      </View>

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

        <View style={[styles.ConButtonCharacter, { bottom: 10 * scaleFactor }]}>
          <TouchableOpacity style={[styles.button, { height: 25 * scaleFactor, width: 200 * scaleFactor }]} onPress={handleContinue}>
            <Text style={[styles.ConButtonText, { fontSize: fontSize }]}>{t('Continue')}</Text>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default CreateCharacter5;
