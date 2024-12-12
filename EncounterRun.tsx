import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ImageBackground, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';

Appearance.setColorScheme('light');

const EncounterRun = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const encounterPlayer = {
    playersFromState: [{ name: 'Player 1', ac: 15, level: 1 }],
  };

  const [playersFromState, setPlayersFromState] = useState(encounterPlayer.playersFromState || []);

  const { encounter } = route.params || {};
  const players = encounter?.players || [];
  const monsters = encounter?.monsters || [];

// Dla Kuby
//   const addPlayer = (newPlayer) => {
//     setPlayers([...players, newPlayer]);
//   };
//
//   const updatePlayer = (index, updatedPlayer) => {
//     const updatedPlayers = players.map((player, i) =>
//       i === index ? { ...player, ...updatedPlayer } : player
//     );
//     setPlayers(updatedPlayers);
//   };
//
//   const removePlayer = (index) => {
//     setPlayers(players.filter((_, i) => i !== index));
//   };
  useEffect(() => {
    const fetchPlayers = async () => {
      const fetchedPlayers = [
        { name: 'Player 1', ac: 15, level: 1 },
        { name: 'Player 2', ac: 14, level: 2 },
      ];
      setPlayers(fetchedPlayers);
    };

    // fetchPlayers();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleStart = () => {
    navigation.navigate('EncounterRunStart', { encounter: { ...encounter, players: playersFromState },});
  };

  return (
    <ImageBackground source={theme.background} style={styles.containerEncounterRun}>
      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={styles.middleEncounterContRun}>
        <TouchableOpacity style={styles.autoRollEncounterButton}>
          <Text style={styles.autoRollEncounterText}>{t('Auto Roll Initiative')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startEncounterButton} onPress={handleStart}>
          <Text style={styles.startEncounterButtonText}>{t('Start')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.monstersListContainer}>
      <View style={[styles.monsterRowEncounterRun, { backgroundColor: '#222' }]}>
        <Text style={[styles.cellEncounterRun, styles.cellInitiativeEncounterRun]}>{t('Initiative')}</Text>
        <Text style={[styles.cellEncounterRun, styles.cellAvatarEncounterRun]}>{t('Avatar')}</Text>
        <Text style={[styles.cellEncounterRun, styles.cellNameEncounterRun]}>{t('Name')}</Text>
        <Text style={[styles.cellEncounterRun, styles.cellCountEncounterRun]}>{t('Count')}</Text>
      </View>

        {playersFromState.map((player, index) => (
          <View
            key={`player-${index}`}
            style={[
              styles.monsterRowEncounterRun,
              index % 2 === 0 && styles.monsterRowOdd,
            ]}
          >
            <Text style={[styles.cellEncounterRun, styles.cellInitiativeEncounterRun]}>-</Text>
            <View style={[styles.cellEncounterRun, styles.cellAvatarEncounterRun]} />
            <View style={[styles.cellEncounterRun, styles.cellNameEncounterRun]}>
              <Text style={styles.monsterTextEncRun}>{player.name}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.acEncounterText}>{t('AC')}: {player.ac}</Text>
                <Text style={styles.crEncounterText}>{t('Level')}: {player.level || 'N/A'}</Text>
              </View>
            </View>
            <Text style={[styles.cellEncounterRun, styles.cellCountEncounterRun]}>1</Text>
          </View>
        ))}

        {monsters.map((monster, index) => (
          <View
            key={`monster-${index}`}
            style={[
              styles.monsterRowEncounterRun,
              (playersFromState.length + index) % 2 === 0 && styles.monsterRowOdd,
            ]}
          >
            <Text style={[styles.cellEncounterRun, styles.cellInitiativeEncounterRun]}>-</Text>
            <View style={[styles.cellEncounterRun, styles.cellAvatarEncounterRun]}>
              <ImageBackground
                source={{ uri: monster.image }}
                style={styles.avatarImage}
              />
            </View>
            <View style={[styles.cellEncounterRun, styles.cellNameEncounterRun]}>
              <Text style={styles.monsterTextEncRun}>{monster.name}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.acEncounterText}>{t('AC')}: {monster.ac}</Text>
                <Text style={styles.crEncounterText}>{t('CR')}: {monster.cr}</Text>
              </View>
            </View>
            <Text style={[styles.cellEncounterRun, styles.cellCountEncounterRun]}>x{monster.count}</Text>
          </View>
        ))}

      {players.length === 0 && monsters.length === 0 && (
        <Text style={styles.monsterText}>{t('No players or monsters in this encounter')}.</Text>
      )}
      </ScrollView>

    </ImageBackground>
  );
};

export default EncounterRun;
