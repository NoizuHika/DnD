import React, { useState, useEffect, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const GenericCampaign = ({ route, navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);

    const { campaignName } = route.params;
    const [sessions, setSessions] = useState([]);
    const [newSessionName, setNewSessionName] = useState('');
    const [newSessionContent, setNewSessionContent] = useState('');
    const [editingSession, setEditingSession] = useState(null);
    const [activeSessionIndex, setActiveSessionIndex] = useState(0);
    const [addingNewSession, setAddingNewSession] = useState(false);

  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", image: require('./assets/assasin.jpeg'), coins: 0, level: 1, hp: 100 },
  ]);
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
         source={theme.background}
        style={styles.containerCamp}
      >

        <View style={styles.sessionsList}>
          <Text style={[styles.CampName, { color: theme.fontColor }]}>LOREM PSILUM</Text>
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
                <Text style={styles.editTextCamp}>
                  {t('Edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteSession(activeSessionIndex)}>
                <Text style={styles.deleteTextCamp}>
                  {t('Delete')}</Text>
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
              <TouchableOpacity style={styles.addButtonCamp} onPress={editingSession === null ? handleAddSession : handleSaveEdit}>
                <Text style={styles.buttonTextCamp}>{editingSession === null ? t('Add Session') : t('Save Session')}</Text>
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

      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      </ImageBackground>
    );
  };

export default GenericCampaign;
