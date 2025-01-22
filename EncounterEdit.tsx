import React, { useState, useContext } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import bestiary from './assets/Library/bestiary.json';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const EncounterEdit: React.FC = ({ route, navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { encounter } = route.params;
  const [monsters, setMonsters] = useState(encounter.monsters || []);
  const [searchText, setSearchText] = useState('');
  const [filteredMonsters, setFilteredMonsters] = useState(bestiary);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [minCr, setMinCr] = useState('');
  const [maxCr, setMaxCr] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('');

  const applyFilters = () => {
    let filtered = bestiary;

    if (minCr || maxCr) {
      filtered = filtered.filter((monster) => {
        const crValue = parseFloat(monster.cr.replace('/', '.'));
        const min = minCr ? parseFloat(minCr.replace('/', '.')) : -Infinity;
        const max = maxCr ? parseFloat(maxCr.replace('/', '.')) : Infinity;
        return crValue >= min && crValue <= max;
      });
    }
    if (typeFilter) {
      filtered = filtered.filter((monster) =>
        monster.type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }
    if (environmentFilter) {
      filtered = filtered.filter((monster) =>
        monster.environment.some((env) =>
          env.toLowerCase().includes(environmentFilter.toLowerCase())
        )
      );
    }
    if (searchText) {
      filtered = filtered.filter((monster) =>
        monster.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredMonsters(filtered);
  };

  const resetFilters = () => {
    setMinCr('');
    setMaxCr('');
    setTypeFilter('');
    setEnvironmentFilter('');
    setSearchText('');
    setFilteredMonsters(bestiary);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const addMonster = (monster) => {
    const existing = monsters.find((m) => m.name === monster.name);
    if (existing) {
      existing.count++;
      setMonsters([...monsters]);
    } else {
      setMonsters([...monsters, { ...monster, count: 1 }]);
    }
  };

  const updateMonsterCount = (name, delta) => {
    const updated = monsters.map((monster) =>
      monster.name === name
        ? { ...monster, count: Math.max(1, monster.count + delta) }
        : monster
    );
    setMonsters(updated);
  };

  const deleteMonster = (name) => {
    const updated = monsters.filter((monster) => monster.name !== name);
    setMonsters(updated);
  };

  const applySearch = (text) => {
    const searchQuery = text.toLowerCase();
    const filtered = bestiary.filter((monster) =>
      monster.name.toLowerCase().includes(searchQuery)
    );
    setFilteredMonsters(filtered);
  };

  return (
    <ImageBackground source={theme.background} style={styles.containerEncounter}>

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

     <View style={styles.encounterNameB}>
      <Text style={[styles.encounterName, { color: theme.fontColor, textAlign: 'center', fontSize: fontSize * 1.5 }]}>{encounter.name}</Text>
      <Text style={[styles.encounterNameA, { color: theme.fontColor, textAlign: 'center', fontSize: fontSize }]}>{t('Recommended level')}: {encounter.level}</Text>
     </View>

      <View style={[styles.monstersList, { marginTop: 50 * scaleFactor }]}>
        <Text style={[styles.sectionTitleEncounter, { fontSize: fontSize * 1.2 }]}>{t('Current Monsters')}:</Text>
        <FlatList
          data={monsters}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.monsterRow}>
              <Text style={[styles.monsterText, { fontSize: fontSize }]}>{item.name}</Text>
              <TouchableOpacity onPress={() => updateMonsterCount(item.name, -1)}>
                <Text style={[styles.controlButton, { fontSize: fontSize }]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.monsterCount, { fontSize: fontSize }]}>x{item.count}</Text>
              <TouchableOpacity onPress={() => updateMonsterCount(item.name, 1)}>
                <Text style={[styles.controlButton, { fontSize: fontSize }]}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteMonster(item.name)}>
                <Text style={[styles.deleteButtonNewColor, { fontSize: fontSize }]}>{t('Delete')}</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.monstersListContainer}
        />
      </View>

      <View style={styles.middleEncounterCont}>
        <View style={styles.rowContainer}>
      <TouchableOpacity
        style={styles.filterEncounter}
        onPress={() => setFilterModalVisible(!filterModalVisible)}
      >
        <Text style={[styles.filterEncounterText, { fontSize: fontSize }]}>{t('Filter')}</Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.searchInputEncounters, { height: 50 * scaleFactor, fontSize: fontSize }]}
        placeholder="Search monsters..."
        placeholderTextColor="#fff"
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          applySearch(text);
        }}
      />
      </View>

      <FlatList
        data={filteredMonsters}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.monsterRow}>
            <Text style={[styles.monsterText, { fontSize: fontSize }]}>{item.name}</Text>
            <TouchableOpacity onPress={() => addMonster(item)}>
              <Text style={[styles.controlButton, { fontSize: fontSize }]}>{t('Add')}</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.monstersListContainer}
      />
      </View>

      <TouchableOpacity
        style={styles.saveButtonEncounters}
        onPress={() => {
          const updatedEncounter = { ...encounter, monsters };
          navigation.navigate('Encounters', { updatedEncounter });
        }}
      >
        <Text style={[styles.saveButtonTextEncounters, { fontSize: fontSize }]}>{t('Save')}</Text>
      </TouchableOpacity>

      {filterModalVisible && (
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitleEncounter, { fontSize: fontSize * 1.5 }]}>{t('Filter Options')}</Text>

        <View style={styles.twoColumnContainer}>
         <View style={styles.column}>
          <TextInput
            style={[styles.filterInput, { height: 40 * scaleFactor, fontSize: fontSize }]}
            placeholder="Min CR (e.g., 1/4)"
            value={minCr}
            placeholderTextColor="#808080"
            onChangeText={setMinCr}
          />
          <TextInput
            style={[styles.filterInput, { height: 40 * scaleFactor, fontSize: fontSize }]}
            placeholder="Max CR (e.g., 2)"
            value={maxCr}
            placeholderTextColor="#808080"
            onChangeText={setMaxCr}
          />
         </View>
         <View style={styles.column}>
          <TextInput
            style={[styles.filterInput, { height: 40 * scaleFactor, fontSize: fontSize }]}
            placeholder="Type (e.g., Beast)"
            value={typeFilter}
            placeholderTextColor="#808080"
            onChangeText={setTypeFilter}
          />
          <TextInput
            style={[styles.filterInput, { height: 40 * scaleFactor, fontSize: fontSize }]}
            placeholder="Environment (e.g., Forest)"
            value={environmentFilter}
            placeholderTextColor="#808080"
            onChangeText={setEnvironmentFilter}
          />
         </View>
        </View>

          <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.applyFilterButton} onPress={applyFilters}>
            <Text style={[styles.applyFilterText, { fontSize: fontSize }]}>{t('Apply Filters')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetFilterButton} onPress={resetFilters}>
            <Text style={[styles.resetFilterText, { fontSize: fontSize }]}>{t('Reset Filters')}</Text>
          </TouchableOpacity>
        </View>
        </View>
      )}

    </ImageBackground>
  );
};

export default EncounterEdit;

