import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

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
  const { theme } = useContext(ThemeContext);
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
         source={theme.background}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        {/* Харки */}
        <TouchableOpacity onPress={() => setCharacterDetailsVisible(!isCharacterDetailsVisible)}>
          <Text style={styles.blockTitle}>{t('Character_Details')}</Text>
        </TouchableOpacity>
        {isCharacterDetailsVisible && (
          <View style={styles.blockContent}>
            <Text style={{ color: theme.fontColor }}>{t('Alignment')}:</Text>
            <Picker
              selectedValue={alignment}
              style={styles.pickerCharacter3}
              onValueChange={(itemValue) => setAlignment(itemValue)}
            >
              {alignments.map((align) => (
                <Picker.Item key={align} label={align} value={align} />
              ))}
            </Picker>

            <Text style={{ color: theme.fontColor }}>{t('Fate')}:</Text>
            <TextInput
              style={styles.inputCharacter}
              placeholder={t('Enter_your_fate')}
              value={fate}
              onChangeText={setFate}
            />

            <Text style={{ color: theme.fontColor }}>{t('Lifestyle')}:</Text>
            <TextInput
              style={styles.inputCharacter}
              placeholder={t('Enter_your_lifestyle')}
              value={lifestyle}
              onChangeText={setLifestyle}
            />
          </View>
        )}

        {/* Физ дан */}
        <TouchableOpacity onPress={() => setPhysicalCharacteristicsVisible(!isPhysicalCharacteristicsVisible)}>
          <Text style={styles.blockTitle}>{t('Physical_Characteristics')}</Text>
        </TouchableOpacity>
        {isPhysicalCharacteristicsVisible && (
          <View style={styles.blockContent}>
            <Text style={{ color: theme.fontColor }}>{t('Hair')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_hair_description')} />

            <Text style={{ color: theme.fontColor }}>{t('Skin')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_skin_description')} />

            <Text style={{ color: theme.fontColor }}>{t('Eyes')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_eye_description')} />

            <Text style={{ color: theme.fontColor }}>{t('Height')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_height')} />

            <Text style={{ color: theme.fontColor }}>{t('Weight')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_weight')} />

            <Text style={{ color: theme.fontColor }}>{t('Age')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_age')} />
          </View>
        )}

        {/* Перса */}
        <TouchableOpacity onPress={() => setPersonalCharacteristicsVisible(!isPersonalCharacteristicsVisible)}>
          <Text style={styles.blockTitle}>{t('Personal_Characteristics')}</Text>
        </TouchableOpacity>
        {isPersonalCharacteristicsVisible && (
          <View style={styles.blockContent}>
            <Text style={{ color: theme.fontColor }}>{t('Ideals')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_ideals')} />

            <Text style={{ color: theme.fontColor }}>{t('Preferences')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_preferences')} />

            <Text style={{ color: theme.fontColor }}>{t('Other')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_other_personal_characteristics')} />
          </View>
        )}

        {/* Заметки */}
        <TouchableOpacity onPress={() => setNotesVisible(!isNotesVisible)}>
          <Text style={styles.blockTitle}>{t('Notes')}</Text>
        </TouchableOpacity>
        {isNotesVisible && (
          <View style={styles.blockContent}>
            <Text style={{ color: theme.fontColor }}>{t('Organizations')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_organizations')} />

            <Text style={{ color: theme.fontColor }}>{t('Enemies')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_enemies')} />

            <Text style={{ color: theme.fontColor }}>{t('Allies')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_allies')} />

            <Text style={{ color: theme.fontColor }}>{t('Backstory')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_backstory')} multiline />

            <Text style={{ color: theme.fontColor }}>{t('Other_Notes')}:</Text>
            <TextInput style={styles.inputCharacter} placeholder={t('Enter_other_notes')} multiline />
          </View>
        )}

        <View style={styles.ConButtonNotes}>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.ConButtonText}>{t('Continue')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default CreateCharacter4;
