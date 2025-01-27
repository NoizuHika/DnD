import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Button, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import CheckBox from '@react-native-community/checkbox';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import autofill from './assets/Library/autofill.json';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const MonsterCreationScreen: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const [monster, setMonster] = useState({
    name: '',
    challengeRating: '',
    armorClass: '',
    size: '',
    monsterType: '',
    hitPoints: '',
    alignment: '',
    monsterSubtype: '',
    strength: '',
    dexterity: '',
    constitution: '',
    intelligence: '',
    wisdom: '',
    charisma: '',
    movement: [],
    skills: [],
    senses: [],
    languages: [],
  });

  const handleGoBack = () => {
    navigation.goBack();
  };

  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [currentInputType, setCurrentInputType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [hitPointsModalVisible, setHitPointsModalVisible] = useState(false);
  const [averageHitPoints, setAverageHitPoints] = useState('');
  const [hitDieValue, setHitDieValue] = useState('d8');
  const [hitPointsModifier, setHitPointsModifier] = useState('');
  const [hitDieCount, setHitDieCount] = useState('');
  const [isSubtype, setIsSubtype] = useState(false);
  const [subtypeValue, setSubtypeValue] = useState('');

  const handleInputChange = (field, value) => {
    setMonster({ ...monster, [field]: value });
  };

  const openDescriptionModal = () => setDescriptionModalVisible(true);
  const closeDescriptionModal = () => setDescriptionModalVisible(false);

  const openInputModal = (type) => {
    setCurrentInputType(type);
    setInputModalVisible(true);
  };

  const closeInputModal = () => {
    setInputModalVisible(false);
    setInputValue('');
  };

  const addItem = () => {
    setMonster((prevMonster) => ({
      ...prevMonster,
      [currentInputType]: [...prevMonster[currentInputType], inputValue],
    }));
    closeInputModal();
  };

  const removeItem = (type, index) => {
    setMonster((prevMonster) => ({
      ...prevMonster,
      [type]: prevMonster[type].filter((_, i) => i !== index),
    }));
  };

  const openHitPointsModal = () => setHitPointsModalVisible(true);
  const closeHitPointsModal = () => setHitPointsModalVisible(false);

  const saveHitPoints = () => {
    const calculatedHitPoints = `${averageHitPoints} ( ${hitDieCount}${hitDieValue} + ${hitPointsModifier} )`;
    handleInputChange('hitPoints', calculatedHitPoints);
    closeHitPointsModal();
  };

  const autoFill = () => {
    setMonster(autofill);
  };

  const saveMonster = () => {
    console.log("Monster saved:", monster);
  };

  return (
    <ImageBackground source={theme.background} style={styles.containerMonCre}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

     <View style={styles.rowContainerMonstrum}>

      <View style={[styles.GoBackMonstrum, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

        <View style={styles.GoBackMonstrum}>
          <TouchableOpacity style={[styles.button, { height: 40 * scaleFactor, width: 90 * scaleFactor }]} onPress={autoFill}>
            <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 40 * scaleFactor, width: 150 * scaleFactor }]}>
              <Text style={[styles.buttonTextCharacter, { fontSize: fontSize * 0.8 }]}>{t('Auto Fill')}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={styles.GoBackMonstrum}>
          <TouchableOpacity style={[styles.button, { height: 40 * scaleFactor, width: 90 * scaleFactor }]} onPress={() => navigation.navigate('MonsterCreationDescription', { monster })}>
           <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 40 * scaleFactor, width: 130 * scaleFactor }]}>
            <Text style={[styles.buttonTextCharacter, { fontSize: fontSize * 0.9 }]}>{t('Description')}</Text>
           </ImageBackground>
          </TouchableOpacity>
        </View>
        </View>

          <View style={styles.rowContainerA}>
            <View style={styles.columnTopAB}>
            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Name')}</Text>
            <TextInput style={[styles.inputSpellCreatorA, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Enter name')} value={monster.name} onChangeText={(text) => handleInputChange('name', text)} />
          </View>
            <View style={styles.columnTopAB}>
            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Challenge Rating')}</Text>
            <Picker selectedValue={monster.challengeRating} onValueChange={(value) => handleInputChange('challengeRating', value)} style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}>
              <Picker.Item label="1/8" value="1/8" />
              <Picker.Item label="1/4" value="1/4" />
              <Picker.Item label="1/2" value="1/2" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
            </Picker>
          </View>
          </View>

          <View style={styles.twoColumnContainer}>
            <View style={styles.column}>
            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Armor Class')}</Text>
            <TextInput style={[styles.inputMonCre, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Armor')} value={monster.armorClass} onChangeText={(text) => handleInputChange('armorClass', text)} keyboardType="numeric" />

            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Hit Points')}</Text>
            <TouchableOpacity onPress={openHitPointsModal} style={styles.inputMonCre}>
              <Text>{monster.hitPoints || t('HP')}</Text>
            </TouchableOpacity>
          </View>
            <View style={styles.column}>
            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Size')}</Text>
            <Picker selectedValue={monster.size} onValueChange={(value) => handleInputChange('size', value)} style={[styles.pickerMagicItemCre, { width: 150 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}>
              <Picker.Item label={t('Small')} value="Small" />
              <Picker.Item label={t('Medium')} value="Medium" />
              <Picker.Item label={t('Large')} value="Large" />
            </Picker>

            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Alignment')}</Text>
            <Picker selectedValue={monster.alignment} onValueChange={(value) => handleInputChange('alignment', value)} style={[styles.pickerMagicItemCre, { width: 125 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}>
              <Picker.Item label={t('Good')} value="Good" />
              <Picker.Item label={t('Evil')} value="Evil" />
              <Picker.Item label={t('Neutral')} value="Neutral" />
            </Picker>
          </View>
            <View style={styles.column}>
            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Monster Type')}</Text>
            <Picker selectedValue={monster.monsterType} onValueChange={(value) => handleInputChange('monsterType', value)} style={[styles.pickerMagicItemCre, { width: 150 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}>
              <Picker.Item label={t('Beast')} value="Beast" />
              <Picker.Item label={t('Dragon')} value="Dragon" />
              <Picker.Item label={t('Undead')} value="Undead" />
            </Picker>

          <View style={styles.section}>
            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Monster Subtype?')}</Text>
            <View style={styles.checkboxContainer1}>
              <CheckBox
                value={isSubtype}
                onValueChange={(value) => setIsSubtype(value)}
                tintColors={{
                  true: theme.checkboxActive || '#4caf50',
                  false: theme.checkboxInactive || '#f44336',
                }}
              />
            </View>

            {isSubtype && (
              <View>
                <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Select Subtype')}</Text>
                <Picker
                  selectedValue={subtypeValue}
                  onValueChange={(value) => setSubtypeValue(value)}
                  style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
                >
                  <Picker.Item label={t('Subtype 1')} value="Subtype 1" />
                  <Picker.Item label={t('Subtype 2')} value="Subtype 2" />
                  <Picker.Item label={t('Subtype 3')} value="Subtype 3" />
                </Picker>
              </View>
            )}
          </View>

          </View>
        </View>

        <View style={styles.twoColumnContainer}>
          <View style={styles.column}>
            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Strength')}</Text>
            <TextInput style={[styles.inputMonCreStat, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Strength')} value={monster.strength} onChangeText={(text) => handleInputChange('strength', text)} keyboardType="numeric" />

            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Dexterity')}</Text>
            <TextInput style={[styles.inputMonCreStat, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Dexterity')} value={monster.dexterity} onChangeText={(text) => handleInputChange('dexterity', text)} keyboardType="numeric" />
          </View>
          <View style={styles.column}>
            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Constitution')}</Text>
            <TextInput style={[styles.inputMonCreStat, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Constitution')} value={monster.dexterity} onChangeText={(text) => handleInputChange('constitution', text)} keyboardType="numeric" />

            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Intelligence')}</Text>
            <TextInput style={[styles.inputMonCreStat, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Intelligence')} value={monster.dexterity} onChangeText={(text) => handleInputChange('intelligence', text)} keyboardType="numeric" />
          </View>
          <View style={styles.column}>
            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Wisdom')}</Text>
            <TextInput style={[styles.inputMonCreStat, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Wisdom')} value={monster.dexterity} onChangeText={(text) => handleInputChange('wisdom', text)} keyboardType="numeric" />

            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Charisma')}</Text>
            <TextInput style={[styles.inputMonCreStat, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Charisma')} value={monster.dexterity} onChangeText={(text) => handleInputChange('charisma', text)} keyboardType="numeric" />
          </View>
        </View>

          <View style={styles.columnAdding}>
            <Text style={[styles.labelMonCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Movement')}</Text>
            <TouchableOpacity style={[styles.addButtonMonCre, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={() => openInputModal('movement')}>
              <Text style={[styles.labelItemCreA, { color: theme.textColor, fontSize: fontSize * 1.1 }]}>{t('Add Movement')}</Text>
            </TouchableOpacity>
          </View>
            {monster.movement.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem('movement', index)}>
                  <Text style={[styles.removeButtonText, { fontSize: fontSize }]}>{t('Remove')}</Text>
                </TouchableOpacity>
              </View>
            ))}

          <View style={styles.columnAdding}>
            <Text style={[styles.labelMonCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Skills')}</Text>
            <TouchableOpacity style={[styles.addButtonMonCre, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={() => openInputModal('skills')}>
              <Text style={[styles.labelItemCreA, { color: theme.textColor, fontSize: fontSize * 1.1 }]}>{t('Add Skill')}</Text>
            </TouchableOpacity>
          </View>
            {monster.skills.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem('skills', index)}>
                  <Text style={[styles.removeButtonText, { fontSize: fontSize }]}>{t('Remove')}</Text>
                </TouchableOpacity>
              </View>
            ))}

          <View style={styles.columnAdding}>
            <Text style={[styles.labelMonCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Senses')}</Text>
            <TouchableOpacity style={[styles.addButtonMonCre, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={() => openInputModal('senses')}>
              <Text style={[styles.labelItemCreA, { color: theme.textColor, fontSize: fontSize }]}>{t('Add Sense')}</Text>
            </TouchableOpacity>
          </View>
            {monster.senses.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem('senses', index)}>
                  <Text style={[styles.removeButtonText, { fontSize: fontSize }]}>{t('Remove')}</Text>
                </TouchableOpacity>
              </View>
            ))}

          <View style={styles.columnAdding}>
            <Text style={[styles.labelMonCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Language')}</Text>
            <TouchableOpacity style={[styles.addButtonMonCre, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={() => openInputModal('languages')}>
              <Text style={[styles.labelItemCreA, { color: theme.textColor, fontSize: fontSize }]}>{t('Add language')}</Text>
            </TouchableOpacity>
          </View>
            {monster.languages.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem('languages', index)}>
                  <Text style={[styles.removeButtonText, { fontSize: fontSize }]}>{t('Remove')}</Text>
                </TouchableOpacity>
              </View>
            ))}

        {/* Hit Points */}
        <Modal visible={hitPointsModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainerMonCre}>
            <View style={styles.modalContentMonCre}>
              <Text style={[styles.modalTitleMonCre, { fontSize: fontSize * 1.2 }]}>{t('Edit Hit Points')}</Text>

              <Text style={[styles.labelMonCreHitPoint, { fontSize: fontSize }]}>{t('Average Hit Points')}</Text>
              <TextInput
                style={[styles.modalInputMonCreHitPoints, { height: 50 * scaleFactor, fontSize: fontSize }]}
                placeholder={t('Enter average hit points')}
                value={averageHitPoints}
                onChangeText={setAverageHitPoints}
                keyboardType="numeric"
              />

              <Text style={[styles.labelMonCreHitPoint, { fontSize: fontSize }]}>{t('Hit Die Value')}</Text>
              <Picker
                selectedValue={hitDieValue}
                onValueChange={(value) => setHitDieValue(value)}
                style={styles.pickerMonCre}
              >
                <Picker.Item label="d4" value="d4" />
                <Picker.Item label="d6" value="d6" />
                <Picker.Item label="d8" value="d8" />
                <Picker.Item label="d10" value="d10" />
                <Picker.Item label="d12" value="d12" />
                <Picker.Item label="d20" value="d20" />
              </Picker>

              <Text style={[styles.labelMonCreHitPoint, { fontSize: fontSize }]}>{t('Hit Points Modifier')}</Text>
              <TextInput
                style={[styles.modalInputMonCreHitPoints, { height: 50 * scaleFactor, fontSize: fontSize }]}
                placeholder={t('Enter hit points modifier')}
                value={hitPointsModifier}
                onChangeText={setHitPointsModifier}
                keyboardType="numeric"
              />

              <Text style={[styles.labelMonCreHitPoint, { fontSize: fontSize }]}>{t('Hit Die Count')}</Text>
              <TextInput
                style={[styles.modalInputMonCreHitPoints, { height: 50 * scaleFactor, fontSize: fontSize }]}
                placeholder={t('Enter hit die count')}
                value={hitDieCount}
                onChangeText={setHitDieCount}
                keyboardType="numeric"
              />

              <Button title={t('Save')} onPress={saveHitPoints} />
              <Button title={t('Cancel')} onPress={closeHitPointsModal} />
            </View>
          </View>
        </Modal>

        {/* Add visible description */}
        <Modal visible={inputModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainerMonCre}>
            <View style={styles.modalContentMonCre}>
              <Text style={[styles.modalTitleMonCre, { fontSize: fontSize * 1.2 }]}>{t(`Add ${currentInputType}`)}</Text>
              <TextInput
                style={[styles.modalInputMonCre, { height: 50 * scaleFactor, fontSize: fontSize }]}
                placeholder={t(`Enter ${currentInputType}...`)}
                value={inputValue}
                onChangeText={setInputValue}
              />
              <Button title={t('Add')} onPress={addItem} />
              <Button title={t('Cancel')} onPress={closeInputModal} />
            </View>
          </View>
        </Modal>

        {/* Description */}
        <Modal visible={descriptionModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainerMonCre}>
            <View style={styles.modalContentMonCre}>
              <Text style={[styles.modalTitleMonCre, { fontSize: fontSize * 1.2 }]}>{t('Monster Description')}</Text>
              <TextInput
                style={[styles.modalInputMonCre, { height: 100 * scaleFactor, fontSize: fontSize }]}
                multiline
                placeholder={t('Enter description...')}
                value={description}
                onChangeText={setDescription}
              />
              <Button title={t('Save')} onPress={closeDescriptionModal} />
            </View>
          </View>
        </Modal>
      </ScrollView>

        <View style={styles.saveButton}>
          <TouchableOpacity style={[styles.buttonMonstrum, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={saveMonster}>
            <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 250 * scaleFactor }]}>
              <Text style={[styles.GoBackText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Save Monster')}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default MonsterCreationScreen;
