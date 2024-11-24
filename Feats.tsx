import React, { useState, useContext } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';

Appearance.setColorScheme('light');

const feats = require('./assets/Library/feats.json');

const Feats = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [searchText, setSearchText] = useState('');
  const [selectedCR, setSelectedCR] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedEnvironment, setSelectedEnvironment] = useState('All');
  const [selectedFeat, setSelectedFeat] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeat, setEditedFeat] = useState(null);

  const crOptions = [0.25, 1, 2, 5, 10, 20, 24];
  const typeOptions = ['Dragon', 'Humanoid', 'Aberration'];
  const environmentOptions = ['Underground', 'Forest', 'Mountains'];

  const categories = ['Type', 'Creature', 'Monster'];
  const environmentCategories = ['Environment'];

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
      filtered = filtered.filter((feat) => feat.cr === selectedCR);
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter((feat) => feat.type === selectedType);
    }

    if (selectedEnvironment !== 'All') {
      filtered = filtered.filter((feat) => feat.environment === selectedEnvironment);
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
          {typeOptions.map((type) => (
            <Picker.Item key={type} label={t(type)} value={type} />
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
            <Picker.Item key={env} label={t(env)} value={env} />
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
              <Text style={styles.tableCell}>{feat.type}</Text>
              <Text style={styles.tableCell}>{feat.cr}</Text>
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
                      value={editedFeat?.cr?.toString() || ''}
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
                      value={editedFeat?.initiative?.toString() || ''}
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
                          value={editedFeat?.hp?.toString() || ''}
                          onChangeText={(value) => handleEditChange('hp', value)}
                          keyboardType="numeric"
                        />
                      </View>
                      <Text style={styles.statValue}>{t('AC')}</Text>
                      <View style={styles.statCircleA}>
                        <TextInput
                          style={styles.statValue}
                          value={editedFeat?.ac?.toString() || ''}
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
                        value={editedFeat?.type || ''}
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
                    {['strbonus', 'dexbonus', 'conbonus', 'intbonus', 'wisbonus', 'chabonus'].map((statbonus) => (
                      <View key={statbonus} style={styles.statBlock}>
                        <TextInput
                          style={styles.statValue}
                          value={editedFeat?.[statbonus]?.toString() || ''}
                          onChangeText={(value) => handleEditChange(statbonus, value)}
                          keyboardType="numeric"
                        />
                      </View>
                    ))}
                  </View>
                  <View style={styles.statsContainerFeatsD}>
                    {['str', 'dex', 'con', 'int', 'wis', 'cha'].map((stat) => (
                      <View key={stat} style={styles.statBlock}>
                        <View style={styles.rowContainer}>
                          <Text style={styles.statLabel}>{stat.toUpperCase()}: </Text>
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
                    value={editedFeat?.senses || ''}
                    onChangeText={(value) => handleEditChange('senses', value)}
                  />
                </View>
                <View style={styles.additionalInfo}>
                  <Text style={styles.actionDescription}>{t('Languages')}: </Text>
                  <TextInput
                    style={styles.actionDescription}
                    value={editedFeat?.languages || ''}
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
                      />
                    </View>
                  ))}
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={saveFeatChanges} style={styles.editButton}>
                    <Text style={styles.editButtonText}>{t('Save')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Cancel')}</Text>
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
                  <Text style={styles.modalSubTitleFeats}>{t('CR')}: {selectedFeat?.cr}</Text>
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
                          <Text style={styles.statValue}>{selectedFeat?.hp}</Text>
                        </View>
                        <View style={styles.statCircle}>
                          <Text style={styles.statValue}>{t('AC')}</Text>
                          <Text style={styles.statValue}>{selectedFeat?.ac}</Text>
                        </View>
                      </View>
                <View style={styles.additionalInfo}>
                      <Text style={styles.featStatSmall}>{selectedFeat?.type}</Text>
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
                    {['strbonus', 'dexbonus', 'conbonus', 'intbonus', 'wisbonus', 'chabonus'].map((statbonus) => (
                      <View key={statbonus} style={styles.statBlock}>
                        <Text style={styles.statValue}>{selectedFeat?.[statbonus]}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.statsContainerFeats}>
                    {['str', 'dex', 'con', 'int', 'wis', 'cha'].map((stat) => (
                      <View key={stat} style={styles.statBlock}>
                        <Text style={styles.statLabel}>{stat.toUpperCase()}: {selectedFeat?.[stat]}</Text>
                      </View>
                    ))}
                  </View>
                  </View>

                <View style={styles.additionalInfo}>
                  <Text style={styles.actionDescription}>{t('Skills')}: {selectedFeat?.skills}</Text>
                </View>
                <View style={styles.additionalInfo}>
                  <Text style={styles.actionDescription}>{t('Senses')}: {selectedFeat?.senses}</Text>
                </View>
                <View style={styles.additionalInfo}>
                  <Text style={styles.actionDescription}>{t('Languages')}: {selectedFeat?.languages}</Text>
                </View>

                <View style={styles.additionalInfo}>
                  {selectedFeat?.actions.map((action, index) => (
                    <View key={index} style={styles.actionContainerFeats}>
                      <Text style={styles.actionName}>{t('Actions')}: {action.name}</Text>
                      <Text style={styles.actionDescription}>{action.description}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.additionalInfo}>
                  {selectedFeat?.features.map((feature, index) => (
                    <View key={index} style={styles.featureContainerFeats}>
                      <Text style={styles.featureName}>{t('Features')}: {feature.name}</Text>
                      <Text style={styles.featureDescription}>{feature.description}</Text>
                    </View>
                  ))}
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

export default Feats;
