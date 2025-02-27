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

const Items: React.FC = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const [items, setItems] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('Type');
  const [selectedSubtype, setSelectedSubtype] = useState('Subtype');
  const [selectedRarity, setSelectedRarity] = useState('Rarity');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const { token } = useAuth();
  const { ipv4 } = useContext(UserData);
  const categories = ['Type', 'weapon', 'armor', 'adventuring_gear', 'consumable', 'magic', 'other'];
  const rarities = ['Rarity', 'common', 'uncommon', 'rare', 'very rare', 'legendary'];
  const [userID, setUserID] = useState(null);

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
              const [itemsResponse, itemTypesResponse,meResponse] = await Promise.all([
                fetch(`http://${ipv4}:8000/items/all/10`),
                fetch(`http://${ipv4}:8000/itemTypes/all`),
                fetch(`http://${ipv4}:8000/me`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json',
                         "Authorization": `Bearer ${token}`
                    }

                }),
              ]);

              if (!itemsResponse.ok || !itemTypesResponse.ok || !meResponse.ok) {
                throw new Error('Failed to fetch data');
              }

              const itemsData = await itemsResponse.json();
              const itemTypesData = await itemTypesResponse.json();
              const userID = await meResponse.json();
              setItems(itemsData);
              setSubTypes(itemTypesData);
              setUserID(userID.id);
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

if (selectedSubtype && selectedSubtype !== 'Subtype') {
  filtered = filtered.filter((item) => {

    if (!item.itemType) return false;

    const normalizedItemTypes = Array.isArray(item.itemType)
      ? item.itemType.map((s) => s.trim().toLowerCase()).join(',')
      : item.itemType.trim().toLowerCase();

    return normalizedItemTypes.split(',').includes(selectedSubtype.trim().toLowerCase());
  });
}

    if (selectedSubtype && selectedSubtype !== 'Subtype') {
      filtered = filtered.filter((item) => {
        if (!item.itemType) return false;
        const normalizedItemTypes = Array.isArray(item.itemType)
          ? item.itemType.map((s) => s.trim().toLowerCase()).join(',')
          : item.itemType.trim().toLowerCase();
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
    const itemDto= {
        id: editedItem.id,
        name: editedItem.name,
        description: editedItem.description,
        weight: editedItem.weight,
        value: editedItem.value,
        ownerID: editedItem.ownerID,
        type: editedItem.type,
        rarity: editedItem.rarity,
        requiresAttunement: editedItem.requiresAttunement,
        itemType: editedItem.itemType,
        armorClass: editedItem.armorClass,
        dexBonus: editedItem.dexBonus,
        stealthDisadventage: editedItem.stealthDisadvantage,
        damageType: editedItem.damageType,
        diceNumber: editedItem.diceNumber,
        diceType: editedItem.diceType,
        specification: editedItem.specification,
        properties: editedItem.properties,
        source: editedItem.source,
        };
    setUpdate(itemDto);
    closeItemModal();
  };
const setUpdate = async (itemDto) => {
  try {
      console.log(itemDto)
    const response = await fetch(`http://${ipv4}:8000/items/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(itemDto),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log('Updated item:', result);
        fetchData();
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};
  const deleteItem = async () => {
        try {

          const response = await fetch(`http://${ipv4}:8000/items/delete/${editedItem.id}`, {
            method: 'Delete',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
          }

          const result = await response.json();
          console.log('New encounter:', result);
        closeItemModal();
        fetchData();
        } catch (error) {
          console.error('Error fetching data:', error.message);
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
            {handleSubtypePicker(selectedType).map((subtype) => (

              <Picker.Item key={subtype.id || subtype} label={t(subtype.name || subtype)} value={subtype.name} style={{ fontSize: fontSize }} />

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
          <Text style={[styles.noResultsText, { fontSize: fontSize }]}>{t('No items found')}</Text>
        ) : (
          filteredItems.map((item, index) => (

            <View key={index} style={[styles.tableRow, { paddingVertical: 10 * scaleFactor }]}>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{item.name}</Text>
              <Text style={[styles.tableCell, { fontSize: fontSize * 0.9 }]}>{item.rarity}</Text>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{item.type}</Text>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{item.itemType.slice(0, 2).join(', ')}</Text>

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
                <View style={styles.itemsDetails}>
                  <Text style={[styles.itemCategory, { fontSize: fontSize }]}>{t('Type')}: {selectedItem.type}</Text>
                </View>
                <View style={styles.itemsDetails}>
                  <Text style={[styles.itemCategory, { fontSize: fontSize }]}>{t('Subtype')}: {Array.isArray(selectedItem.itemType) ? selectedItem.itemType.join(', ') : selectedItem.itemType}</Text>
                </View>
                <View style={styles.itemsDetails}>
                  <Text style={[styles.itemCategory, { fontSize: fontSize }]}>{t('Rarity')}: {selectedItem.rarity}</Text>
                </View>
                <View style={styles.itemsDetails}>
                  <Text style={[styles.itemCategory, { fontSize: fontSize }]}>{t('Price')}: {selectedItem.value} </Text>
                  <Text style={[styles.itemCategory, { fontSize: fontSize }]}>{t('Weight')}: {selectedItem.weight} </Text>
                </View>

                {selectedItem.type === 'weapon' && (
                  <View style={styles.itemsDetails}>
                    <Text style={[styles.itemCategory, { fontSize: fontSize }]}>
                      {t('Dice Number/Dice Type')}: {selectedItem.diceNumber}/{selectedItem.diceType}
                    </Text>
                  </View>
                )}
                {selectedItem.type === 'weapon' && (
                  <View style={styles.itemsDetails}>
                    <Text style={[styles.itemCategory, { fontSize: fontSize }]}>
                      {t('Damage Type')}: {selectedItem.damageType}
                    </Text>
                  </View>
                )}
                {selectedItem.type === 'weapon' && (
                  <View style={styles.itemsDetails}>
                    <Text style={[styles.itemCategory, { fontSize: fontSize }]}>
                      {t('Specification')}: {selectedItem.specification}
                    </Text>
                  </View>
                )}


                {selectedItem.type === 'armor' && (
                  <View style={styles.itemsDetails}>
                    <Text style={[styles.itemCategory, { fontSize: fontSize }]}>
                      {t('Dexterity Bonus')}: {selectedItem.dexBonus}
                    </Text>
                  </View>
                )}
                {selectedItem.type === 'armor' && (
                  <View style={styles.itemsDetails}>
                    <Text style={[styles.itemCategory, { fontSize: fontSize }]}>
                      {t('Stealth Disadvantage')}: {selectedItem.stealthDisadvantage ? t('Yes') : t('No')}
                    </Text>
                  </View>
                )}
                {selectedItem.type === 'armor' && (
                  <View style={styles.itemsDetails}>
                    <Text style={[styles.itemCategory, { fontSize: fontSize }]}>
                      {t('Properties')}: {selectedItem.properties}
                    </Text>
                  </View>
                )}

                <Text style={[styles.itemDescription, { fontSize: fontSize }]}>{selectedItem.description}</Text>
                <View style={styles.modalButtons}>
                {userID === selectedItem.ownerID && (
                  <TouchableOpacity onPress={() => setIsEditing(true)} style={[styles.editButton, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.editButtonText, { fontSize: fontSize }]}>{t('Edit')}</Text>
                  </TouchableOpacity>
                )}
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
                  placeholderTextColor="#b5b5b5"
                />
                <View style={styles.itemsDetails}>
                  <Picker
                    selectedValue={editedItem.type}
                    onValueChange={(value) => {
                      handleEditChange('type', value);
                      handleEditChange('itemType', 'Subtype');
                    }}
                    style={[styles.pickerItems, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
                  >
                    {categories.map((category) => (
                      <Picker.Item key={category} label={t(category)} value={category} style={{ fontSize: fontSize }} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.itemsDetails}>
                  {editedItem.type !== 'Type' && (
                    <Picker
                      selectedValue={editedItem.subtype}
                      onValueChange={(value) => handleEditChange('itemType', value)}

                      style={[styles.pickerItems, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
                    >
                      <Picker.Item label={t('Subtype')} value="Subtype" style={{ fontSize: fontSize }} />
                      {handleSubtypePicker(editedItem.itemType).map((itemType) => (
                        <Picker.Item key={itemType} label={t(itemType)} value={itemType} style={{ fontSize: fontSize }} />

                      ))}
                    </Picker>
                  )}
                </View>
                <View style={styles.itemsDetails}>
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
                <View style={styles.itemsDetails}>
                  <TextInput

                    style={[styles.itemCategory, { fontSize: fontSize }]}

                    value={String(editedItem.value)}
                    onChangeText={(value) => handleEditChange('value', value.endsWith('gp') ? value : `${value}gp`)}

                    placeholder={t('Price')}
                    placeholderTextColor="#b5b5b5"
                  />
                  <TextInput
                    style={[styles.itemCategory, { fontSize: fontSize }]}
                    value={String(editedItem.weight)}
                    onChangeText={(value) => handleEditChange('weight',value.endsWith('lp') ? value : `${value}lp`)}
                    placeholder={t('Weight')}
                    placeholderTextColor="#b5b5b5"
                  />
                </View>

                {editedItem.type === 'weapon' && (
                  <>
                    <View style={styles.itemsDetails}>
                      <TextInput
                        style={[styles.itemCategory, { fontSize: fontSize }]}
                        value={String(editedItem.diceNumber)}
                        onChangeText={(value) => handleEditChange('diceNumber', value)}
                        placeholder={t('Dice Number')}
                        placeholderTextColor="#b5b5b5"
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.itemsDetails}>
                      <TextInput
                        style={[styles.itemCategory, { fontSize: fontSize }]}
                        value={editedItem.diceType}
                        onChangeText={(value) => handleEditChange('diceType', value)}
                        placeholder={t('Dice Type')}
                        placeholderTextColor="#b5b5b5"
                      />
                    </View>
                    <View style={styles.itemsDetails}>
                      <TextInput
                        style={[styles.itemCategory, { fontSize: fontSize }]}
                        value={editedItem.damageType}
                        onChangeText={(value) => handleEditChange('damageType', value)}
                        placeholder={t('Damage Type')}
                        placeholderTextColor="#b5b5b5"
                      />
                    </View>
                    <View style={styles.itemsDetails}>
                      <TextInput
                        style={[styles.itemCategory, { fontSize: fontSize }]}
                        value={editedItem.specification}
                        onChangeText={(value) => handleEditChange('specification', value)}
                        placeholder={t('Specification')}
                        placeholderTextColor="#b5b5b5"
                      />
                    </View>
                  </>
                )}
                {editedItem.type === 'armor' && (
                  <>
                    <View style={styles.itemsDetails}>
                      <TextInput
                        style={[styles.itemCategory, { fontSize: fontSize }]}
                        value={String(editedItem.dexBonus)}
                        onChangeText={(value) => handleEditChange('dexBonus', value)}
                        placeholder={t('Dexterity Bonus')}
                        placeholderTextColor="#b5b5b5"
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.itemsDetails}>
                      <TextInput
                        style={[styles.itemCategory, { fontSize: fontSize }]}
                        value={String(editedItem.stealthDisadvantage)}
                        onChangeText={(value) => handleEditChange('stealthDisadvantage', value)}
                        placeholder={t('Stealth Disadvantage')}
                        placeholderTextColor="#b5b5b5"
                      />
                    </View>
                    <View style={styles.itemsDetails}>
                      <TextInput
                        style={[styles.itemCategory, { fontSize: fontSize }]}
                        value={editedItem.properties}
                        onChangeText={(value) => handleEditChange('properties', value)}
                        placeholder={t('Properties')}
                        placeholderTextColor="#b5b5b5"
                      />
                    </View>
                  </>
                )}

                <TextInput
                  style={[styles.itemDescription, { fontSize: fontSize }]}
                  value={editedItem.description}
                  onChangeText={(value) => handleEditChange('description', value)}
                  placeholder={t('Description')}
                  placeholderTextColor="#b5b5b5"
                  multiline
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={[styles.closeButtonItem, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.closeButtonText, { fontSize: fontSize }]}>{t('Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={deleteItem} style={[styles.deleteButtonSpell, { padding: 10 * scaleFactor }]}>
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

export default Items;