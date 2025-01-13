import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const FeatsCreator = ({ navigation }) => {
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
        <View style={styles.GoBack}>
          <TouchableOpacity style={styles.button} onPress={handleGoBack}>
            <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
              <Text style={styles.GoBackText}>{t('Go_back')}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={styles.centeredBlock}>
          <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Name')}</Text>
          <TextInput
            style={styles.inputItemCreator}
            placeholder={t('Enter feat name')}
            value={feat.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
        </View>

        <View style={styles.centeredBlock}>
          <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Prerequisite')}</Text>
          <TextInput
            style={styles.inputItemCreator}
            placeholder={t('Enter prerequisite')}
            value={feat.prerequisite}
            onChangeText={(text) => handleInputChange('prerequisite', text)}
          />
        </View>

        <View style={styles.centeredBlock}>
          <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Description')}</Text>
          <TextInput
            style={[styles.inputItemCreator, { height: 100 }]}
            multiline
            placeholder={t('Enter feat description')}
            value={feat.description}
            onChangeText={(text) => handleInputChange('description', text)}
          />
        </View>
      </ScrollView>

      <View style={styles.saveButton}>
        <TouchableOpacity style={styles.buttonMonstrum} onPress={saveFeat}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Save Feat')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default FeatsCreator;
