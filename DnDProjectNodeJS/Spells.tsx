import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const spellsData = require('./assets/Library/spells.json');

const schoolColors = {
  Evocation: '#FF4500',
  Abjuration: '#4682B4',
  Conjuration: '#8A2BE2',
  Divination: '#FFD700',
  Enchantment: '#FF69B4',
  Illusion: '#7B68EE',
  Necromancy: '#708090',
  Transmutation: '#32CD32',
  Universal: '#000',
};

const Spells = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [spells, setSpells] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedEffect, setSelectedEffect] = useState('All');
  const [selectedSchool, setSelectedSchool] = useState('All');
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSpell, setEditedSpell] = useState({ ...selectedSpell });

  const levels = Array.from({ length: 10 }, (_, i) => i);
  const effects = ['Attack', 'Defense', 'Support'];
  const schools = Object.keys(schoolColors);

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    setSpells(spellsData);
  }, []);

  const filterSpells = () => {
    let filtered = spells;

    if (searchText) {
      filtered = filtered.filter((spell) =>
        spell.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedLevel !== 'All') {
      filtered = filtered.filter((spell) => spell.level === parseInt(selectedLevel, 10));
    }

    if (selectedEffect !== 'All') {
      filtered = filtered.filter((spell) => spell.effect === selectedEffect);
    }

    if (selectedSchool !== 'All') {
      filtered = filtered.filter((spell) => spell.school === selectedSchool);
    }

    return filtered;
  };

  const filteredSpells = filterSpells();

  const handleSpellPress = (spell) => {
    setSelectedSpell(spell);
  };

  const closeSpellModal = () => {
    setSelectedSpell(null);
  };

  const handleEditChange = (field, value) => {
    setEditedSpell((prevSpell) => ({
      ...prevSpell,
      [field]: value,
    }));
  };

  const saveSpellChanges = () => {
    updateSpell(editedSpell);
    setIsEditing(false);
  };


  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={t('Search spells')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.pickerItemsContainer}>
        <Picker
          selectedValue={selectedLevel}
          style={styles.pickerItems}
          onValueChange={(value) => setSelectedLevel(value)}
        >
          <Picker.Item style={styles.pickerItems} label={t('All Levels')} value="All" />
          {levels.map((level) => (
            <Picker.Item key={level} label={`${t('Level')} ${level}`} value={level.toString()} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedEffect}
          style={styles.pickerItems}
          onValueChange={(value) => setSelectedEffect(value)}
        >
          <Picker.Item style={styles.pickerItems} label={t('All Types')} value="All" />
          {effects.map((effect) => (
            <Picker.Item key={effect} label={t(effect)} value={effect} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedSchool}
          style={styles.pickerItems}
          onValueChange={(value) => setSelectedSchool(value)}
        >
          <Picker.Item style={styles.pickerItems} label={t('All Schools')} value="All" />
          {schools.map((school) => (
            <Picker.Item
              key={school}
              label={t(school)}
              value={school}
              color={schoolColors[school]}
            />
          ))}
        </Picker>
      </View>

      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('School')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Level')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Details')}</Text>
        </View>
        {filteredSpells.length === 0 ? (
          <Text style={styles.noResultsText}>{t('No spells found')}</Text>
        ) : (
        filteredSpells.map((spell, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.nameColumn]}>{spell.name}</Text>
            <Text
              style={[
                styles.tableCell,
                styles.schoolColumn,
                { color: schoolColors[spell.school] || '#000' },
              ]}
            >
              {spell.school}
            </Text>
            <Text style={[styles.tableCell, styles.levelColumn]}>{spell.level}</Text>
            <TouchableOpacity
              style={[styles.tableCell, styles.actionsColumn]}
              onPress={() => handleSpellPress(spell)}
            >
              <Text style={styles.actionText}>{t('Details')}</Text>
            </TouchableOpacity>
          </View>
        )))}
      </ScrollView>

      {selectedSpell && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalOverlayItems}>
            {!isEditing ? (
              <View style={styles.SpellModal}>
                <Text style={styles.itemTitle}>{selectedSpell.name}</Text>

          <View style={styles.twoColumnContainer}>
            <View style={styles.columnSpells}>
                <Text style={styles.modalDetailsSpells}>
                  {t('Level: \n')} {selectedSpell.level}
                </Text>

                <Text style={[{ color: schoolColors[selectedSpell.school] || '#000' }, styles.modalDetailsSpellsSchool]}>
                  {t('School: \n')} {selectedSpell.school}
                </Text>

          </View>
            <View style={styles.columnSpells}>

                <Text style={styles.modalDetailsSpells}>
                  {t('Casting Time: \n')} {selectedSpell.castingTime}
                </Text>

                <Text style={styles.modalDetailsSpells}>
                  {t('Duration: \n')} {selectedSpell.duration}
                </Text>

          </View>
            <View style={styles.columnSpells}>

                <Text style={styles.modalDetailsSpells}>
                  {t('Range: \n')} {selectedSpell.range}
                </Text>

                <Text style={styles.modalDetailsSpells}>
                  {t('Attack/Save: \n')} {selectedSpell.attackSave}
                </Text>

          </View>
            <View style={styles.columnSpells}>

                <Text style={styles.modalDetailsSpells}>
                  {t('Area: \n')} {selectedSpell.area}
                </Text>

                <Text style={styles.modalDetailsSpells}>
                  {t('Components: \n')} {selectedSpell.components.join(', ')}
                </Text>
          </View>
          </View>

                <Text style={styles.itemDescriptionSpell}>{selectedSpell.description}</Text>

                {selectedSpell.upgrade && (
                  <Text style={styles.itemDescription}>{t('Upgrade')}: {selectedSpell.upgrade}</Text>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>{t('Edit')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeSpellModal} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Close')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.itemModal}>
                <TextInput
                  style={styles.itemTitle}
                  value={editedSpell.name}
                  onChangeText={(value) => handleEditChange('name', value)}
                  placeholder={t('Spell Name')}
                />

                <TextInput
                  style={styles.modalDetails}
                  value={String(editedSpell.level)}
                  onChangeText={(value) => handleEditChange('level', value)}
                  placeholder={t('Level')}
                />

                <Picker
                  selectedValue={editedSpell.school}
                  onValueChange={(value) => handleEditChange('school', value)}
                  style={styles.pickerItems}
                >
                  <Picker.Item label={t('Evocation')} value="Evocation" />
                  <Picker.Item label={t('Necromancy')} value="Necromancy" />
                  <Picker.Item label={t('Abjuration')} value="Abjuration" />
                  <Picker.Item label={t('Divination')} value="Divination" />
                  <Picker.Item label={t('Illusion')} value="Illusion" />
                  <Picker.Item label={t('Enchantment')} value="Enchantment" />
                  <Picker.Item label={t('Transmutation')} value="Transmutation" />
                </Picker>
                <TextInput
                  style={styles.modalDetails}
                  value={editedSpell.castingTime}
                  onChangeText={(value) => handleEditChange('castingTime', value)}
                  placeholder={t('Casting Time')}
                />
                <TextInput
                  style={styles.modalDetails}
                  value={editedSpell.range}
                  onChangeText={(value) => handleEditChange('range', value)}
                  placeholder={t('Range')}
                />
                <TextInput
                  style={styles.modalDetails}
                  value={editedSpell.area}
                  onChangeText={(value) => handleEditChange('area', value)}
                  placeholder={t('Area')}
                />
                <TextInput
                  style={styles.modalDetails}
                  value={editedSpell.duration}
                  onChangeText={(value) => handleEditChange('duration', value)}
                  placeholder={t('Duration')}
                />
                <TextInput
                  style={styles.modalDetails}
                  value={editedSpell.attackSave}
                  onChangeText={(value) => handleEditChange('attackSave', value)}
                  placeholder={t('Attack/Save')}
                />
                <TextInput
                  style={styles.modalDetails}
                  value={editedSpell.components ? editedSpell.components.join(', ') : ''}
                  onChangeText={(value) => handleEditChange('components', value.split(', '))}
                  placeholder={t('Components')}
                />
                <TextInput
                  style={styles.itemDescription}
                  value={editedSpell.description}
                  onChangeText={(value) => handleEditChange('description', value)}
                  placeholder={t('Description')}
                  multiline
                />
                {editedSpell.upgrade && (
                  <TextInput
                    style={styles.itemDescription}
                    value={editedSpell.upgrade}
                    onChangeText={(value) => handleEditChange('upgrade', value)}
                    placeholder={t('Upgrade')}
                    multiline
                  />
                )}
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveSpellChanges} style={styles.editButton}>
                    <Text style={styles.editButtonText}>{t('Save')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Modal>
      )}

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

export default Spells;
