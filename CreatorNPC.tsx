import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Button, ImageBackground, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import CheckBox from '@react-native-community/checkbox';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import autofillNPC from './assets/Library/autofillNPC.json';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { UserData } from './UserData';
import { useAuth } from './AuthContext';
Appearance.setColorScheme('light');

const CreatorNPC: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const [monster, setMonster] = useState({
    name: '',
    challengeRating: '',
    armorClass: '',
    size: '',
    monsterType: '',
    hitPoints: '',
    alignment: '',
    saveProfs: '',
    monsterSubtype: '',
    strength: '',
    dexterity: '',
    speed: '',
    constitution: '',
    intelligence: '',
    wisdom: '',
    charisma: '',
    perception: [],
    bonus_action_description: [],
    note: [],
    action_description: [],
    language: [],
    description: [],
  });


const { token } = useAuth();
      const { ipv4 } = useContext(UserData);


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
const setAutofill = async () => {

  try {
     const requestBody = {
         name:monster.name || "Unknown",
	        type:monster.monsterType || "Beast",
	    cr:monster.challengeRating || 1};
         console.log(requestBody)
    const response = await fetch(`http://${ipv4}:8000/bestiaries/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
	const monsterData = {
        name: result.name,
        challengeRating: result.challengeRating.toString(),
        armorClass: result.armorClass.toString(),
        size: result.size.toString(),
        monsterType: result.type.toString(),
        hitPoints: result.averageHitPoints.toString(),
        alignment:result.alignment.toString(),
        saveProfs: result.saveProfs?.toString(),
        strength: result.strScore.toString(),
        dexterity: result.dexScore.toString(),
        constitution: result.conScore.toString(),
        intelligence: result.intScore.toString(),
        wisdom: result.wisScore.toString(),
        charisma: result.chaScore.toString(),
        bonus_action_description: result.bonusActionDescription,
        action_description: result.actionDescription,
        language: result.language,
        description: Array[result.description],
      };
  setMonster(monsterData);
setMonster((prev) => ({ ...prev, speed: result.speed.toString() }));
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

};
const addNewNpc = async () => {
        console.log("startadd")
  try {
     const requestBody = {
       token: token,
                   name: monster.name,
                   challengeRating: `${monster.challengeRating}`,
                   armorClass: `${monster.armorClass}`,
                   hitPoints: `${monster.hitPoints}`,
                   passivePerception: `${monster.perception || "0"}`,
                   strScore: parseInt(monster.strength) || 0,
                   dexScore: parseInt(monster.dexterity) || 0,
                   intScore: parseInt(monster.intelligence) || 0,
                   wisScore: parseInt(monster.wisdom) || 0,
                   chaScore: parseInt(monster.charisma) || 0,
                   conScore: parseInt(monster.constitution) || 0,
                   languageNoteOverride: Array.isArray(monster.language) ? monster.language : [],
                   actionDescription: Array.isArray(monster.action_description)
                       ? monster.action_description.join("\n")
                       : monster.action_description || null,
                   bonusActionDescription: Array.isArray(monster.bonus_action_description)
                       ? monster.bonus_action_description.join("\n")
                       : monster.bonus_action_description || null,
                   alignment: monster?.alignment || "True Neutral",
                   description: monster?.description ?? null,
                   savingThrowProficiencies: Array.isArray(monster.saveProfs) ? monster.saveProfs : [],
                   monsterType: monster.monsterType || "Unknown",
                   size: monster.size || "Medium",
                   speed: monster.speed ? String(monster.speed) : "0"
     };
    console.log(requestBody)
    const response = await fetch(`http://${ipv4}:8000/npcs/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    console.log('New Feat:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

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

  const autoFillNPC = () => {
    setAutofill();
  };

  const saveMonster = () => {
      addNewNpc();
    console.log("Monster saved:", monster);
  };

  return (
    <ImageBackground source={theme.background} style={styles.containerMonCre}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

     <View style={styles.rowContainerMonstrum}>

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

        <View style={styles.GoBackMonstrum}>
          <TouchableOpacity style={[styles.button, { height: 40 * scaleFactor, width: 90 * scaleFactor }]} onPress={autoFillNPC}>
            <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 40 * scaleFactor, width: 150 * scaleFactor }]}>
              <Text style={[styles.buttonTextCharacter, { fontSize: fontSize * 0.8 }]}>{t('Auto Fill')}</Text>
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

            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Speed')}</Text>
            <TextInput style={[styles.inputMonCreStat, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Speed')} value={monster.speed} onChangeText={(text) => handleInputChange('speed', text)}  />

          </View>
            <View style={styles.column}>
            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Size')}</Text>
            <Picker selectedValue={monster.size} onValueChange={(value) => handleInputChange('size', value)} style={[styles.pickerMagicItemCre, { width: 125 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}>
              <Picker.Item label={t('Small')} value="Small" />
              <Picker.Item label={t('Medium')} value="Medium" />
              <Picker.Item label={t('Large')} value="Large" />
            </Picker>

            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Alignment')}</Text>
            <Picker selectedValue={monster.alignment} onValueChange={(value) => handleInputChange('alignment', value)} style={[styles.pickerMagicItemCre, { width: 125 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}>
              <Picker.Item label={t('Good')} value="neutral good" />
              <Picker.Item label={t('Evil')} value="neutral evil" />
              <Picker.Item label={t('Neutral')} value="true neutral" />
            </Picker>

            <Text style={[styles.labelItemCreC, { color: theme.textColor, fontSize: fontSize }]}>{t('Save Profs.')}</Text>
            <TextInput style={[styles.inputMonCre, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Save Proficiencies')} value={monster.saveProfs} onChangeText={(text) => handleInputChange('saveProfs', text)} keyboardType="numeric" />

          </View>
            <View style={styles.column}>
            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Monster Type')}</Text>
            <Picker selectedValue={monster.monsterType} onValueChange={(value) => handleInputChange('monsterType', value)} style={[styles.pickerMagicItemCre, { width: 125 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}>
              <Picker.Item label={t('Aberration')} value="Aberration" />
              <Picker.Item label={t('Beast')} value="Beast" />
              <Picker.Item label={t('Celestial')} value="Celestial" />
              <Picker.Item label={t('Construct')} value="Construct" />
              <Picker.Item label={t('Dragon')} value="Dragon" />
              <Picker.Item label={t('Elemental')} value="Elemental" />
              <Picker.Item label={t('Fey')} value="Fey" />
              <Picker.Item label={t('Fiend')} value="Fiend" />
              <Picker.Item label={t('Giant')} value="Giant" />
              <Picker.Item label={t('Humanoid')} value="Humanoid" />
              <Picker.Item label={t('Monstrosity')} value="Monstrosity" />
              <Picker.Item label={t('Ooze')} value="Ooze" />
              <Picker.Item label={t('Plant')} value="Plant" />
              <Picker.Item label={t('Undead')} value="Undead" />
            </Picker>

          <View style={styles.section}>



            {isSubtype && (
              <View>
                <Text style={[styles.labelItemCreC, { color: theme.textColor, fontSize: fontSize }]}>{t('Select Subtype')}</Text>
                <Picker
                  selectedValue={subtypeValue}
                  onValueChange={(value) => setSubtypeValue(value)}
                  style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
                >
                  <Picker.Item label={t('Humanoid (Elf)')} value="Humanoid (Elf)" />
                  <Picker.Item label={t('Humanoid (Dwarf)')} value="Humanoid (Dwarf)" />
                  <Picker.Item label={t('Humanoid (Orc)')} value="Humanoid (Orc)" />
                  <Picker.Item label={t('Humanoid (Goblinoid)')} value="Humanoid (Goblinoid)" />
                  <Picker.Item label={t('Humanoid (Human)')} value="Humanoid (Human)" />
                  <Picker.Item label={t('Lycanthrope')} value="Lycanthrope" />
                  <Picker.Item label={t('Doppelganger')} value="Doppelganger" />
                  <Picker.Item label={t('Celestial (Angel)')} value="Celestial (Angel)" />
                  <Picker.Item label={t('Celestial (Pegasus)')} value="Celestial (Pegasus)" />
                  <Picker.Item label={t('Fiend (Demon)')} value="Fiend (Demon)" />
                  <Picker.Item label={t('Fiend (Devil)')} value="Fiend (Devil)" />
                  <Picker.Item label={t('Fiend (Yugoloth)')} value="Fiend (Yugoloth)" />
                  <Picker.Item label={t('Undead (Lich)')} value="Undead (Lich)" />
                  <Picker.Item label={t('Undead (Vampire)')} value="Undead (Vampire)" />
                  <Picker.Item label={t('Beast (Aquatic)')} value="Beast (Aquatic)" />
                  <Picker.Item label={t('Beast (Giant)')} value="Beast (Giant)" />
                  <Picker.Item label={t('Dragon (Chromatic)')} value="Dragon (Chromatic)" />
                  <Picker.Item label={t('Dragon (Metallic)')} value="Dragon (Metallic)" />
                  <Picker.Item label={t('Dragon (Gem)')} value="Dragon (Gem)" />
                  <Picker.Item label={t('Monstrosity (Hybrid)')} value="Monstrosity (Hybrid)" />
                  <Picker.Item label={t('Monstrosity (Titan)')} value="Monstrosity (Titan)" />
                  <Picker.Item label={t('Elemental (Fire)')} value="Elemental (Fire)" />
                  <Picker.Item label={t('Elemental (Water)')} value="Elemental (Water)" />
                  <Picker.Item label={t('Elemental (Air)')} value="Elemental (Air)" />
                  <Picker.Item label={t('Elemental (Earth)')} value="Elemental (Earth)" />
                  <Picker.Item label={t('Fey (Eladrin)')} value="Fey (Eladrin)" />
                  <Picker.Item label={t('Fey (Dryad)')} value="Fey (Dryad)" />
                  <Picker.Item label={t('Construct (Golem)')} value="Construct (Golem)" />
                  <Picker.Item label={t('Construct (Animated Object)')} value="Construct (Animated Object)" />
                  <Picker.Item label={t('Aberration (Far Realm)')} value="Aberration (Far Realm)" />
                  <Picker.Item label={t('Swarm of Insects')} value="Swarm of Insects" />
                  <Picker.Item label={t('Swarm of Bats')} value="Swarm of Bats" />
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
            <TextInput style={[styles.inputMonCreStat, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Constitution')} value={monster.constitution} onChangeText={(text) => handleInputChange('constitution', text)} keyboardType="numeric" />

            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Intelligence')}</Text>
            <TextInput style={[styles.inputMonCreStat, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Intelligence')} value={monster.intelligence} onChangeText={(text) => handleInputChange('intelligence', text)} keyboardType="numeric" />
          </View>
          <View style={styles.column}>
            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Wisdom')}</Text>
            <TextInput style={[styles.inputMonCreStat, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Wisdom')} value={monster.wisdom} onChangeText={(text) => handleInputChange('wisdom', text)} keyboardType="numeric" />

            <Text style={[styles.labelItemCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Charisma')}</Text>
            <TextInput style={[styles.inputMonCreStat, { height: 50 * scaleFactor, fontSize: fontSize }]} placeholder={t('Charisma')} value={monster.charisma} onChangeText={(text) => handleInputChange('charisma', text)} keyboardType="numeric" />
          </View>
        </View>

          <View style={styles.columnAdding}>
            <Text style={[styles.labelMonCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Languages')}</Text>
            <TouchableOpacity style={[styles.addButtonMonCre, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={() => openInputModal('language')}>
              <Text style={[styles.labelItemCreA, { color: theme.textColor, fontSize: fontSize }]}>{t('Add language')}</Text>
            </TouchableOpacity>
          </View>
            {monster.language?.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem('language', index)}>
                  <Text style={[styles.removeButtonText, { fontSize: fontSize }]}>{t('Remove')}</Text>
                </TouchableOpacity>
              </View>
            ))}

          <View style={styles.columnAdding}>
            <Text style={[styles.labelMonCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Perception')}</Text>
            <TouchableOpacity style={[styles.addButtonMonCre, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={() => openInputModal('perception')}>
              <Text style={[styles.labelItemCreA, { color: theme.textColor, fontSize: fontSize }]}>{t('Add perception')}</Text>
            </TouchableOpacity>
          </View>
            {monster.perception?.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem('perception', index)}>
                  <Text style={[styles.removeButtonText, { fontSize: fontSize }]}>{t('Remove')}</Text>
                </TouchableOpacity>
              </View>
            ))}

          <View style={styles.columnAdding}>
            <Text style={[styles.labelMonCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Action Description')}</Text>
            <TouchableOpacity style={[styles.addButtonMonCre, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={() => openInputModal('action_description')}>
              <Text style={[styles.labelItemCreA, { color: theme.textColor, fontSize: fontSize }]}>{t('Add description')}</Text>
            </TouchableOpacity>
          </View>
            {monster.action_description?.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem('action_description', index)}>
                  <Text style={[styles.removeButtonText, { fontSize: fontSize }]}>{t('Remove')}</Text>
                </TouchableOpacity>
              </View>
            ))}

          <View style={styles.columnAdding}>
            <Text style={[styles.labelMonCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Bonus Action Description')}</Text>
            <TouchableOpacity style={[styles.addButtonMonCre, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={() => openInputModal('bonus_action_description')}>
              <Text style={[styles.labelItemCreA, { color: theme.textColor, fontSize: fontSize * 1.1 }]}>{t('Add description')}</Text>
            </TouchableOpacity>
          </View>
            {monster.bonus_action_description?.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem('bonus_action_description', index)}>
                  <Text style={[styles.removeButtonText, { fontSize: fontSize }]}>{t('Remove')}</Text>
                </TouchableOpacity>
              </View>
            ))}



          <View style={styles.columnAdding}>
            <Text style={[styles.labelMonCre, { color: theme.textColor, fontSize: fontSize }]}>{t('Description')}</Text>
            <TouchableOpacity style={[styles.addButtonMonCre, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={() => openInputModal('description')}>
              <Text style={[styles.labelItemCreA, { color: theme.textColor, fontSize: fontSize * 1.1 }]}>{t('Add description')}</Text>
            </TouchableOpacity>
          </View>
            {monster.description?.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem('description', index)}>
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
              <Text style={[styles.GoBackText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Save NPC')}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default CreatorNPC;