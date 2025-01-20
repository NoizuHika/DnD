import React, { useState, useContext } from 'react';
import { Modal, ImageBackground, StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import sampleItems from './items.json';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const Inventory: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [selectedScreen, setSelectedScreen] = useState('Inventory');
  const [isModalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', weight: 0, quantity: 0, cost: 0, description: '', category: '' });
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState(sampleItems.items || []);
  const [gold, setGold] = useState(sampleItems.gold || 0);



  const handleSpendGold = (amount) => {
    if (gold >= amount) {
      setGold((prevGold) => prevGold - amount);
    } else {
      alert(t('Not enough gold!'));
    }
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
  };
  const closeDescriptionModal = () => {
    setSelectedItem(null);
  };

  const handleGoBack = () => {
    navigation.navigate('Characters');
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


  const handleRemoveItem = (index) => {
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
    const matchesCategory = selectedCategory === 'All' || item.category.includes(selectedCategory);
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

 const categories = ['All', 'Weapon', 'Armor', 'Ammunition', 'Tools', 'Potions', 'Scrolls', 'Magic Items', 'Adventuring Gear', 'Other'];

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <View style={[styles.dropdownContainerCharacter, { height: 50 * scaleFactor }]}>
        <Picker
          selectedValue={selectedScreen}
          style={[styles.pickerChooseChar, { width: 200 * scaleFactor }]}
          onValueChange={(itemValue) => {
            setSelectedScreen(itemValue);
            navigation.navigate(itemValue);
          }}
        >
          <Picker.Item label={t('Main Scene')} value="Character1" />
          <Picker.Item label={t('Inventory')} value="Inventory" />
          <Picker.Item label={t('Character Details')} value="CharacterDetails" />
        </Picker>
      </View>

      {/* search input */}
      <TextInput
        style={[styles.searchInput, { height: 40 * scaleFactor, fontSize: fontSize }]}
        placeholder={t('Search items')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* category filter maxHeight: 50, */}
      <ScrollView horizontal style={styles.categoryContainer} showsHorizontalScrollIndicator={true}>
        {['All', 'Weapon', 'Armor', 'Ammunition', 'Tools', 'Potions', 'Scrolls', 'Magic Items', 'Adventuring Gear', 'Other'].map(category => (
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
        <Text style={[styles.goldText, { fontSize: fontSize }]}>{t('Gold')}: {gold} {t('gold')}</Text>
      </View>

      {/* items list */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.nameColumn, { fontSize: fontSize }]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText, styles.weightColumn, { fontSize: fontSize }]}>{t('Weight')}</Text>
          <Text style={[styles.tableHeaderText, styles.quantityColumn, { fontSize: fontSize }]}>{t('Quantity')}</Text>
          <Text style={[styles.tableHeaderText, styles.costColumn, { fontSize: fontSize }]}>{t('Cost')}</Text>
          <Text style={[styles.tableHeaderText, styles.actionsColumn, { fontSize: fontSize }]}>{t('Actions')}</Text>
        </View>
        {filteredItems.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCellFixInventory, styles.nameColumn, { fontSize: fontSize * 0.8, paddingVertical: 6 * scaleFactor }]}>{item.name}</Text>
            <Text style={[styles.tableCellFixInventory, styles.weightColumn, { fontSize: fontSize * 0.8, paddingVertical: 6 * scaleFactor }]}>{item.weight}</Text>
            <Text style={[styles.tableCellFixInventory, styles.quantityColumn, { fontSize: fontSize * 0.8, paddingVertical: 6 * scaleFactor }]}>{item.quantity}</Text>
            <Text style={[styles.tableCellFixInventory, styles.costColumn, { fontSize: fontSize * 0.8, paddingVertical: 6 * scaleFactor }]}>{item.cost}</Text>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(index)}>
              <Text style={[styles.removeButtonTextInvent, { fontSize: fontSize }]}>{t('Remove')}</Text>
            </TouchableOpacity>
               <TouchableOpacity key={index} style={styles.descriptionButton} onPress={() => handleItemPress(item)}>
                    <Text style={[styles.descriptionButtonText, { fontSize: fontSize }]}>{t('Description')}</Text>
               </TouchableOpacity>
           </View>
        ))}
      </ScrollView>

      {/* add item */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContentInventory}>
            <Text style={[styles.modalTitleInv, { fontSize: fontSize * 1.2 }]}>{t('Add New Item')}</Text>
              <Text style={[styles.invItemDescription, { fontSize: fontSize }]}>{t('Name')}</Text>
            <TextInput
              placeholder={t('Name')}
              style={[styles.inputInventory, { height: 40 * scaleFactor, fontSize: fontSize }]}
              value={newItem.name}
              onChangeText={(text) => setNewItem({ ...newItem, name: text })}
            />
              <Text style={[styles.invItemDescription, { fontSize: fontSize }]}>{t('Weight')}</Text>
            <TextInput
              placeholder={t('Weight')}
              style={[styles.inputInventory, { height: 40 * scaleFactor, fontSize: fontSize }]}
              value={newItem.weight.toString()}
              onChangeText={(text) => setNewItem({ ...newItem, weight: parseFloat(text) || 0 })}
              keyboardType="numeric"
            />
              <Text style={[styles.invItemDescription, { fontSize: fontSize }]}>{t('Quantity')}</Text>
            <TextInput
              placeholder={t('Quantity')}
              style={[styles.inputInventory, { height: 40 * scaleFactor, fontSize: fontSize }]}
              value={newItem.quantity.toString()}
              onChangeText={(text) => setNewItem({ ...newItem, quantity: parseInt(text) || 0 })}
              keyboardType="numeric"
            />
              <Text style={[styles.invItemDescription, { fontSize: fontSize }]}>{t('Cost')}</Text>
            <TextInput
              placeholder={t('Cost')}
              style={[styles.inputInventory, { height: 40 * scaleFactor, fontSize: fontSize }]}
              value={newItem.cost.toString()}
              onChangeText={(text) => setNewItem({ ...newItem, cost: parseFloat(text) || 0 })}
              keyboardType="numeric"
            />
              <Text style={[styles.invItemDescription, { fontSize: fontSize }]}>{t('Description')}</Text>
            <TextInput
              placeholder={t('Description')}
              style={[styles.inputInventory, { height: 40 * scaleFactor, fontSize: fontSize }]}
              value={newItem.description}
              onChangeText={(text) => setNewItem({ ...newItem, description: text })}
            />
            <Picker
              selectedValue={newItem.category}
              style={[styles.inputInventory, { height: 50 * scaleFactor }]}
              onValueChange={(itemValue) => setNewItem({ ...newItem, category: itemValue })}
            >
              {categories.map((category) => (
                <Picker.Item key={category} label={t(category)} value={category} />
              ))}
            </Picker>

            <TouchableOpacity onPress={handleAddManualItem} style={[styles.addButtonInventory, { height: 50 * scaleFactor }]}>
              <Text style={[styles.addButtonText, { fontSize: fontSize }]}>{t('Add Item')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.cancelButton, { height: 50 * scaleFactor }]}>
              <Text style={[styles.cancelButtonText, { fontSize: fontSize }]}>{t('Cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* description */}
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
        <Text style={[styles.summaryTextLeft, { fontSize: fontSize }]}>{calculateTotalWeight()} {t('kg')}</Text>
        <TouchableOpacity style={[styles.addButtonInventory, { height: 45 * scaleFactor }]} onPress={() => setModalVisible(true)}>
          <Text style={[styles.addButtonText, { fontSize: fontSize }]}>{t('Add Item')}</Text>
        </TouchableOpacity>
        <Text style={[styles.summaryTextRight, { fontSize: fontSize }]}>{calculateTotalCost()} {t('gold')}</Text>
      </View>

      <TouchableOpacity style={[styles.autoAddButton, { height: 45 * scaleFactor }]} onPress={handleAddItemsFromJSON}>
        <Text style={[styles.autoAddButtonText, { fontSize: fontSize }]}>{t('Add Automatically')}</Text>
      </TouchableOpacity>

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
