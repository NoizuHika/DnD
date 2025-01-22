import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { SettingsContext } from './SettingsContext';

const FeatsCreator: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const [feat, setFeat] = useState({
    name: '',
    prerequisite: '',
    description: '',
  });

  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleInputChange = (field, value) => {
    setFeat({ ...feat, [field]: value });
  };

  const saveFeat = () => {
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
          <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Name')}</Text>
          <TextInput
            style={[styles.inputItemCreator, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
            placeholder={t('Enter feat name')}
            value={feat.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
        </View>

        <View style={[styles.centeredBlock, { marginBottom: 20 * scaleFactor }]}>
          <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Prerequisite')}</Text>
          <TextInput
            style={[styles.inputItemCreator, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
            placeholder={t('Enter prerequisite')}
            value={feat.prerequisite}
            onChangeText={(text) => handleInputChange('prerequisite', text)}
          />
        </View>

        <View style={[styles.centeredBlock, { marginBottom: 20 * scaleFactor }]}>
          <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Description')}</Text>
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
