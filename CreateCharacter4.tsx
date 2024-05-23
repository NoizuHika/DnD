import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';

const alignments = [
  'Chaotic Evil',
  'Chaotic Good',
  'Chaotic Neutral',
  'Lawful Evil',
  'Lawful Good',
  'Lawful Neutral',
  'Neutral Evil',
  'Neutral Good',
  'True Neutral'
];

const CreateCharacter4 = ({ navigation, route }) => {
  const handleGoBack = () => {
    navigation.navigate('CreateCharacter');
  };

  const { t, i18n } = useTranslation();
  const { selectedClassInfo, nickname } = route.params;

  const handleContinue = () => {
    navigation.navigate('CreateCharacter5', { selectedClassInfo, nickname });
  };

  const [alignment, setAlignment] = useState('');
  const [fate, setFate] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [isCharacterDetailsVisible, setCharacterDetailsVisible] = useState(true);
  const [isPhysicalCharacteristicsVisible, setPhysicalCharacteristicsVisible] = useState(false);
  const [isPersonalCharacteristicsVisible, setPersonalCharacteristicsVisible] = useState(false);
  const [isNotesVisible, setNotesVisible] = useState(false);

  return (
    <ImageBackground
      source={require('./assets/dungeon.jpeg')}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        {/* Харки */}
        <TouchableOpacity onPress={() => setCharacterDetailsVisible(!isCharacterDetailsVisible)}>
          <Text style={styles.blockTitle}>{t('Character_Details')}</Text>
        </TouchableOpacity>
        {isCharacterDetailsVisible && (
          <View style={styles.blockContent}>
            <Text>Alignment:</Text>
            <Picker
              selectedValue={alignment}
              style={styles.picker}
              onValueChange={(itemValue) => setAlignment(itemValue)}
            >
              {alignments.map((align) => (
                <Picker.Item key={align} label={align} value={align} />
              ))}
            </Picker>

            <Text>Fate:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your fate"
              value={fate}
              onChangeText={setFate}
            />

            <Text>Lifestyle:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your lifestyle"
              value={lifestyle}
              onChangeText={setLifestyle}
            />
          </View>
        )}

        {/* Физ дан */}
        <TouchableOpacity onPress={() => setPhysicalCharacteristicsVisible(!isPhysicalCharacteristicsVisible)}>
          <Text style={styles.blockTitle}>Physical Characteristics</Text>
        </TouchableOpacity>
        {isPhysicalCharacteristicsVisible && (
          <View style={styles.blockContent}>
            <Text>Hair:</Text>
            <TextInput style={styles.input} placeholder="Enter hair description" />

            <Text>Skin:</Text>
            <TextInput style={styles.input} placeholder="Enter skin description" />

            <Text>Eyes:</Text>
            <TextInput style={styles.input} placeholder="Enter eye description" />

            <Text>Height:</Text>
            <TextInput style={styles.input} placeholder="Enter height" />

            <Text>Weight:</Text>
            <TextInput style={styles.input} placeholder="Enter weight" />

            <Text>Age:</Text>
            <TextInput style={styles.input} placeholder="Enter age" />
          </View>
        )}

        {/* Перса */}
        <TouchableOpacity onPress={() => setPersonalCharacteristicsVisible(!isPersonalCharacteristicsVisible)}>
          <Text style={styles.blockTitle}>Personal Characteristics</Text>
        </TouchableOpacity>
        {isPersonalCharacteristicsVisible && (
          <View style={styles.blockContent}>
            <Text>Ideals:</Text>
            <TextInput style={styles.input} placeholder="Enter ideals" />

            <Text>Preferences:</Text>
            <TextInput style={styles.input} placeholder="Enter preferences" />

            <Text>Other:</Text>
            <TextInput style={styles.input} placeholder="Enter other personal characteristics" />
          </View>
        )}

        {/* Заметки */}
        <TouchableOpacity onPress={() => setNotesVisible(!isNotesVisible)}>
          <Text style={styles.blockTitle}>Notes</Text>
        </TouchableOpacity>
        {isNotesVisible && (
          <View style={styles.blockContent}>
            <Text>Organizations:</Text>
            <TextInput style={styles.input} placeholder="Enter organizations" />

            <Text>Enemies:</Text>
            <TextInput style={styles.input} placeholder="Enter enemies" />

            <Text>Allies:</Text>
            <TextInput style={styles.input} placeholder="Enter allies" />

            <Text>Backstory:</Text>
            <TextInput style={styles.input} placeholder="Enter backstory" multiline />

            <Text>Other Notes:</Text>
            <TextInput style={styles.input} placeholder="Enter other notes" multiline />
          </View>
        )}

        <View style={styles.ConButton}>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.ConButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.GoBackText}>Go back</Text>
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


  blockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d6d6d6',
    marginTop: 20,
  },

  blockContent: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },


  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },


  ConButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    width: '60%',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#7F7F7F',
    alignItems: 'center',
  },
  ConButtonText: {
    color: '#d6d6d6',
    fontSize: 20,
  },
  GoBack: {
    position: 'absolute',
    top: 42,
    left: 20,
    width: '20%',
    borderColor: '#7F7F7F',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
  },
  GoBackText: {
    color: '#d6d6d6',
  },
});

export default CreateCharacter4;
