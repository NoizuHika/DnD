import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';

const CreateCharacter5 = ({ navigation, route }) => {
  const { selectedClassInfo } = route.params;
  const [gold, setGold] = useState({ copper: '0', silver: '0', gold: '0', platinum: '0' });
  const { t, i18n } = useTranslation();
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
      source={require('./assets/dungeon.jpeg')}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Choose Starting Equipment or Gold</Text>
        <Text style={styles.subtitle}>Starting Equipment:</Text>

        {equipment && (
          <FlatList
            data={equipment.items}
            renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
        )}

        <Text style={styles.subtitle}>Or choose starting gold:</Text>
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
        <Text style={styles.totalGold}>Total Gold: {formattedTotalGold}</Text>
      </View>

      <View style={styles.goBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.goBackText}>Go back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ConButton}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.ConButtonText}>Continue</Text>
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
  content: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },


  title: {
    fontSize: 24,
    color: '#d6d6d6',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#d6d6d6',
    marginTop: 10,
  },


  item: {
    fontSize: 16,
    color: '#d6d6d6',
  },


  goldInputContainer: {
    marginTop: 10,
  },
  goldInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  goldInput: {
    width: 100,
    height: 40,
    backgroundColor: '#d6d6d6',
    marginLeft: 10,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 16,
    padding: 5,
  },

  totalGold: {
    fontSize: 20,
    color: '#FFD700',
    marginTop: 20,
    textAlign: 'center',
  },
  goBack: {
    position: 'absolute',
    top: 42,
    left: 20,
    width: '20%',
    borderColor: '#7F7F7F',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
  },
  goBackText: {
    color: '#d6d6d6',
  },
  ConButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    width: '35%',
    borderWidth: 1.5,
    borderColor: '#7F7F7F',
    alignItems: 'center',
  },
  ConButtonText: {
    color: '#d6d6d6',
    fontSize: 20,
  },
});

export default CreateCharacter5;
