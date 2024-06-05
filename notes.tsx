import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

const CampaignOne = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const [sessions, setSessions] = useState([
    { name: "Session 1", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc commodo at risus quis sagittis. Sed feugiat in turpis nec rutrum. Fusce non elit justo. Maecenas ac tempor tortor. Sed tincidunt pretium blandit. Nunc lobortis euismod sem in tincidunt. Pellentesque iaculis eget eros vel faucibus. Mauris posuere aliquet ipsum, at vestibulum tortor. Aliquam tempus fermentum feugiat." },
    { name: "Session 2", content: "Praesent eu enim et justo consectetur porta. Aliquam erat volutpat. Nulla hendrerit elementum purus, eget cursus turpis laoreet nec. Duis blandit auctor massa id luctus. Praesent faucibus sapien arcu, et mattis felis tristique id. Pellentesque molestie purus ligula, a feugiat velit consequat sed. Integer nisi tellus, dictum sit amet porta nec, laoreet eu nisi. Morbi euismod sem tristique euismod vehicula. Nullam ipsum erat, mollis ut metus quis, ullamcorper euismod ligula. Phasellus egestas arcu vitae ornare porttitor. Fusce bibendum erat ac arcu sodales, eu tristique massa rhoncus. Nullam luctus, risus ut ornare viverra, ipsum velit sagittis augue, eget condimentum enim augue sed libero. Curabitur blandit nulla turpis, in sodales risus consectetur vel." },
  ]);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionContent, setNewSessionContent] = useState('');
  const [editingSession, setEditingSession] = useState(null);
  const [expandedSessions, setExpandedSessions] = useState({});

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAddSession = () => {
    if (newSessionName && newSessionContent) {
      setSessions([...sessions, { name: newSessionName, content: newSessionContent }]);
      setNewSessionName('');
      setNewSessionContent('');
    }
  };

  const handleEditSession = (index) => {
    setEditingSession(index);
    setNewSessionName(sessions[index].name);
    setNewSessionContent(sessions[index].content);
  };

  const handleSaveEdit = (index) => {
    const updatedSessions = [...sessions];
    updatedSessions[index] = { name: newSessionName, content: newSessionContent };
    setSessions(updatedSessions);
    setEditingSession(null);
    setNewSessionName('');
    setNewSessionContent('');
  };

  const handleDeleteSession = (index) => {
    const updatedSessions = sessions.filter((_, i) => i !== index);
    setSessions(updatedSessions);
  };

  const toggleExpandSession = (index) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.appName}>LOREM PSILUM</Text>
        {sessions.map((session, index) => (
          <View key={index} style={styles.sessionContainer}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionName}>{session.name}</Text>
              <TouchableOpacity onPress={() => handleEditSession(index)}>
                <Text style={styles.editText}>{t('Edit')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteSession(index)}>
                <Text style={styles.deleteText}>{t('Delete')}</Text>
              </TouchableOpacity>
            </View>
                <Text style={styles.sessionContent}>{expandedSessions[index] ? session.content : `${session.content.slice(0, 50)}...`}</Text>
                <TouchableOpacity onPress={() => toggleExpandSession(index)}><Text style={styles.readMoreText}>{expandedSessions[index] ? t('Read less') : t('Read more')}</Text></TouchableOpacity>
          </View>
        ))}
        {editingSession === null ? (
          <View style={styles.newSessionContainer}>
            <TextInput
              style={styles.input}
              value={newSessionName}
              onChangeText={setNewSessionName}
              placeholder={t('Enter session name')}
              placeholderTextColor="#d6d6d6"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newSessionContent}
              onChangeText={setNewSessionContent}
              placeholder={t('Enter session content')}
              placeholderTextColor="#d6d6d6"
              multiline
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddSession}>
              <Text style={styles.buttonText}>{t('Add Session')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.newSessionContainer}>
            <TextInput
              style={styles.input}
              value={newSessionName}
              onChangeText={setNewSessionName}
              placeholder={t('Enter session name')}
              placeholderTextColor="#d6d6d6"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newSessionContent}
              onChangeText={setNewSessionContent}
              placeholder={t('Enter session content')}
              placeholderTextColor="#d6d6d6"
              multiline
            />
            <TouchableOpacity style={styles.addButton} onPress={() => handleSaveEdit(editingSession)}>
              <Text style={styles.buttonText}>{t('Save Session')}</Text>
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
  },
  scrollContainer: {
    paddingTop: '20%',
    paddingHorizontal: 20,
  },
  sessionContainer: {
    borderColor: '#7F7F7F',
    borderWidth: 1.5,
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionName: {
    color: '#d6d6d6',
    fontSize: 18,
  },
  sessionContent: {
    color: '#d6d6d6',
    marginTop: 10,
  },
  readMoreText: {
    color: '#d6d6d6',
    marginTop: 5,
    textDecorationLine: 'underline'
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
  input: {
    borderColor: '#7F7F7F',
    borderWidth: 1.5,
    borderRadius: 10,
    color: '#d6d6d6',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 60,
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
