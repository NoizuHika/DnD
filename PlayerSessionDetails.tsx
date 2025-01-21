import React, { useRef, useState, useEffect, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Image, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const PlayerSessionDetails: React.FC = ({ navigation }) => {
    const { fontSize, scaleFactor } = useContext(SettingsContext);
    const route = useRoute();
    const { session } = route.params || {};
    const { t } = useTranslation();
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
    { id: 1, name: "Player 1", image: require('./assets/assasin.jpeg'), coins: 0, level: 1, hp: 100, ac: 12 },
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

  const handleRoll = () => {
    navigation.navigate('RzutKostka');
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
      <View style={styles.CampaignOneContainerMain}>
        <Text style={[styles.CampName, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>LOREM PSILUM</Text>

      </View>

      <View style={styles.mainCampaignContainer}>
        <View style={styles.leftCampaignContainer}>

    <View style={styles.playersSessionDetailStatsContainer}>
      {players.map((player) => (
        <View key={player.id} style={styles.playerSessionDetailStatsRow}>
          <Text style={[styles.playerSessionDetailStatHP, styles.statWithBorder, { fontSize: fontSize }]}>{t('HP')}: {player.hp}</Text>
          <Text style={[styles.playerSessionDetailStatAC, { fontSize: fontSize }]}>{t('AC')}: {player.ac}</Text>
        </View>
      ))}
    </View>

    <TouchableOpacity style={styles.rollSessionDetailButton} onPress={() => handleRoll()}>
      <Text style={[styles.rollSessionDetailButtonText, { fontSize: fontSize * 1.4 }]}>{t('Roll')}</Text>
    </TouchableOpacity>

          <ScrollView>



      {!addingNewSession && (
      <View style={styles.noteContent}>
        {notes.map((note, index) => (
          <View key={index} style={styles.noteHeader}>
            <TouchableOpacity onPress={() => handleOpenNote(note, index)}>
              <View style={styles.noteActions}>
                <Text style={[styles.noteTitle, { fontSize: fontSize }]}>{note.title}</Text>
              </View>
            </TouchableOpacity>
            {noteVisibility[index] && (
              <>
                <Text style={[styles.noteContent, { fontSize: fontSize }]}>{note.content}</Text>
                <Image source={note.image} style={[styles.noteImage, { width: 200 * scaleFactor, height: 200 * scaleFactor }]} />
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
               <Text style={[styles.modalNoteCampaignTitle, { fontSize: fontSize * 1.2 }]}>{selectedNote?.title}</Text>
               <Text style={[styles.modalNoteCampaignText, { fontSize: fontSize }]}>{selectedNote?.content}</Text>
               <Image source={selectedNote?.image} style={[styles.modalImageNoteCampaign, { width: 200 * scaleFactor, height: 200 * scaleFactor }]} />
               <View style={styles.modalActionsNoteCampaign}>
                 <TouchableOpacity style={styles.editButtonCamp} onPress={() => handleEditNote(editingNoteIndex)}>
                   <Text style={[styles.editTextCamp, { fontSize: fontSize }]}>{t('Edit')}</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.shareButtonCamp} onPress={() => handleShareNote(selectedNote)}>
                   <Text style={[styles.shareText, { fontSize: fontSize }]}>{t('Share')}</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.deleteButtonCamp} onPress={() => handleDeleteNote(editingNoteIndex)}>
                   <Text style={[styles.deleteTextCamp, { fontSize: fontSize }]}>{t('Delete')}</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </View>
                 <TouchableOpacity onPress={handleCloseNote}>
                   <Text style={[styles.closeNoteButtonCampaign, { fontSize: fontSize }]}>{t('Close')}</Text>
                 </TouchableOpacity>
         </Modal>
        )}

          <TouchableOpacity
            style={styles.addButtonCamp}
            onPress={handleAddNote}
          >
            <Text style={[styles.addButtonTextCamp, { fontSize: fontSize }]}>{t('+ Add Note')}</Text>
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
              style={[styles.inputCampNote, { fontSize: fontSize }]}
              placeholder={t('Enter note title')}
              placeholderTextColor="#d6d6d6"
              value={newNoteTitle}
              onChangeText={setNewNoteTitle}
            />
            <TextInput
              style={[styles.inputCampNote, styles.contentInput, { fontSize: fontSize }]}
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
              <Text style={[styles.imagePickerText, { fontSize: fontSize }]}>
                {t('Pick an image')}
              </Text>
            </TouchableOpacity>
            {newNoteImage && (
              <Image source={{ uri: newNoteImage }} style={[styles.newNoteImage, { width: 200 * scaleFactor, height: 200 * scaleFactor }]} />
            )}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={editingNoteIndex !== null ? handleSaveEditNote : handleSaveNote}
            >
              <Text style={[styles.saveText, { fontSize: fontSize }]}>
                {editingNoteIndex !== null ? t('Save') : t('Add Note')}
              </Text>
            </TouchableOpacity>
            {editingNoteIndex !== null && (
              <TouchableOpacity
                style={styles.deleteButtonCampNote}
                onPress={() => handleDeleteNote(editingNoteIndex)}
              >
                <Text style={[styles.deleteTextCampNote, { fontSize: fontSize }]}>{t('Delete Note')}</Text>
              </TouchableOpacity>
            )}
          </View>
            <TouchableOpacity onPress={handleCloseNote}>
              <Text style={[styles.closeNoteButtonCampaign, { fontSize: fontSize }]}>{t('Close')}</Text>
            </TouchableOpacity>
        </Modal>
        )}

        <View style={styles.rightCampaignContainer}>
          <View style={styles.playerSessionDetailAvatarContainer}>
            <Image source={players[0].image} style={[styles.playerSessionDetailAvatar, { width: 100 * scaleFactor, height: 100 * scaleFactor }]} />
            <Text style={[styles.playerSessionDetailName, { fontSize: fontSize }]}>{players[0].name}</Text>
          </View>
          <ScrollView style={styles.rightCampaignContainerScrollArea} ref={scrollViewRef}>
          {diceResults.map((result, index) => (
            <Text key={index} style={[styles.diceResult, { fontSize: fontSize }]}>
              {t('Dice roll result')}: Dice {result}
            </Text>
          ))}
               <Text style={styles.modalNoteCampaignText}>gracz wyrzucil 2</Text>
               <Text style={styles.modalNoteCampaignText}>Wilk dolącza do walki</Text>
               <Text style={styles.modalNoteCampaignText}>Gracz1 i Gracz2 rozpoczęli walkę z Wilkiem</Text>
               <Text style={styles.modalNoteCampaignText}>Gracz2 wyrzucil 20</Text>
          </ScrollView>
        </View>
      </View>

     </View>

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default PlayerSessionDetails;
