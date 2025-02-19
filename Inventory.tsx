import React, { useState, useContext,useEffect } from 'react';
import { Modal, ImageBackground, StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import sampleItems from './items.json';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { UserData } from './UserData';
import { useAuth } from './AuthContext';
Appearance.setColorScheme('light');

const Inventory: React.FC = ({ route,navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { t } = useTranslation();
  const { characterData } = route.params;
  const [character, setCharacter] = useState(characterData);
  const { theme } = useContext(ThemeContext);
  const { token } = useAuth();
  const [selectedScreen, setSelectedScreen] = useState('Inventory');
  const [isModalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', weight: 0, quantity: 0, cost: 0, description: '', category: '' });
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState(characterData.items || []);
  const [aItems,setAItems] = useState([]);
  const [gold, setGold] = useState(sampleItems.gold || 0);
  const { ipv4 } = useContext(UserData);
  const [equippedItems, setEquippedItems] = useState({});
  const [isEquipModalVisible, setEquipModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const equipSlots = [
    { key: "Weapon", label: t('Right Hand') },
    { key: 'Shield', label: t('Left Hand') },
    { key: 'Armor', label: t('Body Armor') },
    { key: 'Ring', label: t('Ring') },
    { key: 'Amulet', label: t('Amulet') }
  ];

  const handleEquipItem = (item) => {
    if (!selectedSlot || item.category !== selectedSlot) return;

    setEquippedItems((prev) => ({
      ...prev,
      [item.category]: item,
    }));

    setSelectedSlot(null);
  };

  const handleUnequipItem = (category) => {
    setEquippedItems((prev) => {
      const updatedItems = { ...prev };
      delete updatedItems[category];
      return updatedItems;
    });
  };

  const handleSpendGold = (amount) => {
    if (gold >= amount) {
      setGold((prevGold) => prevGold - amount);
    } else {
      alert(t('Not enough gold!'));
    }
  };
     useEffect(() => {
        fetchData();
      }, []);
      const fetchData = async () => {
              try {
                  const [itemsResponse] = await Promise.all([
                    fetch(`http://${ipv4}:8000/items/all/10`),
                  ]);

                  if (!itemsResponse.ok) {
                    throw new Error('Failed to fetch data');
                  }

                  const itemsData = await itemsResponse.json();
                  setAItems(itemsData);
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
              };

      const handleItemPress = (item) => {
        setSelectedItem(item);
      };
      const closeDescriptionModal = () => {
        setSelectedItem(null);
      };

      const handleGoBack = () => {
        navigation.goBack();
      };

      const calculateTotalWeight = () => {
        return items.reduce((total, item) => total + item.weight * item.quantity, 0).toFixed(2);
      };

      const calculateTotalCost = () => {
        const totalGold = items.reduce((total, item) => total + item.cost * item.quantity, 0);
        return totalGold.toFixed(2);
      };

      const handleAddManualItem = () => {
        const existingItemIndex = items.findIndex(item => item.name === newItem.name);

        if (existingItemIndex >= 0) {

          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          setItems(updatedItems);
        } else {
          setItems([...items, newItem]);
        }

        setNewItem({ name: '', weight: 0, quantity: 0, cost: 0, description: '', category: '' });
        setModalVisible(false);
      };

    const handleAddItem=(item) =>{
            addItem(item);
            setItems([...items, item]);
        }

  const addItem = async (item) => {
    try {
      const requestBody = {
        id: item.id,
        player: characterData.id
      };

      const [itemsResponse] = await Promise.all([
        fetch(`http://${ipv4}:8000/characters/itemAdd`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        })
      ]);

      if (!itemsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const itemsData = await itemsResponse.json();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
   const removeItem = async (index) => {
     try {
       const requestBody = {
         id: items[index].id,
         player: characterData.id
       };

       const [itemsResponse] = await Promise.all([
         fetch(`http://${ipv4}:8000/characters/removeItem`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             "Authorization": `Bearer ${token}`
           },
           body: JSON.stringify(requestBody)
         })
       ]);

       if (!itemsResponse.ok) {
         throw new Error('Failed to fetch data');
       }

       const itemsData = await itemsResponse.json();
     } catch (error) {
       console.error('Error fetching data:', error);
     }
   };

  const handleRemoveItem = (index) => {
    removeItem(index);
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value === '' ? 0 : value;
    setItems(newItems);
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.type.includes(selectedCategory);
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    handleAddItemsFromJSON();
  }, []);

  const handleAddItemsFromJSON = () => {
    const updatedItems = [...items];
    sampleItems.items.forEach(sampleItem => {
      const existingItemIndex = updatedItems.findIndex(item => item.name === sampleItem.name);
      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex].quantity += sampleItem.quantity;
      } else {
        updatedItems.push(sampleItem);
      }
    });
    setItems(updatedItems);
  };


 const categories = ['All', 'Weapon', 'Armor', 'Consumable', 'Adventuring Gear', 'Magic Item', 'Other'];

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <View style={[styles.dropdownContainerCharacter, { height: 50 * scaleFactor }]}>
        <Picker
          selectedValue={selectedScreen}
          style={[styles.pickerChooseChar, { width: 200 * scaleFactor }]}
          onValueChange={(itemValue) => {
            setSelectedScreen(itemValue);
            navigation.navigate(itemValue,{ characterData : character });
          }}
        >
          <Picker.Item label={t('Main Scene')} value="Character1" />
          <Picker.Item label={t('Inventory')} value="Inventory" />
          <Picker.Item label={t('Character Details')} value="CharacterDetails" />
        </Picker>
      </View>

      <TextInput
        style={[styles.searchInput, { height: 40 * scaleFactor, fontSize: fontSize }]}
        placeholder={t('Search items')}
        placeholderTextColor="#808080"
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView horizontal style={styles.categoryContainer} showsHorizontalScrollIndicator={true}>
        {['All', 'weapon', 'armor', 'consumable', 'adventuring_gear', 'magic', 'other'].map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, { padding: 10 * scaleFactor }, selectedCategory === category && styles.selectedCategoryButton]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryButtonText, { fontSize: fontSize }]}>{t(category)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.goldBar}>
        <Text style={[styles.goldText, { fontSize: fontSize }]}>{t('Gold')}: {characterData.money}</Text>
      </View>

      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.nameColumn, { fontSize: fontSize * 0.9 }]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText, styles.weightColumn, { fontSize: fontSize * 0.9 }]}>{t('Weight')}</Text>
          <Text style={[styles.tableHeaderText, styles.quantityColumn, { fontSize: fontSize * 0.9 }]}>{t('QuantityInv')}</Text>
          <Text style={[styles.tableHeaderText, styles.costColumn, { fontSize: fontSize * 0.9 }]}>{t('CostInv')}</Text>
          <Text style={[styles.tableHeaderText, styles.actionsColumn, { fontSize: fontSize * 0.9 }]}>{t('Actions')}</Text>
        </View>
        {filteredItems.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCellFixInventory, styles.nameColumn, { fontSize: fontSize * 0.8, paddingVertical: 6 * scaleFactor }]}>{item.name}</Text>
            <Text style={[styles.tableCellFixInventory, styles.weightColumn, { fontSize: fontSize * 0.8, paddingVertical: 6 * scaleFactor }]}>{item.weight}</Text>
            <Text style={[styles.tableCellFixInventory, styles.quantityColumn, { fontSize: fontSize * 0.8, paddingVertical: 6 * scaleFactor }]}>{item.quantity}</Text>
            <Text style={[styles.tableCellFixInventory, styles.costColumn, { fontSize: fontSize * 0.8, paddingVertical: 6 * scaleFactor }]}>{item.cost}</Text>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(index)}>
              <Text style={[styles.removeButtonTextInvent, { fontSize: fontSize * 0.8 }]}>{t('Remove')}</Text>
            </TouchableOpacity>
               <TouchableOpacity key={index} style={styles.descriptionButton} onPress={() => handleItemPress(item)}>
                    <Text style={[styles.descriptionButtonText, { fontSize: fontSize }]}>{t('Description')}</Text>
               </TouchableOpacity>
           </View>
        ))}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >

        <View style={styles.modalContainerCharacter}>
        <View style={[styles.tableHeaderA, { paddingVertical: 10 * scaleFactor }]}>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Rarity')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Type')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Subtype')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Actions')}</Text>
        </View>
          <ScrollView style={styles.tableContainerCharacter}>
            {aItems.map((item, index) => {
              const { name, rarity, type, itemType } = item;
              return (
                <View key={item.id || index} style={[styles.tableRowCharacter, { paddingVertical: 10 * scaleFactor }]}>
                  <Text style={[styles.tableCellCharacter, { fontSize }]}>{name}</Text>
                  <Text style={[styles.tableCellCharacter, { fontSize: fontSize * 0.9 }]}>{rarity}</Text>
                  <Text style={[styles.tableCellCharacter, { fontSize }]}>{type}</Text>
                  <Text style={[styles.tableCellCharacter, { fontSize }]}>
                    {itemType.slice(0, 2).join(', ')}
                  </Text>
                  <TouchableOpacity style={styles.tableCellCharacter} onPress={() => handleAddItem(item)}>
                    <Text style={[styles.actionTextCharacter, { fontSize }]}>{t('AddItemChar')}</Text>

                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>

            <TouchableOpacity style={styles.closeButtonA} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>{t('Close')}</Text>
            </TouchableOpacity>

        </View>
      </Modal>

      <Modal
        visible={!!selectedItem}
        transparent={true}
        animationType="slide"
        onRequestClose={closeDescriptionModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContentInventory}>
            <Text style={[styles.modalTitleInv, { fontSize: fontSize * 1.2 }]}>{selectedItem?.name}</Text>
            <Text style={[styles.modalDescription, { fontSize: fontSize }]}>{selectedItem?.description}</Text>
            <TouchableOpacity onPress={closeDescriptionModal} style={[styles.cancelButton, { height: 20 * scaleFactor }]}>
              <Text style={[styles.cancelButtonText, { fontSize: fontSize }]}>{t('Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.summaryContainer}>
        <Text style={[styles.summaryTextLeft, { fontSize: fontSize }]}></Text>
        <TouchableOpacity style={[styles.addButtonInventory, { height: 45 * scaleFactor }]} onPress={() => setModalVisible(true)}>
          <Text style={[styles.addButtonText, { fontSize: fontSize }]}>{t('Add Item')}</Text>
        </TouchableOpacity>

        <Text style={[styles.summaryTextRight, { fontSize: fontSize }]}></Text>
      </View>


      <View style={styles.summaryContainerA}>
      <TouchableOpacity style={styles.equipButton} onPress={() => setEquipModalVisible(true)}>
        <Text style={[styles.equipButtonText, { fontSize: fontSize }]}>{t('Equipped')}</Text>
      </TouchableOpacity>
      </View>


      <Modal
        visible={isEquipModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEquipModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContentInventory}>
            <Text style={[styles.modalTitleInv, { fontSize: fontSize * 1.2 }]}>{t('Equipped Items')}</Text>

            {equipSlots.map((slot) => (
              <View key={slot.key} style={styles.equippedItemRow}>
                <Text style={[styles.equippedItemText, { fontSize: fontSize }]}>{slot.label}:</Text>

                {equippedItems[slot.key] ? (
                  <>
                    <Text style={[styles.equippedItemText, { fontSize: fontSize }]}>{equippedItems[slot.key].name}</Text>
                    <TouchableOpacity style={styles.unequipButton} onPress={() => handleUnequipItem(slot.key)}>
                      <Text style={[styles.unequipButtonText, { fontSize: fontSize * 0.8 }]}>{t('Unequip')}</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity style={styles.equipItemButton} onPress={() => setSelectedSlot(slot.key)}>
                    <Text style={[styles.equipItemButtonText, { fontSize: fontSize }]}>{t('Select')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {Object.keys(equippedItems).length === 0 && (
              <Text style={[styles.noEquipmentText, { fontSize: fontSize }]}>{t('No items equipped')}</Text>
            )}

            {selectedSlot && (
              <ScrollView style={styles.equipItemList}>
                {items
                  .filter((item) => item.category === selectedSlot)
                  .map((item) => (
                    <TouchableOpacity key={item.name} style={styles.equipItemButton} onPress={() => handleEquipItem(item)}>
                      <Text style={[styles.equipItemButtonText, { fontSize: fontSize }]}>{item.name} ({t(item.category)})</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            )}

            <TouchableOpacity onPress={() => setEquipModalVisible(false)} style={[styles.cancelButton, { height: 50 * scaleFactor }]}>
              <Text style={[styles.cancelButtonText, { fontSize: fontSize }]}>{t('Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

export default Inventory;