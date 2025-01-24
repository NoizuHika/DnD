import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, TouchableOpacity, Text, View, Button, StyleSheet, ScrollView, TextInput, FlatList } from 'react-native';
import { useNavigation, HeaderBackButton } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
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


          } catch (error) {
              console.error('Error fetching data:', error);
          }
    };


    const openSessionDetails = (item) => {
        navigation.navigate('PlayerSessionDetails', {campaign: item[1], player:item[0],session:item[1].sessions[item[1].sessions.length - 1] });
    };

    return (
      <ImageBackground
        style={styles.containerCamp}
             source={theme.background}
        resizeMode="cover">

        <View style={styles.scrollContainer}>

            <Text style={[styles.headerTextCamp, { color: theme.fontColor, fontSize: fontSize }]}>{t('Your Sessions')}</Text>

                  <FlatList
                    data={result}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.inputCampNote, { padding: 10 * scaleFactor, marginVertical: 5 * scaleFactor }]}
                            onPress={() => openSessionDetails(item)}
                        >
                            <Text style={[styles.sessionName, { fontSize: fontSize }]}>{item[1].title}</Text>
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
