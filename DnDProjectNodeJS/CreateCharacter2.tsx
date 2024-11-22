import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import HiddenText from './ProbaUkrytegoTekstu';
import CustomPicker from './Picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const CreateCharacter2 = ({ navigation, route }) => {
const handleGoBack = () => {
     navigation.navigate('CreateCharacter');
  };

  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const { selectedClassInfo, nickname } = route.params;

  const handleContinue = () => {
    navigation.navigate('CreateCharacter3', { selectedClassInfo, nickname });
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

   return <Text key={index} style={styles.RaceGenderTitle}>{block}</Text>;
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
            style={styles.selectedImage}
          />
          <View style={styles.nicknameContainer}>
            <Text style={styles.nicknameText}>{nickname}</Text>
          </View>
          {renderDescription(selectedClassInfo.description)}
        </View>

      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

        <View style={styles.ConButton}>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.ConButtonText}>{t('Continue')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ImageBackground>
  );
};

export default CreateCharacter2;