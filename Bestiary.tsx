import React, { useState, useContext } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { UserData } from './UserData';

Appearance.setColorScheme('light');



const Bestiary = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [searchText, setSearchText] = useState('');
  const [selectedCR, setSelectedCR] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedEnvironment, setSelectedEnvironment] = useState('All');
  const [selectedFeat, setSelectedFeat] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeat, setEditedFeat] = useState(null);

  const { ipv4 } = useContext(UserData)
  const crOptions = ["0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                      "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22",
                      "23", "24", "25", "26", "27", "28", "29", "30"];
  const [typeOptions,setTypeOptions] = useState([])
  const [environmentOptions,setEnvironmentOptions] = useState([])

  useEffect(() => {
        fetchData();
      }, []);

  const fetchData = async () => {
        try {
            const [bestiariesResponse, environmentsResponse, monsterTypeResponse] = await Promise.all([
              fetch(`http://${ipv4}:8000/bestiaries/all`),
              fetch(`http://${ipv4}:8000/environments/all`),
              fetch(`http://${ipv4}:8000/monster_types/all`)
            ]);

            if (!bestiariesResponse.ok || !environmentsResponse.ok || !monsterTypeResponse.ok) {
              throw new Error('Failed to fetch data');
            }

            const feats = await bestiariesResponse.json();
            const environmentData = await environmentsResponse.json();
            const typeData = await monsterTypeResponse.json();
            setFeats(feats);
            setEnvironmentOptions(environmentOptions);
            setTypeOptions(typeData);
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
        feat.environment && feat.environment.includes(selectedEnvironment)
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
    const index = feats.findIndex((feat) => feat.id === editedFeat.id);
    if (index !== -1) {
      feats[index] = { ...editedFeat };
    }

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

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder={t('Search feats')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.pickerItemsContainer}>
        <Picker
          selectedValue={selectedType}
          style={styles.pickerItems}
          onValueChange={(value) => setSelectedType(value)}
        >
          <Picker.Item label={t('Type')} value={'All'} />
          {typeOptions.map((monsterType) => (
            <Picker.Item key={monsterType.id} label={t(monsterType.name)} value={monsterType.name} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedCR}
          style={styles.pickerItems}
          onValueChange={(value) => setSelectedCR(value)}
        >
          <Picker.Item label={t('CR')} value={'All'} />
          {crOptions.map((cr) => (
            <Picker.Item key={cr} label={t('CR') + ' ' + cr} value={cr} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedEnvironment}
          style={styles.pickerItems}
          onValueChange={(value) => setSelectedEnvironment(value)}
        >
         <Picker.Item label={t('Environment')} value={'All'} />
           {environmentOptions.map((env) => (
             <Picker.Item key={env.id} label={t(env.name)} value={env.name} />
         ))}
        </Picker>
      </View>

      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Type')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('CR')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Source')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Details')}</Text>
        </View>
        {filteredFeats.length === 0 ? (
          <Text style={styles.noResultsText}>{t('No feats found')}</Text>
        ) : (
          filteredFeats.map((feat, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{feat.name}</Text>
            <Text style={styles.tableCell}>{feat.monsterType}</Text>
            <Text style={styles.tableCell}>{feat.challengeRating}</Text>
            <Text style={styles.tableCell}>{feat.source}</Text>
            <TouchableOpacity
              style={[styles.tableCell, styles.actionsColumn]}
              onPress={() => handleFeatPress(feat)}
            >
              <Text style={styles.actionText}>{t('Details')}</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>

      <Modal visible={!!selectedFeat} transparent={true} animationType="slide" onRequestClose={closeFeatModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentFeats}>
            {isEditing ? (
              <ScrollView>
                <View style={styles.rowContainer}>
                  <View style={styles.additionalInfoTitleA}>
                    <TextInput
                      style={styles.modalSubTitleFeats}
                      value={editedFeat?.name || ''}
                      onChangeText={(value) => handleEditChange('name', value)}
                    />
                  </View>
                  <View style={styles.additionalInfoTitleA}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.modalSubTitleFeats}>{t('CR')}: </Text>
                        <TextInput
                          style={styles.modalSubTitleFeats}
                          value={editedFeat?.challengeRating?.toString() || ''}
                          onChangeText={(value) => handleEditChange('cr', value)}
                          keyboardType="numeric"
                        />
                  </View>
                  </View>
                  <View style={styles.additionalInfoTitleA}>
                    <View style={styles.rowContainer}>
                    <Text style={styles.modalSubTitleFeats}>{t('Initiative')}: </Text>
                    <TextInput
                      style={styles.modalSubTitleFeats}
                      value={editedFeat?.initiative?.toString() || '5'}
                      onChangeText={(value) => handleEditChange('initiative', value)}
                      keyboardType="numeric"
                    />
                  </View>
                  </View>
                </View>

                <View style={styles.rowContainer}>
                  {selectedFeat?.image && (
                    <ImageBackground source={{ uri: selectedFeat.image }} style={styles.modalImage} />
                  )}
                  <View style={styles.infoColumn}>
                    <View style={styles.statsRow}>
                      <Text style={styles.statValue}>{t('HP')}</Text>
                      <View style={styles.statCircleA}>
                        <TextInput
                          style={styles.statValue}
                          value={editedFeat?.averageHitPoints?.toString() + ' (' + editedFeat?.averageHitPoints?.toString() + ' ' + editedFeat?.hitPointDiceCount?.toString() + ' ' + editedFeat?.hitPointDiceType?.toString() + ' + ' + editedFeat?.hitPointModifier?.toString() + ')'  || ''}
                          onChangeText={(value) => handleEditChange('hp', value)}
                          keyboardType="numeric"
                        />
                      </View>
                      <Text style={styles.statValue}>{t('AC')}</Text>
                      <View style={styles.statCircleA}>
                        <TextInput
                          style={styles.statValue}
                          value={editedFeat?.armorClass || ''}
                          onChangeText={(value) => handleEditChange('ac', value)}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <View style={styles.additionalInfoA}>
                      <View style={styles.rowContainer}>
                      <Text style={styles.featStatSmall}>{t('Type')}: </Text>
                      <TextInput
                        style={styles.featStatSmall}
                        value={editedFeat?.monsterType || ''}
                        onChangeText={(value) => handleEditChange('type', value)}
                      />
                    </View>
                    </View>
                    <View style={styles.additionalInfoA}>
                      <View style={styles.rowContainer}>
                      <Text style={styles.featStatSmall}>{t('Alignment')}: </Text>
                      <TextInput
                        style={styles.featStatSmall}
                        value={editedFeat?.alignment || ''}
                        onChangeText={(value) => handleEditChange('alignment', value)}
                      />
                    </View>
                    </View>
                    <View style={styles.additionalInfoA}>
                      <View style={styles.rowContainer}>
                      <Text style={styles.featStatSmall}>{t('Speed')}: </Text>
                      <TextInput
                        style={styles.featStatSmall}
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
                          <Text style={styles.statLabel}>{stat.slice(0, 3).toUpperCase()}: </Text>
                          <TextInput
                            style={styles.statLabel}
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
                  <Text style={styles.actionDescription}>{t('Skills')}: </Text>
                  <TextInput
                    style={styles.actionDescription}
                    value={editedFeat?.skills || ''}
                    onChangeText={(value) => handleEditChange('skills', value)}
                  />
                </View>
                <View style={styles.additionalInfo}>
                  <Text style={styles.actionDescription}>{t('Senses')}: </Text>
                  <TextInput
                    style={styles.actionDescription}
                    value={editedFeat?.passivePerception || ''}
                    onChangeText={(value) => handleEditChange('senses', value)}
                  />
                </View>
                <View style={styles.additionalInfo}>
                  <Text style={styles.actionDescription}>{t('Languages')}: </Text>
                  <TextInput
                    style={styles.actionDescription}
                    value={editedFeat?.languageNoteOverride || ''}
                    onChangeText={(value) => handleEditChange('languages', value)}
                  />
                </View>

                <View style={styles.additionalInfo}>
                  <Text style={styles.actionName}>{t('Actions')}:</Text>
                  {editedFeat?.actions.map((action, index) => (
                    <View key={index} style={styles.actionContainer}>
                      <Text style={styles.actionName}>{action.name}:</Text>
                      <TextInput
                        style={styles.actionDescription}
                        value={action.description}
                        onChangeText={(value) => handleActionChange(index, value)}
                        placeholder={t('Description')}
                        multiline
                      />
                    </View>
                  ))}
                </View>

                <View style={styles.additionalInfo}>
                  <Text style={styles.actionName}>{t('Features')}:</Text>
                  {editedFeat?.features.map((feature, index) => (
                    <View key={index} style={styles.featureContainerFeats}>
                      <Text style={styles.featureName}>{feature.name}:</Text>
                      <TextInput
                        style={styles.featureDescription}
                        value={feature.description}
                        onChangeText={(value) => handleFeatureChange(index, value)}
                        placeholder={t('Description')}
                        multiline
                      />
                    </View>
                  ))}
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveFeatChanges} style={styles.editButton}>
                    <Text style={styles.editButtonText}>{t('Save')}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <ScrollView>
                <View style={styles.featsContainerColumn}>
              <View style={styles.additionalInfoTitle}>
                <Text style={styles.modalSubTitleFeats}>{selectedFeat?.name}</Text>
                </View>
              <View style={styles.additionalInfoTitle}>
                <Text style={styles.modalSubTitleFeats}>{t('CR')}: {selectedFeat?.challengeRating}</Text>
                </View>
              <View style={styles.additionalInfoTitle}>
                <Text style={styles.modalSubTitleFeats}>{t('Initiative')}: {selectedFeat?.initiative}</Text>
                </View>
                </View>


                  <View style={styles.rowContainer}>
                    {selectedFeat?.image && (
                      <ImageBackground source={{ uri: selectedFeat.image }} style={styles.modalImage} />
                    )}

                    <View style={styles.infoColumn}>
                      <View style={styles.statsRow}>
                        <View style={styles.statCircle}>
                          <Text style={styles.statValue}>{t('HP')}</Text>
                          <Text style={styles.statValue}>{selectedFeat?.averageHitPoints}</Text>
                        </View>
                        <View style={styles.statCircle}>
                          <Text style={styles.statValue}>{t('AC')}</Text>
                          <Text style={styles.statValue}>{selectedFeat?.armorClass}</Text>
                        </View>
                      </View>
                 <View style={styles.additionalInfo}>
                      <Text style={styles.featStatSmall}>{selectedFeat?.monsterType}</Text>
                    </View>
                <View style={styles.additionalInfo}>
                      <Text style={styles.featStatSmall}>{selectedFeat?.alignment}</Text>
                    </View>
                <View style={styles.additionalInfo}>
                      <Text style={styles.featStatSmall}>{t('Speed')}: {selectedFeat?.speed}</Text>
                    </View>
                    </View>
                  </View>


                <View style={styles.statsContainerFeatsB}>
                <View style={styles.statsContainerFeatsA}>
                  {['strScore', 'dexScore', 'conScore', 'intScore', 'wisScore', 'chaScore'].map((statbonus) => (
                    <View key={statbonus} style={styles.statBlock}>
                      <Text style={styles.statValue}>{Math.floor((selectedFeat?.[statbonus]-10)/2)}</Text>
                          </View>
                  ))}
                </View>
                <View style={styles.statsContainerFeats}>
                  {['strScore', 'dexScore', 'conScore', 'intScore', 'wisScore', 'chaScore'].map((stat) => (
                    <View key={stat} style={styles.statBlock}>
                      <Text style={styles.statLabel}>{stat.slice(0, 3).toUpperCase()}: {selectedFeat?.[stat]}</Text>
                    </View>
                  ))}
                </View>
                </View>

                <View style={styles.additionalInfo}>
                  <Text style={styles.actionDescription}>{t('Skills')}: {selectedFeat?.skills}</Text>
                </View>
                <View style={styles.additionalInfo}>
                  <Text style={styles.actionDescription}>{t('Senses')}: {selectedFeat?.passivePerception}</Text>
                </View>
                <View style={styles.additionalInfo}>
                  <Text style={styles.actionDescription}>{t('Languages')}: {selectedFeat?.languageNoteOverride.join(', ')}</Text>
                </View>

                <View style={styles.additionalInfo}>
                      <Text style={styles.actionDescription}>{selectedFeat?.actionDescription}</Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => handleEditFeat(selectedFeat)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>{t('Edit')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={closeFeatModal} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Close')}</Text>
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

export default Bestiary
