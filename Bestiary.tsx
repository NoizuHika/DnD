import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { UserData } from './UserData';
import { SettingsContext } from './SettingsContext';
import { useAuth } from './AuthContext';

Appearance.setColorScheme('light');

const Bestiary: React.FC = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const [searchText, setSearchText] = useState('');
  const [selectedCR, setSelectedCR] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedEnvironment, setSelectedEnvironment] = useState('All');
  const [selectedFeat, setSelectedFeat] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeat, setEditedFeat] = useState(null);
  const [feats,setFeats]= useState([]);
  const { token } = useAuth();
  const { ipv4 } = useContext(UserData);
  const [userID, setUserID] = useState(null);
  const crOptions = ["0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                      "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22",
                      "23", "24", "25", "26", "27", "28", "29", "30"];
  const [typeOptions,setTypeOptions] = useState([]);
  const [environmentOptions,setEnvironmentOptions] = useState([]);
    const extractActions = (text) => {
        const actionRegex = /(\w+)\.?\s(.+?)(?=(?:\n|Javelin|Summon Air Elemental|\n\n|$))/g;
        let matches = [];
        let match;
        while ((match = actionRegex.exec(text)) !== null) {
          let action = {
            name: match[1],
            description: match[2].trim(),
          };
          const hitRegex = /Hit:\s*(\d+)\s*\(\d+\w+ \+\s*\d+\)/;
          const hitMatch = hitRegex.exec(match[2]);
          if (hitMatch) {
            action.hit = hitMatch[0];
          }
          matches.push(action);
        }
    return matches;
  };
  useEffect(() => {
        fetchData();
      }, []);

  const fetchData = async () => {
        try {
            const [bestiariesResponse, environmentsResponse, monsterTypeResponse,meResponse] = await Promise.all([
              fetch(`http://${ipv4}:8000/bestiaries/all/10`),
              fetch(`http://${ipv4}:8000/environments/all`),
              fetch(`http://${ipv4}:8000/monster_types/all`),
              fetch(`http://${ipv4}:8000/me`,{
                                  method: 'GET',
                                  headers: {
                                      'Content-Type': 'application/json',
                                      'accept': 'application/json',
                                       "Authorization": `Bearer ${token}`
                                  }

                              }),
            ]);

            if (!bestiariesResponse.ok || !environmentsResponse.ok || !monsterTypeResponse.ok || !meResponse) {
              throw new Error('Failed to fetch data');
            }

            const feats = await bestiariesResponse.json();
            const environmentData = await environmentsResponse.json();
            const typeData = await monsterTypeResponse.json();
            const userID = await meResponse.json();
            setFeats(feats);
            setEnvironmentOptions(environmentData);
            setTypeOptions(typeData);
            console.log(userID);
            setUserID(userID.id)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };


  const handleGoBack = () => {
    navigation.goBack();
  };

  const filterFeats = () => {
    let filtered = feats;

    if (searchText) {
      filtered = filtered.filter((feat) =>
        feat.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCR !== 'All') {
      filtered = filtered.filter((feat) => feat.challengeRating.split(" ")[0] === selectedCR);
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter((feat) => feat.monsterType === selectedType);
    }

    if (selectedEnvironment !== 'All') {
      filtered = filtered.filter((feat) =>
        feat.environments && feat.environments.includes(selectedEnvironment)
      );
    }

    return filtered;
  };

  const filteredFeats = filterFeats();

  const handleFeatPress = (feat) => {
    setSelectedFeat(feat);
  };

  const closeFeatModal = () => {
    setSelectedFeat(null);
  };

const setUpdate = async (bestiaryDto) => {
  try {
      console.log(bestiaryDto);
    const response = await fetch(`http://${ipv4}:8000/bestiaries/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(bestiaryDto),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log('Updated Bestiary:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};


  const handleEditFeat = (feat) => {
      setEditedFeat(feat);
    setIsEditing(true);
  };

  const handleEditChange = (field, value) => {
    setEditedFeat((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveFeatChanges = () => {
    const bestiaryDto = {
                id:editedFeat.id,
                name : editedFeat.name,
                challengeRating : editedFeat.challengeRating,
                armorClass : editedFeat.armorClass,
                hitPointDiceCount : editedFeat.hitPointDiceCount,
                hitPointModifier : editedFeat.hitPointModifier,
                averageHitPoints : editedFeat.averageHitPoints,
                passivePerception : editedFeat.passivePerception,
                strScore : editedFeat.strScore,
                dexScore : editedFeat.dexScore,
                intScore : editedFeat.intScore,
                wisScore : editedFeat.wisScore,
                chaScore : editedFeat.chaScore,
                conScore : editedFeat.conScore,
                languageNoteOverride : editedFeat.languageNoteOverride,
                lairDescription : editedFeat.lairDescription,
                legendaryActionDescription : editedFeat.legendaryActionDescription,
                mythicActionDescription : editedFeat.mythicActionDescription,
                actionDescription : editedFeat.actionDescription,
                monsterDescription : editedFeat.monsterDescription,
                alignment : editedFeat.alignment,
                savingThrowProficiencies : editedFeat.savingThrowProficiencies,
                damageAdjustment: Array.isArray(editedFeat.damageAdjustment) ? editedFeat.damageAdjustment : [],
                conditionImmunities : editedFeat.conditionImmunities,
                environments : editedFeat.environments,
                hitPointDiceType : editedFeat.hitPointDiceType,
                monsterType : editedFeat.monsterType,
                monsterSubType : editedFeat.monsterSubType,
                size : editedFeat.size,
                speed : editedFeat.size,
                skills : editedFeat.skills,
                source: editedFeat.source,
              };
          setUpdate(bestiaryDto);
    setIsEditing(false);
    setSelectedFeat(editedFeat);
    if (!editedFeat.name || editedFeat.name.trim() === '') {
      alert(t('Name cannot be empty!'));
      return;
    }
  };

  const handleActionChange = (index, value) => {
    const updatedActions = [...editedFeat.actions];
    updatedActions[index].description = value;
    setEditedFeat({ ...editedFeat, actions: updatedActions });
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...editedFeat.features];
    updatedFeatures[index].description = value;
    setEditedFeat({ ...editedFeat, features: updatedFeatures });
  };

  const deleteBesti = async () => {
        console.log(editedFeat.id)
      try {
        const response = await fetch(`http://${ipv4}:8000/bestiaries/delete/${editedFeat.id}`, {
          method: 'DELETE',
        });
          fetchData();
          setSelectedFeat(null);
              setIsEditing(false);
        if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
              }
       }catch (error) {
            console.error('Error fetching data:', error.message);
          }
    };

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.searchInput, { fontSize: fontSize, height: 40 * scaleFactor }]}
        placeholder={t('Search monster')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.pickerItemsContainer}>
        <Picker
          selectedValue={selectedType}
          style={[styles.pickerItems, { width: 135 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
          onValueChange={(value) => setSelectedType(value)}
        >

          <Picker.Item label={t('Type')} value={'All'} style={{ fontSize: fontSize }} />
          {typeOptions.map((monsterType) => (
            <Picker.Item key={monsterType.id} label={t(monsterType.name)} value={monsterType.name} style={{ fontSize: fontSize }} />

          ))}
        </Picker>

        <Picker
          selectedValue={selectedCR}
          style={[styles.pickerItems, { width: 135 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
          onValueChange={(value) => setSelectedCR(value)}
        >
          <Picker.Item label={t('CR')} value={'All'} style={{ fontSize: fontSize }} />
          {crOptions.map((cr) => (
            <Picker.Item key={cr} label={t('CR') + ' ' + cr} value={cr} style={{ fontSize: fontSize }} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedEnvironment}
          style={[styles.pickerItems, { width: 135 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
          onValueChange={(value) => setSelectedEnvironment(value)}
        >

          <Picker.Item label={t('Environment')} value={'All'} style={{ fontSize: fontSize }} />
          {environmentOptions.map((env) => (
            <Picker.Item key={env.id} label={t(env.name)} value={env.name} style={{ fontSize: fontSize }} />
          ))}

        </Picker>
      </View>

      <ScrollView style={styles.tableContainer}>
        <View style={[styles.tableHeader, { paddingVertical: 10 * scaleFactor }]}>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Type')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('CR')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Source')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Details')}</Text>
        </View>
        {filteredFeats.length === 0 ? (
          <Text style={[styles.noResultsText, { fontSize: fontSize }]}>{t('No monsters found')}</Text>
        ) : (
          filteredFeats.map((feat, index) => (

            <View key={index} style={[styles.tableRow, { paddingVertical: 10 * scaleFactor }]}>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{feat.name}</Text>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{feat.monsterType}</Text>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{feat.challengeRating}</Text>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{feat.source}</Text>
              <TouchableOpacity
                style={[styles.tableCell, styles.actionsColumn]}
                onPress={() => handleFeatPress(feat)}
              >
                <Text style={[styles.actionText, { fontSize: fontSize }]}>{t('Details')}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>


      <Modal visible={!!selectedFeat} transparent={true} animationType="slide" onRequestClose={closeFeatModal}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentFeats, { padding: 20 * scaleFactor }]}>
            {isEditing ? (
              <ScrollView>
                <View style={styles.rowContainer}>
                  <View style={styles.additionalInfoTitleA}>
                    <TextInput
                      style={[styles.modalSubTitleFeats, { fontSize: fontSize * 1.2 }]}
                      value={editedFeat?.name || ''}
                      onChangeText={(value) => handleEditChange('name', value)}
                    />
                  </View>
                  <View style={styles.additionalInfoTitleA}>
                    <View style={styles.rowContainer}>

                      <Text style={[styles.modalSubTitleFeats, { fontSize: fontSize * 1.2 }]}>{t('CR')}: </Text>
                      <TextInput
                        style={[styles.modalSubTitleFeats, { fontSize: fontSize * 1.2 }]}
                        value={editedFeat?.challengeRating?.toString() || ''}
                        onChangeText={(value) => handleEditChange('challengeRating', value)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <View style={styles.additionalInfoTitleA}>
                    <View style={styles.rowContainer}>
                      <Text style={[styles.modalSubTitleFeats, { fontSize: fontSize * 1.2 }]}>{t('Initiative')}: </Text>
                      <TextInput
                        style={[styles.modalSubTitleFeats, { fontSize: fontSize * 1.2 }]}
                        value={editedFeat?.initiative?.toString() || '5'}
                        onChangeText={(value) => handleEditChange('initiative', value)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.rowContainer}>
                  {selectedFeat?.image && (
                    <ImageBackground source={{ uri: selectedFeat.image }} style={[styles.modalImage, { height: 150 * scaleFactor, width: 150 * scaleFactor }]} />
                  )}
                  <View style={styles.infoColumn}>
                    <View style={styles.statsRow}>
                      <Text style={[styles.statValue, { fontSize: fontSize }]}>{t('HP')}</Text>
                      <View style={[styles.statCircleA, { width: 50 * scaleFactor, height: 50 * scaleFactor }]}>
                        <TextInput

                          style={[styles.statValue, { fontSize: fontSize }]}
                          value={editedFeat?.averageHitPoints?.toString() + ' (' + editedFeat?.averageHitPoints?.toString() + ' ' + editedFeat?.hitPointDiceCount?.toString() + ' ' + editedFeat?.hitPointDiceType?.toString() + ' + ' + editedFeat?.hitPointModifier?.toString() + ')' || ''}
                          onChangeText={(value) => handleEditChange('averageHitPoints', value)}

                          keyboardType="numeric"
                        />
                      </View>
                      <Text style={[styles.statValue, { fontSize: fontSize }]}>{t('AC')}</Text>
                      <View style={[styles.statCircleA, { width: 50 * scaleFactor, height: 50 * scaleFactor }]}>
                        <TextInput

                          style={[styles.statValue, { fontSize: fontSize }]}
                          value={editedFeat?.armorClass || ''}
                          onChangeText={(value) => handleEditChange('armorClass', value)}

                        />
                      </View>
                    </View>
                    <View style={styles.additionalInfoA}>
                      <View style={styles.rowContainer}>

                        <Text style={[styles.featStatSmall, { fontSize: fontSize }]}>{t('Type')}: </Text>
                        <TextInput
                          style={[styles.featStatSmall, { fontSize: fontSize }]}
                          value={editedFeat?.monsterType || ''}
                          onChangeText={(value) => handleEditChange('monsterType', value)}
                        />
                      </View>
                    </View>
                    <View style={styles.additionalInfoA}>
                      <View style={styles.rowContainer}>
                        <Text style={[styles.featStatSmall, { fontSize: fontSize }]}>{t('Alignment')}: </Text>
                        <TextInput
                          style={[styles.featStatSmall, { fontSize: fontSize }]}
                          value={editedFeat?.alignment || ''}
                          onChangeText={(value) => handleEditChange('alignment', value)}
                        />
                      </View>
                    </View>
                    <View style={styles.additionalInfoA}>
                      <View style={styles.rowContainer}>
                        <Text style={[styles.featStatSmall, { fontSize: fontSize }]}>{t('Speed')}: </Text>
                        <TextInput
                          style={[styles.featStatSmall, { fontSize: fontSize }]}
                          value={editedFeat?.speed?.toString() || ''}
                          onChangeText={(value) => handleEditChange('speed', value)}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.statsContainerFeatsC}>
                  <View style={styles.statsContainerFeatsD}>
                    {['strScore', 'dexScore', 'conScore', 'intScore', 'wisScore', 'chaScore'].map((stat) => (
                      <View key={stat} style={styles.statBlock}>
                        <View style={styles.rowContainer}>

                          <Text style={[styles.statLabel, { fontSize: fontSize }]}>{stat.slice(0, 3).toUpperCase()}: </Text>
                          <TextInput
                            style={[styles.statLabel, { fontSize: fontSize }]}
                            value={editedFeat?.[stat]?.toString() || ''}
                            onChangeText={(value) => handleEditChange(stat, value)}
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.additionalInfo}>
                  <Text style={[styles.actionDescription, { fontSize: fontSize }]}>{t('Skills')}: </Text>
                  <TextInput
                    style={[styles.actionDescription, { fontSize: fontSize }]}
                    value={editedFeat?.skills || ''}
                    onChangeText={(value) => handleEditChange('skills', value)}
                  />
                </View>
                <View style={styles.additionalInfo}>
                  <Text style={[styles.actionDescription, { fontSize: fontSize }]}>{t('Senses')}: </Text>
                  <TextInput

                    style={[styles.actionDescription, { fontSize: fontSize }]}
                    value={editedFeat?.passivePerception || ''}
                    onChangeText={(value) => handleEditChange('passivePerception', value)}

                  />
                </View>
                <View style={styles.additionalInfo}>
                  <Text style={[styles.actionDescription, { fontSize: fontSize }]}>{t('Languages')}: </Text>
                  <TextInput
                    style={styles.actionDescription, { fontSize: fontSize }}
                    value={editedFeat?.languageNoteOverride.join(', ') || ''}
                    onChangeText={(value) => handleEditChange(
                                                     'languageNoteOverride',
                                                     value.split(',').map(item => item.trim())
                                                   )
                                                 }
                  />
                </View>

                <View style={styles.additionalInfo}>

                  <Text style={[styles.actionName, { fontSize: fontSize }]}>{t('Actions')}: </Text>
                  <TextInput
                    style={styles.actionDescription}
                    value={editedFeat?.actionDescription || ''}
                    onChangeText={(value) => handleEditChange('actionDescription', value)}
                  />

                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.closeButtonItem}>
                    <Text style={[styles.closeButtonText, { fontSize: fontSize }]}>{t('Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={deleteBesti} style={[styles.deleteButtonSpell, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.editButtonText, { fontSize: fontSize }]}>{t('Delete')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveFeatChanges} style={styles.editButton}>
                    <Text style={[styles.editButtonText, { fontSize: fontSize }]}>{t('Save')}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <ScrollView>
                <View style={styles.featsContainerColumn}>
                  <View style={styles.additionalInfoTitle}>
                    <Text style={[styles.modalSubTitleFeats, { fontSize: fontSize * 1.2 }]}>{selectedFeat?.name}</Text>
                  </View>
                  <View style={styles.additionalInfoTitle}>
                    <Text style={[styles.modalSubTitleFeats, { fontSize: fontSize * 1.2 }]}>{t('CR')}: {selectedFeat?.challengeRating}</Text>
                  </View>
                  <View style={styles.additionalInfoTitle}>
                    <Text style={[styles.modalSubTitleFeats, { fontSize: fontSize * 1.2 }]}>{t('Initiative')}: {selectedFeat?.initiative}</Text>
                  </View>
                </View>

                <View style={styles.rowContainer}>
                  {selectedFeat?.image && (
                    <ImageBackground source={{ uri: selectedFeat.image }} style={[styles.modalImage, { height: 150 * scaleFactor, width: 150 * scaleFactor }]} />
                  )}
                  <View style={styles.infoColumn}>
                    <View style={styles.statsRow}>
                      <View style={styles.statLeft}>
                        <Text style={[styles.statValue, { fontSize: fontSize }]}>{t('HP')}</Text>
                        <Text style={[styles.statValue, { fontSize: fontSize }]}>{selectedFeat?.averageHitPoints}</Text>
                      </View>
                      <View style={styles.dividerStats} />
                      <View style={styles.statRight}>
                        <Text style={[styles.statValue, { fontSize: fontSize }]}>{t('AC')}</Text>
                        <Text style={[styles.statValue, { fontSize: fontSize }]}>{selectedFeat?.armorClass}</Text>
                      </View>
                    </View>
                    <View style={styles.additionalInfo}>
                      <Text style={[styles.featStatSmall, { fontSize: fontSize }]}>{selectedFeat?.monsterType}</Text>
                    </View>
                    <View style={styles.additionalInfo}>
                      <Text style={[styles.featStatSmall, { fontSize: fontSize }]}>{selectedFeat?.alignment}</Text>
                    </View>
                    <View style={styles.additionalInfo}>
                      <Text style={[styles.featStatSmall, { fontSize: fontSize }]}>{t('Speed')}: {selectedFeat?.speed}</Text>
                    </View>
                  </View>
                </View>


                <View style={styles.statsContainerFeatsB}>
                  <View style={styles.statsContainerFeatsA}>
                    {['strScore', 'dexScore', 'conScore', 'intScore', 'wisScore', 'chaScore'].map((statbonus) => (
                      <View key={statbonus} style={styles.statBlock}>
                        <Text style={[styles.statValue, { fontSize: fontSize }]}>{Math.floor((selectedFeat?.[statbonus] - 10) / 2)}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.statsContainerFeats}>
                    {['strScore', 'dexScore', 'conScore', 'intScore', 'wisScore', 'chaScore'].map((stat) => (
                      <View key={stat} style={styles.statBlock}>
                        <Text style={[styles.statLabel, { fontSize: fontSize }]}>{stat.slice(0, 3).toUpperCase()}: {selectedFeat?.[stat]}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.additionalInfo}>
                  <Text style={[styles.actionDescription, { fontSize: fontSize }]}>{t('Skills')}: {selectedFeat?.skills}</Text>
                </View>
                <View style={styles.additionalInfo}>
                  <Text style={[styles.actionDescription, { fontSize: fontSize }]}>{t('Senses')}: {selectedFeat?.passivePerception}</Text>
                </View>
                <View style={styles.additionalInfo}>
                  <Text style={[styles.actionDescription, { fontSize: fontSize }]}>{t('Languages')}: {selectedFeat?.languageNoteOverride.join(', ')}</Text>
                </View>

               <View style={styles.additionalInfo}>
                 {extractActions(selectedFeat?.actionDescription).map((action, index) => (
                   <View key={index} style={styles.actionContainer}>
                     <Text style={styles.actionDescription}>{t('Name')}: {action.name}</Text>
                     <Text style={styles.actionDescription}>{t('Description')}: {action.description}</Text>
                     {action.hit && (
                       <TouchableOpacity onPress={() => roll(selectedMonster, action, session)}>
                         <Text style={styles.actionDescriptionA}>{t('Hit')}: {action.hit}</Text>
                       </TouchableOpacity>
                     )}
                   </View>
                 ))}
               </View>

                <View style={styles.modalButtons}>
                {userID === selectedFeat?.ownerID && (
                  <TouchableOpacity onPress={() => handleEditFeat(selectedFeat)} style={styles.editButton}>
                    <Text style={[styles.editButtonText, { fontSize: fontSize }]}>{t('Edit')}</Text>
                  </TouchableOpacity>
                )}
                  <TouchableOpacity onPress={closeFeatModal} style={styles.closeButtonItem}>
                    <Text style={[styles.closeButtonText, { fontSize: fontSize }]}>{t('Close')}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default Bestiary;