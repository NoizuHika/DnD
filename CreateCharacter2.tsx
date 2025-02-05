import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import HiddenText from './ProbaUkrytegoTekstu';
import CustomPicker from './Picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const CreateCharacter2: React.FC = ({ navigation, route }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const handleGoBack = () => {
    navigation.goBack();
  };

  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const { selectedClassInfo, nickname,description,race,playerClass, image } = route.params;

  const handleContinue = () => {
    navigation.navigate('CreateCharacter3', { selectedClassInfo, nickname,description,race,playerClass, image });
  };
  //const { selectedRace, selectedGender, selectedPosition } = route.params;

  const renderDescription = (description) => {
    return description.split('\n\n\n').map((block, index) => {
      const [title, ...contentArr] = block.split(': ');
      const content = contentArr.join(': ');

      if (content) {
        return <HiddenText key={index} title={title} content={content} />;
      }

  const pickerContent = selectedClassInfo[title] ? selectedClassInfo[title].split('\p') : [];

   if (pickerContent.length > 0) {
     return <PickerText key={index} title={title} options={pickerContent} />;
   }

    if (block.trim() === 'Spells:') {
      const spells = block.split('\n').slice(1);
      return (
        <Picker key={index} title={t('Spells')} options={spells} />
      );
    }

   if (selectedClassInfo[block]) {
     return <HiddenText key={index} title={line} content={selectedClassInfo[block]} />;
   }

   return <Text key={index} style={[styles.RaceGenderTitle, { fontSize: fontSize * 1.1 }]}>{block}</Text>;
    });
  };

  return (
  <ImageBackground
         source={theme.background}
           style={styles.container}
         >

    <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <View style={styles.selectedImageContainer}>
          <Image
            source={selectedClassInfo.image}
            style={[styles.selectedImage, { width: 400 * scaleFactor, height: 400 * scaleFactor }]}
          />
          <View style={styles.nicknameContainer}>
            <Text style={[styles.nicknameText, { fontSize: fontSize * 1.2 }]}>{nickname}</Text>
          </View>
          {renderDescription(selectedClassInfo.description)}
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

export default CreateCharacter2;