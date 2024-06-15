import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'react-native-image-picker';

const YourBook = ({ navigation }) => {
  const { t } = useTranslation();
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
        <ImageBackground key={index} source={character.image} style={styles.characterImage} />
      ))}
      <TouchableOpacity onPress={handleAddCharacter}>
        <ImageBackground source={require('./assets/add_new.png')} style={styles.characterImage} />
      </TouchableOpacity>
    </View>
  );

  const renderNotes = () => (
    <View style={styles.sectionContainer}>
      <FlatList
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.itemText}>{item}</Text>}
      />
      <TextInput
        placeholder={t('Add Note')}
        placeholderTextColor="#fff"
        style={styles.input}
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
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
        <Text style={styles.addButtonText}>{t('Add Image')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={require('./assets/dungeon.jpeg')} style={styles.container}>
      <Text style={styles.appName}>DUNGEON MASTER BOOK</Text>

      {activeSection === null && (
        <>
          <TouchableOpacity style={[styles.mainButton, { bottom: '50%' }]} onPress={() => setActiveSection('characters')}>
            <Text style={styles.buttonText}>{t('CHARACTERS')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mainButton, { bottom: '40%' }]} onPress={() => setActiveSection('notes')}>
            <Text style={styles.buttonText}>{t('NOTES')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mainButton, {bottom: '30%' }]} onPress={() => setActiveSection('images')}>
            <Text style={styles.buttonText}>{t('IMAGES')}</Text>
          </TouchableOpacity>
        </>
      )}

      {activeSection === 'characters' && renderCharacters()}
      {activeSection === 'notes' && renderNotes()}
      {activeSection === 'images' && renderImages()}
      {activeSection !== null && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>{t('Back')}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.goBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.goBackText}>{t('Go back')}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 24,
    color: '#fff',
    position: 'absolute',
    top: '16%',
  },
  backButton: {
    width: '20%',
    borderColor: '#7F7F7F',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    marginTop: 10,
  },
  backButtonText: {
    color: '#d6d6d6',
  },
  mainButton: {
    position: 'absolute',
    bottom: '35%',
    width: '50%',
    backgroundColor: 'transparent',
    borderColor: '#7F7F7F',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
  },
  buttonText: {
    color: '#d6d6d6',
  },
  sectionContainer: {
    width: '80%',
    alignItems: 'center',
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    color: '#fff',
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: 'transparent',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#7F7F7F',
  },
  addButtonText: {
    color: '#d6d6d6',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  characterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  characterImage: {
    width: 100,
    height: 100,
    margin: 10,
    justifyContent: 'flex-end',
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

export default YourBook;
