import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground,Modal } from 'react-native';
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
  const { encounter,monstersBase,playersBase,campaign } = route.params || {};
  const players = playersBase || [];
  const monsters = monstersBase || [];
  const [visibleMonster, setVisibleMonster] = useState(false);
  const [selectedMonster,setSelectedMonster] = useState(null);
  const [entities, setEntities] = useState([
    ...players.map(player => ({ ...player, type: 'player', id: player.id+100 || 10 })),
   ...monsters.map((monster, index) => ({
       ...monster,
       type: 'monster',
       id: index,
       hp: monster.actualHP || 10,
    })),
    ]);
  const [turn, setTurn] = useState(1);

  const isPlayerDead = entities.some(entity => entity.type === 'player' && entity.actualHP === 0);

  const areMonstersAlive = entities.some(entity => entity.type === 'monster' && entity.actualHP > 0);
  const session = campaign.sessions[campaign?.sessions.length - 1];
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
      const aliveEntities = entities.filter(entity => entity.actualHP > 0);
      if (aliveEntities.length === 0) return 0;

      let nextIndex = (prevIndex + 1) % aliveEntities.length;

      while (aliveEntities[nextIndex]?.hp === 0) {
        nextIndex = (nextIndex + 1) % aliveEntities.length;
      }

      return nextIndex;
    });
  };
 closeMonsterModal
  const handleMonsterPress = (entity) => {
    setSelectedMonster(entity);
    setVisibleMonster(true);
  };

  const closeMonsterModal = () => {
      setSelectedMonster(null);
      setVisibleMonster(false);
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
          ? { ...entity, actualHP: Math.max(entity.actualHP + amount, 0) }
          : entity
      );

      return updatedEntities;
    });
  };

  if (isPlayerDead) {
    navigation.goBack();
    return null;
  }
  const extractActions = (text) => {
    const actionRegex = /(\w+)\.?\s(.+?)(?=(?:\n|Javelin|Summon Air Elemental|\n\n|$))/g;
    let matches = [];
    let match;
    while ((match = actionRegex.exec(text)) !== null) {
      let action = {
        name: match[1],
        description: match[2].trim(),
      };
      const hitRegex = /Hit:\s*(\d+)\s*\(\d+\w+ \+\s*\d+\)/;
      const hitMatch = hitRegex.exec(match[2]);
      if (hitMatch) {
        action.hit = hitMatch[0];
      }
      matches.push(action);
    }
    return matches;
  };
    const roll = (monster,action) => {
        setSelectedMonster(null);
        setVisibleMonster(false);
    navigation.navigate('RzutKostka_Bonus_SpellStat', { player:monster,spell:action,session: session });
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

{visibleMonster && selectedMonster && (
  <Modal visible={true} transparent={true} animationType="fade">
    <ScrollView>
                    <View style={styles.featsContainerColumn}>
                  <View style={styles.additionalInfoTitle}>
                    <Text style={styles.modalSubTitleFeats}>{selectedMonster?.base.name}</Text>
                    </View>
                  <View style={styles.additionalInfoTitle}>
                    <Text style={styles.modalSubTitleFeats}>{t('CR')}: {selectedMonster?.base.challengeRating}</Text>
                    </View>
                  <View style={styles.additionalInfoTitle}>
                    <Text style={styles.modalSubTitleFeats}>{t('Initiative')}: {selectedMonster?.base.initiative}</Text>
                    </View>
                    </View>


                      <View style={styles.rowContainer}>
                        {selectedMonster?.base.image && (
                          <ImageBackground source={{ uri: selectedMonster.image }} style={styles.modalImage} />
                        )}

                        <View style={styles.infoColumn}>
                          <View style={styles.statsRow}>
                            <View style={styles.statCircle}>
                              <Text style={styles.statValue}>{t('HP')}</Text>
                              <Text style={styles.statValue}>{selectedMonster?.base.averageHitPoints}</Text>
                            </View>
                            <View style={styles.statCircle}>
                              <Text style={styles.statValue}>{t('AC')}</Text>
                              <Text style={styles.statValue}>{selectedMonster?.base.armorClass}</Text>
                            </View>
                          </View>
                     <View style={styles.additionalInfo}>
                          <Text style={styles.featStatSmall}>{selectedMonster?.base.monsterType}</Text>
                        </View>
                    <View style={styles.additionalInfo}>
                          <Text style={styles.featStatSmall}>{selectedMonster?.base.alignment}</Text>
                        </View>
                    <View style={styles.additionalInfo}>
                          <Text style={styles.featStatSmall}>{t('Speed')}: {selectedMonster?.base.speed}</Text>
                        </View>
                        </View>
                      </View>


                    <View style={styles.statsContainerFeatsB}>
                    <View style={styles.statsContainerFeatsA}>
                      {['strScore', 'dexScore', 'conScore', 'intScore', 'wisScore', 'chaScore'].map((statbonus) => (
                        <View key={statbonus} style={styles.statBlock}>
                          <Text style={styles.statValue}>{Math.floor((selectedMonster?.base[statbonus]-10)/2)}</Text>
                              </View>
                      ))}
                    </View>
                    <View style={styles.statsContainerFeats}>
                      {['strScore', 'dexScore', 'conScore', 'intScore', 'wisScore', 'chaScore'].map((stat) => (
                        <View key={stat} style={styles.statBlock}>
                          <Text style={styles.statLabel}>{stat.slice(0, 3).toUpperCase()}: {selectedMonster?.base[stat]}</Text>
                        </View>
                      ))}
                    </View>
                    </View>

                    <View style={styles.additionalInfo}>
                      <Text style={styles.actionDescription}>{t('Skills')}: {selectedMonster?.base.skills}</Text>
                    </View>
                    <View style={styles.additionalInfo}>
                      <Text style={styles.actionDescription}>{t('Senses')}: {selectedMonster?.base.passivePerception}</Text>
                    </View>
                    <View style={styles.additionalInfo}>
                      <Text style={styles.actionDescription}>{t('Languages')}: {selectedMonster?.base.languageNoteOverride.join(', ')}</Text>
                    </View>

                    <View style={styles.additionalInfo}>

                                <Text style={styles.title}>Actions:</Text>
                                {extractActions(selectedMonster?.base?.actionDescription).map((action, index) => (
                                  <View key={index} style={styles.actionContainer}>
                                    <Text style={styles.actionDescription}>Name: {action.name}</Text>
                                    <Text style={styles.actionDescription}>Description: {action.description}</Text>
                                    {action.hit && (
                                      <TouchableOpacity onPress={() => roll(selectedMonster,action,session)}>
                                        <Text style={styles.actionDescription}>Hit: {action.hit}</Text>
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                ))}

                    </View>

                    <View style={styles.modalButtons}>


                      <TouchableOpacity onPress={closeMonsterModal} style={styles.closeButtonItem}>
                        <Text style={styles.closeButtonText}>{t('Close')}</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
  </Modal>
)}



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
          .filter(entity => entity.actualHP > 0)
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
                {entity.type =="player" ? (
                  <ImageBackground source={{ uri: entity.image } || "?"} style={[styles.avatarImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]} />
                ) : (
                   <TouchableOpacity
                        key={entity.id}
                        onPress={() => handleMonsterPress(entity)}
                      >
                        <ImageBackground
                          source={{ uri: entity.image }}
                          style={[styles.avatarImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]}
                        />
                      </TouchableOpacity>
                )}
              </View>
              <View style={[styles.cellEncounterRun, styles.cellNameEncounterRun]}>
                <Text style={[styles.monsterTextEncRun, { fontSize: fontSize, color: theme.fontColor }]}>{entity.name}</Text>
              </View>
              <View style={[styles.cellEncounterRun, styles.cellCountEncounterRun]}>
                <TouchableOpacity onPress={() => adjustHp(entity.id, -1)} style={[styles.hpButtonEncounterRun, { height: 30 * scaleFactor, width: 30 * scaleFactor }]}>
                  <Text style={[styles.hpButtonTextEncounterRun, { fontSize: fontSize }]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.hpTextEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{entity.actualHP}</Text>
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
