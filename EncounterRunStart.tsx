import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const EncounterRunStart: React.FC = ({ route, navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [currentInitiativeIndex, setCurrentInitiativeIndex] = useState(0);
  const { encounter } = route.params || {};
  const players = encounter?.players || [];
  const monsters = encounter?.monsters || [];

  const [entities, setEntities] = useState([
    ...players.map(player => ({ ...player, type: 'player', id: `${player.name}-player`, hp: player.hp || 10 })),
    ...monsters.flatMap((monster, index) =>
      Array.from({ length: monster.count }, (_, i) => ({
        ...monster,
        type: 'monster',
        id: `${monster.name}-${index}-${i}`,
        hp: monster.hp || 10,
        initiative: Math.floor(Math.random() * 20) + 1,
      }))
    ),
  ]);

  const [turn, setTurn] = useState(1);

  const isPlayerDead = entities.some(entity => entity.type === 'player' && entity.hp === 0);

  const areMonstersAlive = entities.some(entity => entity.type === 'monster' && entity.hp > 0);

  const handleNextTurn = () => {
    if (isPlayerDead) {
      navigation.goBack();
      return;
    }

    if (!areMonstersAlive) {
      return;
    }

    setTurn((prevTurn) => prevTurn + 1);

    setCurrentInitiativeIndex((prevIndex) => {
      const aliveEntities = entities.filter(entity => entity.hp > 0);
      if (aliveEntities.length === 0) return 0;

      let nextIndex = (prevIndex + 1) % aliveEntities.length;

      while (aliveEntities[nextIndex]?.hp === 0) {
        nextIndex = (nextIndex + 1) % aliveEntities.length;
      }

      return nextIndex;
    });
  };

  const handleEndEncounter = () => {
    navigation.goBack();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const adjustHp = (id, amount) => {
    setEntities((prevEntities) => {
      const updatedEntities = prevEntities.map((entity) =>
        entity.id === id
          ? { ...entity, hp: Math.max(entity.hp + amount, 0) }
          : entity
      );

      return updatedEntities;
    });
  };

  if (isPlayerDead) {
    navigation.goBack();
    return null;
  }

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
        <Text style={[styles.turnTextEncounterRun, { fontSize: fontSize * 1.2, color: theme.fontColor }]}>{t('Turn')}: {turn}</Text>

        {areMonstersAlive ? (
          <TouchableOpacity
            style={[styles.turnTextEncounterRun, { height: 50 * scaleFactor, width: 150 * scaleFactor }]}
            onPress={handleNextTurn}
          >
            <Text style={[styles.nextTurnTextEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('Next Initiative')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.endEncounterButton, { height: 50 * scaleFactor, width: 150 * scaleFactor }]}
            onPress={handleEndEncounter}
          >
            <Text style={[styles.endEncounterButtonText, { fontSize: fontSize, color: theme.fontColor }]}>{t('End Encounter')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.monstersListContainer}>
        <View style={[styles.monsterRowEncounterRun, { backgroundColor: '#222' }]}>
          <Text style={[styles.cellEncounterRun, styles.cellInitiativeEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('Initiative')}</Text>
          <Text style={[styles.cellEncounterRun, styles.cellAvatarEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('Avatar')}</Text>
          <Text style={[styles.cellEncounterRun, styles.cellNameEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('Name')}</Text>
          <Text style={[styles.cellEncounterRun, styles.cellCountEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('HP')}</Text>
        </View>

        {entities
          .filter(entity => entity.hp > 0)
          .sort((a, b) => b.initiative - a.initiative)
          .map((entity, index) => (
            <View
              key={entity.id}
              style={[
                styles.monsterRowEncounterRun,
                index % 2 === 0 && styles.monsterRowOdd,
              ]}
            >
              <Text style={[styles.cellEncounterRun, styles.cellInitiativeEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{entity.initiative || '-'}</Text>
              <View style={[styles.cellEncounterRun, styles.cellAvatarEncounterRun, { height: 50 * scaleFactor, width: 50 * scaleFactor }]}>
                {entity.type === 'monster' && entity.image ? (
                  <ImageBackground source={{ uri: entity.image }} style={[styles.avatarImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]} />
                ) : (
                  <View style={[styles.avatarImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]} />
                )}
              </View>
              <View style={[styles.cellEncounterRun, styles.cellNameEncounterRun]}>
                <Text style={[styles.monsterTextEncRun, { fontSize: fontSize, color: theme.fontColor }]}>{entity.name}</Text>
              </View>
              <View style={[styles.cellEncounterRun, styles.cellCountEncounterRun]}>
                <TouchableOpacity onPress={() => adjustHp(entity.id, -1)} style={[styles.hpButtonEncounterRun, { height: 30 * scaleFactor, width: 30 * scaleFactor }]}>
                  <Text style={[styles.hpButtonTextEncounterRun, { fontSize: fontSize }]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.hpTextEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{entity.hp}</Text>
                <TouchableOpacity onPress={() => adjustHp(entity.id, 1)} style={[styles.hpButtonEncounterRun, { height: 30 * scaleFactor, width: 30 * scaleFactor }]}>
                  <Text style={[styles.hpButtonTextEncounterRun, { fontSize: fontSize }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

        {entities.length === 0 && (
          <Text style={[styles.monsterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('No entities in this encounter')}.</Text>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default EncounterRunStart;
