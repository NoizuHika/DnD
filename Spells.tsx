import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { UserData } from './UserData';
import { SettingsContext } from './SettingsContext';
Appearance.setColorScheme('light');

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

const Spells: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { ipv4 } = useContext(UserData);
  const [spells, setSpells] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedEffect, setSelectedEffect] = useState('All');
  const [selectedSchool, setSelectedSchool] = useState('All');
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSpell, setEditedSpell] = useState(null);

  const levels = ["Cantrip", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"];
    const [schools,setSchools] = useState([])

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
      fetchData();
  }, []);

  const fetchData = async () => {
      try {
          const [spellsResponse, schoolsResponse] = await Promise.all([
            fetch(`http://${ipv4}:8000/spells/all/10`),
            fetch(`http://${ipv4}:8000/schools/all`),
          ]);

          if (!spellsResponse.ok || !schoolsResponse.ok) {
            throw new Error('Failed to fetch data');
          }

          const spellsData = await spellsResponse.json();
          const schoolsData = await schoolsResponse.json();

          setSpells(spellsData);
          setSchools(schoolsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

  useEffect(() => {
    if (selectedSpell) {
      setEditedSpell({ ...selectedSpell });
    } else {
      setEditedSpell(null);
    }
  }, [selectedSpell]);

  const filterSpells = () => {
    let filtered = spells;

    if (searchText) {
      filtered = filtered.filter((spell) =>
        spell.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedLevel !== 'All') {
      filtered = filtered.filter((spell) => spell.level === selectedLevel);
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
    setIsEditing(false);
  };

  const handleEditChange = (field, value) => {
    setEditedSpell((prevSpell) => ({
      ...prevSpell,
      [field]: value,
    }));
  };

const setUpdate = async (spellDto) => {
  try {
    const response = await fetch(`http://${ipv4}:8000/spells/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(spellDto),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log('Updated spell:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};


  const saveSpellChanges = () => {
    if (!editedSpell) return;
    const spellDto = {
              id: editedSpell.id,
              name: editedSpell.name,
              level: editedSpell.level,
              castingTime: editedSpell.castingTime,
              duration: editedSpell.duration,
              components: editedSpell.components,
              description: editedSpell.description,
              atHigherLevels: editedSpell.atHigherLevels,
              range: editedSpell.range,
              school:editedSpell.school,
              classes: editedSpell.classes,
              source: editedSpell.source,
              ownerID: editedSpell.ownerID,
            };
         setUpdate(spellDto);
    setSelectedSpell(editedSpell);
    setIsEditing(false);
  };

    const deleteSpell = async () => {
      try {

        const response = await fetch(`http://${ipv4}:8000/spells/delete/${editedSpell.id}`, {
          method: 'Delete',
          headers: {
            'Content-Type': 'application/json',
          }
        });
    setSelectedSpell(null);
    setIsEditing(false);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const result = await response.json();
        console.log('New encounter:', result);
      fetchData();
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }

    };


  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <TextInput
        style={[styles.searchInput, { fontSize: fontSize, height: 40 * scaleFactor }]}
        placeholder={t('Search spells')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.pickerItemsContainer}>
            <Picker
              selectedValue={selectedLevel}
              style={[styles.pickerItems, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
              onValueChange={(value) => setSelectedLevel(value)}
            >
              <Picker.Item style={[styles.pickerItems, { fontSize: fontSize }]} label={t('All Levels')} value="All" />
              {levels.map((level) => (

                <Picker.Item key={level} label={`${t('Level')} ${level}`} value={level.toString()} style={{ fontSize: fontSize }} />

              ))}
            </Picker>
            <Picker
              selectedValue={selectedSchool}
              style={[styles.pickerItems, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
              onValueChange={(value) => setSelectedSchool(value)}
            >
              <Picker.Item style={[styles.pickerItems, { fontSize: fontSize }]} label={t('All Schools')} value="All" />
              {schools.map((school) => (
                <Picker.Item
                  key={school}
                  label={t(school.name)}
                  value={school.name}
                  color={schoolColors[school]}
                  style={{ fontSize: fontSize }}
                />
              ))}
            </Picker>
      </View>

      <ScrollView style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Name')}</Text>
              <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('School')}</Text>
              <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Level')}</Text>
              <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Details')}</Text>
            </View>
            {filteredSpells.length === 0 ? (
              <Text style={[styles.noResultsText, { fontSize: fontSize }]}>{t('No spells found')}</Text>
            ) : (
            filteredSpells.map((spell, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.nameColumn, { fontSize: fontSize }]}>{spell.name}</Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.schoolColumn,
                        { color: schoolColors[spell.school] || '#000', fontSize: fontSize * 0.9 },
                      ]}
                    >
                      {spell.school}
                    </Text>
                    <Text style={[styles.tableCell, styles.levelColumn, { fontSize: fontSize }]}>{spell.level}</Text>
                    <TouchableOpacity
                      style={[styles.tableCell, styles.actionsColumn]}
                      onPress={() => handleSpellPress(spell)}
                    >
                      <Text style={[styles.actionText, { fontSize: fontSize }]}>{t('Details')}</Text>
                    </TouchableOpacity>
                  </View>
            )))}
      </ScrollView>

        {selectedSpell && (
          <Modal visible={true} transparent={true} animationType="fade">
            <ScrollView contentContainerStyle={styles.modalOverlaySpells}>
              {!isEditing ? (
                <View style={[styles.SpellModal, { padding: 20 * scaleFactor }]}>
                  <Text style={[styles.itemTitle, { fontSize: fontSize * 1.2 }]}>
                    {selectedSpell.name}
                  </Text>

                  <View style={styles.twoColumnContainer}>
                    <View style={styles.columnSpells}>
                      <Text style={[styles.modalDetailsSpells, { fontSize: fontSize }]}>
                        {t('Level: \n')} {selectedSpell.level}
                      </Text>
                      <Text
                        style={[
                          { color: schoolColors[selectedSpell.school] || '#000' },
                          styles.modalDetailsSpellsSchool,
                          { fontSize: fontSize },
                        ]}
                      >
                        {t('School: \n')} {selectedSpell.school}
                      </Text>
                    </View>

                    <View style={styles.columnSpells}>
                      <Text style={[styles.modalDetailsSpells, { fontSize: fontSize }]}>
                        {t('Casting Time: \n')} {selectedSpell.castingTime}
                      </Text>
                      <Text style={[styles.modalDetailsSpells, { fontSize: fontSize }]}>
                        {t('Duration: \n')} {selectedSpell.duration}
                      </Text>
                    </View>

                    <View style={styles.columnSpells}>
                      <Text style={[styles.modalDetailsSpells, { fontSize: fontSize }]}>
                        {t('Range: \n')} {selectedSpell.range}
                      </Text>

                    </View>

                    <View style={styles.columnSpells}>

                      <Text style={[styles.modalDetailsSpells, { fontSize: fontSize }]}>
                        {t('Components: \n')} {selectedSpell.components?.join(', ')}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.itemDescriptionSpell, { fontSize: fontSize }]}>
                    {selectedSpell.description}
                  </Text>

                  {selectedSpell.atHigherLevels && selectedSpell.atHigherLevels !== ' ' && (
                    <Text style={[styles.itemDescription, { fontSize: fontSize }]}>
                      {t('At Higher Levels')}: {selectedSpell.atHigherLevels}
                    </Text>
                  )}

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      onPress={() => setIsEditing(true)}
                      style={[styles.editButton, { padding: 10 * scaleFactor }]}
                    >
                      <Text style={[styles.editButtonText, { fontSize: fontSize }]}>{t('Edit')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={closeSpellModal}
                      style={[styles.closeButtonItem, { padding: 10 * scaleFactor }]}
                    >
                      <Text style={[styles.closeButtonText, { fontSize: fontSize }]}>{t('Close')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={[styles.itemModal, { padding: 20 * scaleFactor }]}>
                  <TextInput
                    style={[styles.itemTitle, { fontSize: fontSize * 1.2 }]}
                    value={editedSpell.name}
                    onChangeText={(value) => handleEditChange('name', value)}
                    placeholder={t('Spell Name')}
                  />

                  <View style={styles.twoColumnContainer}>
                    <View style={styles.columnSpells}>
                      <Picker
                        selectedValue={editedSpell.level}
                        onValueChange={(value) => handleEditChange('level', value)}
                        style={[
                          styles.pickerItemsA,
                          { width: 150 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] },
                        ]}
                      >
                        <Picker.Item label={t('Cantrip')} value="Cantrip" />
                        {[...Array(9)].map((_, index) => (
                          <Picker.Item key={index} label={`${index + 1}th`} value={`${index + 1}th`} />
                        ))}
                      </Picker>

                      <Picker
                        selectedValue={editedSpell.school}
                        onValueChange={(value) => handleEditChange('school', value)}
                        style={[
                          styles.pickerItemsA,
                          { width: 150 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] },
                        ]}
                      >
                        {['Evocation', 'Necromancy', 'Abjuration', 'Divination', 'Illusion', 'Enchantment', 'Transmutation'].map(
                          (school) => (
                            <Picker.Item key={school} label={t(school)} value={school} />
                          )
                        )}
                      </Picker>
                    </View>

                    <View style={styles.columnSpells}>
                      <TextInput
                        style={[styles.modalDetails, { fontSize: fontSize }]}
                        value={editedSpell.castingTime}
                        onChangeText={(value) => handleEditChange('castingTime', value)}
                        placeholder={t('Casting Time')}
                        placeholderTextColor="#808080"
                      />
                      <TextInput
                        style={[styles.modalDetails, { fontSize: fontSize }]}
                        value={editedSpell.duration}
                        onChangeText={(value) => handleEditChange('duration', value)}
                        placeholder={t('Duration')}
                        placeholderTextColor="#808080"
                      />
                    </View>

                    <View style={styles.columnSpells}>
                      <TextInput
                        style={[styles.modalDetails, { fontSize: fontSize }]}
                        value={editedSpell.range}
                        onChangeText={(value) => handleEditChange('range', value)}
                        placeholder={t('Range')}
                        placeholderTextColor="#808080"
                      />
                    </View>

                    <View style={styles.columnSpells}>
                      <TextInput
                        style={[styles.modalDetails, { fontSize: fontSize }]}
                        value={editedSpell.components?.join(', ')}
                        onChangeText={(value) => handleEditChange('components', value.split(', '))}
                        placeholder={t('Components')}
                        placeholderTextColor="#808080"
                      />
                    </View>
                  </View>

                  <TextInput
                    style={[styles.itemDescription, { fontSize: fontSize }]}
                    value={editedSpell.description}
                    onChangeText={(value) => handleEditChange('description', value)}
                    placeholder={t('Description')}
                    placeholderTextColor="#808080"
                    multiline
                  />
                  {editedSpell.atHigherLevels && (
                    <TextInput
                      style={[styles.itemDescription, { fontSize: fontSize }]}
                      value={editedSpell.atHigherLevels}
                      onChangeText={(value) => handleEditChange('atHigherLevels', value)}
                      placeholder={t('At Higher Levels')}
                      placeholderTextColor="#808080"
                      multiline
                    />
                  )}

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      onPress={() => setIsEditing(false)}
                      style={[styles.closeButtonItem, { padding: 10 * scaleFactor }]}
                    >
                      <Text style={[styles.closeButtonText, { fontSize: fontSize }]}>{t('Cancel')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={deleteSpell}
                      style={[styles.deleteButtonSpell, { padding: 10 * scaleFactor }]}
                    >
                      <Text style={[styles.editButtonText, { fontSize: fontSize }]}>{t('Delete')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={saveSpellChanges}
                      style={[styles.editButton, { padding: 10 * scaleFactor }]}
                    >
                      <Text style={[styles.editButtonText, { fontSize: fontSize }]}>{t('Save')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </Modal>
        )}


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

export default Spells;