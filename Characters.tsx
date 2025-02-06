import React, { useState, useContext,useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { UserData } from './UserData';
import { useAuth } from './AuthContext';
Appearance.setColorScheme('light');

const Characters: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const handleGoBack = () => {
     navigation.navigate('LoggedScreen');
  };

  const { token } = useAuth();
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [characters, setCharacters] = useState([]);
  const { ipv4 } = useContext(UserData)

  useEffect(() => {
            fetchData();
  }, []);

  const fetchData = async () => {
            try {
                console.log('Token:', token.toString());

                const campaignsResponse = await fetch(`http://${ipv4}:8000/user/characters`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'accept': 'application/json'
                            },
                            body: JSON.stringify({ token: token.toString() }),
                        });


                if (!campaignsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const characters = await campaignsResponse.json();
                setCharacters(characters.characters);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };


  const handleCharacterPress = (character) => {
     console.log(`Character ${character.name} pressed`);
     navigation.navigate('Character1',{ characterData : character });
  };
 const handleCharacterCreatePress = (character) => {
     navigation.navigate('CreateCharacter');
  };

  const data = [...characters, { id: 'create_button', isButton: true }];

  const renderItem = ({ item }) => {
    if (item.isButton) {
      return (
        <View style={styles.buttonContainerCharacters}>
          <TouchableOpacity onPress={() => handleCharacterCreatePress('CreateCharacter')}>
            <ImageBackground
              source={require('./assets/Halfling-M-Warlock.jpg')}
              style={[styles.characterImage, {
                height: 100 * scaleFactor,
                width: 100 * scaleFactor
              }]}
            >
              <Text style={[styles.characterStatus, {
                color: 'white',
                fontSize: fontSize * 0.8
              }]}>
                {t('Create_new')}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.buttonContainerCharacters}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleCharacterPress(item)}
        >
          <ImageBackground
            source={item.image ? { uri: item.image } : require('./addons/defaultPlayer.png')}
            style={[styles.characterImage, {
              height: 100 * scaleFactor,
              width: 100 * scaleFactor
            }]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
  <ImageBackground
         source={theme.background}
         style={styles.containerCharacters}
       >

     <Text style={[styles.appNameCharacters, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>DMBook</Text>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        numColumns={3}
        contentContainerStyle={styles.characterContainerCharacters}
        scrollIndicatorInsets={{ top: 60, bottom: 60 }}
      />

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

export default Characters;