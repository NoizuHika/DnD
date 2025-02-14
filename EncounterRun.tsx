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
  const [visibleAddNPC, setVisibleAddNPC] = useState(false);
  const { encounter,campaign } = route.params || {};
  const [usedEncounter, setUsedEncounter] = useState(encounter || {});
  const [players,setPlayers] = useState(encounter.players || {});
  const [monsters,setMonsters] = useState(encounter.entities || {});
  const [npcs, setNpcs] = useState(encounter.npcs ||{});
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedNpcs, setSelectedNpcs] = useState([]);

  const handleSelectNPC = (npc) => {
    if (selectedNpcs.includes(npc.id)) {
      setSelectedNpcs(selectedNpcs.filter(id => id !== npc.id));
    } else {
      setSelectedNpcs([...selectedNpcs, npc.id]);
    }
  };
  const handleSelectPlayer = (player) => {
      console.log(player.id);
      if (selectedPlayers.includes(player.id)) {
        setSelectedPlayers(selectedPlayers.filter(id => id !== player.id));
      } else {
        setSelectedPlayers([...selectedPlayers, player.id]);
      }
    };
  const removePlayer = (index) => {
     setPlayers(players.filter((_, i) => i !== index));
    };
  const removeNpcFromEncounter = (npc) => {
      removeNpc();
    setNpcs(prevNpcs => prevNpcs.filter(item => item.id !== npc.id));
  };

  const removePlayerFromEncounter = async (player) => {
      const item = {
          item:encounter.id,
          id:player.id
          };


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
    setVisibleAdd(false);
  };
    const removeNpc = async (npc) => {
        const item = {
            item:encounter.id,
            id:npc.id
            };


        console.log(value)
        try {
            const response = await fetch(`http://${ipv4}:8000/encounters/${encounter.id}/removeNpc`, {
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


    const addNpcsToEncounter = async () => {
        try {
            const response = await fetch(`http://${ipv4}:8000/encounters/${encounter.id}/addNpcs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
            body: JSON.stringify(selectedNpcs)
            });


            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data= await response.json();

                  console.log('Player added to encounter :', data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
  setSelectedNpcs([]);
  setVisibleAdd(false);
  };



  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleStart = () => {
    navigation.navigate('EncounterRunStart', { encounter:encounter,playersBase:players,monstersBase:monsters,campaign:campaign, npc:npcs});
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



  return (
    <ImageBackground source={theme.background} style={styles.containerEncounterRun}>

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

    {visibleAdd && (
      <Modal visible={true} transparent={true} animationType="fade">
        <View style={styles.modalOverlayItems}>

          <View style={[styles.playersListContainer, { borderColor: theme.borderColor, borderWidth: 1 }]}>
            {campaign.characters.map(player => (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.playerAvatarEncounter,
                  selectedPlayers.includes(player.id) && styles.selectedPlayerEncounter,
                  { borderColor: theme.borderColor, borderWidth: 0.5 }
                ]}
                onPress={() => handleSelectPlayer(player)}
              >
                <View style={styles.avatarContainerEncounter}>
                  {player.image ? (
                    <Image source={player.image ? { uri: player.image } : require('./addons/defaultPlayer.png')} style={styles.playerImage} />
                  ) : (
                    <View style={[styles.playerImage, styles.placeholder]}>
                      <Text style={[styles.placeholderText, { color: theme.fontColor, fontSize: fontSize * 1.1 }]}>{t('No Image')}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.playerNameEncounter, { color: theme.fontColor, fontSize: fontSize * 1.1 }]}>{player.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtonsEncounter}>
            <TouchableOpacity onPress={() => setVisibleAdd(false)} style={styles.closeButtonItemEncounter}>
              <Text style={styles.closeButtonTextEncounter}>{t('Cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButtonEncounter} onPress={() => addPlayersToEncounter()} >
              <Text style={styles.editButtonTextEncounter}>{t('Add')}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    )}

      {visibleAddNPC && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalOverlayItems}>
            <View style={[styles.playersListContainer, { borderColor: theme.borderColor, borderWidth: 1 }]}>
              {campaign.npcs.map(npc => (
                <TouchableOpacity
                  key={npc.id}
                  style={[
                    styles.playerAvatarEncounter,
                    selectedNpcs.includes(npc.id) && styles.selectedPlayerEncounter,
                    { borderColor: theme.borderColor, borderWidth: 0.5 }
                  ]}
                  onPress={() => handleSelectNPC(npc)}
                >
                  <View style={styles.avatarContainerEncounter}>
                      <Image source={npc.image ? { uri: npc.image } : require('./addons/defaultNPC.png')} style={[styles.playerImage, { width: 50, height: 50 }]} />
                  </View>
                  <Text style={[styles.playerNameEncounter, { color: theme.fontColor, fontSize: fontSize * 1.1 }]}>{npc.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtonsEncounter}>
              <TouchableOpacity onPress={() => setVisibleAddNPC(false)} style={styles.closeButtonItemEncounter}>
                <Text style={styles.closeButtonTextEncounter}>{t('Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButtonEncounter} onPress={addNpcsToEncounter}>
                <Text style={styles.editButtonTextEncounter}>{t('Add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.middleEncounterContRun}>
        <TouchableOpacity style={[styles.autoRollEncounterButton, { height: 50 * scaleFactor, width: 150 * scaleFactor }]}onPress={handleInitiative}>
          <Text style={[styles.autoRollEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Auto Roll Initiative')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.startEncounterButton, { height: 50 * scaleFactor, width: 150 * scaleFactor }]} onPress={handleStart}>
          <Text style={[styles.startEncounterButtonText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Start')}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.monsterRowEncounterRun, { backgroundColor: '#222' }]}>
        <Text style={[styles.cellEncounterRun, styles.cellInitiativeEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('Initiative')}</Text>
        <Text style={[styles.cellEncounterRun, styles.cellAvatarEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('Avatar')}</Text>
        <Text style={[styles.cellEncounterRun, styles.cellNameEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('Name')}</Text>
        <Text style={[styles.cellEncounterRun, styles.cellCountEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('Count')}</Text>
      </View>
      <ScrollView style={styles.monstersListContainer}>
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
                    source={player.image ? { uri: player.image } : require('./addons/defaultPlayer.png')}
                    style={[styles.avatarImage, { height: 90 * scaleFactor, width: 90 * scaleFactor }]}
                  />
                </View>
            <View style={[styles.cellEncounterRun, styles.cellNameEncounterRun]}>
              <Text style={[styles.monsterTextEncRun, { fontSize: fontSize, color: theme.fontColor }]}>{player.name}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.acEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('AC')}: {player.armorClass}</Text>

                <Text style={[styles.crEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Level')}: {player.playerClasses[0]?.level || 'N/A'}</Text>

              </View>
            </View>
            <TouchableOpacity style={styles.cellCountEncounterRunA} onPress={() => removePlayerFromEncounter(player)}>
                  <Text style={[styles.cellEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('X')}</Text>
                </TouchableOpacity>
          </View>
        ))}
        <View >
       </View>

        {npcs.map((npc, index) => (
          <View
            key={`npc-${index}`}
            style={[
              styles.monsterRowEncounterRun,
              (players.length + index) % 2 === 0 && styles.monsterRowOdd,
            ]}
          >
            <Text style={[styles.cellEncounterRun, styles.cellInitiativeEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{npc.base ? npc.initiative: 'N/A'}</Text>
            <View style={[styles.cellEncounterRun, styles.cellAvatarEncounterRun, { height: 50 * scaleFactor, width: 50 * scaleFactor }]}>
              <ImageBackground
                source={npc.image ? { uri: npc.image } : require('./addons/defaultNPC.png')}
                style={[styles.avatarImage, { height: 90 * scaleFactor, width: 90 * scaleFactor }]}
              />
            </View>
            <View style={[styles.cellEncounterRun, styles.cellNameEncounterRun]}>
              <Text style={[styles.monsterTextEncRun, { fontSize: fontSize, color: theme.fontColor }]}>{npc.name}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.acEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('AC')}: {npc.armorClass}</Text>
                <Text style={[styles.crEncounterText, { fontSize: fontSize, color: theme.fontColor }]}>{t('CR')}: {npc.challengeRating || 'N/A'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.cellCountEncounterRunA} onPress={() => removeNpcFromEncounter(npc)}>
              <Text style={[styles.cellEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>{t('X')}</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View />

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
                    source={monster.image ? { uri: monster.image } : require('./addons/defaultBeast.png')}
                    style={[styles.avatarImage, { height: 90 * scaleFactor, width: 90 * scaleFactor }]}
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
                <View style={[styles.cellCountEncounterRunA]}>
                    <Text style={[styles.cellEncounterRun, { fontSize: fontSize, color: theme.fontColor }]}>1</Text>
                </View>
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

      <View style={styles.middleEncounterContRunA}>
        <TouchableOpacity style={[styles.startEncounterButton, { height: 50 * scaleFactor, width: 150 * scaleFactor }]} onPress={() => setVisibleAdd(true)}>
          <Text style={[styles.startEncounterButtonText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Add Player')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.startEncounterButton, { height: 50 * scaleFactor, width: 150 * scaleFactor }]} onPress={() => setVisibleAddNPC(true)}>
          <Text style={[styles.startEncounterButtonText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Add NPC')}</Text>
        </TouchableOpacity>
      </View>

    </ImageBackground>
  );
};

export default EncounterRun;