import React, { useState, useEffect, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import PlayerCharacter from './PlayerCharacter';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';

const spellsData = require('./assets/Library/spells.json');

Appearance.setColorScheme('light');

const Character1 = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [characterData, setCharacterData] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState('Character1');
  const [health, setHealth] = useState(100);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [actionVisible, setActionVisible] = useState(false);
  const [bonusVisible, setBonusVisible] = useState(false);
  const [reactVisible, setReactVisible] = useState(false);
  const [romanVisible, setRomanVisible] = useState(false);
  const [selectedRomanNumeral, setSelectedRomanNumeral] = useState(null);
  const { theme } = useContext(ThemeContext);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [spells, setSpells] = useState([]);


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSpells(spellsData);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/characters/1');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setCharacterData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error fetching data
    }
  };

  const handleGoBack = () => {
    navigation.navigate('Characters');
  };

  const handleRollDice = () => {
    navigation.navigate('RzutKostka');
  };

  const handleStatPress = (statValue) => {
    navigation.navigate('RzutKostka_Bonus', { statValue });
  };

  const calculateLargerNumber = (value) => {
    const largerNumber = Math.floor((value - 10) / 2);
    return largerNumber >= 0 ? `${largerNumber}` : `${largerNumber}`;
  };

  const handleHealthChange = (amount) => {
    setHealth(prevHealth => Math.max(0, Math.min(100, prevHealth + amount)));
  };

  if (!characterData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('Loading...')}</Text>
      </View>
    );
  }

  const toggleSkills = () => {
    setSkillsVisible(!skillsVisible);
    setBonusVisible(false);
    setReactVisible(false);
    setActionVisible(false);
    setRomanVisible(false);
    setSelectedLevel(null);
    setSelectedRomanNumeral(null);
  };

  const toggleAction = () => {
    setActionVisible(!actionVisible);
    setBonusVisible(false);
    setReactVisible(false);
    setSkillsVisible(false);
    setRomanVisible(false);
    setSelectedLevel(null);
    setSelectedRomanNumeral(null);
  };

  const toggleBonus = () => {
    setBonusVisible(!bonusVisible);
    setActionVisible(false);
    setReactVisible(false);
    setSkillsVisible(false);
    setRomanVisible(false);
    setSelectedLevel(null);
    setSelectedRomanNumeral(null);
  };

  const toggleReact = () => {
    setReactVisible(!reactVisible);
    setActionVisible(false);
    setBonusVisible(false);
    setSkillsVisible(false);
    setRomanVisible(false);
    setSelectedLevel(null);
    setSelectedRomanNumeral(null);
  };

  const toggleRoman = (level) => {
    if (selectedLevel === level) {
      setSelectedLevel(null);
      setRomanVisible(false);
    } else {
      setSelectedLevel(level);
      setRomanVisible(true);
      setSkillsVisible(false);
      setActionVisible(false);
      setBonusVisible(false);
      setReactVisible(false);
    }
  };

  const handleRomanNumeralPress = (label) => {
    const levelMap = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9 };
    const level = levelMap[label];
    if (selectedRomanNumeral === label) {
      setSelectedRomanNumeral(null);
    } else {
      setSelectedRomanNumeral(level);
    }
  };

  {selectedRomanNumeral && <AbilitiesWindow level={selectedRomanNumeral - 1} />}

  const groupSpellsByLevel = (spells) => {
    const grouped = {};
    spells.forEach((spell) => {
      if (!grouped[spell.level]) {
        grouped[spell.level] = [];
      }
      grouped[spell.level].push(spell);
    });
    return grouped;
  };

  const spellsByLevel = groupSpellsByLevel(spells);

  const abilitiesData = {
    I: [{ image: require('./assets/skills/bootofspeed.png') }, { image: require('./assets/skills/powershot.png') }],
    II: [{ image: require('./assets/skills/icesword.png') }],
    //...
  };

  const AbilitiesWindow = ({ level }) => {
    const spells = spellsByLevel[level] || [];

    return (
      <View style={styles.abilityWindow}>
        <ScrollView>
          {spells.map((spell, index) => (
            <View key={index} style={styles.spellContainer}>
              <Text style={styles.spellName}>{spell.name}</Text>
              <Text style={styles.spellDetails}>
                {t('Level')}: {spell.level}, {t('Casting Time')}: {spell.castingTime}, {t('Range')}: {spell.range}
              </Text>
              <Text style={styles.spellDescription}>{spell.description}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };


  const ActionWindow = ({ onClose }) => {
    const [showPowerLevels, setShowPowerLevels] = useState(false);

    const handleImagePress = () => {
      setShowPowerLevels(!showPowerLevels);
    };

    return (
      <View style={styles.abilityWindow}>
        <View style={styles.skillsContainer}>
          <TouchableOpacity onPress={handleImagePress}>
            <Image source={require('./assets/skills/firearrow.png')} style={styles.abilityImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePress}>
            <Image source={require('./assets/skills/powershot.png')} style={styles.abilityImage} />
          </TouchableOpacity>
        </View>

        {showPowerLevels && (
          <View style={styles.powerLevels}>
            {['I', 'II', 'III', 'IV', 'V', 'VI'].map((label, index) => (
              <TouchableOpacity key={index} style={styles.rightButton}>
                <Text style={styles.buttonTextCharacter}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const BonusWindow = ({ onClose }) => {
    const [showPowerLevels, setShowPowerLevels] = useState(false);

    const handleImagePress = () => {
      setShowPowerLevels(!showPowerLevels);
    };

    return (
      <View style={styles.abilityWindow}>
        <View style={styles.skillsContainer}>
          <TouchableOpacity onPress={handleImagePress}>
            <Image source={require('./assets/skills/powershot.png')} style={styles.abilityImage} />
          </TouchableOpacity>
        </View>

        {showPowerLevels && (
          <View style={styles.powerLevels}>
            {['I', 'II', 'III', 'IV', 'V', 'VI'].map((label, index) => (
              <TouchableOpacity key={index} style={styles.rightButton}>
                <Text style={styles.buttonTextCharacter}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const ReactWindow = ({ onClose }) => {
    const [showPowerLevels, setShowPowerLevels] = useState(false);

    const handleImagePress = () => {
      setShowPowerLevels(!showPowerLevels);
    };

    return (
      <View style={styles.abilityWindow}>
        <View style={styles.skillsContainer}>
          <TouchableOpacity onPress={handleImagePress}>
            <Image source={require('./assets/skills/firearrow.png')} style={styles.abilityImage} />
          </TouchableOpacity>
        </View>

        {showPowerLevels && (
          <View style={styles.powerLevels}>
            {['I', 'II', 'III', 'IV', 'V', 'VI'].map((label, index) => (
              <TouchableOpacity key={index} style={styles.rightButton}>
                <Text style={styles.buttonTextCharacter}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const player = new PlayerCharacter(
    characterData.strScore,
    characterData.dexScore,
    characterData.conScore,
    characterData.intScore,
    characterData.wisScore,
    characterData.chaScore,
    characterData.armorClass,
    calculateLargerNumber(characterData.dexScore)
  );

  const skills = [
    { mod: 'DEX', skill: 'Acrobatics', bonus: 3 },
    { mod: 'WIS', skill: 'Animal Handling', bonus: -1 },
    { mod: 'INT', skill: 'Arcana', bonus: 10 },
    { mod: 'STR', skill: 'Athletics', bonus: 5 },
    { mod: 'CHA', skill: 'Deception', bonus: -1 },
    { mod: 'INT', skill: 'History', bonus: 10 },
    { mod: 'WIS', skill: 'Insight', bonus: -1 },
    { mod: 'CHA', skill: 'Intimidation', bonus: -1 },
    { mod: 'INT', skill: 'Investigation', bonus: 10 },
    { mod: 'WIS', skill: 'Medicine', bonus: -1 },
    { mod: 'INT', skill: 'Nature', bonus: 5 },
    { mod: 'WIS', skill: 'Perception', bonus: -1 },
    { mod: 'CHA', skill: 'Performance', bonus: -1 },
    { mod: 'CHA', skill: 'Persuasion', bonus: -1 },
    { mod: 'INT', skill: 'Religion', bonus: 10 },
    { mod: 'DEX', skill: 'Sleight of Hand', bonus: 3 },
    { mod: 'DEX', skill: 'Stealth', bonus: 3 },
    { mod: 'WIS', skill: 'Survival', bonus: -1 },
  ];

  const getProficiencyColor = (bonus) => {
    if (bonus >= 10) {
      return '#000000';
    } else if (bonus >= 5) {
      return '#555555';
    } else if (bonus >= 0) {
      return '#AAAAAA';
    } else {
      return '#FFFFFF';
    }
  };

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <View style={styles.dropdownContainerCharacter}>
        <Picker
          selectedValue={selectedScreen}
          style={styles.pickerChooseChar}
          onValueChange={(itemValue) => {
            setSelectedScreen(itemValue);
            navigation.navigate(itemValue);
          }}
        >
          <Picker.Item label={t('Main Scene')} value="Character1" />
          <Picker.Item label={t('Inventory')} value="Inventory" />
          <Picker.Item label={t('Character Details')} value="CharacterDetails" />
        </Picker>
      </View>
      <View style={styles.imageContainer}>
        <Image source={require('./assets/assasin.jpeg')} style={styles.image} />
      </View>

      <View style={styles.healthContainer}>
       <Text style={styles.statText}>{t('Health')}: {health}</Text>
        <View style={styles.healthBar}>
          <View style={[styles.healthFill, { width: `${health}%` }]} />
        </View>
        <TouchableOpacity style={styles.healthButtonChar} onPress={() => handleHealthChange(10)}>
          <Text style={styles.healthText}>{t('Heal')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.damageButtonChar} onPress={() => handleHealthChange(-10)}>
          <Text style={styles.damageText}>{t('Damage')}</Text>
        </TouchableOpacity>
       </View>

      <View style={styles.statsContainer}>
      <View style={styles.blackLeftContainer}>
        <TouchableOpacity onPress={() => handleStatPress(calculateLargerNumber(player.STR))}>
          <View style={styles.statBox}>
            <Text style={styles.largeText}>{calculateLargerNumber(player.STR)}</Text>
            <Text style={styles.statText}>{`STR: ${player.STR}`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatPress(calculateLargerNumber(player.DEX))}>
          <View style={styles.statBox}>
            <Text style={styles.largeText}>{calculateLargerNumber(player.DEX)}</Text>
            <Text style={styles.statText}>{`DEX: ${player.DEX}`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatPress(calculateLargerNumber(player.CON))}>
          <View style={styles.statBox}>
            <Text style={styles.largeText}>{calculateLargerNumber(player.CON)}</Text>
            <Text style={styles.statText}>{`CON: ${player.CON}`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatPress(calculateLargerNumber(player.INT))}>
          <View style={styles.statBox}>
            <Text style={styles.largeText}>{calculateLargerNumber(player.INT)}</Text>
            <Text style={styles.statText}>{`INT: ${player.INT}`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatPress(calculateLargerNumber(player.WIS))}>
          <View style={styles.statBox}>
            <Text style={styles.largeText}>{calculateLargerNumber(player.WIS)}</Text>
            <Text style={styles.statText}>{`WIS: ${player.WIS}`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatPress(calculateLargerNumber(player.CHA))}>
          <View style={styles.statBox}>
            <Text style={styles.largeText}>{calculateLargerNumber(player.CHA)}</Text>
            <Text style={styles.statText}>{`CHA: ${player.CHA}`}</Text>
          </View>
        </TouchableOpacity>

      <View style={styles.leftContainer}>
        <View style={styles.circleBox}>
          <Text style={styles.circleText}>{player.AC}</Text>
          <Text style={styles.circleLabel}>{t('AC')}</Text>
        </View>
        <View style={styles.circleBox}>
          <Text style={styles.circleText}>{player.INIT}</Text>
          <Text style={styles.circleLabel}>{t('Initiative')}</Text>
        </View>
        <View style={styles.circleBox}>
          <Text style={styles.circleText}>{player.Proficiency}</Text>
          <Text style={styles.circleLabel}>{t('Proficiency')}</Text>
        </View>
      </View>

        <TouchableOpacity style={styles.EditBox}>
          <Text style={styles.EditText}>{t('Edit Character')}</Text>
        </TouchableOpacity>
      </View>
      </View>


      <TouchableOpacity style={styles.Skills} onPress={toggleSkills}>
        <Text style={styles.SkillsText}>{t('Skills')}</Text>
      </TouchableOpacity>

      {skillsVisible && (
        <View style={styles.skillsWindow}>
          <View style={styles.skillRow}>
            <Text style={[styles.headerText, {right: '70%' }]}>{t('Prof')}.</Text>
            <Text style={[styles.headerText, {right: '150%' }]}>{t('Mod')}.</Text>
            <Text style={[styles.headerText, {right: '60%' }]}>{t('Skill')}</Text>
            <Text style={[styles.headerText, {left: '320%' }]}>{t('Bonus')}</Text>
          </View>
          <ScrollView>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillRow}>
                <View
                  style={[
                    styles.circle,
                    { backgroundColor: getProficiencyColor(skill.bonus) },
                  ]}
                />
                <Text style={styles.skillMod}>{skill.mod}</Text>
                <Text style={styles.skillName}>{skill.skill}</Text>
                <View style={styles.bonusBox}>
                  <Text style={styles.skillBonus}>{skill.bonus >= 0 ? `+${skill.bonus}` : skill.bonus}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.rightButton} onPress={toggleAction}>
            <Text style={styles.buttonTextCharacter}>{t('Action')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightButton} onPress={toggleBonus}>
            <Text style={styles.buttonTextCharacter}>{t('Bonus')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightButton} onPress={toggleReact}>
            <Text style={styles.buttonTextCharacter}>{t('React')}</Text>
          </TouchableOpacity>
          {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'].map((label, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.rightButton,
                selectedLevel === index + 1 && styles.levelButtonSelected,
              ]}
              onPress={() => toggleRoman(index + 1)}
            >
              <Text style={[styles.buttonTextCharacter, selectedLevel === index + 1 && styles.activeLevelButtonSelectedText]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedLevel && (
         <View style={styles.CharacterSpellListContainer}>
           <ScrollView >
            {spellsByLevel[selectedLevel]?.map((spell) => (
              <View key={spell.id} style={styles.CharacterSpellCard}>
                <Text style={styles.CharacterSpellName}>{spell.name}</Text>
                <Text style={styles.CharacterSpellDetails}>{t('Casting Time')}: {spell.castingTime}</Text>
                <Text style={styles.CharacterSpellDetails}>{t('Range')}: {spell.range}</Text>
                <Text style={styles.CharacterSpellDetails}>{t('Duration')}: {spell.duration}</Text>
                <Text style={styles.CharacterSpellDetails}>{t('School')}: {spell.school}</Text>
                <Text style={styles.CharacterSpellDetails}>{t('Description')}: {spell.description}</Text>
              </View>
            )) || <Text style={styles.CharacterNoSpellsText}>{t('No spells available for this level.')}</Text>}
           </ScrollView>
         </View>
        )}

        {selectedRomanNumeral && <AbilitiesWindow abilities={abilitiesData[selectedRomanNumeral] || []} />}
        {actionVisible && <ActionWindow />}
        {bonusVisible && <BonusWindow />}
        {reactVisible && <ReactWindow />}

        <View style={styles.diceTurnContainer}>
          <TouchableOpacity style={styles.TurnDiceButton}>
            <Text style={styles.rightTurnDiceText}>{t('New Turn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.TurnDiceButton} onPress={() => {handleRollDice()}}>
            <Text style={styles.rightTurnDiceText}>{t('Roll Dice')}</Text>
          </TouchableOpacity>
        </View>

      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Character1;