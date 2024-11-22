import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const sampleItems = require('./assets/Library/magic_items.json');

const MagicItems = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

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

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={t('Search items')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.pickerItemsContainer}>
        <Picker
          selectedValue={selectedType}
          style={styles.pickerItems}
          onValueChange={(value) => {
            setSelectedType(value);
            setSelectedSubtype('Subtype');
          }}
        >
          {categories.map((category) => (
            <Picker.Item key={category} label={t(category)} value={category} />
          ))}
        </Picker>
        {selectedType !== 'Type' && (
          <Picker
            selectedValue={selectedSubtype}
            style={styles.pickerItems}
            onValueChange={(value) => setSelectedSubtype(value)}
          >
            <Picker.Item label={t('Subtype')} value="Subtype" />
            {handleSubtypePicker().map((subtype) => (
              <Picker.Item key={subtype} label={t(subtype)} value={subtype} />
            ))}
          </Picker>
        )}
        <Picker
          selectedValue={selectedRarity}
          style={styles.pickerItems}
          onValueChange={(value) => setSelectedRarity(value)}
        >
          {rarities.map((rarity) => (
            <Picker.Item key={rarity} label={t(rarity)} value={rarity} />
          ))}
        </Picker>
      </View>

      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>{t('Name')}</Text>
          <Text style={styles.tableHeaderText}>{t('Rarity')}</Text>
          <Text style={styles.tableHeaderText}>{t('Type')}</Text>
          <Text style={styles.tableHeaderText}>{t('Subtype')}</Text>
          <Text style={styles.tableHeaderText}>{t('Actions')}</Text>
        </View>
        {filteredItems.length === 0 ? (
          <Text style={styles.noResultsText}>{t('No magic items found')}</Text>
        ) : (
        filteredItems.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{item.rarity}</Text>
            <Text style={styles.tableCell}>{item.type}</Text>
            <Text style={styles.tableCell}>{item.subtype}</Text>
            <TouchableOpacity
              style={styles.tableCell}
              onPress={() => handleItemPress(item)}
            >
              <Text style={styles.actionText}>{t('Details')}</Text>
            </TouchableOpacity>
          </View>
        )))}
      </ScrollView>

      {selectedItem && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalOverlayItems}>
            {!isEditing ? (
              <View style={styles.itemModal}>
                <Text style={styles.itemTitle}>{selectedItem.name}</Text>
                <View style={styles.itemMagicModal}>
                <Text style={styles.itemCategory}>{t('Type')}: {selectedItem.type}</Text>
                <Text style={styles.itemCategory}>{t('Subtype')}: {selectedItem.subtype}</Text>
                <Text style={styles.itemCategory}>{t('Rarity')}: {selectedItem.rarity}</Text>
                </View>
                <Text style={styles.itemDescriptionAttune}>{selectedItem.attunement}</Text>
                <Text style={styles.itemDescription}>{selectedItem.description}</Text>
                <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}
                >
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
                <View style={styles.itemMagicModal}>
                <Picker
                  selectedValue={editedItem.type}
                  onValueChange={(value) => {
                    handleEditChange('type', value);
                    handleEditChange('subtype', 'Subtype');
                  }}
                  style={styles.pickerItems}
                >
                  {categories.map((category) => (
                    <Picker.Item key={category} label={t(category)} value={category} />
                  ))}
                </Picker>
                {editedItem.type !== 'Type' && (
                  <Picker
                    selectedValue={editedItem.subtype}
                    onValueChange={(value) => handleEditChange('subtype', value)}
                    style={styles.pickerItems}
                  >
                    <Picker.Item label={t('Subtype')} value="Subtype" />
                    {handleSubtypePickerSubType(editedItem.type).map((subtype) => (
                      <Picker.Item key={subtype} label={t(subtype)} value={subtype} />
                    ))}
                  </Picker>
                )}
                <Picker
                  selectedValue={editedItem.rarity}
                  onValueChange={(value) => handleEditChange('rarity', value)}
                  style={styles.pickerItems}
                >
                  {rarities.map((rarity) => (
                    <Picker.Item key={rarity} label={t(rarity)} value={rarity} />
                  ))}
                </Picker>
                </View>
                <TextInput
                  style={styles.itemDescriptionAttune}
                  value={editedItem.attunement}
                  onChangeText={(value) => handleEditChange('attunement', value)}
                  placeholder={t('Attunement')}
                  multiline
                />
                <TextInput
                  style={styles.itemDescription}
                  value={editedItem.description}
                  onChangeText={(value) => handleEditChange('description', value)}
                  placeholder={t('Description')}
                  multiline
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.closeButtonItem}>
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

export default MagicItems;
