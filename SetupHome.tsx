import React, { useContext } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import { SettingsContext } from './SettingsContext';

const SetupHome: React.FC = () => {
  const { setFontSize, setScaleFactor } = useContext(SettingsContext);
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const handleSelect = (size: 'small' | 'medium' | 'large') => {
    if (size === 'small') {
      setFontSize(12);
      setScaleFactor(0.8);
    } else if (size === 'medium') {
      setFontSize(15);
      setScaleFactor(1.0);
    } else if (size === 'large') {
      setFontSize(18);
      setScaleFactor(1.2);
    }
    navigation.navigate('Home');
  };

  return (
   <ImageBackground source={theme.background} style={styles.container}>
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.fontColor }]}>{t('Select the interface size')}:</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleSelect('small')}>
        <Text style={styles.buttonText}>{t('Small')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleSelect('medium')}>
        <Text style={styles.buttonText}>{t('Medium')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleSelect('large')}>
        <Text style={styles.buttonText}>{t('Big')}</Text>
      </TouchableOpacity>
    </View>
   </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#007BFF',
    width: 200,
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SetupHome;