import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Button, ScrollView, ImageBackground } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const MonsterCreationDescription: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);

  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [descriptionType, setDescriptionType] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [isLegendary, setIsLegendary] = useState(false);
  const [monsterDescriptions, setMonsterDescriptions] = useState({
    monsterDescription: '',
    actionsDescription: '',
    bonusActionsDescription: '',
    reactionsDescription: '',
    specialTraitsDescription: '',
    legendaryActionsDescription: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [legendaryDescription, setLegendaryDescription] = useState('');

  const openDescriptionModal = (type) => {
    setDescriptionType(type);
    setDescriptionText(monsterDescriptions[type] || '');
    setDescriptionModalVisible(true);
    setIsModalVisible(true);
  };

  const closeDescriptionModal = () => {
    setDescriptionModalVisible(false);
    setIsModalVisible(false);
  };

  const saveDescription = () => {
    setMonsterDescriptions((prev) => ({ ...prev, [descriptionType]: descriptionText }));
    closeDescriptionModal();
  };

  return (
    <ImageBackground source={theme.background} style={styles.containerMonCre}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
       <View style={styles.columnDescr}>
        <Text style={[styles.labelMagicItemCreA, { color: theme.textColor, fontSize: fontSize }]}>{t('Monster Description')}</Text>
        <TouchableOpacity style={styles.inputMonCre} onPress={() => openDescriptionModal('monsterDescription')}>
          <Text style={[styles.TextMonCre, { fontSize: fontSize }]}> {monsterDescriptions.monsterDescription || t('Enter monster description')}</Text>
        </TouchableOpacity>

        <Text style={[styles.labelMagicItemCreA, { color: theme.textColor, fontSize: fontSize }]}>{t('Actions Description')}</Text>
        <TouchableOpacity style={styles.inputMonCre} onPress={() => openDescriptionModal('actionsDescription')}>
          <Text style={[styles.TextMonCre, { fontSize: fontSize }]}> {monsterDescriptions.actionsDescription || t('Enter actions description')}</Text>
        </TouchableOpacity>

        <Text style={[styles.labelMagicItemCreA, { color: theme.textColor, fontSize: fontSize }]}>{t('Bonus Action Description')}</Text>
        <TouchableOpacity style={styles.inputMonCre} onPress={() => openDescriptionModal('bonusActionsDescription')}>
          <Text style={[styles.TextMonCre, { fontSize: fontSize }]}> {monsterDescriptions.bonusActionsDescription || t('Enter bonus action description')}</Text>
        </TouchableOpacity>

        <Text style={[styles.labelMagicItemCreA, { color: theme.textColor, fontSize: fontSize }]}>{t('Reactions Description')}</Text>
        <TouchableOpacity style={styles.inputMonCre} onPress={() => openDescriptionModal('reactionsDescription')}>
          <Text style={[styles.TextMonCre, { fontSize: fontSize }]}> {monsterDescriptions.reactionsDescription || t('Enter reactions description')}</Text>
        </TouchableOpacity>

        <Text style={[styles.labelMagicItemCreA, { color: theme.textColor, fontSize: fontSize }]}>{t('Special Traits Description')}</Text>
        <TouchableOpacity style={styles.inputMonCre} onPress={() => openDescriptionModal('specialTraitsDescription')}>
          <Text style={[styles.TextMonCre, { fontSize: fontSize }]}> {monsterDescriptions.specialTraitsDescription || t('Enter special traits description')}</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isLegendary}
              onValueChange={(value) => {
                setIsLegendary(value);
                if (!value) setLegendaryDescription('');
              }}
              tintColors={{ true: theme.checkboxActive, false: theme.checkboxInactive }}
            />
            <Text style={[styles.labelCheck, { fontSize: fontSize * 1.2 }]}>{t('Legendary?')}</Text>
          </View>
        </View>

        {isLegendary && (
          <View>
            <Text style={[styles.labelMagicItemCreA, { color: theme.textColor, fontSize: fontSize }]}>{t('Legendary Action Description')}</Text>
            <TouchableOpacity
              style={styles.inputMonCre}
              onPress={() => openDescriptionModal('legendaryActionsDescription')}
            >
              <Text style={[styles.TextMonCre, { fontSize: fontSize }]}>
                {monsterDescriptions.legendaryActionsDescription || t('Enter legendary action description')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        </View>

        <Modal visible={descriptionModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainerMonCre}>
            <View style={styles.modalContentMonCre}>
              <Text style={[styles.modalTitleMonCre, { fontSize: fontSize * 1.2 }]}>
                {t(
                  (descriptionType || '')
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                )}
              </Text>
              <TextInput
                style={[styles.modalInputMonCre, { height: 100 * scaleFactor, fontSize: fontSize }]}
                multiline
                placeholder={t(`Enter ${descriptionType.replace(/([A-Z])/g, ' $1').toLowerCase()}`)}
                value={descriptionText}
                onChangeText={setDescriptionText}
              />
              <Button title={t('Save')} onPress={saveDescription} />
              <Button title={t('Cancel')} onPress={closeDescriptionModal} />
            </View>
          </View>
        </Modal>
      </ScrollView>

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default MonsterCreationDescription;