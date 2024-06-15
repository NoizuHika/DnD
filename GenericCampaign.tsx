import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GenericCampaign = ({ route, navigation }) => {
  const { t, i18n } = useTranslation();

    const { campaignName } = route.params;
    const [sessions, setSessions] = useState([]);
    const [newSessionName, setNewSessionName] = useState('');
    const [newSessionContent, setNewSessionContent] = useState('');
    const [editingSession, setEditingSession] = useState(null);
    const [activeSessionIndex, setActiveSessionIndex] = useState(0);
    const [addingNewSession, setAddingNewSession] = useState(false);

    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const handleSelectPlayer = (player) => {
      if (selectedPlayers.includes(player.id)) {
        setSelectedPlayers(selectedPlayers.filter(id => id !== player.id));
      } else {
        setSelectedPlayers([...selectedPlayers, player.id]);
      }
    };

    const handlePlayerAction = (action) => {
      const updatedPlayers = players.map(player => {
        if (selectedPlayers.includes(player.id)) {
          switch (action) {
            case 'addCoins':
              player.coins += 10;
              break;
            case 'levelUp':
              player.level += 1;
              break;
            case 'changeHP':
              player.hp = player.hp < 100 ? 100 : player.hp - 10;
              break;
            case 'remove':
              return null;
          }
        }
        return player;
      }).filter(player => player !== null);
      setPlayers(updatedPlayers);
      setSelectedPlayers([]);
    };

    const handleAddPlayer = () => {
      const newPlayer = {
        id: players.length + 1,
        name: `Player ${players.length + 1}`,
        image: require('./assets/adventurer.jpeg'),
        coins: 0,
        level: 1,
        hp: 100,
      };
      setPlayers([...players, newPlayer]);
    };

    useEffect(() => {
      const loadSessions = async () => {
        try {
          const savedSessions = await AsyncStorage.getItem('sessions');
          if (savedSessions !== null) {
            console.log('Loaded sessions from storage:', savedSessions);
            setSessions(JSON.parse(savedSessions));
          }
        } catch (error) {
          console.error('Failed to load sessions', error);
        }
      };
      loadSessions();
    }, []);

    const saveSessions = async (updatedSessions) => {
      try {
        await AsyncStorage.setItem('sessions', JSON.stringify(updatedSessions));
        setSessions(updatedSessions);
      } catch (error) {
        console.error('Failed to save sessions', error);
      }
    };

    const handleGoBack = () => {
      navigation.goBack();
    };

    const handleAddSession = () => {
      if (newSessionName && newSessionContent) {
        const updatedSessions = [...sessions, { name: newSessionName, content: newSessionContent }];
        saveSessions(updatedSessions);
        setNewSessionName('');
        setNewSessionContent('');
        setAddingNewSession(false);
        setActiveSessionIndex(updatedSessions.length - 1);
      } else {
        Alert.alert(t('Please enter both name and content for the session.'));
      }
    };

    const handleEditSession = (index) => {
      setEditingSession(index);
      setNewSessionName(sessions[index].name);
      setNewSessionContent(sessions[index].content);
    };

    const handleSaveEdit = () => {
      if (editingSession !== null) {
        const updatedSessions = [...sessions];
        updatedSessions[editingSession] = { name: newSessionName, content: newSessionContent };
        saveSessions(updatedSessions);
        setEditingSession(null);
        setNewSessionName('');
        setNewSessionContent('');
      }
    };

    const handleDeleteSession = (index) => {
      const updatedSessions = sessions.filter((_, i) => i !== index);
      saveSessions(updatedSessions);
      setActiveSessionIndex(0);
    };

    const handleNewSessionTab = () => {
      setAddingNewSession(true);
      setActiveSessionIndex(sessions.length);
    };

    return (
      <ImageBackground
        source={require('./assets/dungeon.jpeg')}
        style={styles.container}
      >

        <View style={styles.sessionsList}>
          <Text style={styles.appName}>LOREM PSILUM</Text>
          <ScrollView horizontal>
            {sessions.map((session, index) => (
              <TouchableOpacity key={index} style={styles.sessionTab} onPress={() => {
                setActiveSessionIndex(index);
                setAddingNewSession(false);
              }}>
                <Text style={styles.sessionTabText}>{session.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.sessionTab} onPress={handleNewSessionTab}>
              <Text style={styles.sessionTabText}>{t('Add new')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {sessions.length > 0 && activeSessionIndex < sessions.length && !addingNewSession && (
            <View style={styles.sessionContainer}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionName}>{sessions[activeSessionIndex]?.name}</Text>
                <TouchableOpacity onPress={() => handleEditSession(activeSessionIndex)}>
                  <Text style={styles.editText}>{t('Edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteSession(activeSessionIndex)}>
                  <Text style={styles.deleteText}>{t('Delete')}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sessionContent}>{sessions[activeSessionIndex]?.content}</Text>
            </View>
          )}
          {(editingSession !== null || addingNewSession) && (
            <View style={styles.newSessionContainer}>
              <TextInput
                style={styles.inputName}
                value={newSessionName}
                onChangeText={setNewSessionName}
                placeholder={t('Enter session name')}
                placeholderTextColor="#d6d6d6"
              />
              <TextInput
                style={[styles.inputContent, styles.textArea]}
                value={newSessionContent}
                onChangeText={setNewSessionContent}
                placeholder={t('Enter session content')}
                placeholderTextColor="#d6d6d6"
                multiline
              />
              <TouchableOpacity style={styles.addButton} onPress={editingSession === null ? handleAddSession : handleSaveEdit}>
                <Text style={styles.buttonText}>{editingSession === null ? t('Add Session') : t('Save Session')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={styles.playerPanel}>
          <ScrollView horizontal>
            {players.map(player => (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.playerAvatar,
                  selectedPlayers.includes(player.id) && styles.selectedPlayer
                ]}
                onPress={() => handleSelectPlayer(player)}
              >
                <Image source={player.image} style={styles.playerImage} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.playerAvatar} onPress={handleAddPlayer}>
              <Text style={styles.addPlayerText}>+</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {selectedPlayers.length > 0 && (
          <View style={styles.playerActions}>
            <TouchableOpacity style={styles.playerActionButton} onPress={() => handlePlayerAction('addCoins')}>
              <Text style={styles.playerActionText}>{t('Add Coins')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.playerActionButton} onPress={() => handlePlayerAction('levelUp')}>
              <Text style={styles.playerActionText}>{t('Level Up')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.playerActionButton} onPress={() => handlePlayerAction('manageInventory')}>
              <Text style={styles.playerActionText}>{t('Manage Inventory')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.playerActionButton} onPress={() => handlePlayerAction('changeHP')}>
              <Text style={styles.playerActionText}>{t('Change HP')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.playerActionButton} onPress={() => handlePlayerAction('remove')}>
              <Text style={styles.playerActionText}>{t('Remove Player')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.goBack}>
          <TouchableOpacity style={styles.button} onPress={handleGoBack}>
            <Text style={styles.goBackText}>{t('Go_back')}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    appName: {
      textAlign: 'center',
      marginBottom: 20,
      fontSize: 24,
      color: '#7F7F7F',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    scrollContainer: {
      paddingTop: '20%',
      paddingHorizontal: 20,
    },
    sessionContainer: {
      borderColor: '#7F7F7F',
      borderWidth: 1.5,
      borderRadius: 10,
      marginTop: 10,
      marginBottom: 10,
      padding: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    sessionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sessionName: {
      color: '#d6d6d6',
      fontSize: 18,
    },
    sessionContent: {
      color: '#d6d6d6',
      marginTop: 10,
    },
    sessionsList: {
      textAlign: 'center',
      top: '10%',
      width: '100%',
      borderColor: '#7F7F7F',
      borderBottomWidth: 1.5,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1, //przez tą linijke stracilem kilka godzin, bo kod nie dzialal
    },
    sessionTab: {
      padding: 10,
      borderColor: '#7F7F7F',
      borderRightWidth: 1.5,
    },
    sessionTabText: {
      color: '#d6d6d6',
      fontSize: 18,
    },
    editText: {
      color: '#d6d6d6',
      marginHorizontal: 5,
    },
    deleteText: {
      color: '#d6d6d6',
      marginHorizontal: 5,
    },
    newSessionContainer: {
      marginBottom: 15,
    },
    inputName: {
      borderColor: '#7F7F7F',
      borderWidth: 1.5,
      borderRadius: 10,
      color: '#d6d6d6',
      paddingHorizontal: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    inputContent: {
      borderColor: '#7F7F7F',
      borderWidth: 1.5,
      borderRadius: 10,
      color: '#d6d6d6',
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    textArea: {
      height: 100,
    },
    addButton: {
      borderColor: '#7F7F7F',
      borderWidth: 1.5,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#d6d6d6',
    },
    playerPanel: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderTopColor: '#7F7F7F',
      borderTopWidth: 1.5,
      padding: 10,
    },
    playerAvatar: {
      margin: 5,
      padding: 5,
      borderColor: '#7F7F7F',
      borderWidth: 1.5,
      borderRadius: 50,
    },
    playerImage: {
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    selectedPlayer: {
      borderColor: 'yellow',
    },
    addPlayerText: {
      color: '#d6d6d6',
      fontSize: 18,
      top: 10,
      paddingHorizontal: 20,
    },
    playerActions: {
      bottom: 90,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 5,
      borderTopColor: '#7F7F7F',
      borderTopWidth: 1,
    },
    playerActionButton: {
      padding: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: 50,
    },
    playerActionText: {
      color: '#d6d6d6',
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
  });

export default GenericCampaign;
