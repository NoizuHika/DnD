import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ImageBackground, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const EncounterRun: React.FC = ({ route, navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
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

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={styles.middleEncounterContRun}>
        <TouchableOpacity style={[styles.autoRollEncounterButton, { height: 50 * scaleFactor, width: 150 * scaleFactor }]}>
          <Text style={[styles.autoRollEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Auto Roll Initiative')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.startEncounterButton, { height: 50 * scaleFactor, width: 150 * scaleFactor }]} onPress={handleStart}>
          <Text style={[styles.startEncounterButtonText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Start')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.monstersListContainer}>
      <View style={[styles.monsterRowEncounterRun, { backgroundColor: '#222' }]}>
        <Text style={[styles.cellEncounterRun, styles.cellInitiativeEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('Initiative')}</Text>
        <Text style={[styles.cellEncounterRun, styles.cellAvatarEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('Avatar')}</Text>
        <Text style={[styles.cellEncounterRun, styles.cellNameEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('Name')}</Text>
        <Text style={[styles.cellEncounterRun, styles.cellCountEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('Count')}</Text>
      </View>

        {playersFromState.map((player, index) => (
          <View
            key={`player-${index}`}
            style={[
              styles.monsterRowEncounterRun,
              index % 2 === 0 && styles.monsterRowOdd,
            ]}
          >
            <Text style={[styles.cellEncounterRun, styles.cellInitiativeEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>-</Text>
            <View style={[styles.cellEncounterRun, styles.cellAvatarEncounterRun, { height: 50 * scaleFactor, width: 50 * scaleFactor }]} />
            <View style={[styles.cellEncounterRun, styles.cellNameEncounterRun]}>
              <Text style={[styles.monsterTextEncRun, { fontSize: fontSize, color: theme.fontColor }]}>{player.name}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.acEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('AC')}: {player.ac}</Text>
                <Text style={[styles.crEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Level')}: {player.level || 'N/A'}</Text>
              </View>
            </View>
            <Text style={[styles.cellEncounterRun, styles.cellCountEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>1</Text>
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
            <Text style={[styles.cellEncounterRun, styles.cellInitiativeEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>-</Text>
            <View style={[styles.cellEncounterRun, styles.cellAvatarEncounterRun, { height: 50 * scaleFactor, width: 50 * scaleFactor }]}>
              <ImageBackground
                source={{ uri: monster.image }}
                style={[styles.avatarImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]}
              />
            </View>
            <View style={[styles.cellEncounterRun, styles.cellNameEncounterRun]}>
              <Text style={[styles.monsterTextEncRun, { fontSize: fontSize, color: theme.fontColor }]}>{monster.name}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.acEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('AC')}: {monster.ac}</Text>
                <Text style={[styles.crEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('CR')}: {monster.cr}</Text>
              </View>
            </View>
            <Text style={[styles.cellEncounterRun, styles.cellCountEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>x{monster.count}</Text>
          </View>
        ))}

      {players.length === 0 && monsters.length === 0 && (
        <Text style={[styles.monsterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('No players or monsters in this encounter')}.</Text>
      )}
      </ScrollView>

    </ImageBackground>
  );
};

export default EncounterRun;
