import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const CreateCharacter5 = ({ navigation, route }) => {
  const { selectedClassInfo } = route.params;
  const [gold, setGold] = useState({ copper: '0', silver: '0', gold: '0', platinum: '0' });
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
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

  const handleGoBack = () => {
    navigation.navigate('CreateCharacter');
  };

  const handleContinue = () => {
    const equipment = startingEquipment[selectedClassInfo];
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
        <Text style={[styles.title, { color: theme.fontColor }]}>{t('Choose Starting Equipment or Gold')}</Text>
        <Text style={styles.subtitle}>{t('Starting Equipment')}:</Text>

        {equipment && (
          <FlatList
            data={equipment.items}
            renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
        )}

        <Text style={styles.subtitle}>{t('Or choose starting gold')}:</Text>
        <View style={styles.goldInputContainer}>
          {['copper', 'silver', 'gold', 'platinum'].map((field) => (
            <View key={field} style={styles.goldInputWrapper}>
              <Text style={styles.subtitle}>{field.charAt(0).toUpperCase() + field.slice(1)}: </Text>
              <TextInput
                style={styles.goldInput}
                keyboardType="numeric"
                onFocus={() => handleFocus(field)}
                onBlur={() => handleBlur(field)}
                onChangeText={(value) => setGold({ ...gold, [field]: value })}
                value={gold[field]}
              />
            </View>
          ))}
        </View>
        <Text style={styles.totalGold}>{t('Total Gold')}: {formattedTotalGold}</Text>
      </View>

      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

        <View style={styles.ConButtonNotes}>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.ConButtonText}>{t('Continue')}</Text>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default CreateCharacter5;
