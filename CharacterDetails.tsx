import React, { useState, useEffect, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity,route, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import PlayerCharacter from './PlayerCharacter';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const CharacterDetail: React.FC = ({ route,navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { t, i18n } = useTranslation();
  const { characterData } =  route.params;
  const [selectedScreen, setSelectedScreen] = useState('CharacterDetail');
  const { theme } = useContext(ThemeContext);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={theme.background}
      style={styles.container}
    >
      <Text style={[styles.appName, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>
        {t('CharacterDetails')}
      </Text>

      <View style={[styles.dropdownContainerCharacter, { height: 50 * scaleFactor }]}>
        <Picker
          selectedValue={selectedScreen}
          style={[styles.pickerChooseChar, { width: 200 * scaleFactor }]}
          onValueChange={(itemValue) => {
            setSelectedScreen(itemValue);
            navigation.navigate(itemValue,{ characterData : character });
          }}
        >
          <Picker.Item label={t('Main Scene')} value="Character1" />
          <Picker.Item label={t('Inventory')} value="Inventory" />
          <Picker.Item label={t('Character Details')} value="CharacterDetails" />
        </Picker>
      </View>

      {/* Wyświetlanie danych postaci */}
      <View style={{ padding: 20 }}>
        <Text style={[styles.detailText, { color: theme.fontColor, fontSize: fontSize * 1.2 }]}>
          {t('Species')}: {characterData?.playerSpecies?.[0]?.species.name || t('Unknown')}
        </Text>

        <Text style={[styles.detailText, { color: theme.fontColor, fontSize: fontSize * 1.2 }]}>
          {t('Class')}: {characterData?.playerClasses?.[0]?.playerClass?.name || t('Unknown')}
        </Text>

        <Text style={[styles.detailText, { color: theme.fontColor, fontSize: fontSize }]}>
          {t('Description')}: {characterData?.description?.toString() || t('No description available')}
        </Text>
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


export default CharacterDetail;