import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const sampleItems = require('./assets/Library/magic_items.json');

const MagicItems: React.FC = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('Type');
  const [selectedSubtype, setSelectedSubtype] = useState('Subtype');
  const [selectedRarity, setSelectedRarity] = useState('Rarity');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  const categories = ['Type', 'Item', 'Weapon', 'Armor'];
  const rarities = ['Rarity', 'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Artifact'];

  const itemSubtypes = ['Wondrous item', 'Rod', 'Scroll', 'Staff', 'Wand', 'Ring', 'Potion'];
  const weaponSubtypes = ['Longsword', 'Longbow'];
  const armorSubtypes = ['Leather', 'Scale mail', 'Heavy armor'];

  useEffect(() => {
    setItems(sampleItems);
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const filterItems = () => {
    if (!items || !Array.isArray(items)) return [];
    let filtered = items;

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedType && selectedType !== 'Type') {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    if (selectedSubtype && selectedSubtype !== 'Subtype') {
      filtered = filtered.filter((item) => item.subtype === selectedSubtype);
    }

    if (selectedRarity && selectedRarity !== 'Rarity') {
      filtered = filtered.filter((item) => item.rarity === selectedRarity);
    }

    return filtered;
  };

  const filteredItems = filterItems();

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setEditedItem({ ...item });
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    setIsEditing(false);
  };

  const handleEditChange = (field, value) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
  };

  const saveItemChanges = () => {
    const updatedItems = items.map((item) =>
      item.name === selectedItem.name ? { ...editedItem } : item
    );
    setItems(updatedItems);
    closeItemModal();
  };

  const handleSubtypePickerSubType = (type) => {
    if (type === 'Item') return itemSubtypes;
    if (type === 'Weapon') return weaponSubtypes;
    if (type === 'Armor') return armorSubtypes;
    return [];
  };

  const handleSubtypePicker = () => {
    if (selectedType === 'Item') return itemSubtypes;
    if (selectedType === 'Weapon') return weaponSubtypes;
    if (selectedType === 'Armor') return armorSubtypes;
    return [];
  };

  const deleteMagicItem = async () => {
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
        placeholder={t('Search items')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.pickerItemsContainer}>
        <Picker
          selectedValue={selectedType}
          style={[styles.pickerItems, { width: 135 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
          onValueChange={(value) => {
            setSelectedType(value);
            setSelectedSubtype('Subtype');
          }}
        >
          {categories.map((category) => (
            <Picker.Item key={category} label={t(category)} value={category} style={{ fontSize: fontSize }} />
          ))}
        </Picker>
        {selectedType !== 'Type' && (
          <Picker
            selectedValue={selectedSubtype}
            style={[styles.pickerItems, { width: 135 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
            onValueChange={(value) => setSelectedSubtype(value)}
          >
            <Picker.Item label={t('Subtype')} value="Subtype" style={{ fontSize: fontSize }} />
            {handleSubtypePicker().map((subtype) => (
              <Picker.Item key={subtype} label={t(subtype)} value={subtype} style={{ fontSize: fontSize }} />
            ))}
          </Picker>
        )}
        <Picker
          selectedValue={selectedRarity}
          style={[styles.pickerItems, { width: 135 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
          onValueChange={(value) => setSelectedRarity(value)}
        >
          {rarities.map((rarity) => (
            <Picker.Item key={rarity} label={t(rarity)} value={rarity} style={{ fontSize: fontSize }} />
          ))}
        </Picker>
      </View>

      <ScrollView style={styles.tableContainer}>
        <View style={[styles.tableHeader, { paddingVertical: 10 * scaleFactor }]}>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Rarity')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Type')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Subtype')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Actions')}</Text>
        </View>
        {filteredItems.length === 0 ? (
          <Text style={[styles.noResultsText, { fontSize: fontSize }]}>{t('No magic items found')}</Text>
        ) : (
          filteredItems.map((item, index) => (
            <View key={index} style={[styles.tableRow, { paddingVertical: 10 * scaleFactor }]}>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{item.name}</Text>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{item.rarity}</Text>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{item.type}</Text>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{item.subtype}</Text>
              <TouchableOpacity
                style={styles.tableCell}
                onPress={() => handleItemPress(item)}
              >
                <Text style={[styles.actionText, { fontSize: fontSize }]}>{t('Details')}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {selectedItem && (
        <Modal visible={true} transparent={true} animationType="fade">
          <ScrollView contentContainerStyle={styles.modalOverlaySpells}>
            {!isEditing ? (
              <View style={[styles.itemModal, { padding: 20 * scaleFactor }]}>
                <Text style={[styles.itemTitle, { fontSize: fontSize * 1.2 }]}>{selectedItem.name}</Text>
                <View style={styles.itemMagicModal}>
                  <Text style={[styles.itemCategory, { fontSize: fontSize }]}>{t('Type')}: {selectedItem.type}</Text>
                  <Text style={[styles.itemCategory, { fontSize: fontSize }]}>{t('Subtype')}: {selectedItem.subtype}</Text>
                  <Text style={[styles.itemCategory, { fontSize: fontSize }]}>{t('Rarity')}: {selectedItem.rarity}</Text>
                </View>
                <Text style={[styles.itemDescriptionAttune, { fontSize: fontSize }]}>{selectedItem.attunement}</Text>
                <Text style={[styles.itemDescription, { fontSize: fontSize }]}>{selectedItem.description}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setIsEditing(true)} style={[styles.editButton, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.editButtonText, { fontSize: fontSize }]}>{t('Edit')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeItemModal} style={[styles.closeButtonItem, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.closeButtonText, { fontSize: fontSize }]}>{t('Close')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={[styles.itemModal, { padding: 20 * scaleFactor }]}>
                <TextInput
                  style={[styles.itemTitle, { fontSize: fontSize * 1.2 }]}
                  value={editedItem.name}
                  onChangeText={(value) => handleEditChange('name', value)}
                  placeholder={t('Name')}
                />
                <View style={styles.itemMagicModal}>
                  <Picker
                    selectedValue={editedItem.type}
                    onValueChange={(value) => {
                      handleEditChange('type', value);
                      handleEditChange('subtype', 'Subtype');
                    }}
                    style={[styles.pickerItems, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
                  >
                    {categories.map((category) => (
                      <Picker.Item key={category} label={t(category)} value={category} style={{ fontSize: fontSize }} />
                    ))}
                  </Picker>
                  {editedItem.type !== 'Type' && (
                    <Picker
                      selectedValue={editedItem.subtype}
                      onValueChange={(value) => handleEditChange('subtype', value)}
                      style={[styles.pickerItems, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
                    >
                      <Picker.Item label={t('Subtype')} value="Subtype" style={{ fontSize: fontSize }} />
                      {handleSubtypePickerSubType(editedItem.type).map((subtype) => (
                        <Picker.Item key={subtype} label={t(subtype)} value={subtype} style={{ fontSize: fontSize }} />
                      ))}
                    </Picker>
                  )}
                  <Picker
                    selectedValue={editedItem.rarity}
                    onValueChange={(value) => handleEditChange('rarity', value)}
                    style={[styles.pickerItems, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
                  >
                    {rarities.map((rarity) => (
                      <Picker.Item key={rarity} label={t(rarity)} value={rarity} style={{ fontSize: fontSize }} />
                    ))}
                  </Picker>
                </View>
                <TextInput
                  style={[styles.itemDescriptionAttune, { fontSize: fontSize }]}
                  value={editedItem.attunement}
                  onChangeText={(value) => handleEditChange('attunement', value)}
                  placeholder={t('Attunement')}
                  multiline
                />
                <TextInput
                  style={[styles.itemDescription, { fontSize: fontSize }]}
                  value={editedItem.description}
                  onChangeText={(value) => handleEditChange('description', value)}
                  placeholder={t('Description')}
                  multiline
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={[styles.closeButtonItem, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.closeButtonText, { fontSize: fontSize }]}>{t('Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={deleteMagicItem} style={[styles.deleteButtonSpell, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.editButtonText, { fontSize: fontSize }]}>{t('Delete')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveItemChanges} style={[styles.editButton, { padding: 10 * scaleFactor }]}>
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

export default MagicItems;