import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { UserData } from './UserData';

const featsData = require('./assets/Library/feats.json');

const Feats = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { ipv4 } = useContext(UserData);

  const [feats, setFeats] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFeat, setSelectedFeat] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeat, setEditedFeat] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const [featsResponse] = await Promise.all([
          fetch(`http://${ipv4}:8000/feats/all`),
        ]);

        if (!featsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const feats = await featsResponse.json();

        setFeats(feats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

const setUpdate = async (updatedEncounter) => {
  try {
     console.log(JSON.stringify(updatedEncounter));
    const response = await fetch(`http://${ipv4}:8000/feats/update`, {
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


  const handleGoBack = () => {
    navigation.goBack();
  };

  const filterFeats = () => {
    return feats.filter((feat) =>
      feat.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filteredFeats = filterFeats();

  const handleFeatPress = (feat) => {
    setSelectedFeat(feat);
    setEditedFeat({ ...feat });
  };

  const closeFeatModal = () => {
    setSelectedFeat(null);
    setEditedFeat(null);
    setIsEditing(false);
  };

  const handleEditChange = (field, value) => {
    setEditedFeat((prevFeat) => ({
      ...prevFeat,
      [field]: value,
    }));
  };

  const saveFeatChanges = () => {
    if (!editedFeat) return;

    setFeats((prevFeats) =>
      prevFeats.map((feat) =>
        feat.name === selectedFeat.name ? editedFeat : feat
      )
    );
    setUpdate(editedFeat);
    setSelectedFeat(editedFeat);
    setIsEditing(false);
  };

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={t('Search feats')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Requirements')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Source')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Details')}</Text>
        </View>
        {filteredFeats.length === 0 ? (
          <Text style={styles.noResultsText}>{t('No feats found')}</Text>
        ) : (
          filteredFeats.map((feat, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.nameColumn]}>{feat.name}</Text>
              <Text style={[styles.tableCell]}>{feat.requirements || t('None')}</Text>
              <Text style={[styles.tableCell]}>{feat.source}</Text>
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

      {selectedFeat && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalOverlayItems}>
            {!isEditing ? (
              <View style={styles.itemModal}>
                <Text style={styles.itemTitle}>{selectedFeat.name}</Text>
                <Text style={styles.itemDescriptionAttune}>
                  {t('Requirements')}: {selectedFeat.requirements || t('None')}
                </Text>
                <Text style={styles.itemDescription}>{selectedFeat.description}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>{t('Edit')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeFeatModal} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Close')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.itemModal}>
                <TextInput
                  style={styles.itemTitle}
                  value={editedFeat.name}
                  onChangeText={(value) => handleEditChange('name', value)}
                  placeholder={t('Name')}
                />
                <TextInput
                  style={styles.itemDescriptionAttune}
                  value={editedFeat.requirements}
                  onChangeText={(value) => handleEditChange('requirements', value)}
                  placeholder={t('Requirements')}
                />
                <TextInput
                  style={styles.itemDescription}
                  value={editedFeat.description}
                  onChangeText={(value) => handleEditChange('description', value)}
                  placeholder={t('Description')}
                  multiline
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={closeFeatModal} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveFeatChanges} style={styles.editButton}>
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

export default Feats;