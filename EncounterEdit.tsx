import React, { useState, useContext,useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { UserData } from './UserData';
import { EncounterDto } from './dataModels/encounterDto'

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
  const [monstersEXP, setMonstersEXP] = useState([]);
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

const getChallengeRating = (baseID) => {
    if (!bestiary || !Array.isArray(bestiary)) {
        return null;
          }
      const monster = bestiary.find(m => m.id === baseID);
      return monster ? monster.challengeRating : null;
};

useEffect(() => {
    const newMonsterEXP = encounter.entities.map(entity => {
      const challengeRating = getChallengeRating(entity.baseID);
      return challengeRating !== null ? challengeRating : 0;
    });
    setMonstersEXP(newMonsterEXP);
  }, []);

  const applyFilters = () => {
    let filtered = bestiary;

    if (minCr || maxCr) {
      filtered = filtered.filter((bestiary) => {
        const crValue = parseFloat(bestiary.challengeRating.replace('/', '.'));
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
     console.log(JSON.stringify(updatedEncounter));
    const response = await fetch(`http://${ipv4}:8000/encounters/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(updatedEncounter),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(updatedEncounter)
    console.log('Updated encounter:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};


  const updateEncounters=()=>{
      const players = encounter.players == null ? [] : encounter.players;
      const { adjustedXP } = calculateEncounterXP();
      const updatedEncounter = {
          id: encounter.id,
          title: encounter.title,
          entities: monsters,
          players: players,
          campaignID: encounter.campaignID,
          ownerID: encounter.ownerID,
          XP:adjustedXP
        };

      setUpdate(updatedEncounter)
      navigation.navigate('Encounters',{campaign:campaign});
      };

  const handleGoBack = () => {
    navigation.goBack();
  };

const calculateEncounterXP = () => {
      if (!monstersEXP || monstersEXP === 0) {
          return { totalXP: 0, adjustedXP: 0, multiplier: 1 };
        }

    let totalXP = 0;
    monstersEXP.forEach((entity) => {
      const challengeRating = entity;
       if (challengeRating && typeof challengeRating === 'string') {
      const xpStr = challengeRating.split("(")[1].replace("xp)", "").trim();
      totalXP += parseInt(xpStr, 10);
      }
    });
    const numEntities = monstersEXP.length;
    let multiplier = 1;

    if (numEntities === 2) multiplier = 1.5;
    else if (numEntities >= 3 && numEntities <= 6) multiplier = 2;
    else if (numEntities >= 7 && numEntities <= 10) multiplier = 2.5;
    else if (numEntities >= 11 && numEntities <= 14) multiplier = 3;
    else if (numEntities >= 15) multiplier = 4;

    const adjustedXP = totalXP * multiplier;

    return { totalXP, adjustedXP, multiplier };
  };


  const addMonster = (monster) => {
      const newEntity = {
            baseID: monster.id,
            actualHP: monster.averageHitPoints,
            effects: [],
            name: monster.name,
          };
          const newChallengeRating = getChallengeRating(newEntity.baseID);

        setMonstersEXP(prevMonsterEXP => [...prevMonsterEXP, newChallengeRating]);
        setMonsters([...monsters, newEntity]);

  };

  const deleteMonster = (index) => {
    const updated = monsters.filter((_, i) => i !== index);
    const updated2 = monstersEXP.filter((_, i) => i !== index);
    setMonsters(updated);
    setMonstersEXP(updated2)
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
      <Text style={[styles.encounterName, { color: theme.fontColor, textAlign: 'center', fontSize: fontSize * 1.5 }]}>{encounter.title}</Text>
      <Text style={[styles.encounterNameA, { color: theme.fontColor, textAlign: 'center', fontSize: fontSize }]}>{t('Recommended level')}: {encounter.level}</Text>
     </View>

      <View style={[styles.monstersList, { marginTop: 50 * scaleFactor }]}>
        <Text style={[styles.sectionTitleEncounter, { fontSize: fontSize * 1.2 }]}>{t('Current Monsters')}:</Text>
        <FlatList
          data={monsters}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.monsterRow}>
              <Text style={[styles.monsterText, { fontSize: fontSize }]}>{item.name}</Text>

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

