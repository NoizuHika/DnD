import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, Button, StyleSheet, ScrollView, TextInput, FlatList } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const PlayerSessions = () => {
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

            <Text style={[styles.headerTextCamp, { color: theme.fontColor }]}>{t('Your Sessions')}</Text>

                  <FlatList
                    data={sessions}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.inputCampNote}
                            onPress={() => openSessionDetails(item)}
                        >
                            <Text style={styles.sessionName}>{item}</Text>
                        </TouchableOpacity>
                    )}
            />
        </View>


      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      </ImageBackground>
    );
};

export default PlayerSessions;
