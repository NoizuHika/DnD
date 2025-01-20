import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const Creator = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const handleGoBack = () => {
    navigation.goBack();
  };

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

  const handleFeatsCreatorScreen = () => {
    navigation.navigate('FeatsCreator');
  };

  const handleBackLibScreen = () => {
    navigation.navigate('BackLibCreator');
  };

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <Text style={[styles.appName, { color: theme.fontColor }]}>DMBook</Text>

      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '70%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleItemCreatorPress}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.items} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, textAlign: theme.textAlign }]}>
              {t('Item Creator')}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '60%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleMagicItemCreatorPress}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.magicitem} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, textAlign: theme.textAlign }]}>
              {t('Magic Item Creator')}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '50%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleSpellCreatorPress}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.spells} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, textAlign: theme.textAlign }]}>
              {t('Spell Creator')}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '40%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleMonsterCreationScreen}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.feats} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, textAlign: theme.textAlign }]}>
              {t('Monster Creator')}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '30%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleFeatsCreatorScreen}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.featsFeats} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, textAlign: theme.textAlign }]}>
              {t('Feats Creator')}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '20%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleBackLibScreen}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.backLib} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, textAlign: theme.textAlign }]}>
              {t('Back Library Creator')}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

    </ImageBackground>
  );
};

export default Creator;
