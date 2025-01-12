import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const backLibraryData = require('./assets/Library/BackLibrary.json');

const BackLibrary = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [backLibrary, setBackLibrary] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  useEffect(() => {
    setBackLibrary(backLibraryData);
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const filterBackLibrary = () => {
    return backLibrary.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filteredBackLibrary = filterBackLibrary();

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setEditedItem({ ...item });
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    setEditedItem(null);
    setIsEditing(false);
  };

  const handleEditChange = (field, value) => {
    setEditedItem((prevItem) => ({
      ...prevItem,
      [field]: value,
    }));
  };

  const saveItemChanges = () => {
    if (!editedItem) return;

    setBackLibrary((prevBackLibrary) =>
      prevBackLibrary.map((item) =>
        item.name === selectedItem.name ? editedItem : item
      )
    );

    setSelectedItem(editedItem);
    setIsEditing(false);
  };

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={t('Search library')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Skill Proficiencies')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Source')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Details')}</Text>
        </View>
        {filteredBackLibrary.length === 0 ? (
          <Text style={styles.noResultsText}>{t('No library found')}</Text>
        ) : (
          filteredBackLibrary.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.nameColumn]}>{item.name}</Text>
              <Text style={[styles.tableCell]}>{item.skillProficiencies || t('None')}</Text>
              <Text style={[styles.tableCell]}>{item.source}</Text>
              <TouchableOpacity
                style={[styles.tableCell, styles.actionsColumn]}
                onPress={() => handleItemPress(item)}
              >
                <Text style={styles.actionText}>{t('Details')}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {selectedItem && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalOverlayItems}>
            {!isEditing ? (
              <View style={styles.itemModal}>
                <Text style={styles.itemTitle}>{selectedItem.name}</Text>
                <Text style={styles.itemDescriptionAttune}>
                  {t('Skill Proficiencies')}: {selectedItem.skillProficiencies || t('None')}
                </Text>
                <Text style={styles.itemDescription}>
                  {t('Languages')}: {selectedItem.languages || t('None')}
                </Text>
                <Text style={styles.itemDescription}>
                  {t('Tool Proficiencies')}: {selectedItem.toolProficiencies || t('None')}
                </Text>
                <Text style={styles.itemDescription}>
                  {t('Equipment')}: {selectedItem.equipment || t('None')}
                </Text>
                <Text style={styles.itemDescription}>
                  {t('Feature')}: {selectedItem.feature || t('None')}
                </Text>
                <Text style={styles.itemDescription}>{selectedItem.description}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>{t('Edit')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeItemModal} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Close')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.itemModal}>
                <TextInput
                  style={styles.itemTitle}
                  value={editedItem.name}
                  onChangeText={(value) => handleEditChange('name', value)}
                  placeholder={t('Name')}
                />
                <TextInput
                  style={styles.itemDescriptionAttune}
                  value={editedItem.skillProficiencies}
                  onChangeText={(value) => handleEditChange('skillProficiencies', value)}
                  placeholder={t('Skill Proficiencies')}
                />
                <TextInput
                  style={styles.itemDescription}
                  value={editedItem.languages}
                  onChangeText={(value) => handleEditChange('languages', value)}
                  placeholder={t('Languages')}
                />
                <TextInput
                  style={styles.itemDescription}
                  value={editedItem.toolProficiencies}
                  onChangeText={(value) => handleEditChange('toolProficiencies', value)}
                  placeholder={t('Tool Proficiencies')}
                />
                <TextInput
                  style={styles.itemDescription}
                  value={editedItem.equipment}
                  onChangeText={(value) => handleEditChange('equipment', value)}
                  placeholder={t('Equipment')}
                />
                <TextInput
                  style={styles.itemDescription}
                  value={editedItem.feature}
                  onChangeText={(value) => handleEditChange('feature', value)}
                  placeholder={t('Feature')}
                />
                <TextInput
                  style={styles.itemDescription}
                  value={editedItem.description}
                  onChangeText={(value) => handleEditChange('description', value)}
                  placeholder={t('Description')}
                  multiline
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={closeItemModal} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveItemChanges} style={styles.editButton}>
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

export default BackLibrary;