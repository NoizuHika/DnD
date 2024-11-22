import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

  const languages = [
    { code: 'en', label: 'English', flag: require('./assets/flags/English.png') },
    { code: 'pl', label: 'Polski', flag: require('./assets/flags/Polish.png') },
    { code: 'ua', label: 'Українська', flag: require('./assets/flags/Ukraine.png') },
    { code: 'ru', label: 'Русский', flag: require('./assets/flags/russia.png') }
  ];

  const themes = [
    { name: 'theme1', label: 'Dark', preview: require('./assets/font/theme1.png') },
    { name: 'theme2', label: 'Light', preview: require('./assets/font/theme2.png') }
  ];

const DMPage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { theme, changeTheme } = useContext(ThemeContext);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const handleLoginPress = () => {
    navigation.navigate('LogIn');
  };

  const handleCampaignsPress = () => {
    navigation.navigate('YourCampaigns');
  };

  const handleBookPress = () => {
    navigation.navigate('YourBook');
  };

  const handleChangeRole = () => {
    navigation.navigate('LoggedScreen');
  };

  const handleMonsterCreationScreen = () => {
    navigation.navigate('MonsterCreationScreen');
  };

  const handleLibraryPress = (page) => {
    setModalVisible(false);
    navigation.navigate(page);
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setCurrentLang(code);
  };

  const handleChangeTheme = (themeName) => {
    changeTheme(themeName);
  };

  return (
    <ImageBackground
      source={theme.background}
      style={styles.container}
    >
      <Text style={[styles.appName, { color: theme.fontColor }]}>DMBook</Text>

      <View style={[styles.buttonContainerUsu, { bottom: '70%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleMonsterCreationScreen}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.yourcamp} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
            {t('Monstrum')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '60%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleCampaignsPress}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.yourcamp} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
            {t('Your campaigns')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '50%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleBookPress}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.yourbook} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
            {t('Your book')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '40%' }]}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.library} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
            {t('Library')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

       <View style={[styles.buttonContainerUsu, { bottom: '30%' }]}>
          <TouchableOpacity style={styles.button} onPress={() => {handleChangeRole()}}>
            <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
                <Image source={theme.icons.DMToPlayer} style={styles.icons} />
                <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
                {t('Change role')}</Text>
            </ImageBackground>
          </TouchableOpacity>
       </View>

      <View style={[styles.buttonContainerUsu, { bottom: '20%' }]}>
        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
            <Image source={theme.icons.logout} style={styles.icons} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
            {t('Log out')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContentDMBook}>
            <Text style={styles.modalTitle}>{t('Library')}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleLibraryPress('Spells')}>
            <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
              <Image source={theme.icons.spells} style={styles.icons} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Spells')}</Text>
            </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleLibraryPress('Items')}>
            <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
              <Image source={theme.icons.items} style={styles.icons} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Items')}</Text>
            </ImageBackground>
            </TouchableOpacity>
             <TouchableOpacity style={styles.modalButton} onPress={() => handleLibraryPress('MagicItems')}>
             <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
               <Image source={theme.icons.feats} style={styles.icons} />
               <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
               {t('Magic Items')}</Text>
             </ImageBackground>
             </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleLibraryPress('Feats')}>
            <ImageBackground source={require('./assets/font/font1.png')} style={styles.buttonBackground}>
              <Image source={theme.icons.feats} style={styles.icons} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: theme.fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Feats')}</Text>
            </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>{t('Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.themeContainer}>
        <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
          <Image source={theme.icons.settings} style={styles.gearIcon} />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSettingsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('Select Language')}</Text>
              <View style={styles.dropdown}>
                {languages.map((lang) => (
                  <TouchableOpacity key={lang.code} onPress={() => changeLanguage(lang.code)} style={styles.flagButton}>
                    <Image source={lang.flag} style={styles.flag} />
                    <Text style={styles.languageLabel}>{lang.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalTitle}>{t('Select Theme')}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
                {themes.map((themeItem) => (
                  <TouchableOpacity key={themeItem.name} onPress={() => handleChangeTheme(themeItem.name)} style={styles.themeOption}>
                    <Image source={themeItem.preview} style={styles.themePreview} />
                    <Text style={styles.themeLabel}>{themeItem.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={() => setSettingsModalVisible(false)}>
                <Text style={{ color: 'white', fontSize: 20 }}>{t('Close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </ImageBackground>
  );
};

export default DMPage;
