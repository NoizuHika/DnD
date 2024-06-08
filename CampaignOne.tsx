import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CampaignOne = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const [sessions, setSessions] = useState([
    { name: "Session 1", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc commodo at risus quis sagittis. Sed feugiat in turpis nec rutrum. Fusce non elit justo. Maecenas ac tempor tortor. Sed tincidunt pretium blandit. Nunc lobortis euismod sem in tincidunt. Pellentesque iaculis eget eros vel faucibus. Mauris posuere aliquet ipsum, at vestibulum tortor. Aliquam tempus fermentum feugiat." },
    { name: "Session 2", content: "Praesent eu enim et justo consectetur porta. Aliquam erat volutpat. Nulla hendrerit elementum purus, eget cursus turpis laoreet nec. Duis blandit auctor massa id luctus. Praesent faucibus sapien arcu, et mattis felis tristique id. Pellentesque molestie purus ligula, a feugiat velit consequat sed. Integer nisi tellus, dictum sit amet porta nec, laoreet eu nisi. Morbi euismod sem tristique euismod vehicula. Nullam ipsum erat, mollis ut metus quis, ullamcorper euismod ligula. Phasellus egestas arcu vitae ornare porttitor. Fusce bibendum erat ac arcu sodales, eu tristique massa rhoncus. Nullam luctus, risus ut ornare viverra, ipsum velit sagittis augue, eget condimentum enim augue sed libero. Curabitur blandit nulla turpis, in sodales risus consectetur vel." },
  ]);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionContent, setNewSessionContent] = useState('');
  const [editingSession, setEditingSession] = useState(null);
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [addingNewSession, setAddingNewSession] = useState(false);

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

export default CampaignOne;
