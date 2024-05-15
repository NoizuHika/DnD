import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CreateCharacter = ({ navigation }) => {
  const handleGoBack = () => {
     navigation.navigate('Characters');
  };

  const races = [
    { name: '-' },
    { name: 'Dwarf' },
    { name: 'Halfling' },
    { name: 'Human' },
    { name: 'Elf' },
    { name: 'Gnome' },
    { name: 'Dragonborn' },
    { name: 'Half-orc' },
    { name: 'Half-elf' },
    { name: 'Tiefling' },
  ];

  const positions = [
    { name: '-' },
    { name: 'Bard' },
    { name: 'Barbarian' },
    { name: 'Warrior' },
    { name: 'Wizard' },
    { name: 'Druid' },
    { name: 'Priest' },
    { name: 'Inventor' },
    { name: 'Warlock' },
    { name: 'Monk' },
    { name: 'Paladin' },
    { name: 'Rogue' },
    { name: 'Ranger' },
    { name: 'Sorcerer' },
  ];

  const positionsImages = {
    'Dwarf-M-Bard': require('./assets/Dwarf-M-Bard.jpg'),
    'Dwarf-W-Bard': require('./assets/Dwarf-W-Bard.jpg'),
    'Dwarf-M-Barbarian': require('./assets/Dwarf-M-Barbarian.jpg'),
    'Dwarf-W-Barbarian': require('./assets/Dwarf-W-Barbarian.jpg'),
    'Dwarf-M-Warrior': require('./assets/Dwarf-M-Warrior.jpg'),
    'Dwarf-W-Warrior': require('./assets/Dwarf-W-Warrior.jpg'),
    'Dwarf-M-Wizard': require('./assets/Dwarf-M-Wizard.jpg'),
    'Dwarf-W-Wizard': require('./assets/Dwarf-W-Wizard.jpg'),
    'Dwarf-M-Druid': require('./assets/Dwarf-M-Druid.jpg'),
    'Dwarf-W-Druid': require('./assets/Dwarf-W-Druid.jpg'),
    'Dwarf-M-Priest': require('./assets/Dwarf-M-Priest.jpg'),
    'Dwarf-W-Priest': require('./assets/Dwarf-W-Priest.jpg'),
    'Dwarf-M-Inventor': require('./assets/Dwarf-M-Inventor.jpg'),
    'Dwarf-W-Inventor': require('./assets/Dwarf-W-Inventor.jpg'),
    'Dwarf-M-Warlock': require('./assets/Dwarf-M-Warlock.jpg'),
    'Dwarf-W-Warlock': require('./assets/Dwarf-W-Warlock.jpg'),
    'Dwarf-M-Monk': require('./assets/Dwarf-M-Monk.jpg'),
    'Dwarf-W-Monk': require('./assets/Dwarf-W-Monk.jpg'),
    'Dwarf-M-Paladin': require('./assets/Dwarf-M-Paladin.jpg'),
    'Dwarf-W-Paladin': require('./assets/Dwarf-W-Paladin.jpg'),
    'Dwarf-M-Rogue': require('./assets/Dwarf-M-Rogue.jpg'),
    'Dwarf-W-Rogue': require('./assets/Dwarf-W-Rogue.jpg'),
    'Dwarf-M-Ranger': require('./assets/Dwarf-M-Ranger.jpg'),
    'Dwarf-W-Ranger': require('./assets/Dwarf-W-Ranger.jpg'),
    'Dwarf-M-Sorcerer': require('./assets/Dwarf-M-Sorcerer.jpg'),
    'Dwarf-W-Sorcerer': require('./assets/Dwarf-W-Sorcerer.jpg'),
    'Halfling-M-Bard': require('./assets/Halfling-M-Bard.jpg'),
    'Halfling-W-Bard': require('./assets/Halfling-W-Bard.jpg'),
    'Halfling-M-Barbarian': require('./assets/Halfling-M-Barbarian.jpg'),
    'Halfling-W-Barbarian': require('./assets/Halfling-W-Barbarian.jpg'),
    'Halfling-M-Warrior': require('./assets/Halfling-M-Warrior.jpg'),
    'Halfling-W-Warrior': require('./assets/Halfling-W-Warrior.jpg'),
    'Halfling-M-Wizard': require('./assets/Halfling-M-Wizard.jpg'),
    'Halfling-W-Wizard': require('./assets/Halfling-W-Wizard.jpg'),
    'Halfling-M-Druid': require('./assets/Halfling-M-Druid.jpg'),
    'Halfling-W-Druid': require('./assets/Halfling-W-Druid.jpg'),
    'Halfling-M-Priest': require('./assets/Halfling-M-Priest.jpg'),
    'Halfling-W-Priest': require('./assets/Halfling-W-Priest.jpg'),
    'Halfling-M-Inventor': require('./assets/Halfling-M-Inventor.jpg'),
    'Halfling-W-Inventor': require('./assets/Halfling-W-Inventor.jpg'),
    'Halfling-M-Warlock': require('./assets/Halfling-M-Warlock.jpg'),
    'Halfling-W-Warlock': require('./assets/Halfling-W-Warlock.jpg'),
    'Halfling-M-Monk': require('./assets/Halfling-M-Monk.jpg'),
    'Halfling-W-Monk': require('./assets/Halfling-W-Monk.jpg'),
    'Halfling-M-Paladin': require('./assets/Halfling-M-Paladin.jpg'),
    'Halfling-W-Paladin': require('./assets/Halfling-W-Paladin.jpg'),
    'Halfling-M-Rogue': require('./assets/Halfling-M-Rogue.jpg'),
    'Halfling-W-Rogue': require('./assets/Halfling-W-Rogue.jpg'),
    'Halfling-M-Ranger': require('./assets/Halfling-M-Ranger.jpg'),
    'Halfling-W-Ranger': require('./assets/Halfling-W-Ranger.jpg'),
    'Halfling-M-Sorcerer': require('./assets/Halfling-M-Sorcerer.jpg'),
    'Halfling-W-Sorcerer': require('./assets/Halfling-W-Sorcerer.jpg'),
    'Human-M-Mage': require('./assets/Human-M-Mage.jpg'),
    'Human-W-Mage': require('./assets/Human-W-Mage.jpg'),
    // so on pzdc rabota na 5 hours
  };

  const classInfo = {
    'Dwarf-M-Bard': {
        image: require('./assets/Dwarf-M-Bard.jpg'),
        description: 'Описание класса Dwarf-M-Bard',
      },
      'Dwarf-W-Bard': {
        image: require('./assets/Dwarf-W-Bard.jpg'),
        description: 'Описание класса Dwarf-W-Bard',
      },
      'Dwarf-M-Barbarian': {
        image: require('./assets/Dwarf-M-Barbarian.jpg'),
        description: 'Описание класса Dwarf-M-Barbarian',
      },
      'Dwarf-W-Barbarian': {
        image: require('./assets/Dwarf-W-Barbarian.jpg'),
        description: 'Описание класса Dwarf-W-Barbarian',
      },
      'Dwarf-M-Warrior': {
        image: require('./assets/Dwarf-M-Warrior.jpg'),
        description: 'Родился в горах, любил сражаться с собратьями. Буянил.',
      },
      'Dwarf-W-Warrior': {
        image: require('./assets/Dwarf-W-Warrior.jpg'),
        description: 'Родилась в деревне близ гор, над ней всегда издевались.',
      },
      'Dwarf-M-Wizard': {
        image: require('./assets/Dwarf-M-Wizard.jpg'),
        description: 'Описание класса Dwarf-M-Wizard',
      },
      'Dwarf-W-Wizard': {
        image: require('./assets/Dwarf-W-Wizard.jpg'),
        description: 'Описание класса Dwarf-W-Wizard',
      },
      'Dwarf-M-Druid': {
        image: require('./assets/Dwarf-M-Druid.jpg'),
        description: 'Описание класса Dwarf-M-Druid',
      },
      'Dwarf-W-Druid': {
        image: require('./assets/Dwarf-W-Druid.jpg'),
        description: 'Описание класса Dwarf-W-Druid',
      },
      'Dwarf-M-Priest': {
        image: require('./assets/Dwarf-M-Priest.jpg'),
        description: 'Описание класса Dwarf-M-Priest',
      },
      'Dwarf-W-Priest': {
        image: require('./assets/Dwarf-W-Priest.jpg'),
        description: 'Описание класса Dwarf-W-Priest',
      },
      'Dwarf-M-Inventor': {
        image: require('./assets/Dwarf-M-Inventor.jpg'),
        description: 'Описание класса Dwarf-M-Inventor',
      },
      'Dwarf-W-Inventor': {
        image: require('./assets/Dwarf-W-Inventor.jpg'),
        description: 'Описание класса Dwarf-W-Inventor',
      },
      'Dwarf-M-Warlock': {
        image: require('./assets/Dwarf-M-Warlock.jpg'),
        description: 'Описание класса Dwarf-M-Warlock',
      },
      'Dwarf-W-Warlock': {
        image: require('./assets/Dwarf-W-Warlock.jpg'),
        description: 'Описание класса Dwarf-W-Warlock',
      },
      'Dwarf-M-Monk': {
        image: require('./assets/Dwarf-M-Monk.jpg'),
        description: 'Описание класса Dwarf-M-Monk',
      },
      'Dwarf-W-Monk': {
        image: require('./assets/Dwarf-W-Monk.jpg'),
        description: 'Описание класса Dwarf-W-Monk',
      },
      'Dwarf-M-Paladin': {
        image: require('./assets/Dwarf-M-Paladin.jpg'),
        description: 'Описание класса Dwarf-M-Paladin',
      },
      'Dwarf-W-Paladin': {
        image: require('./assets/Dwarf-W-Paladin.jpg'),
        description: 'Описание класса Dwarf-W-Paladin',
      },
      'Dwarf-M-Rogue': {
        image: require('./assets/Dwarf-M-Rogue.jpg'),
        description: 'Описание класса Dwarf-M-Rogue',
      },
      'Dwarf-W-Rogue': {
        image: require('./assets/Dwarf-W-Rogue.jpg'),
        description: 'Описание класса Dwarf-W-Rogue',
      },
      'Dwarf-M-Ranger': {
        image: require('./assets/Dwarf-M-Ranger.jpg'),
        description: 'Описание класса Dwarf-M-Ranger',
      },
      'Dwarf-W-Ranger': {
        image: require('./assets/Dwarf-W-Ranger.jpg'),
        description: 'Описание класса Dwarf-W-Ranger',
      },
      'Dwarf-M-Sorcerer': {
        image: require('./assets/Dwarf-M-Sorcerer.jpg'),
        description: 'Описание класса Dwarf-M-Sorcerer',
      },
      'Dwarf-W-Sorcerer': {
        image: require('./assets/Dwarf-W-Sorcerer.jpg'),
        description: 'Описание класса Dwarf-W-Sorcerer',
      },
      'Halfling-M-Bard': {
        image: require('./assets/Halfling-M-Bard.jpg'),
        description: 'Racial Traits: \n\nLucky: when roll 1 on d20 for attack, ability check or saving throw - reroll \n\nBrave: Advantage on saving throws against being frightened \n\nHalfling Nimbleness: You can move through the space of any creature that is of a size larger than yours \n\nNaturally Stealthy: You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you \n\n\nClass Features \n\n\nHit Points: \n\nHit Dice: 1d8 per bard level \n\nHit Points at 1st Level: 8 + your Constitution modifier \n\nHit Points at Higher Levels: 1d8 (or 5) + your Constitution modifier per bard level after 1st \n\n\nProficiencies: \n\nArmor: Light armor\n\nWeapons: Simple weapons, hand crossbows, longswords, rapiers, shortswords\n\nTools: Three musical instruments of your choice\n\nSaving Throws: Dexterity, Charisma \n\n\nSpellcasting: \n\nCantrips: You know two cantrips of your choice from the bard spell list. You learn additional bard cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Bard table. \n\nSpell Slots: The Bard table shows how many spell slots you have to cast your bard spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell’s level or higher. You regain all expended spell slots when you finish a long rest. \n\nSpells Known of 1st Level and Higher: You know four 1st-level spells of your choice from the bard spell list \n\nSpellcasting Ability: Charisma is your spellcasting ability for your bard spells. Your magic comes from the heart and soul you pour into the performance of your music or oration. You use your Charisma whenever a spell refers to your spellcasting ability. In addition, you use your Charisma modifier when setting the saving throw DC for a bard spell you cast and when making an attack roll with one. \n\nSpell save DC: 8 + your proficiency bonus + your Charisma modifier \n\nSpell attack modifier: your proficiency bonus + your Charisma modifier \n\nSpell save DC: 8 + your proficiency bonus + your Charisma modifier\n\nSpell attack modifier: your proficiency bonus + your Charisma modifier\n\n\nSpells: \nBardic Inspiration \nJack of All Trades \nSong of Rest \nBard College \nExpertise \nAbility Score Improvement \nFont of Inspiration \nCountercharm \nMagical Secrets \nSuperior Inspiration',
      },
      'Halfling-W-Bard': {
        image: require('./assets/Halfling-W-Bard.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\nHit Points\nHit Dice: 1d12 per bard level\nHit Points at 1st Level: 2 + modifier\nHit Points at Higher Levels: 12 (or 4) + y 1st\nProficiencies\nArmor: Имба\nWeapons: ЛЮбое\nTools: Three разные херни\nSaving Throws: Телепо, ПОр, Огурец\nSpellcasting\nSpell save DC = 2 + your proficiency bonus + your рот modifier\nSpell attack modifier = your proficiency bonus + your шаверма modifier\nBardic Inspiration\nJack of All Trades\nSong of Rest\nBard College\nExpertise\nAbility Score Improvement\nFont of Inspiration\nCountercharm\nMagical Secrets\nSuperior Inspiration',
      },
      'Halfling-M-Barbarian': {
        image: require('./assets/Halfling-M-Barbarian.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-W-Barbarian': {
        image: require('./assets/Halfling-W-Barbarian.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-M-Warrior': {
        image: require('./assets/Halfling-M-Warrior.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-W-Warrior': {
        image: require('./assets/Halfling-W-Warrior.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-M-Wizard': {
        image: require('./assets/Halfling-M-Wizard.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-W-Wizard': {
        image: require('./assets/Halfling-W-Wizard.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-M-Druid': {
        image: require('./assets/Halfling-M-Druid.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-W-Druid': {
        image: require('./assets/Halfling-W-Druid.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-M-Priest': {
        image: require('./assets/Halfling-M-Priest.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-W-Priest': {
        image: require('./assets/Halfling-W-Priest.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-M-Inventor': {
        image: require('./assets/Halfling-M-Inventor.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-W-Inventor': {
        image: require('./assets/Halfling-W-Inventor.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-M-Warlock': {
        image: require('./assets/Halfling-M-Warlock.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-W-Warlock': {
        image: require('./assets/Halfling-W-Warlock.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-M-Monk': {
        image: require('./assets/Halfling-M-Monk.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-W-Monk': {
        image: require('./assets/Halfling-W-Monk.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-M-Paladin': {
        image: require('./assets/Halfling-M-Paladin.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-W-Paladin': {
        image: require('./assets/Halfling-W-Paladin.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-M-Rogue': {
        image: require('./assets/Halfling-M-Rogue.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-W-Rogue': {
        image: require('./assets/Halfling-W-Rogue.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-M-Ranger': {
        image: require('./assets/Halfling-M-Ranger.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-W-Ranger': {
        image: require('./assets/Halfling-W-Ranger.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-M-Sorcerer': {
        image: require('./assets/Halfling-M-Sorcerer.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Halfling-W-Sorcerer': {
        image: require('./assets/Halfling-W-Sorcerer.jpg'),
        description: 'Lucky (when roll 1 on d20 for attack, ability check or saving throw - reroll), Brave (Advantage on saving throws against being frightened), Halfling Nimbleness (You can move through the space of any creature that is of a size larger than yours), Naturally Stealthy (You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you)\n',
      },
      'Human-M-Mage': {
        image: require('./assets/Human-M-Mage.jpg'),
        description: 'Описание класса Human-M-Mage',
      },
      'Human-W-Mage': {
        image: require('./assets/Human-W-Mage.jpg'),
        description: 'Описание класса Human-W-Mage',
      },
    // Vot tut priam pzdc. Moze i mozna inaczej, ale aktualnie eto prosto pzdc
  };


  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [nickname, setNickname] = useState('');

  const renderRaceItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedRace(item)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderGenderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedGender(item)}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  const renderPositionItem = ({ item }) => (
      <TouchableOpacity onPress={() => setPositionItem(item)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
  );

  const renderPositionsImages = ({ item }) => (
   <TouchableOpacity onPress={() => setPositionsImages(item)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={positionsImages[`${selectedRace?.name}-${selectedGender ? selectedGender.charAt(0) : ''}-${item}`]}
          style={{ width: 30, height: 30, marginRight: 10 }}
        />
        <Text>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleContinue = () => {
    const selectedClassKey = `${selectedRace}-${selectedGender}-${selectedPosition}`;
    const selectedClassInfo = classInfo[selectedClassKey];

    navigation.navigate('CreateCharacter2', { selectedClassInfo, nickname });
  };

  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >

      <View style={styles.RaceGenderPosCont}>
            <Text style={styles.RaceGenderPosContTitle}>Race</Text>
            <Picker
                selectedValue={selectedRace}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedRace(itemValue)}>
                {races.map((race, index) => (
                  <Picker.Item key={index} label={race.name} value={race.name} />
                ))}
            </Picker>

            <Text style={styles.RaceGenderPosContTitle}>Gender</Text>
              <Picker
                 selectedValue={selectedGender}
                 style={styles.picker}
                 onValueChange={(itemValue) => setSelectedGender(itemValue)}>
                 <Picker.Item label="-" value="-" />
                 <Picker.Item label="Male" value="M" />
                 <Picker.Item label="Female" value="W" />
              </Picker>

              <Text style={styles.RaceGenderPosContTitle}>Class</Text>
                <Picker
                  selectedValue={selectedPosition}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedPosition(itemValue)}>
                  {positions.map((position, index) => (
                     <Picker.Item key={index} label={position.name} value={position.name} />
                  ))}
             </Picker>

          <Text style={styles.RaceGenderPosContTitle}>Nickname</Text>
          <TextInput
            style={styles.textInput}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Enter your nickname"
          />

        </View>

        <View style={styles.selectedImageContainer}>
          {selectedRace && selectedGender && selectedPosition && (
            <Image
              source={positionsImages[`${selectedRace}-${selectedGender}-${selectedPosition}`]}
              style={styles.selectedImage}
            />
          )}
        </View>

        <Button title="Continue" onPress={handleContinue} />


       <View style={styles.GoBack}>
      <TouchableOpacity style={styles.button} onPress={() => {handleGoBack()}} >
            <Text style={styles.GoBackText}>Go back</Text>
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
    width: '100%',
    height: '100%',
  },
  appName: {
    position: 'absolute',
    top: '16%',
    fontSize: 24,
    color: '#7F7F7F',
  },

  RaceGenderPosCont: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  RaceGenderPosContTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },

  textInput: {
    height: 40,
    width: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  picker: {
    height: 40,
    width: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },

  selectedImageContainer: {
    position: 'center',

  },
  selectedImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },


  GoBack: {
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: '20%',
        borderColor: '#7F7F7F',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1.5,
      },
      GoBackText: {
        color: '#d6d6d6',
      },
    });

export default CreateCharacter;