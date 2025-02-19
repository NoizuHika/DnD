import React, { useRef, useState, useEffect, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity,route, TextInput, ScrollView, Alert, Image, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { useAuth } from './AuthContext';
import { SettingsContext } from './SettingsContext';
import { UserData } from './UserData';
Appearance.setColorScheme('light');

const CampaignOne: React.FC = ({ route,navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { campaign } = route.params;
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { ipv4 } = useContext(UserData)
  const [selectedPlayerAdd,setSelectedPlayerAdd] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [notes, setNotes] = useState([]);
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
  const [actualCampaign,setActualCampaign] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [noteVisibility, setNoteVisibility] = useState(new Array(notes.length).fill(false));
  const [modalVisible, setModalVisible] = useState(false);
  const { token } = useAuth();
  const scrollViewRef = useRef(null);

  useEffect(() => {
      setPlayers(campaign.characters);
      setSessions(campaign.sessions);
  }, []);

  useEffect(() => {
    if (scrollViewRef.current && campaign.sessions[activeSessionIndex]?.logs?.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [campaign.sessions[activeSessionIndex]?.logs]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (actualCampaign) {
        fetchData();
      } else {
        console.warn('Cannot fetch data: actualCampaign is empty');
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [actualCampaign]);

  const fetchData = async () => {
        try {
            const sessionsResponse = await fetch(`http://${ipv4}:8000/campaigns/${campaign.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                }
            });

            if (!sessionsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

             const data = await sessionsResponse.json();
                    setActualCampaign(data)
                    setPlayers(data.characters);
                    setSessions(data.sessions);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

  const handleSelectPlayer = (player) => {
    if (selectedPlayers.includes(player.id)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== player.id));
    } else {
      setSelectedPlayers([...selectedPlayers, player.id]);
    }
  };
const changeHP = async (player) => {

  try {
     const requestBody = {
         player:player.id,
         id: player.actualHP-1};
         console.log(requestBody)
    const response = await fetch(`http://${ipv4}:8000/characters/hp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    console.log('New Feat:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

};
const levelUp = async (player) => {

  try {
    const response = await fetch(`http://${ipv4}:8000/characters/levelUP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({character_id:player.id}),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    console.log('New Feat:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

};
const addCoins = async (player) => {
  try {
     const requestBody = {
         player:player.id,id:player.money+10};
         console.log(requestBody)
    const response = await fetch(`http://${ipv4}:8000/characters/money`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    console.log('New Feat:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

};
const removeFromCampaign = async (player) => {

  try {
     const requestBody = {
         id:player.id};
         console.log(requestBody)
    const response = await fetch(`http://${ipv4}:8000/characters/removeCampaign/{character_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    console.log('New Feat:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

};
  const handlePlayerAction = (action) => {
    const updatedPlayers = players.map(player => {
      if (selectedPlayers.includes(player.id)) {
        switch (action) {
          case 'addCoins':
            addCoins(player);
            break;
          case 'levelUp':
            levelUp(player);
            break;
          case 'changeHP':
            changeHP(player);
            break;
          case 'remove':
             removeFromCampaign(player);
            return null;
        }
      }
      return player;
    }).filter(player => player !== null);
    setPlayers(updatedPlayers);
    setSelectedPlayers([]);
  };

  const handleAddPlayer = () => {
    setIsModalVisible(true);
    setSelectedPlayerAdd(true);
  };

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
  const addNPC = () =>{

      };
  const handleGoBack = () => {
    navigation.goBack();
  };

const addNewSession = async (newSessionContent,newSessionName) => {
  try {
         const requestBody = {
             campaignID: campaign.id,
             sessionName: newSessionName,
             SessionDescription: newSessionContent};
    const response = await fetch(`http://${ipv4}:8000/sessions/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    console.log('New session:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
  fetchData();
};
const addNewNote = async (newNoteTitle,newNoteContent) => {

  try {
     const requestBody = {
         token: token,
         id: sessions[activeSessionIndex]?.id,
         itemNoteTitle: newNoteTitle,
         itemNoteDescription: newNoteContent,
         type:"c"};
         console.log(requestBody)
    const response = await fetch(`http://${ipv4}:8000/notes/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    console.log('New session:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
  fetchData();
};
const updateSession = async (newSessionContent) => {
  try {
         const requestBody = {
             sessionName: sessions[activeSessionIndex]?.title,
             SessionDescription: newSessionContent,
             sessionID: sessions[activeSessionIndex]?.id };
    const response = await fetch(`http://${ipv4}:8000/sessions/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    console.log('New session:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
  fetchData();
};
  const handleAddSession = () => {
    if (newSessionName && newSessionContent) {
        addNewSession(newSessionContent,newSessionName);
         const updatedSessions = [...sessions, { name: newSessionName, description: newSessionContent }];
              saveSessions(updatedSessions);
      setNewSessionName('');
      setNewSessionContent('');
      setAddingNewSession(false);
       setActiveSessionIndex(updatedSessions.length - 1);
    } else {
      Alert.alert(t('Please enter both name and description for the session.'));
    }
  };
const updateNote = async () => {
  try {
         const requestBody = {
            token: token,
         id: campaign.sessions[activeSessionIndex]?.notes[editingNoteIndex]?.id,
         itemNoteTitle: newNoteTitle,
         itemNoteDescription: newNoteContent,
         type:"c"
             };
         console.log(requestBody);
console.log(campaign.sessions[activeSessionIndex]?.notes[editingNoteIndex]?.id);
    const response = await fetch(`http://${ipv4}:8000/notes/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    console.log('New note:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
  fetchData();
};
  const handleEditSession = (index) => {
    setEditingSession(index);
    setNewSessionName(sessions[index].name);
    setNewSessionContent(sessions[index].description);
  };

  const handleSaveEdit = () => {
    if (editingSession !== null) {
        updateSession(newSessionContent);
      const updatedSessions = [...sessions];
      updatedSessions[editingSession] = { name: newSessionName, description: newSessionContent };
      saveSessions(updatedSessions);
      setEditingSession(null);
      setNewSessionName('');
      setNewSessionContent('');
    }
  };
const deleteSession = async () => {
  try {

    const response = await fetch(`http://${ipv4}:8000/sessions/delete/${sessions[activeSessionIndex]?.id}`, {
      method: 'Delete',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log('Deleted:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
  fetchData();
};
const deleteNote = async () => {
  try {

    const response = await fetch(`http://${ipv4}:8000/notes/delete/${selectedNote.id}`, {
      method: 'Delete',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log('Deleted:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
  fetchData();
};
  const handleDeleteSession = (index) => {
      deleteSession();
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
        console.log(campaign.sessions[activeSessionIndex]?.id)
      addNewNote(newNoteTitle,newNoteContent)
      const updatedNotes = [...notes, newNote];
      await saveNotes(updatedNotes);
      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteImage(null);
      setAddingNewNote(false);
    } else {
      Alert.alert(t('Please enter both title and description for the note.'));
    }
  };

  const handleEditNote = (index) => {
    handleCloseNote();
    setEditingNoteIndex(index);
    setNewNoteTitle(campaign.sessions[activeSessionIndex]?.notes[index]?.title);
    setNewNoteContent(campaign.sessions[activeSessionIndex]?.notes[index]?.description);
    setAddingNewNote(!addingNewNote);
    setModalVisible(true);
  };

  const handleSaveEditNote = () => {
    if (editingNoteIndex !== null) {
      const updatedNotes = [...notes];
      updateNote();
      setNotes(updatedNotes);
      setEditingNoteIndex(null);
      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteImage(null);
      setAddingNewNote(false);
    }
  };

  const handleDeleteNote = (index) => {
    deleteNote();
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
    navigation.navigate('Encounters',{campaign:campaign});
  };

  const handleOpenNote = (note, index) => {
    setSelectedNote(note);
    setEditingNoteIndex(index);
    setIsModalVisible(true);
  };
const handleClosePlayerAdd = () => {
    setSelectedPlayerAdd(true);
    setIsModalVisible(false);
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
        <Text style={[styles.CampName, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>{campaign.title}</Text>

        <ScrollView horizontal>
          {sessions.map((session, index) => (
            <TouchableOpacity key={index} style={styles.sessionTab} onPress={() => {
              setActiveSessionIndex(index);
              setAddingNewSession(false);
            }}>
              <Text style={[styles.sessionTabText, { fontSize: fontSize }]}>{session.title}</Text>
            </TouchableOpacity>
          ))}
            <TouchableOpacity style={styles.sessionTab} onPress={handleNewSessionTab}>
              <Text style={[styles.sessionTabText, { fontSize: fontSize }]}>{t('Add new')}</Text>
            </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.CampaignOneContainerMain}>
        {sessions.length > 0 && !addingNewSession && (
          <View style={styles.sessionContainer}>
            <View style={styles.sessionHeader}>
           <ScrollView style={styles.sessionContentScrollContainer}>
            <Text style={[styles.sessionContent, { fontSize: fontSize }]}>{sessions[activeSessionIndex]?.description}</Text>
           </ScrollView>
            </View>
             <View style={styles.rowContainerRight}>
              <TouchableOpacity onPress={() => handleEditSession(activeSessionIndex)}>
                <Text style={[styles.editTextCamp, { fontSize: fontSize }]}>
                {t('Edit')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteSession(activeSessionIndex)}>
                <Text style={[styles.deleteTextCamp, { fontSize: fontSize }]}>
                {t('Delete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {addingNewSession && (
          <View style={styles.sessionContainer}>
          <TextInput
                        style={[styles.inputContent, styles.textArea, { fontSize: fontSize }]}
                        value={newSessionName}
                        onChangeText={setNewSessionName}
                        placeholder={t('Enter session Name')}
                        placeholderTextColor="#d6d6d6"
                        multiline
                      />
            <TextInput
              style={[styles.inputContent, styles.textArea, { fontSize: fontSize }]}
              value={newSessionContent}
              onChangeText={setNewSessionContent}
              placeholder={t('Enter session description')}
              placeholderTextColor="#d6d6d6"
              multiline
            />
            <TouchableOpacity style={[styles.addButtonCamp, { height: 45 * scaleFactor }]} onPress={handleAddSession}>
              <Text style={[styles.buttonTextCamp, { fontSize: fontSize }]}>{t('Add Session')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {editingSession !== null && !addingNewSession && (
          <View style={styles.sessionContainer}>
            <TextInput
              style={[styles.inputContent, styles.textArea, { fontSize: fontSize }]}
              value={newSessionContent}
              onChangeText={setNewSessionContent}
              placeholder={t('Enter session description')}
              placeholderTextColor="#d6d6d6"
              multiline
            />
            <TouchableOpacity style={[styles.addButtonCamp, { height: 40 * scaleFactor }]} onPress={handleSaveEdit}>
              <Text style={[styles.buttonTextCamp, { fontSize: fontSize }]}>{t('Save Changes')}</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>

      <View style={styles.mainCampaignContainer}>
        <View style={styles.leftCampaignContainer}>
          <ScrollView>


      {!addingNewSession && (
      <View style={styles.noteContent}>
        {sessions[activeSessionIndex]?.notes?.map((note, index) => (
          <View key={index} style={styles.noteHeader}>
            <TouchableOpacity onPress={() => handleOpenNote(note, index)}>
              <View style={styles.noteActions}>
                <Text style={[styles.noteTitle, { fontSize: fontSize }]}>{note.title}</Text>
              </View>
            </TouchableOpacity>
            {noteVisibility[index] && (
              <>

                <Text style={[styles.noteContent, { fontSize: fontSize }]}>{note.description}</Text>
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
               <Text style={[styles.modalNoteCampaignText, { fontSize: fontSize }]}>{selectedNote?.description}</Text>
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
            style={[styles.addButtonCamp, { height: 40 * scaleFactor }]}
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
              placeholder={t('Enter note description')}
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
          <ScrollView style={styles.rightCampaignContainerScrollArea} ref={scrollViewRef}>
                      <>
                      {sessions[activeSessionIndex]?.logs?.map((result, index) => (
                          <Text key={index} style={[styles.diceResult, { fontSize: fontSize }]}>
                              {result}
                          </Text>
                         ))}
                         <Text style={styles.diceResult}>{"\n\n"}</Text>
                       </>

          </ScrollView>
          <TouchableOpacity style={styles.encounterButtonCampaignOne} onPress={handleGoToEncounter}>
            <Text style={[styles.encounterButtonTextCampaignOne, { fontSize: fontSize }]}>{t('Start Encounter')}</Text>
          </TouchableOpacity>
        </View>
      </View>

     </View>
        {selectedPlayerAdd && (
                 <Modal
                   visible={isModalVisible}
                   animationType="slide"
                   transparent={true}
                   onRequestClose={handleCloseNote}
                 >
                   <View style={styles.modalNoteCampaignContainer}>
                     <View style={styles.modalNoteCampaignContent}>
                       <Text style={[styles.modalNoteCampaignTitle, { fontSize: fontSize * 1.2 }]}>Code to join:</Text>
                       <Text style={[styles.modalNoteCampaignText, { fontSize: fontSize }]}>{campaign.code}</Text>
                         <View style={styles.modalActionsNoteCampaign}>
                         <TouchableOpacity style={styles.editButtonCamp} onPress={addNPC}>
                           <Text style={[styles.editTextCamp, { fontSize: fontSize }]}>{t('addNPC')}</Text>
                         </TouchableOpacity>
                       </View>
                     </View>
                   </View>
                         <TouchableOpacity onPress={handleClosePlayerAdd}>
                           <Text style={[styles.closeNoteButtonCampaign, { fontSize: fontSize }]}>{t('Close')}</Text>
                         </TouchableOpacity>
                 </Modal>
                )}
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
              {player.image ? (
                  <Image source={{ uri: player.image }} style={styles.playerImage} />
                ) : (
                  <Image source={require('./addons/defaultPlayer.png')} style={styles.playerImage} />
                )}
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
            <Text style={[styles.playerActionText, { fontSize: fontSize }]}>{t('Add Coins')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playerActionButton} onPress={() => handlePlayerAction('levelUp')}>
            <Text style={[styles.playerActionText, { fontSize: fontSize }]}>{t('Level Up')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playerActionButton} onPress={() => handlePlayerAction('changeHP')}>
            <Text style={[styles.playerActionText, { fontSize: fontSize }]}>{t('Change HP')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playerActionButton} onPress={() => handlePlayerAction('remove')}>
            <Text style={[styles.playerActionText, { fontSize: fontSize }]}>{t('Remove Player')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default CampaignOne;