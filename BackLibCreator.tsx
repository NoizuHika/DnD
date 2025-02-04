import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { SettingsContext } from './SettingsContext';
import { useAuth } from './AuthContext';
import { UserData } from './UserData';
const BackLibCreator: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
    const { token } = useAuth();
          const { ipv4 } = useContext(UserData);
  const [backLib, setBackLib] = useState({
    name: '',
    skillProficiency1: '',
    skillProficiency2: '',
    toolProficiencies: '',
    languages:'',
    featureName: '',
    featureDescription: '',
  });

  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleInputChange = (field, value) => {
    setBackLib({ ...backLib, [field]: value });
  };
const addNewBackground = async () => {

  try {
     const requestBody = {
         token: token,
         name: backLib.name,
         skillProficiencies: [backLib.skillProficiency1,backLib.skillProficiency2],
         toolProficiencies: [backLib.toolProficiencies],
         languages: [backLib.languages],
         features: [[backLib.featureName,backLib.featureDescription]],
         };
         console.log(requestBody);
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
  fetchData();
};
  const saveBackLib = () => {
      addNewBackground();
    console.log('BackLib saved:', backLib);
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
            placeholder={t('Enter name')}
            value={backLib.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
        </View>

      <View style={styles.rowCreateItemContainer}>
       <View style={styles.column}>
        <View style={styles.centeredBlock}>
          <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Skill Proficiency 1')}</Text>
          <Picker
            selectedValue={backLib.skillProficiency1}
            style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
            onValueChange={(value) => handleInputChange('skillProficiency1', value)}
          >
            <Picker.Item label={t('Acrobatics')} value="Acrobatics" />
            <Picker.Item label={t('Insight')} value="Insight" />
            <Picker.Item label={t('Religion')} value="Religion" />
          </Picker>
        </View>
       </View>

       <View style={styles.column}>
        <View style={styles.centeredBlock}>
          <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Skill Proficiency 2')}</Text>
          <Picker
            selectedValue={backLib.skillProficiency2}
            style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
            onValueChange={(value) => handleInputChange('skillProficiency2', value)}
          >
            <Picker.Item label={t('Acrobatics')} value="Acrobatics" />
            <Picker.Item label={t('Insight')} value="Insight" />
            <Picker.Item label={t('Religion')} value="Religion" />
          </Picker>
        </View>
       </View>
      </View>


        <View style={[styles.centeredBlock, { marginBottom: 20 * scaleFactor }]}>
          <Text style={[styles.labelNameItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Tool Proficiency')}</Text>
          <Picker
            selectedValue={backLib.toolProficiencies}
            style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
            onValueChange={(value) => handleInputChange('toolProficiencies', value)}
          >
              <Picker.Item label={t('None')} value="None" />
            <Picker.Item label={t('2 Tools')} value="2 Tools" />
            <Picker.Item label={t('1 Tool')} value="1 Tool" />

          </Picker>
        </View>
        <View style={[styles.centeredBlock, { marginBottom: 20 * scaleFactor }]}>
                  <Text style={[styles.labelNameItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Language Proficiency')}</Text>
                  <Picker
                    selectedValue={backLib.languages}
                    style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
                    onValueChange={(value) => handleInputChange('languages', value)}
                  >
                     <Picker.Item label={t('None')} value="None" />
                    <Picker.Item label={t('2 Languages')} value="2 Languages" />
                    <Picker.Item label={t('1 Language')} value="1 Language" />
                  </Picker>
                </View>

        <View style={[styles.centeredBlock, { marginBottom: 20 * scaleFactor }]}>
          <Text style={[styles.labelNameItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Feature Name')}</Text>
          <TextInput
            style={[styles.inputItemCreator, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
            placeholder={t('Enter back library name')}
            value={backLib.featureName}
            onChangeText={(text) => handleInputChange('featureName', text)}
          />
        </View>

        <View style={[styles.centeredBlock, { marginBottom: 20 * scaleFactor }]}>
          <Text style={[styles.labelNameItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Feature Description')}</Text>
          <TextInput
            style={[styles.inputItemCreator, { height: 100 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
            multiline
            placeholder={t('Enter back library description')}
            value={backLib.featureDescription}
            onChangeText={(text) => handleInputChange('featureDescription', text)}
          />
        </View>
      </ScrollView>

      <View style={[styles.saveButton, { marginBottom: 10 * scaleFactor }]}>
        <TouchableOpacity style={[styles.buttonMonstrum, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={saveBackLib}>
          <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 200 * scaleFactor }]}>
            <Text style={[styles.GoBackText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Save BackLib')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default BackLibCreator;