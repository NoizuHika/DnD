import React, { useState, useContext,useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { useAuth } from './AuthContext';
import { UserData } from './UserData';
const CreateCharacter4: React.FC = ({ navigation, route }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const handleGoBack = () => {
    navigation.goBack();
  };

  const { token } = useAuth();
Appearance.setColorScheme('light');

const[alignments,setAlignments] = useState([]);
 const { ipv4 } = useContext(UserData)
const [backgrounds,setBackgrounds] = useState([]);
useEffect(() => {
      addBackgrounds();
      addAlignments();
      }, []);
const addAlignments = async () => {

  try {
         const response = await fetch(`http://${ipv4}:8000/alignment/all`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      }}
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    setAlignments(result);
    console.log(result)
    console.log('New Feat:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

};

const addBackgrounds= async () => {

  try {
         const response = await fetch(`http://${ipv4}:8000/backgrounds/all/short`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      }}
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    setBackgrounds(result);
    console.log(result)
    console.log('New Feat:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

};
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { selectedClassInfo, nickname,description,race,playerClass, image, attributes } = route.params;

  const handleContinue = () => {
      const description2= ` Gender: ${description} Fate: ${fate} Lifestyle: ${lifestyle} Height: ${height} Weight: ${weight} Age: ${age}`
    navigation.navigate('CreateCharacter5', { selectedClassInfo, nickname,description2,race,playerClass, image, attributes,alignment,background });
  };

  const [alignment, setAlignment] = useState('');
  const [fate, setFate] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [isCharacterDetailsVisible, setCharacterDetailsVisible] = useState(true);
  const [isPhysicalCharacteristicsVisible, setPhysicalCharacteristicsVisible] = useState(false);
  const [isPersonalCharacteristicsVisible, setPersonalCharacteristicsVisible] = useState(false);
  const [isNotesVisible, setNotesVisible] = useState(false);
  const [background,setBackground] = useState('');
  const validateNumberInput = (text) => {
    return text.replace(/[^0-9]/g, '');
  };

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');

  return (
    <ImageBackground
         source={theme.background}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

       <View style={styles.blockContainer}>
        <TouchableOpacity onPress={() => setCharacterDetailsVisible(!isCharacterDetailsVisible)}>
          <Text style={[styles.blockTitle, { fontSize: fontSize * 1.2 }]}>{t('Character_Details')}</Text>
        </TouchableOpacity>
        {isCharacterDetailsVisible && (
          <View style={[styles.blockContent, { transform: [{ scale: 1.1 * scaleFactor }] }]}>
            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Alignment')}:</Text>
            <Picker
              selectedValue={alignment}
              style={styles.pickerCharacter3}
              onValueChange={(itemValue) => setAlignment(itemValue)}
            >
              {alignments.map((align) => (
                <Picker.Item key={align} label={align.name} value={align.id} />
              ))}
            </Picker>

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Fate')}:</Text>
            <TextInput
              style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]}
              placeholder={t('Enter_your_fate')}
              value={fate}
              onChangeText={setFate}
            />

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Lifestyle')}:</Text>
            <TextInput
              style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]}
              placeholder={t('Enter_your_lifestyle')}
              value={lifestyle}
              onChangeText={setLifestyle}
            />
          </View>
        )}
       </View>
       <View style={styles.blockContainer}>
        <TouchableOpacity onPress={() => setPhysicalCharacteristicsVisible(!isPhysicalCharacteristicsVisible)}>
          <Text style={[styles.blockTitle, { fontSize: fontSize * 1.2 }]}>{t('Physical_Characteristics')}</Text>
        </TouchableOpacity>
        {isPhysicalCharacteristicsVisible && (
          <View style={[styles.blockContent, { transform: [{ scale: 1.1 * scaleFactor }] }]}>
            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Hair')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_hair_description')} />

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Skin')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_skin_description')} />

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Eyes')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_eye_description')} />

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Height')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_height')} value={height} onChangeText={(text) => setHeight(validateNumberInput(text))} keyboardType="numeric" />

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Weight')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_weight')} value={weight} onChangeText={(text) => setWeight(validateNumberInput(text))} keyboardType="numeric" />

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Age')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_age')} value={age} onChangeText={(text) => setAge(validateNumberInput(text))} keyboardType="numeric" />
          </View>
        )}
       </View>
       <View style={styles.blockContainer}>
        <TouchableOpacity onPress={() => setPersonalCharacteristicsVisible(!isPersonalCharacteristicsVisible)}>
          <Text style={[styles.blockTitle, { fontSize: fontSize * 1.2 }]}>{t('Personal_Characteristics')}</Text>
        </TouchableOpacity>
        {isPersonalCharacteristicsVisible && (
          <View style={styles.blockContent}>
            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Ideals')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_ideals')} />

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Preferences')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_preferences')} />

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Other')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_other_personal_characteristics')} />
          </View>
        )}
       </View>
       <View style={styles.blockContainer}>
        <TouchableOpacity onPress={() => setNotesVisible(!isNotesVisible)}>
          <Text style={[styles.blockTitle, { fontSize: fontSize * 1.2 }]}>{t('Notes')}</Text>
        </TouchableOpacity>
        {isNotesVisible && (
          <View style={styles.blockContent}>
            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Organizations')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_organizations')} />

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Enemies')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_enemies')} />

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Allies')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_allies')} />

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Backstory')}:</Text>
            <Picker
              selectedValue={alignment}
              style={styles.pickerCharacter3}
              onValueChange={(itemValue) => setBackground(itemValue)}
            >
              {backgrounds.map((align) => (
                <Picker.Item key={align} label={align[0]} value={align[1]} />
              ))}
            </Picker>

            <Text style={[styles.label, { fontSize: fontSize, color: theme.fontColor }]}>{t('Other_Notes')}:</Text>
            <TextInput style={[styles.inputCharacter, { height: 45 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter_other_notes')} multiline />
          </View>
        )}
       </View>
      </ScrollView>

        <View style={[styles.ConButtonCharacter, { bottom: 10 * scaleFactor }]}>
          <TouchableOpacity style={[styles.button, { height: 25 * scaleFactor, width: 200 * scaleFactor }]} onPress={handleContinue}>
            <Text style={[styles.ConButtonText, { fontSize: fontSize }]}>{t('Continue')}</Text>
          </TouchableOpacity>
        </View>

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

export default CreateCharacter4;