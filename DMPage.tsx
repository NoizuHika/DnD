import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { useAuth } from './AuthContext';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

  const languages = [
    { code: 'en', label: 'English', flag: require('./assets/flags/English.png') },
    { code: 'pl', label: 'Polski', flag: require('./assets/flags/Polish.png') },
    { code: 'ua', label: 'Українська', flag: require('./assets/flags/Ukraine.png') },
    { code: 'ru', label: 'Русский', flag: require('./assets/flags/russia.png') }
  ];

const DMPage: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { theme, changeTheme } = useContext(ThemeContext);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const themes = [
    { name: 'theme1', label: t('Dark'), preview: require('./assets/font/theme1.png') },
    { name: 'theme2', label: t('Light'), preview: require('./assets/font/theme2.png') }
  ];

  const {token} = useAuth();

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
      <Text style={[styles.appName, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>DMBook</Text>
      <Text style={[styles.appName, { marginTop: 45, color: theme.fontColor, fontSize: fontSize * 1 }]}>{t('DM')}</Text>

      <View style={[styles.buttonContainerUsu, { bottom: '60%' }]}>
        <TouchableOpacity style={[styles.button, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={handleCampaignsPress}>
          <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
            <Image source={theme.icons.yourcamp} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
            {t('Your campaigns')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '50%' }]}>
        <TouchableOpacity style={[styles.button, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={handleBookPress}>
          <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
            <Image source={theme.icons.yourbook} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
            {t('Your book')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonContainerUsu, { bottom: '40%' }]}>
        <TouchableOpacity style={[styles.button, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={() => setModalVisible(true)}>
          <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
            <Image source={theme.icons.library} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
            {t('Library')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

       <View style={[styles.buttonContainerUsu, { bottom: '30%' }]}>
          <TouchableOpacity style={[styles.button, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={() => { handleChangeRole() }}>
            <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
                <Image source={theme.icons.DMToPlayer} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
                <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
                {t('Change role')}</Text>
            </ImageBackground>
          </TouchableOpacity>
       </View>

      <View style={[styles.buttonContainerUsu, { bottom: '20%' }]}>
        <TouchableOpacity style={[styles.button, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={handleLoginPress}>
          <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
            <Image source={theme.icons.logout} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
            <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
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
          <View style={[styles.modalContentDMBook, { padding: 20 * scaleFactor }]}>
            <Text style={[styles.modalTitle, { fontSize: fontSize * 1.2 }]}>{t('Library')}</Text>

            <TouchableOpacity style={[styles.modalButton, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={() => handleLibraryPress('Spells')}>
            <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
              <Image source={theme.icons.spells} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Spells')}</Text>
            </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={() => handleLibraryPress('Items')}>
            <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
              <Image source={theme.icons.items} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Items')}</Text>
            </ImageBackground>
            </TouchableOpacity>

             <TouchableOpacity style={[styles.modalButton, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={() => handleLibraryPress('MagicItems')}>
             <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
               <Image source={theme.icons.magicitem} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
               <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
               {t('Magic Items')}</Text>
             </ImageBackground>
             </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={() => handleLibraryPress('Bestiary')}>
            <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
              <Image source={theme.icons.feats} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Bestiary')}</Text>
            </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={() => handleLibraryPress('Feats')}>
            <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
              <Image source={theme.icons.featsFeats} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Feats')}</Text>
            </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={() => handleLibraryPress('BackLibrary')}>
            <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
              <Image source={theme.icons.backLib} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Background Lib')}</Text>
            </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={() => handleLibraryPress('RulesGloss')}>
            <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
              <Image source={theme.icons.rules} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Rules Glossary')}</Text>
            </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={() => handleLibraryPress('Creator')}>
            <ImageBackground source={require('./assets/font/font1.png')} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
              <Image source={theme.icons.creator} style={[styles.icons, { height: 40 * scaleFactor, width: 40 * scaleFactor }]} />
              <Text style={[styles.buttonText, { color: theme.fontColor, fontSize: fontSize, fontStyle: theme.fontStyle, textShadowColor: theme.textShadowColor, textShadowOffset: theme.textShadowOffset, textShadowRadius: theme.textShadowRadius, flex: theme.flex, textAlign: theme.textAlign}]}>
              {t('Creator')}</Text>
            </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalCloseButton, { height: 60 * scaleFactor }]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalCloseButtonText, { fontSize: fontSize }]}>{t('Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.themeContainer}>
        <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
          <Image source={theme.icons.settings} style={[styles.gearIcon, { height: 50 * scaleFactor, width: 50 * scaleFactor }]} />
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
            <View style={[styles.modalContent, { padding: 20 * scaleFactor }]}>
              <Text style={[styles.modalTitle, { fontSize: fontSize * 1.2 }]}>{t('Select Language')}</Text>
              <View style={styles.dropdown}>
                {languages.map((lang) => (
                  <TouchableOpacity key={lang.code} onPress={() => changeLanguage(lang.code)} style={styles.flagButton}>
                    <Image source={lang.flag} style={[styles.flag, { height: 30 * scaleFactor, width: 40 * scaleFactor }]} />
                    <Text style={[styles.languageLabel, { fontSize: fontSize * 1 }]}>{lang.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.modalTitle, { fontSize: fontSize * 1.2 }]}>{t('Select Theme')}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
                {themes.map((themeItem) => (
                  <TouchableOpacity key={themeItem.name} onPress={() => handleChangeTheme(themeItem.name)} style={styles.themeOption}>
                    <Image source={themeItem.preview} style={[styles.themePreview, { height: 350 * scaleFactor, width: 200 * scaleFactor }]} />
                    <Text style={[styles.themeLabel, { fontSize: fontSize * 1 }]}>{themeItem.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={[styles.closeButton, { height: 60 * scaleFactor }]} onPress={() => setSettingsModalVisible(false)}>
                <Text style={{ color: 'white', fontSize: fontSize }}>{t('Close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </ImageBackground>
  );
};

export default DMPage;
