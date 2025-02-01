import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ImageBackground, ScrollView, Modal,Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { UserData } from './UserData';

Appearance.setColorScheme('light');

const EncounterRun: React.FC = ({ route, navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { ipv4 } = useContext(UserData);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const { encounter,campaign } = route.params || {};
  const [usedEncounter, setUsedEncounter] = useState(encounter || {});
  const [players,setPlayers] = useState(encounter.players || {});
  const [monsters,setMonsters] = useState(encounter.entities || {});
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const removePlayerFromEncounter = async (player) => {
                const value = player.id
                console.log(value)
                try {
                    const response = await fetch(`http://${ipv4}:8000/encounters/${encounter.id}/removePlayer`, {
                            method: 'Delete',
                            headers: {
                                'Content-Type': 'application/json',
                                'accept': 'application/json'
                            },
                        body: JSON.stringify({id:value})
                        });


                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data= await response.json();

                          console.log('Player removed from encounter :', data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

  const addPlayersToEncounter = async () => {

                  try {
                      const response = await fetch(`http://${ipv4}:8000/encounters/${encounter.id}/addPlayers`, {
                                  method: 'POST',
                                  headers: {
                                      'Content-Type': 'application/json',
                                      'accept': 'application/json'
                                  },
                              body: JSON.stringify(selectedPlayers)
                              });


                      if (!response.ok) {
                          throw new Error('Failed to fetch data');
                      }
                      const data= await response.json();

                            console.log('Player added to encounter :', data);
                  } catch (error) {
                      console.error('Error fetching data:', error);
                  }
              setSelectedPlayers([]);
              };


  const removePlayer = (index) => {
     setPlayers(players.filter((_, i) => i !== index));
    };


  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleStart = () => {
    navigation.navigate('EncounterRunStart', { encounter:encounter,playersBase:players,monstersBase:monsters,campaign:campaign});
  };
 useEffect(() => {
      fetchData();
  }, []);

  const handleInitiative = () => {
    const updatedPlayers = players.map(player => ({
      ...player,
      initiative: Math.floor(Math.random() * 20) + 1
    }));

    const updatedMonsters = monsters.map(monster => ({
      ...monster,
      initiative: Math.floor(Math.random() * 20) + 1
    }));

    updatedPlayers.sort((a, b) => b.initiative - a.initiative);
    updatedMonsters.sort((a, b) => b.initiative - a.initiative);

    setPlayers(updatedPlayers);
    setMonsters(updatedMonsters);

    console.log('Updated Players with Initiative:', updatedPlayers);
    console.log('Updated Monsters with Initiative:', updatedMonsters);
  };
  const handleSelectPlayer = (player) => {
      console.log(player.id);
      if (selectedPlayers.includes(player.id)) {
        setSelectedPlayers(selectedPlayers.filter(id => id !== player.id));
      } else {
        setSelectedPlayers([...selectedPlayers, player.id]);
      }
    };

  const fetchData = async () => {

                  const entityAnswer = encounter.entities.map(entity => entity.baseID);

              try {
                  const response = await fetch(`http://${ipv4}:8000/bestiaries/list`, {
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'application/json',
                                  'accept': 'application/json'
                              },
                          body: JSON.stringify(entityAnswer)
                          });


                  if (!response.ok) {
                      throw new Error('Failed to fetch data');
                  }

                  const data= await response.json();

                    const updatedEntities = encounter.entities.map(entity => {

                                const entityData = data.bestiaries.find(bestiary => bestiary.id === entity.baseID);
                                if (entityData) {

                                    return { ...entity, base: entityData };
                                }
                                return entity;
                            });
                        console.log('Updated Entity Base:', updatedEntities);
                            setUsedEncounter({ ...encounter, entities: updatedEntities });
                            setMonsters(updatedEntities);
              } catch (error) {
                  console.error('Error fetching data:', error);
              }
          };
  const handleAddPlayer = () => {
      setSelectedPlayers([]);
    setVisibleAdd(true);
  };


  return (
    <ImageBackground source={theme.background} style={styles.containerEncounterRun}>

{visibleAdd && (
  <Modal visible={true} transparent={true} animationType="fade">
    <View style={styles.modalOverlayItems}>

      <View style={styles.playersListContainer}>
        {campaign.characters.map(player => (
          <TouchableOpacity
            key={player.id}
            style={[
              styles.playerAvatar,
              selectedPlayers.includes(player.id) && styles.selectedPlayer
            ]}
            onPress={() => handleSelectPlayer(player)}
          >
            {player.image ? (
              <Image source={{ uri: player.image }} style={styles.playerImage} />
            ) : (
              <View style={[styles.playerImage, styles.placeholder]}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.modalButtons}>
        <TouchableOpacity onPress={() => setVisibleAdd(false)} style={styles.closeButtonItem}>
          <Text style={styles.closeButtonText}>{t('Cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={() => addPlayersToEncounter()} >
          <Text style={styles.editButtonText}>{t('Add')}</Text>
        </TouchableOpacity>
      </View>

    </View>
  </Modal>
)}


      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={styles.middleEncounterContRun}>
        <TouchableOpacity style={[styles.autoRollEncounterButton, { height: 50 * scaleFactor, width: 150 * scaleFactor }]}onPress={handleInitiative}>
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

        {players.map((player, index) => (
          <View
            key={`player-${index}`}
            style={[
              styles.monsterRowEncounterRun,
              index % 2 === 0 && styles.monsterRowOdd,
            ]}
          >
            <Text style={[styles.cellEncounterRun, styles.cellInitiativeEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{player.initiative}</Text>
                            <View style={[styles.cellEncounterRun, styles.cellAvatarEncounterRun, { height: 50 * scaleFactor, width: 50 * scaleFactor }]}>
                              <ImageBackground
                                source={{ uri: player.image }}
                                style={[styles.avatarImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]}
                              />
                            </View>
            <View style={[styles.cellEncounterRun, styles.cellNameEncounterRun]}>
              <Text style={[styles.monsterTextEncRun, { fontSize: fontSize, color: theme.fontColor }]}>{player.name}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.acEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('AC')}: {player.armorClass}</Text>
                <Text style={[styles.crEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Level')}: {player.playerClasses[0].level || 'N/A'}</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.startEncounterButton, { height: 50 * scaleFactor, width: 150 * scaleFactor }]} onPress={() => removePlayerFromEncounter(player)}>
                  <Text style={[styles.startEncounterButtonText, { fontSize: fontSize, color: theme.fontColor }]}>{t('X')}</Text>
                </TouchableOpacity>
          </View>
        ))}
        <View >
               <TouchableOpacity style={[styles.startEncounterButton, { height: 50 * scaleFactor, width: 150 * scaleFactor }]} onPress={handleAddPlayer}>
                                 <Text style={[styles.startEncounterButtonText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Add Player')}</Text>
                               </TouchableOpacity>
       </View>
       <View style={[styles.middleEncounterContRun, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>

              </View>

        {monsters && monsters.length > 0 ? (
          monsters.map((monster, index) => {

            return (
              <View
                key={`monster-${index}`}
                style={[
                  styles.monsterRowEncounterRun,
                  (players.length + index) % 2 === 0 && styles.monsterRowOdd,
                ]}

              >
                <Text style={[styles.cellEncounterRun, styles.cellInitiativeEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{monster.base ? monster.initiative: 'N/A'}</Text>
                <View style={[styles.cellEncounterRun, styles.cellAvatarEncounterRun, { height: 50 * scaleFactor, width: 50 * scaleFactor }]}>
                  <ImageBackground
                    source={{ uri: monster.image }}
                    style={[styles.avatarImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]}
                  />
                </View>
                <View style={[styles.cellEncounterRun, styles.cellNameEncounterRun]}>
                  <Text style={[styles.monsterTextEncRun, { fontSize: fontSize, color: theme.fontColor }]}>{monster.name}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.acEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>
                      {t('AC')}: {monster.base ? monster.base.armorClass.split(" ")[0] : 'N/A'}
                    </Text>
                    <Text style={[styles.crEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>
                      {t('CR')}: {monster.base ? monster.base.challengeRating.split(" ")[0] : 'N/A'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.cellEncounterRun, styles.cellCountEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>1</Text>
              </View>
            );
          })
        ) : (
          <Text style={[styles.monsterText, { fontSize: fontSize, color: theme.fontColor }]}>
            {t('No monsters available')}
          </Text>
        )}

      {players.length === 0 && monsters.length === 0 && (
        <Text style={[styles.monsterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('No players or monsters in this encounter')}.</Text>
      )}
      </ScrollView>

    </ImageBackground>
  );
};

export default EncounterRun;
