import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const sampleItems = require('./assets/Library/items.json');

const Items = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('Type');
  const [selectedRarity, setSelectedRarity] = useState('Rarity');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Price');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  const priceRanges = [
    { label: t('Price'), value: 'Price' },
    { label: `${t('Price')} 0 - 50`, value: '0-50' },
    { label: `${t('Price')} 51 - 500`, value: '51-500' },
    { label: `${t('Price')} 501 - 5000`, value: '501-5000' },
    { label: `${t('Price')} 5001 - 10000`, value: '5001-10000' },
  ];

  const categories = ['Type', 'Weapon', 'Armor', 'Ammunition', 'Tools', 'Potions', 'Scrolls', 'Adventuring Gear', 'Other'];
  const rarities = ['Rarity', 'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'];


  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    setItems(sampleItems);
  }, []);

  const filterItems = () => {
    if (!items || !Array.isArray(items)) return [];

    let filtered = items;

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedType && selectedType !== 'Type') {
      filtered = filtered.filter((item) => Array.isArray(item.type) && item.type.includes(selectedType));
    }

    if (selectedRarity && selectedRarity !== 'Rarity') {
      filtered = filtered.filter((item) => Array.isArray(item.rarity) && item.rarity.includes(selectedRarity));
    }

    if (selectedPriceRange !== 'Price') {
      const range = selectedPriceRange.split('-').map(Number);
      if (range.length === 2) {
        const [min, max] = range;
        filtered = filtered.filter((item) => item.price >= min && item.price <= max);
      }
    }

    return filtered;
  };

  const filteredItems = filterItems();

  const handleItemPress = (item) => {
    if (typeof item.type === 'string') {
      item.type = item.type.split(',').map((v) => v.trim());
    }
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
          onValueChange={(itemValue) => setSelectedType(itemValue)}
        >
          {categories.map((category) => (
            <Picker.Item key={category} label={t(category)} value={category} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedRarity}
          style={styles.pickerItems}
          onValueChange={(itemValue) => setSelectedRarity(itemValue)}
        >
          {rarities.map((rarity) => (
            <Picker.Item key={rarity} label={t(rarity)} value={rarity} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedPriceRange}
          style={styles.pickerItems}
          onValueChange={(itemValue) => setSelectedPriceRange(itemValue)}
        >
          {priceRanges.map(({ label, value }) => (
            <Picker.Item key={label} label={label} value={value} />
          ))}
        </Picker>
      </View>

      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Rarity')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Price')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Actions')}</Text>
        </View>
        {filteredItems.length === 0 ? (
          <Text style={styles.noResultsText}>{t('No items found')}</Text>
        ) : (
        filteredItems.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.nameColumn]}>{item.name}</Text>
            <Text style={[styles.tableCell, styles.rarityColumn]}>{item.rarity.join(', ')}</Text>
            <Text style={[styles.tableCell, styles.priceColumn]}>{item.price}</Text>
            <TouchableOpacity
              style={[styles.tableCell, styles.actionsColumn]}
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
                <View style={styles.itemsDetails}>
                  <Text style={styles.itemCategory}>{selectedItem.type.join(', ')}</Text>
                  <Text style={styles.itemCategory}>{t('Weight')}: {selectedItem.weight} lb</Text>
                  <Text style={styles.itemCategory}>{t('Cost')}: {selectedItem.price} gp</Text>
                </View>
                <Text style={styles.itemDescription}>{selectedItem.description}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={closeItemModal} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Close')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    style={styles.editButton}
                  >
                    <Text style={styles.editButtonText}>{t('Edit')}</Text>
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
                <View style={styles.itemsDetails}>
                <Picker
                  selectedValue={editedItem.type}
                  onValueChange={(itemValue) => handleEditChange('type', itemValue)}
                  style={styles.pickerItems}
                >
                  {categories.slice(1).map((category) => (
                    <Picker.Item key={category} label={t(category)} value={category} />
                  ))}
                </Picker>
                <View style={styles.IteminputContainer}>
                <Text style={styles.itemCategory}>{t('Weight')}: </Text>
                <TextInput
                  style={styles.itemCategory}
                  value={String(editedItem.weight)}
                  onChangeText={(value) => handleEditChange('weight', parseFloat(value) || 0)}
                  placeholder={t('Weight')}
                  keyboardType="numeric"
                />
                </View>
                <View style={styles.IteminputContainer}>
                <Text style={styles.itemCategory}>{t('Price')}: </Text>
                <TextInput
                  style={styles.itemCategory}
                  value={String(editedItem.price)}
                  onChangeText={(value) => handleEditChange('price', parseFloat(value) || 0)}
                  placeholder={t('Price')}
                  keyboardType="numeric"
                />
                </View>
                </View>
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

export default Items;