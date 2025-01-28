import React, { useState, useContext,useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { UserData } from './UserData';

Appearance.setColorScheme('light');

const EncounterEdit: React.FC = ({ route, navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { ipv4 } = useContext(UserData);
  const { campaign } = route.params;
  const { encounter } = route.params;
  const [bestiary,setBestiary]= useState({});
  const [monsters, setMonsters] = useState(encounter.entities || []);
  const [searchText, setSearchText] = useState('');
  const [filteredMonsters, setFilteredMonsters] = useState({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const crOptions = ["0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22",
                        "23", "24", "25", "26", "27", "28", "29", "30"];
  const [minCr, setMinCr] = useState('');
  const [maxCr, setMaxCr] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('');

  useEffect(() => {
        fetchData();
      }, []);


  const applyFilters = () => {
    let filtered = bestiary;

    if (minCr || maxCr) {
      filtered = filtered.filter((bestiary) => {
        const crValue = parseFloat(bestiary.challangeRating.replace('/', '.'));
        const min = minCr ? parseFloat(minCr.replace('/', '.')) : -Infinity;
        const max = maxCr ? parseFloat(maxCr.replace('/', '.')) : Infinity;
        return crValue >= min && crValue <= max;
      });
    }
    if (typeFilter) {
      filtered = filtered.filter((bestiary) =>
        monster.type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }
    if (environmentFilter) {
      filtered = filtered.filter((bestiary) =>
        monster.environments.some((env) =>
          env.toLowerCase().includes(environmentFilter.toLowerCase())
        )
      );
    }
    if (searchText) {
      filtered = filtered.filter((bestiary) =>
        monster.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredMonsters(filtered);
  };
const fetchData = async () => {
        try {
            const [bestiariesResponse, environmentsResponse, monsterTypeResponse] = await Promise.all([
              fetch(`http://${ipv4}:8000/bestiaries/all/10`),
              fetch(`http://${ipv4}:8000/environments/all`),
              fetch(`http://${ipv4}:8000/monster_types/all`)
            ]);

            if (!bestiariesResponse.ok || !environmentsResponse.ok || !monsterTypeResponse.ok) {
              throw new Error('Failed to fetch data');
            }

            const feats = await bestiariesResponse.json();

            const environmentData = await environmentsResponse.json();
            const typeData = await monsterTypeResponse.json();
            setFilteredMonsters(feats);
            setEnvironmentFilter(environmentData);
            setTypeFilter(typeData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
  const resetFilters = () => {
    setMinCr('');
    setMaxCr('');
    setTypeFilter('');
    setEnvironmentFilter('');
    setSearchText('');
    setFilteredMonsters(bestiary);
  };
const setUpdate = async (updatedEncounter) => {
  try {
    const response = await fetch(`http://${ipv4}:8000/encounters/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        item_id: updatedEncounter.id,
        item: updatedEncounter.toString(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const result = await response.json();

    console.log('Updated encounter:', result);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


  const updateEncounters=()=>{
      const updatedEncounter = { ...encounter, entities: monsters };
      setUpdate(updatedEncounter)
      navigation.navigate('Encounters',{campaign:campaign});
      };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const addMonster = (monster) => {
      const newEntity = {
            base: monster,
            actualHP: parseInt(monster.averageHitPoints),
            effects: [],
          };
          setMonsters([...monsters, newEntity]);
  };

  const updateMonsterCount = (name, delta) => {
    const updated = monsters.map((monster) =>
      monster.name === name
        ? { ...monster, count: Math.max(1, monster.count + delta) }
        : monster
    );
    setMonsters(updated);
  };

  const deleteMonster = (index) => {
    const updated = monsters.filter((_, i) => i !== index);
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
          renderItem={({ item, index }) => (
            <View style={styles.monsterRow}>
              <Text style={[styles.monsterTextA, { fontSize: fontSize }]}>{item.base.name}</Text>

              <TouchableOpacity onPress={() => deleteMonster(index)}>
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
        style={[styles.searchInputEncounters, { height: 40 * scaleFactor, fontSize: fontSize }]}
        placeholder={t('Search monsters...')}
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
            <Text style={[styles.monsterTextA, { fontSize: fontSize }]}>{item.name}</Text>
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
        onPress={() => updateEncounters()}
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
            placeholder={t('Min CR (e.g., 1/4)')}
            value={minCr}
            placeholderTextColor="#808080"
            onChangeText={setMinCr}
          />
          <TextInput
            style={[styles.filterInput, { height: 40 * scaleFactor, fontSize: fontSize }]}
            placeholder={t('Max CR (e.g., 2)')}
            value={maxCr}
            placeholderTextColor="#808080"
            onChangeText={setMaxCr}
          />
         </View>
         <View style={styles.column}>
          <TextInput
            style={[styles.filterInput, { height: 40 * scaleFactor, fontSize: fontSize }]}
            placeholder={t('Type (e.g., Beast)')}
            value={typeFilter}
            placeholderTextColor="#808080"
            onChangeText={setTypeFilter}
          />
          <TextInput
            style={[styles.filterInput, { height: 40 * scaleFactor, fontSize: fontSize }]}
            placeholder={t('Environment (e.g., Forest)')}
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
