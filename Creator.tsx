import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const Creator = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const handleItemCreatorPress = () => {
    navigation.navigate('ItemCreator');
  };

  const handleMagicItemCreatorPress = () => {
    navigation.navigate('MagicItemCreator');
  };

  const handleSpellCreatorPress = () => {
    navigation.navigate('SpellCreator');
  };

  const handleMonsterCreationScreen = () => {
    navigation.navigate('MonsterCreationScreen');
  };

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <Text style={[styles.appName, { color: theme.fontColor }]}>DMBook</Text>

      <View style={[styles.buttonContainerUsu, { bottom: '60%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleItemCreatorPress}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.DMToPlayer} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, textAlign: theme.textAlign }]}>
              {t('Item Creator')}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '50%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleMagicItemCreatorPress}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.DMToPlayer} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, textAlign: theme.textAlign }]}>
              {t('Magic Item Creator')}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '40%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleSpellCreatorPress}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.DMToPlayer} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, textAlign: theme.textAlign }]}>
              {t('Spell Creator')}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '30%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleMonsterCreationScreen}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.DMToPlayer} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, textAlign: theme.textAlign }]}>
              {t('Monster Creator')}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

    </ImageBackground>
  );
};

export default Creator;
