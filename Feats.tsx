import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { UserData } from './UserData';

import { SettingsContext } from './SettingsContext';


const featsData = require('./assets/Library/feats.json');

const Feats: React.FC = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { fontSize, scaleFactor } = useContext(SettingsContext);

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

  const deleteFeats = async () => {
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert(t('Item deleted successfully'));
      } else {
        alert(t('Failed to delete item'));
      }
    } catch (error) {
      console.error(error);
      alert(t('Error deleting item'));
    }
  };

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <TextInput
        style={[styles.searchInput, { fontSize: fontSize, height: 40 * scaleFactor }]}
        placeholder={t('Search feats')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView style={styles.tableContainer}>

        <View style={[styles.tableHeader, { paddingVertical: 10 * scaleFactor }]}>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Prerequisite')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Source')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Details')}</Text>

        </View>
        {filteredFeats.length === 0 ? (
          <Text style={[styles.noResultsText, { fontSize: fontSize }]}>{t('No feats found')}</Text>
        ) : (
          filteredFeats.map((feat, index) => (

            <View key={index} style={[styles.tableRow, { paddingVertical: 10 * scaleFactor }]}>
              <Text style={[styles.tableCell, styles.nameColumn, { fontSize: fontSize }]}>{feat.name}</Text>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{feat.requirements || t('None')}</Text>
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

      {selectedFeat && (
        <Modal visible={true} transparent={true} animationType="fade">
          <ScrollView contentContainerStyle={styles.modalOverlaySpells}>
            {!isEditing ? (

              <View style={[styles.itemModal, { padding: 20 * scaleFactor }]}>
                <Text style={[styles.itemTitle, { fontSize: fontSize * 1.2 }]}>{selectedFeat.name}</Text>
                <Text style={[styles.itemDescriptionAttune, { fontSize: fontSize }]}>
                  {t('Prerequisite')}: {selectedFeat.requirements || t('None')}

                </Text>
                <Text style={[styles.itemDescription, { fontSize: fontSize }]}>{selectedFeat.description}</Text>
                <View style={styles.modalButtons}>
                {user.id === feats.ownerID && (
                  <TouchableOpacity onPress={() => setIsEditing(true)} style={[styles.editButton, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.editButtonText, { fontSize: fontSize }]}>{t('Edit')}</Text>
                  </TouchableOpacity>
                )}
                  <TouchableOpacity onPress={closeFeatModal} style={[styles.closeButtonItem, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.closeButtonText, { fontSize: fontSize }]}>{t('Close')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={[styles.itemModal, { padding: 20 * scaleFactor }]}>
                <TextInput
                  style={[styles.itemTitle, { fontSize: fontSize * 1.2 }]}
                  value={editedFeat.name}
                  onChangeText={(value) => handleEditChange('name', value)}
                  placeholder={t('Name')}
                  placeholderTextColor="#b5b5b5"
                />
                <TextInput

                  style={[styles.itemDescriptionAttune, { fontSize: fontSize }]}
                  value={editedFeat.requirements}
                  onChangeText={(value) => handleEditChange('requirements', value)}
                  placeholder={t('Requirements')}
                  placeholderTextColor="#b5b5b5"
                />
                <TextInput
                  style={[styles.itemDescription, { fontSize: fontSize }]}
                  value={editedFeat.description}
                  onChangeText={(value) => handleEditChange('description', value)}
                  placeholder={t('Description')}
                  placeholderTextColor="#b5b5b5"
                  multiline
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={closeFeatModal} style={[styles.closeButtonItem, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.closeButtonText, { fontSize: fontSize }]}>{t('Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={deleteFeats} style={[styles.deleteButtonSpell, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.editButtonText, { fontSize: fontSize }]}>{t('Delete')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveFeatChanges} style={[styles.editButton, { padding: 10 * scaleFactor }]}>
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

export default Feats;