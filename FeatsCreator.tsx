import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { SettingsContext } from './SettingsContext';
import { useAuth } from './AuthContext';
import { UserData } from './UserData';
const FeatsCreator: React.FC = ({ navigation }) => {
      const { ipv4 } = useContext(UserData);
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { token } = useAuth();
  const [feat, setFeat] = useState({
    name: '',
    requirements: '',
    description: '',
  });
const addNewFeat = async () => {

  try {
     const requestBody = {
         token: token,
         name:feat.name,
         description: feat.description,
         requirements: feat.requirements};
         console.log(requestBody)
    const response = await fetch(`http://${ipv4}:8000/feats/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    console.log('New Feat:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

};
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleInputChange = (field, value) => {
    setFeat({ ...feat, [field]: value });
  };

  const saveFeat = () => {
      addNewFeat();
    console.log('Feat saved:', feat);
  };

  return (
    <ImageBackground source={theme.background} style={styles.containerCreator}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

        <View style={[styles.centeredBlock, { marginBottom: 20 * scaleFactor }]}>
          <Text style={[styles.labelNameItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Name')}</Text>
          <TextInput
            style={[styles.inputItemCreator, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
            placeholder={t('Enter feat name')}
            value={feat.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
        </View>

        <View style={[styles.centeredBlock, { marginBottom: 20 * scaleFactor }]}>
          <Text style={[styles.labelNameItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Prerequisite')}</Text>
          <TextInput
            style={[styles.inputItemCreator, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
            placeholder={t('Enter prerequisite')}
            value={feat.requirements}
            onChangeText={(text) => handleInputChange('requirements', text)}
          />
        </View>

        <View style={[styles.centeredBlock, { marginBottom: 20 * scaleFactor }]}>
          <Text style={[styles.labelNameItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Description')}</Text>
          <TextInput
            style={[styles.inputItemCreator, { height: 100 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
            multiline
            placeholder={t('Enter feat description')}
            value={feat.description}
            onChangeText={(text) => handleInputChange('description', text)}
          />
        </View>
      </ScrollView>

      <View style={[styles.saveButton, { marginBottom: 10 * scaleFactor }]}>
        <TouchableOpacity style={[styles.buttonMonstrum, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={saveFeat}>
          <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 200 * scaleFactor }]}>
            <Text style={[styles.GoBackText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Save Feat')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default FeatsCreator;