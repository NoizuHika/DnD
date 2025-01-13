import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const BackLibCreator = ({ navigation }) => {
  const [backLib, setBackLib] = useState({
    name: '',
    skillProficiency1: '',
    skillProficiency2: '',
    additionalProficiency: '',
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

  const saveBackLib = () => {
    console.log('BackLib saved:', backLib);
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
            placeholder={t('Enter name')}
            value={backLib.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
        </View>

      <View style={styles.rowCreateItemContainer}>
       <View style={styles.column}>
        <View style={styles.centeredBlock}>
          <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Skill Proficiency 1')}</Text>
          <Picker
            selectedValue={backLib.skillProficiency1}
            style={styles.pickerMagicItemCre}
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
          <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Skill Proficiency 2')}</Text>
          <Picker
            selectedValue={backLib.skillProficiency2}
            style={styles.pickerMagicItemCre}
            onValueChange={(value) => handleInputChange('skillProficiency2', value)}
          >
            <Picker.Item label={t('Acrobatics')} value="Acrobatics" />
            <Picker.Item label={t('Insight')} value="Insight" />
            <Picker.Item label={t('Religion')} value="Religion" />
          </Picker>
        </View>
       </View>
      </View>


        <View style={styles.centeredBlock}>
          <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Additional Proficiency')}</Text>
          <Picker
            selectedValue={backLib.additionalProficiency}
            style={styles.pickerMagicItemCre}
            onValueChange={(value) => handleInputChange('additionalProficiency', value)}
          >
            <Picker.Item label={t('2 Languages')} value="2 Languages" />
            <Picker.Item label={t('1 Language, 1 Tool')} value="1 Language, 1 Tool" />
            <Picker.Item label={t('2 Tools')} value="2 Tools" />
          </Picker>
        </View>

        <View style={styles.centeredBlock}>
          <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Feature Name')}</Text>
          <TextInput
            style={styles.inputItemCreator}
            placeholder={t('Enter feature name')}
            value={backLib.featureName}
            onChangeText={(text) => handleInputChange('featureName', text)}
          />
        </View>

        <View style={styles.centeredBlock}>
          <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Feature Description')}</Text>
          <TextInput
            style={[styles.inputItemCreator, { height: 100 }]}
            multiline
            placeholder={t('Enter feature description')}
            value={backLib.featureDescription}
            onChangeText={(text) => handleInputChange('featureDescription', text)}
          />
        </View>
      </ScrollView>

      <View style={styles.saveButton}>
        <TouchableOpacity style={styles.buttonMonstrum} onPress={saveBackLib}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Save BackLib')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default BackLibCreator;