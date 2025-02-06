import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, Button, StyleSheet, ScrollView, TextInput, FlatList, Modal, Image } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { UserData } from './UserData';
import { useAuth } from './AuthContext';

Appearance.setColorScheme('light');

const PlayerSessions: React.FC = () => {
    const { fontSize, scaleFactor } = useContext(SettingsContext);
    const [sessions, setSessions] = useState([]);
    const [result, setResult] = useState([]);
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);
    const { ipv4 } = useContext(UserData);
    const { token } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [code, setCode] = useState('');
    const [characters, setCharacters] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [playerModalVisible, setPlayerModalVisible] = useState(false);

    useEffect(() => {
         fetchData();
    }, []);
    const fetchData = async () => {
        try {
            console.log('Token:', token.toString());
            const sessionsResponse = await fetch(`http://${ipv4}:8000/user/characters/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ token: token.toString() }),
            });

            if (!sessionsResponse.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await sessionsResponse.json();
             setResult(data.result)


            const charactersResponse = await fetch(`http://${ipv4}:8000/user/characters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ token: token.toString() }),
            });

            if (!charactersResponse.ok) {
                throw new Error('Failed to fetch characters');
            }

            const charactersData = await charactersResponse.json();
            setCharacters(charactersData.characters);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


 const joinSession = async () => {
                requestBody ={
                        campaign_code: code,
                        character_id: selectedPlayers.id
                        };
        try {
            console.log('Token:', token.toString());
            const sessionsResponse = await fetch(`http://${ipv4}:8000/campaigns/addCharacter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify(requestBody),
            });

            if (!sessionsResponse.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await sessionsResponse.json();
             setResult(data.result)


            const charactersResponse = await fetch(`http://${ipv4}:8000/user/characters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ token: token.toString() }),
            });

            if (!charactersResponse.ok) {
                throw new Error('Failed to fetch characters');
            }

            const charactersData = await charactersResponse.json();
            setCharacters(charactersData.characters);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const openSessionDetails = (item) => {
        navigation.navigate('PlayerSessionDetails', {campaign: item[1], player:item[0],session:item[1].sessions[item[1].sessions.length - 1] });

    };

    const addSession = () => {
        joinSession();
        if (code.trim() === '') return;

        setResult([...result]);
        setModalVisible(false);
        setCode('');
        setSelectedPlayers([]);
    };

    const handleSelectPlayer = (player) => {
        if (selectedPlayers.includes(player.id)) {
            setSelectedPlayers(selectedPlayers.filter(id => id !== player.id));
        } else {
            setSelectedPlayers([...selectedPlayers, player.id]);
        }
    };

    return (
      <ImageBackground
        style={styles.containerCamp}
             source={theme.background}
        resizeMode="cover">

        <View style={[styles.scrollContainerSession, { flex: 1 }]}>

            <Text style={[styles.headerTextCamp, { color: theme.fontColor, fontSize: fontSize }]}>{t('Your Sessions')}</Text>

                  <FlatList
                    data={result}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.inputCampNote, { padding: 10 * scaleFactor, marginVertical: 5 * scaleFactor, borderColor: theme.borderColor, borderWidth: 2 }]}
                            onPress={() => openSessionDetails(item)}
                        >
                            <Text style={[styles.sessionName, { fontSize: fontSize }]}>{item[1].title}</Text>
                        </TouchableOpacity>
                    )}
            />

            <TouchableOpacity
                style={[styles.addButtonPlayerSession, { borderColor: theme.borderColor, borderWidth: 2 }]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={[styles.autoAddButtonText, { color: theme.fontColor, fontSize: fontSize * 0.8 }]}>{t('Add Session')}</Text>
            </TouchableOpacity>

        </View>



        <Modal transparent={true} visible={modalVisible} animationType="slide">
            <View style={styles.modalContainerMonCre}>
                <View style={styles.modalContentMonCre}>
                    <Text style={[styles.modalTitleMonCre, { fontSize: fontSize }]}>{t('Enter Code')}</Text>
                    <TextInput
                        style={[styles.modalInputEncounter, { fontSize: fontSize }]}

                        value={code}
                        onChangeText={setCode}
                        placeholder={t('Enter Code')}
                        placeholderTextColor="#808080"
                        maxLength={6}
                    />

                    <Text style={[styles.modalTitleMonCre, { fontSize: fontSize, marginTop: 10 * scaleFactor }]}>{t('Select Player')}</Text>
                    <TouchableOpacity
                        style={[styles.pickerButton, { borderColor: theme.borderColor, borderWidth: 1 }]}
                        onPress={() => setPlayerModalVisible(true)}
                    >
                        <Text style={{ fontSize: fontSize, color: theme.fontColor }}>
                            {selectedPlayers ? selectedPlayers.name : t('Select a player')}
                        </Text>
                    </TouchableOpacity>

                  <View style={styles.rowContainer}>
                    <TouchableOpacity
                        style={[styles.modalButtonSession, { padding: 10 * scaleFactor, backgroundColor: 'green' }]}
                        onPress={addSession}
                    >
                        <Text style={[styles.modalCloseButtonText, { fontSize: fontSize * 0.8 }]}>{t('Confirm')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modalButtonSession, { padding: 10 * scaleFactor, backgroundColor: 'red' }]}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={[styles.modalCloseButtonText, { fontSize: fontSize * 0.8 }]}>{t('Cancel')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </View>

            <Modal transparent={true} visible={playerModalVisible} animationType="slide">
                <View style={styles.modalContainerMonCre}>
                    <View style={styles.modalContentMonCre}>
                        <Text style={[styles.modalTitleMonCre, { fontSize: fontSize }]}>{t('Select Player')}</Text>

                        <FlatList
                            data={characters}
                            keyExtractor={(player) => player.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.characterItem,
                                        selectedPlayers?.id === item.id && styles.selectedCharacter
                                    ]}
                                    onPress={() => {
                                        setSelectedPlayers(item);
                                        setPlayerModalVisible(false);
                                    }}
                                >
                                    <Image source={item.image ? { uri: item.image } : require('./addons/defaultPlayer.png')} style={styles.characterImageSession} />
                                    <Text style={[styles.characterNameSession, { color: theme.fontColor }]}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            style={[styles.modalButtonSession, { padding: 10 * scaleFactor, backgroundColor: 'gray' }]}
                            onPress={() => setPlayerModalVisible(false)}
                        >
                            <Text style={[styles.modalCloseButtonText, { fontSize: fontSize * 0.8 }]}>{t('Cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </Modal>


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

export default PlayerSessions;