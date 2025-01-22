import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'react-native-image-picker';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const YourBook: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [activeSection, setActiveSection] = useState(null);
  const [characters, setCharacters] = useState([
    { name: 'Character1', image: require('./assets/swordsman.jpeg') },
    { name: 'Character2', image: require('./assets/wizard.jpeg') },
    { name: 'Character3', image: require('./assets/archer.jpeg') },
    { name: 'Character4', image: require('./assets/assasin.jpeg') },
    { name: 'Character5', image: require('./assets/Halfling-M-Warrior.jpg') },
  ]);
  const [notes, setNotes] = useState([]);
  const [images, setImages] = useState([]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleBackPress = () => {
    setActiveSection(null);
  };

  const handleAddImage = () => {
    const options = {
      mediaType: 'photo',
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImages([...images, response.assets[0].uri]);
      }
    });
  };

  const handleAddCharacter = () => {
    const options = {
      mediaType: 'photo',
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const newCharacter = { name: `Character${characters.length + 1}`, image: { uri: response.assets[0].uri } };
        setCharacters([...characters, newCharacter]);
      }
    });
  };

  const renderCharacters = () => (
    <View style={styles.characterRow}>
      {characters.map((character, index) => (
        <ImageBackground key={index} source={character.image} style={[styles.characterImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]} />
      ))}
      <TouchableOpacity onPress={handleAddCharacter}>
        <ImageBackground source={require('./assets/icons/characters.png')} style={[styles.characterImage, { height: 100 * scaleFactor, width: 100 * scaleFactor }]} />
      </TouchableOpacity>
    </View>
  );

  const renderNotes = () => (
    <View style={styles.sectionContainer}>
      <FlatList
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={[styles.itemText, { fontSize: fontSize, color: theme.fontColor }]}>{item}</Text>}
      />
      <TextInput
        placeholder={t('Add Note')}
        placeholderTextColor="#fff"
        style={[styles.inputNotes, { fontSize: fontSize, height: 50 * scaleFactor, padding: 10 * scaleFactor }]}
        onSubmitEditing={(e) => {
          setNotes([...notes, e.nativeEvent.text]);
          e.target.clear();
        }}
      />
    </View>
  );

  const renderImages = () => (
    <View style={styles.sectionContainer}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Image source={{ uri: item }} style={[styles.image, { height: 200 * scaleFactor, width: 200 * scaleFactor }]} />}
      />
      <TouchableOpacity style={styles.addButtonImage} onPress={handleAddImage}>
        <Text style={[styles.addButtonText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Add Image')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <Text style={[styles.appName, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>DUNGEON MASTER BOOK</Text>

      {activeSection === null && (
        <>
       <View style={[styles.buttonContainerUsu, {bottom: '50%' }]}>
          <TouchableOpacity style={[styles.button, { height: 50 * scaleFactor }]} onPress={() => setActiveSection('characters')}>
            <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
              <Image source={theme.icons.characters} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Characters')}</Text>
            </ImageBackground>
          </TouchableOpacity>
       </View>

       <View style={[styles.buttonContainerUsu, { bottom: '40%' }]}>
          <TouchableOpacity style={[styles.button, { height: 50 * scaleFactor }]} onPress={() => setActiveSection('notes')}>
            <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
              <Image source={theme.icons.notes} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Notes')}</Text>
            </ImageBackground>
          </TouchableOpacity>
       </View>

       <View style={[styles.buttonContainerUsu, {bottom: '30%' }]}>
          <TouchableOpacity style={[styles.button, { height: 50 * scaleFactor }]} onPress={() => setActiveSection('images')}>
            <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
              <Image source={theme.icons.images} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Images')}</Text>
            </ImageBackground>
          </TouchableOpacity>
       </View>
        </>
      )}

      {activeSection === 'characters' && renderCharacters()}
      {activeSection === 'notes' && renderNotes()}
      {activeSection === 'images' && renderImages()}
      {activeSection !== null && (
        <TouchableOpacity style={[styles.backButton, { height: 50 * scaleFactor, width: 150 * scaleFactor }]} onPress={handleBackPress}>
          <Text style={[styles.backButtonText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Back')}</Text>
        </TouchableOpacity>
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

export default YourBook;
