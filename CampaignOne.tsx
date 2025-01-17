import React, { useRef, useState, useEffect, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Image, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';

Appearance.setColorScheme('light');

const CampaignOne = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme, diceResults } = useContext(ThemeContext);

  const [sessions, setSessions] = useState([
    { name: "Session 1" },
    { name: "Session 2" },
  ]);
  const [notes, setNotes] = useState([
    {
      title: "Notatka1",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc commodo at risus quis sagittis. Sed feugiat in turpis nec rutrum. Fusce non elit justo. Maecenas ac tempor tortor. Sed tincidunt pretium blandit. Nunc lobortis euismod sem in tincidunt. Pellentesque iaculis eget eros vel faucibus. Mauris posuere aliquet ipsum, at vestibulum tortor. Aliquam tempus fermentum feugiat.",
      image: require('./assets/Dwarf-M-Inventor.jpg')
    },
    {
      title: "Notatka2",
      content: "Praesent eu enim et justo consectetur porta. Aliquam erat volutpat. Nulla hendrerit elementum purus, eget cursus turpis laoreet nec. Duis blandit auctor massa id luctus. Praesent faucibus sapien arcu, et mattis felis tristique id. Pellentesque molestie purus ligula, a feugiat velit consequat sed. Integer nisi tellus, dictum sit amet porta nec, laoreet eu nisi. Morbi euismod sem tristique euismod vehicula. Nullam ipsum erat, mollis ut metus quis, ullamcorper euismod ligula. Phasellus egestas arcu vitae ornare porttitor. Fusce bibendum erat ac arcu sodales, eu tristique massa rhoncus. Nullam luctus, risus ut ornare viverra, ipsum velit sagittis augue, eget condimentum enim augue sed libero. Curabitur blandit nulla turpis, in sodales risus consectetur vel.",
      image: require('./assets/Dwarf-W-Inventor.jpg')
    },
  ]);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionContent, setNewSessionContent] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteImage, setNewNoteImage] = useState(null);
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [addingNewSession, setAddingNewSession] = useState(false);
  const [addingNewNote, setAddingNewNote] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", image: require('./assets/assasin.jpeg'), coins: 0, level: 1, hp: 100 },
    { id: 2, name: "Player 2", image: require('./assets/archer.jpeg'), coins: 0, level: 1, hp: 100 },
  ]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [noteVisibility, setNoteVisibility] = useState(new Array(notes.length).fill(false));
  const [modalVisible, setModalVisible] = useState(false);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [diceResults]);

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
          setSessions(JSON.parse(savedSessions));
        }
      } catch (error) {
        console.error('Failed to load sessions', error);
      }
    };
    loadSessions();
  }, []);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const savedNotes = await AsyncStorage.getItem('notes');
        if (savedNotes !== null) {
          setNotes(JSON.parse(savedNotes));
        }
      } catch (error) {
        console.error('Failed to load notes', error);
      }
    };
    loadNotes();
  }, []);

  const saveSessions = async (updatedSessions) => {
    try {
      await AsyncStorage.setItem('sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
    } catch (error) {
      console.error('Failed to save sessions', error);
    }
  };

  const saveNotes = async (updatedNotes) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Failed to save notes', error);
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

  const toggleNoteVisibility = (index) => {
    setNoteVisibility(prevVisibility => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  const handleShareNote = (note) => {
    Alert.alert(`Sharing note: ${note.title}`);
    handleCloseNote();
  };

  const handleAddNote = () => {
    setAddingNewNote(!addingNewNote);
    setEditingNoteIndex(null);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteImage(null);
    setModalVisible(true);
  };

  const handleSaveNote = async () => {
    if (newNoteTitle && newNoteContent) {
      const newNote = {
        title: newNoteTitle,
        content: newNoteContent,
        image: newNoteImage ? { uri: newNoteImage } : require('./assets/Human-W-Mage.jpg'),
        diceResults: diceResults,
      };
      const updatedNotes = [...notes, newNote];
      await saveNotes(updatedNotes);
      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteImage(null);
      setAddingNewNote(false);
    } else {
      Alert.alert(t('Please enter both title and content for the note.'));
    }
  };

  const handleEditNote = (index) => {
    handleCloseNote();
    setEditingNoteIndex(index);
    setNewNoteTitle(notes[index].title);
    setNewNoteContent(notes[index].content);
    setNewNoteImage(notes[index].image.uri || null);
    setAddingNewNote(!addingNewNote);
    setModalVisible(true);
  };

  const handleSaveEditNote = () => {
    if (editingNoteIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editingNoteIndex] = {
        title: newNoteTitle,
        content: newNoteContent,
        image: newNoteImage ? { uri: newNoteImage } : require('./assets/Human-W-Mage.jpg')
      };
      setNotes(updatedNotes);
      setEditingNoteIndex(null);
      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteImage(null);
      setAddingNewNote(false);
    }
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    setNoteVisibility(noteVisibility.filter((_, i) => i !== index));
    setAddingNewNote(false);
    handleCloseNote();
    saveNotes(updatedNotes);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewNoteImage(result.assets[0].uri);
    }
  };

  const handleGoToEncounter = () => {
    navigation.navigate('Encounters');
  };

  const handleOpenNote = (note, index) => {
    setSelectedNote(note);
    setEditingNoteIndex(index);
    setIsModalVisible(true);
  };

  const handleCloseNote = () => {
    setSelectedNote(null);
    setAddingNewNote(null);
    setIsModalVisible(false);
  };

  return (
    <ImageBackground
      source={theme.background}
      style={styles.containerCamp}
    >
     <View style={styles.CampaignOneContainerMainA}>
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

      <View style={styles.CampaignOneContainerMain}>
        {sessions.length > 0 && activeSessionIndex < sessions.length && !addingNewSession && (
          <View style={styles.sessionContainer}>
            <View style={styles.sessionHeader}>
           <ScrollView style={styles.sessionContentScrollContainer}>
            <Text style={styles.sessionContent}>{sessions[activeSessionIndex]?.content}</Text>
           </ScrollView>
            </View>
             <View style={styles.rowContainerRight}>
              <TouchableOpacity onPress={() => handleEditSession(activeSessionIndex)}>
                <Text style={styles.editTextCamp}>
                {t('Edit')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteSession(activeSessionIndex)}>
                <Text style={styles.deleteTextCamp}>
                {t('Delete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {addingNewSession && (
          <View style={styles.sessionContainer}>
            <TextInput
              style={[styles.inputContent, styles.textArea]}
              value={newSessionContent}
              onChangeText={setNewSessionContent}
              placeholder={t('Enter session content')}
              placeholderTextColor="#d6d6d6"
              multiline
            />
            <TouchableOpacity style={styles.addButtonCamp} onPress={handleAddSession}>
              <Text style={styles.buttonTextCamp}>{t('Add Session')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {editingSession !== null && !addingNewSession && (
          <View style={styles.sessionContainer}>
            <TextInput
              style={[styles.inputContent, styles.textArea]}
              value={newSessionContent}
              onChangeText={setNewSessionContent}
              placeholder={t('Enter session content')}
              placeholderTextColor="#d6d6d6"
              multiline
            />
            <TouchableOpacity style={styles.addButtonCamp} onPress={handleSaveEdit}>
              <Text style={styles.buttonTextCamp}>{t('Save Changes')}</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>

      <View style={styles.mainCampaignContainer}>
        <View style={styles.leftCampaignContainer}>
          <ScrollView>


      {!addingNewSession && (
      <View style={styles.noteContent}>
        {notes.map((note, index) => (
          <View key={index} style={styles.noteHeader}>
            <TouchableOpacity onPress={() => handleOpenNote(note, index)}>
              <View style={styles.noteActions}>
                <Text style={styles.noteTitle}>{note.title}</Text>
              </View>
            </TouchableOpacity>
            {noteVisibility[index] && (
              <>
                <Text style={styles.noteContent}>{note.content}</Text>
                <Image source={note.image} style={styles.noteImage} />
              </>
            )}
          </View>
        ))}

        {selectedNote && (
         <Modal
           visible={isModalVisible}
           animationType="slide"
           transparent={true}
           onRequestClose={handleCloseNote}
         >
           <View style={styles.modalNoteCampaignContainer}>
             <View style={styles.modalNoteCampaignContent}>
               <Text style={styles.modalNoteCampaignTitle}>{selectedNote?.title}</Text>
               <Text style={styles.modalNoteCampaignText}>{selectedNote?.content}</Text>
               <Image source={selectedNote?.image} style={styles.modalImageNoteCampaign} />
               <View style={styles.modalActionsNoteCampaign}>
                 <TouchableOpacity style={styles.editButtonCamp} onPress={() => handleEditNote(editingNoteIndex)}>
                   <Text style={styles.editTextCamp}>{t('Edit')}</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.shareButtonCamp} onPress={() => handleShareNote(selectedNote)}>
                   <Text style={styles.shareText}>{t('Share')}</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.deleteButtonCamp} onPress={() => handleDeleteNote(editingNoteIndex)}>
                   <Text style={styles.deleteTextCamp}>{t('Delete')}</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </View>
                 <TouchableOpacity onPress={handleCloseNote}>
                   <Text style={styles.closeNoteButtonCampaign}>{t('Close')}</Text>
                 </TouchableOpacity>
         </Modal>
        )}

          <TouchableOpacity
            style={styles.addButtonCamp}
            onPress={handleAddNote}
          >
            <Text style={styles.addButtonTextCamp}>{t('+ Add Note')}</Text>
          </TouchableOpacity>
        </View>
      )}

          </ScrollView>
      </View>

        {addingNewNote && !addingNewSession && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
          <View style={styles.newNoteContainer}>
            <TextInput
              style={styles.inputCampNote}
              placeholder={t('Enter note title')}
              placeholderTextColor="#d6d6d6"
              value={newNoteTitle}
              onChangeText={setNewNoteTitle}
            />
            <TextInput
              style={[styles.inputCampNote, styles.contentInput]}
              placeholder={t('Enter note content')}
              placeholderTextColor="#d6d6d6"
              multiline
              value={newNoteContent}
              onChangeText={setNewNoteContent}
            />
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={pickImage}
            >
              <Text style={styles.imagePickerText}>
                {t('Pick an image')}
              </Text>
            </TouchableOpacity>
            {newNoteImage && (
              <Image source={{ uri: newNoteImage }} style={styles.newNoteImage} />
            )}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={editingNoteIndex !== null ? handleSaveEditNote : handleSaveNote}
            >
              <Text style={styles.saveText}>
                {editingNoteIndex !== null ? t('Save') : t('Add Note')}
              </Text>
            </TouchableOpacity>
            {editingNoteIndex !== null && (
              <TouchableOpacity
                style={styles.deleteButtonCampNote}
                onPress={() => handleDeleteNote(editingNoteIndex)}
              >
                <Text style={styles.deleteTextCampNote}>{t('Delete Note')}</Text>
              </TouchableOpacity>
            )}
          </View>
            <TouchableOpacity onPress={handleCloseNote}>
              <Text style={styles.closeNoteButtonCampaign}>{t('Close')}</Text>
            </TouchableOpacity>
        </Modal>
        )}

        <View style={styles.rightCampaignContainer}>
          <ScrollView style={styles.rightCampaignContainerScrollArea} ref={scrollViewRef}>
          {diceResults.map((result, index) => (
            <Text key={index} style={styles.diceResult}>
              {t('Dice roll result')}: Dice {result}
            </Text>
          ))}
               <Text style={styles.modalNoteCampaignText}>gracz wyrzucil 2</Text>
               <Text style={styles.modalNoteCampaignText}>Monster dolącza do walki</Text>
               <Text style={styles.modalNoteCampaignText}>Gracz1 i Gracz2 rozpoczęli walkę z Wilkiem</Text>
               <Text style={styles.modalNoteCampaignText}>Gracz2 wyrzucil 20</Text>
          </ScrollView>
          <TouchableOpacity style={styles.encounterButtonCampaignOne} onPress={handleGoToEncounter}>
            <Text style={styles.encounterButtonTextCampaignOne}>{t('Start Encounter')}</Text>
          </TouchableOpacity>
        </View>
      </View>

     </View>

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
        <TouchableOpacity style={styles.button} onPress={() => {handleGoBack()}} >
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default CampaignOne;