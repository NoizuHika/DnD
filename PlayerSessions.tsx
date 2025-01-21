import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, Button, StyleSheet, ScrollView, TextInput, FlatList } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const PlayerSessions: React.FC = () => {
    const { fontSize, scaleFactor } = useContext(SettingsContext);
    const [sessions, setSessions] = useState([]);
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const loadSessions = async () => {
            try {
                // Fetch campaigns from AsyncStorage
                const storedCampaigns = await AsyncStorage.getItem('campaigns');
                if (storedCampaigns) {
                    setSessions(JSON.parse(storedCampaigns));
                }
            } catch (error) {
                console.error('Failed to load sessions:', error);
            }
        };
        loadSessions();
    }, []);


    const openSessionDetails = (session) => {
        navigation.navigate('PlayerSessionDetails', { session });
    };

    return (
      <ImageBackground
        style={styles.containerCamp}
             source={theme.background}
        resizeMode="cover">

        <View style={styles.scrollContainer}>

            <Text style={[styles.headerTextCamp, { color: theme.fontColor, fontSize: fontSize }]}>{t('Your Sessions')}</Text>

                  <FlatList
                    data={sessions}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.inputCampNote, { padding: 10 * scaleFactor, marginVertical: 5 * scaleFactor }]}
                            onPress={() => openSessionDetails(item)}
                        >
                            <Text style={[styles.sessionName, { fontSize: fontSize }]}>{item}</Text>
                        </TouchableOpacity>
                    )}
            />
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

export default PlayerSessions;
