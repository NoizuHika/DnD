import React from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import PlayerCharacter from './PlayerCharacter'; // Import if using separate file

const Character1 = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.navigate('Characters');
  };

  const { t, i18n } = useTranslation();
  const calculateLargerNumber = (value) => {
      const largerNumber = Math.floor((value - 10) / 2);
      return largerNumber >= 0 ? `+${largerNumber}` : `${largerNumber}`;
    };
  // Example of creating a new PlayerCharacter instance
  const player = new PlayerCharacter(8, 15, 12, 13, 14, 15, 16, 17);
  /*
  const [characterData, setCharacterData] = useState(null);
  useEffect(() => {
        fetchData();
      }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/player_characters/0');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      // Assuming data is in the format { STR, DEX, CON, INT, WIS, CHA, AC, INIT }
      setCharacterData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error fetching data
    }
    const player = new PlayerCharacter(
        characterData.strScore,
        characterData.dexScore,
        characterData.conScore,
        characterData.intScore,
        characterData.wisScore,
        characterData.chaScore,
        characterData.armorClass,
        calculateLargerNumber(characterData.dexScore) // Assuming INIT value is not provided in the schema, using 0 for now
     );
  };
  */
  // Function to calculate the larger number

  const handleStatPress = () => {
       navigation.navigate('RzutKostka_Bonus');
    };

  return (
    <ImageBackground
      source={require('./assets/dungeon.jpeg')}
      style={styles.container}
    >
    <View style={styles.imageContainer}>
             <Image source={require('./assets/assasin.jpeg')} style={styles.image} />
       </View>
      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.GoBackText}>{t('Go_back')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statsContainer}>
            <TouchableOpacity onPress={() => handleStatPress()}>

        <View style={styles.statBox}>
          <Text style={styles.largeText}>{calculateLargerNumber(player.STR)}</Text>
          <Text style={styles.statText}>{`STR: ${player.STR}`}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.largeText}>{calculateLargerNumber(player.DEX)}</Text>
          <Text style={styles.statText}>{`DEX: ${player.DEX}`}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.largeText}>{calculateLargerNumber(player.CON)}</Text>
          <Text style={styles.statText}>{`CON: ${player.CON}`}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.largeText}>{calculateLargerNumber(player.INT)}</Text>
          <Text style={styles.statText}>{`INT: ${player.INT}`}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.largeText}>{calculateLargerNumber(player.WIS)}</Text>
          <Text style={styles.statText}>{`WIS: ${player.WIS}`}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.largeText}>{calculateLargerNumber(player.CHA)}</Text>
          <Text style={styles.statText}>{`CHA: ${player.CHA}`}</Text>
        </View>
        </TouchableOpacity>
       </View>

        <View style={styles.leftContainer}>
            <View style={styles.circleBox}>
                <Text style={styles.circleText}>{player.AC}</Text>
                <Text style={styles.circleLabel}>AC</Text>
            </View>
            <View style={styles.circleBox}>
                <Text style={styles.circleText}>{player.INIT}</Text>
                <Text style={styles.circleLabel}>Initiative</Text>
            </View>
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
  statsContainer: {
    position: 'absolute',
    top: 42,
    right: 20,
  },
  statBox: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 1.0)',
    borderRadius: 100,
    borderColor: '#7F7F7F',
    borderWidth: 1.5,
    alignItems: 'center', // Center align the text in the box
  },
  largeText: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 5, // Space between large number and stat text
  },
  statText: {
    color: '#d6d6d6',
  },
  leftContainer: {
      position: 'absolute',
      top: 70,
      left: 20,
    },
  circleBox: {
      marginVertical: 10,
      width: 70,
      height: 70,
      borderRadius: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderColor: '#7F7F7F',
      borderWidth: 1.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circleText: {
      fontSize: 24,
      color: '#ffffff',
    },
    circleLabel: {
      fontSize: 12,
      color: '#d6d6d6',
      marginTop: 2,
    },
imageContainer: {
    position: 'absolute',
    top: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderColor: '#7F7F7F',
    borderWidth: 1.5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Character1;
