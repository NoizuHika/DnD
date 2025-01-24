import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { UserData } from './UserData';
Appearance.setColorScheme('light');

const Items = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [items, setItems] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('Type');
  const [selectedSubtype, setSelectedSubtype] = useState('Subtype');
  const [selectedRarity, setSelectedRarity] = useState('Rarity');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const { ipv4 } = useContext(UserData);
  const categories = ['Type', 'weapon', 'armor', 'adventuring_gear', 'consumable', 'magic', 'other'];
  const rarities = ['Rarity', 'common', 'uncommon', 'rare', 'very rare', 'legendary'];

  const handleSubtypePicker = (type) => {
    if (!subTypes || subTypes.length === 0) return [];
    if (type === 'weapon') return subTypes.weapons || [];
    if (type === 'armor') return subTypes.armors || [];
    if (type === 'adventuring_gear') return subTypes.adventuringGears || [];
    if (type === 'consumable') return subTypes.consumables || [];
    if (type === 'magic') return subTypes.magics || [];
    if (type === 'other') return subTypes.others || [];
    return [];
  };

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
          try {
              const [itemsResponse, itemTypesResponse] = await Promise.all([
                fetch(`http://${ipv4}:8000/items/all`),
                fetch(`http://${ipv4}:8000/itemTypes/all`),
              ]);

              if (!itemsResponse.ok || !itemTypesResponse.ok) {
                throw new Error('Failed to fetch data');
              }

              const itemsData = await itemsResponse.json();
              const itemTypesData = await itemTypesResponse.json();
              setItems(itemsData);
              setSubTypes(itemTypesData)
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };

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
      filtered = filtered.filter((item) => item.type.includes(selectedType));
    }
    console.log(selectedSubtype)
if (selectedSubtype && selectedSubtype !== 'Subtype') {
  filtered = filtered.filter((item) => {
    // Sprawdź, czy itemType istnieje i jest tablicą
    if (!item.itemType) return false;

    // Zbierz itemType w jedno ciąg oddzielone przecinkiem i normalizuj
    const normalizedItemTypes = Array.isArray(item.itemType)
      ? item.itemType.map((s) => s.trim().toLowerCase()).join(',')  // Znormalizowana lista itemType oddzielona przecinkiem
      : item.itemType.trim().toLowerCase();                          // Jeśli to nie jest tablica, znormalizuj bez przecinka

    // Sprawdź, czy selectedSubtype znajduje się w znormalizowanej tablicy itemType
    return normalizedItemTypes.split(',').includes(selectedSubtype.trim().toLowerCase());
  });
}




    if (selectedRarity && selectedRarity !== 'Rarity') {
      filtered = filtered.filter((item) => item.rarity.includes(selectedRarity));
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
      item.name === selectedItem.name
        ? { ...editedItem, subtype: [editedItem.subtype] }
        : item
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
            {handleSubtypePicker(selectedType).map((subtype) => (
              <Picker.Item key={subtype.id || subtype} label={t(subtype.name || subtype)} value={subtype.name} />
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
          <Text style={styles.noResultsText}>{t('No items found')}</Text>
        ) : (
          filteredItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.name}</Text>
              <Text style={styles.tableCell}>{item.rarity}</Text>
              <Text style={styles.tableCell}>{item.type}</Text>
              <Text style={styles.tableCell}>{item.itemType.join(', ')}</Text>
              <TouchableOpacity
                style={styles.tableCell}
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
                <View style={styles.itemsDetails}>
                  <Text style={styles.itemCategory}>{t('Type')}: {selectedItem.type}</Text>
                  <Text style={styles.itemCategory}>{t('Subtype')}: {selectedItem.itemType}</Text>
                  <Text style={styles.itemCategory}>{t('Rarity')}: {selectedItem.rarity}</Text>
                </View>
                <View style={styles.itemsDetails}>
                  <Text style={styles.itemCategory}>{t('Price')}: {selectedItem.value} gp</Text>
                  <Text style={styles.itemCategory}>{t('Weight')}: {selectedItem.weight} lb</Text>
                </View>
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
                <View style={styles.itemsDetails}>
                  <Picker
                    selectedValue={editedItem.type}
                    onValueChange={(value) => {
                      handleEditChange('type', value);
                      handleEditChange('itemType', 'Subtype');
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
                      onValueChange={(value) => handleEditChange('itemType', value)}
                      style={styles.pickerItems}
                    >
                      <Picker.Item label={t('Subtype')} value="Subtype" />
                      {handleSubtypePicker(editedItem.itemType).map((itemType) => (
                        <Picker.Item key={itemType} label={t(subtype)} value={itemType} />
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
                <View style={styles.itemsDetails}>

                  <TextInput
                    style={styles.itemCategory}
                    value={String(editedItem.value)}
                    onChangeText={(value) => handleEditChange('value', parseFloat(value) || 0)}
                    placeholder={t('Price')}
                    keyboardType="numeric"
                  />

                  <TextInput
                    style={styles.itemCategory}
                    value={String(editedItem.weight)}
                    onChangeText={(value) => handleEditChange('weight', parseFloat(value) || 0)}
                    placeholder={t('Weight')}
                    keyboardType="numeric"
                  />

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