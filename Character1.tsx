import React, { useState, useEffect, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import PlayerCharacter from './PlayerCharacter';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

const spellsData = require('./assets/Library/spells.json');

Appearance.setColorScheme('light');

const Character1: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
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

  const handleStatPress = (statName, statValue) => {
    navigation.navigate('RzutKostka_Bonus', { statName, statValue });
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

  const handleSpellPress = (spell) => {
    if (!spell || !spell.requiredStat) {
      console.error('Invalid spell data:', spell);
      return;
    }

    const requiredStat = spell.requiredStat;
    const statValue = calculateLargerNumber(player[requiredStat]);

    navigation.navigate('RzutKostka_Bonus_SpellStat', { spell, statValue });
  };

  const AbilitiesWindow = ({ level, navigation }) => {
    const spells = spellsByLevel[level] || [];

    return (
      <View style={styles.abilityWindow}>
      <ScrollView>
        {spells.map((spell, index) => (
          <TouchableOpacity
            key={index}
            style={styles.spellContainer}
            onPress={() => handleSpellPress(spell)}
          >
            <Text style={[styles.spellName, { fontSize: fontSize }]}>{spell.name}</Text>
            <Text style={[styles.spellDetails, { fontSize: fontSize * 0.8 }]}>
              {t('Level')}: {spell.level}, {t('Casting Time')}: {spell.castingTime}, {t('Range')}: {spell.range}
            </Text>
            <Text style={[styles.spellDescription, { fontSize: fontSize * 0.8 }]}>{spell.description}</Text>
          </TouchableOpacity>
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
            <Image source={require('./assets/skills/firearrow.png')} style={[styles.abilityImage, { height: 50 * scaleFactor, width: 50 * scaleFactor }]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePress}>
            <Image source={require('./assets/skills/powershot.png')} style={[styles.abilityImage, { height: 50 * scaleFactor, width: 50 * scaleFactor }]} />
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
      <View style={[styles.dropdownContainerCharacter, { height: 40 * scaleFactor, width: 200 * scaleFactor }]}>
        <Picker
          selectedValue={selectedScreen}
          style={[styles.pickerChooseChar, { width: 200 * scaleFactor }]}
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
        <Image source={require('./assets/assasin.jpeg')} style={[styles.image, { height: 100 * scaleFactor, width: 100 * scaleFactor }]} />
      </View>

      <View style={[styles.healthContainer, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        <TouchableOpacity style={[styles.healthButtonChar, { height: 30 * scaleFactor, width: 80 * scaleFactor, right: 15 * scaleFactor }]} onPress={() => handleHealthChange(10)}>
          <Text style={[styles.healthText, { fontSize: fontSize }]}>{t('Heal')}</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
            <Text style={[styles.statText, { fontSize: fontSize }]}>{t('Health')}: {health}</Text>
            <View style={styles.healthBar}>
              <View style={[styles.healthFill, { width: `${health}%` }]} />
            </View>
          </View>
        <TouchableOpacity style={[styles.damageButtonChar, { height: 30 * scaleFactor, width: 80 * scaleFactor, left: 15 * scaleFactor }]} onPress={() => handleHealthChange(-10)}>
          <Text style={[styles.damageText, { fontSize: fontSize }]}>{t('Damage')}</Text>
        </TouchableOpacity>
       </View>

      <View style={styles.statsContainer}>
      <View style={styles.blackLeftContainer}>
        <TouchableOpacity onPress={() => handleStatPress('STR', calculateLargerNumber(player.STR))}>
          <View style={[styles.statBox, { height: 55 * scaleFactor, width: 85 * scaleFactor }]}>
            <Text style={[styles.largeText, { fontSize: fontSize }]}>{calculateLargerNumber(player.STR)}</Text>
            <Text style={[styles.statText, { fontSize: fontSize * 0.8 }]}>{`STR: ${player.STR}`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatPress('DEX', calculateLargerNumber(player.DEX))}>
          <View style={[styles.statBox, { height: 55 * scaleFactor, width: 85 * scaleFactor }]}>
            <Text style={[styles.largeText, { fontSize: fontSize }]}>{calculateLargerNumber(player.DEX)}</Text>
            <Text style={[styles.statText, { fontSize: fontSize * 0.8 }]}>{`DEX: ${player.DEX}`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatPress('CON', calculateLargerNumber(player.CON))}>
          <View style={[styles.statBox, { height: 55 * scaleFactor, width: 85 * scaleFactor }]}>
            <Text style={[styles.largeText, { fontSize: fontSize }]}>{calculateLargerNumber(player.CON)}</Text>
            <Text style={[styles.statText, { fontSize: fontSize * 0.8 }]}>{`CON: ${player.CON}`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatPress('INT', calculateLargerNumber(player.INT))}>
          <View style={[styles.statBox, { height: 55 * scaleFactor, width: 85 * scaleFactor }]}>
            <Text style={[styles.largeText, { fontSize: fontSize }]}>{calculateLargerNumber(player.INT)}</Text>
            <Text style={[styles.statText, { fontSize: fontSize * 0.8 }]}>{`INT: ${player.INT}`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatPress('WIS', calculateLargerNumber(player.WIS))}>
          <View style={[styles.statBox, { height: 55 * scaleFactor, width: 85 * scaleFactor }]}>
            <Text style={[styles.largeText, { fontSize: fontSize }]}>{calculateLargerNumber(player.WIS)}</Text>
            <Text style={[styles.statText, { fontSize: fontSize * 0.8 }]}>{`WIS: ${player.WIS}`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatPress('CHA', calculateLargerNumber(player.CHA))}>
          <View style={[styles.statBox, { height: 55 * scaleFactor, width: 85 * scaleFactor }]}>
            <Text style={[styles.largeText, { fontSize: fontSize }]}>{calculateLargerNumber(player.CHA)}</Text>
            <Text style={[styles.statText, { fontSize: fontSize * 0.8 }]}>{`CHA: ${player.CHA}`}</Text>
          </View>
        </TouchableOpacity>

      <View style={styles.blackLeftContainer}>
        <View style={[styles.circleBox, { height: 82 * scaleFactor, width: 82 * scaleFactor }]}>
          <Text style={[styles.circleText, { fontSize: fontSize }]}>{player.AC}</Text>
          <Text style={[styles.circleLabel, { fontSize: fontSize * 0.8 }]}>{t('AC')}</Text>
        </View>
        <View style={[styles.circleBox, { height: 82 * scaleFactor, width: 82 * scaleFactor }]}>
          <Text style={[styles.circleText, { fontSize: fontSize }]}>{player.INIT}</Text>
          <Text style={[styles.circleLabel, { fontSize: fontSize * 0.8 }]}>{t('Initiative')}</Text>
        </View>
        <View style={[styles.circleBox, { height: 82 * scaleFactor, width: 82 * scaleFactor }]}>
          <Text style={[styles.circleText, { fontSize: fontSize }]}>{player.Proficiency}</Text>
          <Text style={[styles.circleLabel, { fontSize: fontSize * 0.8 }]}>{t('Proficiency')}</Text>
        </View>
      </View>

        <TouchableOpacity style={[styles.EditBox, { width: 85 * scaleFactor }]}>
          <Text style={[styles.EditText, { fontSize: fontSize * 0.8 }]}>{t('Edit Character')}</Text>
        </TouchableOpacity>
      </View>
      </View>


      <TouchableOpacity style={[styles.Skills, { height: 70 * scaleFactor, width: 70 * scaleFactor }]} onPress={toggleSkills}>
        <Text style={[styles.SkillsText, { fontSize: fontSize }]}>{t('Skills')}</Text>
      </TouchableOpacity>

      {skillsVisible && (
        <View style={styles.skillsWindow}>
          <View style={styles.skillRow}>
            <Text style={[styles.headerText, { fontSize: fontSize, right: '70%' }]}>{t('Prof')}.</Text>
            <Text style={[styles.headerText, { fontSize: fontSize, right: '150%' }]}>{t('Mod')}.</Text>
            <Text style={[styles.headerText, { fontSize: fontSize, right: '60%' }]}>{t('Skill')}</Text>
            <Text style={[styles.headerText, { fontSize: fontSize, left: '320%' }]}>{t('Bonus')}</Text>
          </View>
          <ScrollView style={{ height: 300 * scaleFactor * 1.4 }}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillRow}>
                <View
                  style={[
                    styles.circle,
                    { backgroundColor: getProficiencyColor(skill.bonus) },
                  ]}
                />
                <Text style={[styles.skillMod, { fontSize: fontSize }]}>{skill.mod}</Text>
                   <Text style={[styles.skillName, { fontSize: fontSize }]}>{skill.skill}</Text>
                 <View style={styles.bonusBox}>
                   <Text style={[styles.skillBonus, { fontSize: fontSize }]}>{skill.bonus >= 0 ? `+${skill.bonus}` : skill.bonus}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

        <View style={styles.rightContainer}>
          <TouchableOpacity style={[styles.rightButton, { height: 40 * scaleFactor, width: 80 * scaleFactor }]} onPress={toggleAction}>
            <Text style={[styles.buttonTextCharacter, { fontSize: fontSize }]}>{t('Action')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.rightButton, { height: 40 * scaleFactor, width: 80 * scaleFactor }]} onPress={toggleBonus}>
            <Text style={[styles.buttonTextCharacter, { fontSize: fontSize }]}>{t('Bonus')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.rightButton, { height: 40 * scaleFactor, width: 80 * scaleFactor }]} onPress={toggleReact}>
            <Text style={[styles.buttonTextCharacter, { fontSize: fontSize }]}>{t('React')}</Text>
          </TouchableOpacity>
          {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'].map((label, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.rightButton, { height: 40 * scaleFactor, width: 80 * scaleFactor },
                selectedLevel === index + 1 ? styles.levelButtonSelected : {}
              ]}
              onPress={() => toggleRoman(index + 1)}
            >
              <Text style={[styles.buttonTextCharacter, { fontSize: fontSize } , selectedLevel === index + 1 && styles.activeLevelButtonSelectedText]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedLevel && (
          <View style={styles.CharacterSpellListContainer}>
            <ScrollView>
              {spellsByLevel[selectedLevel]?.map((spell) => (
                <TouchableOpacity
                  key={spell.id}
                  style={styles.CharacterSpellCard}
                  onPress={() => handleSpellPress(spell)}
                >
                  <Text style={[styles.CharacterSpellName, { fontSize: fontSize }]}>{spell.name}</Text>
                  <Text style={[styles.CharacterSpellDetails, { fontSize: fontSize * 0.8 }]}>{t('Casting Time')}: {spell.castingTime}</Text>
                  <Text style={[styles.CharacterSpellDetails, { fontSize: fontSize * 0.8 }]}>{t('Range')}: {spell.range}</Text>
                  <Text style={[styles.CharacterSpellDetails, { fontSize: fontSize * 0.8 }]}>{t('Duration')}: {spell.duration}</Text>
                  <Text style={[styles.CharacterSpellDetails, { fontSize: fontSize * 0.8 }]}>{t('School')}: {spell.school}</Text>
                  <Text style={[styles.CharacterSpellDetails, { fontSize: fontSize * 0.8 }]}>{t('Stat')}: {spell.requiredStat}</Text>
                  <Text style={[styles.CharacterSpellDetails, { fontSize: fontSize * 0.8 }]}>{t('Description')}: {spell.description}</Text>
                </TouchableOpacity>
              )) || <Text style={[styles.CharacterNoSpellsText, { fontSize: fontSize }]}>{t('No spells available for this level.')}</Text>}
            </ScrollView>
          </View>
        )}

        {selectedRomanNumeral && <AbilitiesWindow abilities={abilitiesData[selectedRomanNumeral] || []} />}
        {actionVisible && <ActionWindow />}
        {bonusVisible && <BonusWindow />}
        {reactVisible && <ReactWindow />}

        <View style={styles.diceTurnContainer}>
          <TouchableOpacity style={[styles.TurnDiceButton, { height: 80 * scaleFactor, width: 80 * scaleFactor }]}>
            <Text style={[styles.rightTurnDiceText, { fontSize: fontSize }]}>{t('New Turn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.TurnDiceButton, { height: 80 * scaleFactor, width: 80 * scaleFactor }]} onPress={() => {handleRollDice()}}>
            <Text style={[styles.rightTurnDiceText, { fontSize: fontSize }]}>{t('Roll Dice')}</Text>
          </TouchableOpacity>
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

export default Character1;