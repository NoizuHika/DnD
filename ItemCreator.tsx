import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Button, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const ItemCreator = ({ navigation }) => {
  const [item, setItem] = useState({
    name: '',
    gold: '',
    silver: '',
    copper: '',
    weight: '',
    description: '',
  });

  const [selectedType, setSelectedType] = useState('Type');
  const [selectedSubtype, setSelectedSubtype] = useState('Subtype');
  const [selectedRarity, setSelectedRarity] = useState('Rarity');

  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const categories = ['Type', 'Weapon', 'Armor', 'Tools', 'Potions', 'Scrolls', 'Adventuring Gear', 'Other'];
  const rarities = ['Rarity', 'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'];

  const handleSubtypePicker = (type) => {
    if (type === 'Weapon') return ['Sword', 'Dagger', 'Hammer', 'Polearm'];
    if (type === 'Armor') return ['Plate Armor', 'Shield', 'Leather Armor'];
    if (type === 'Adventuring Gear') return ['Magic Container', 'Tool', 'Instrument'];
    if (type === 'Consumable') return ['Potion', 'Elixir'];
    if (type === 'Magic') return ['Wand', 'Scroll', 'Staff'];
    if (type === 'Other') return ['Treasure', 'Alchemical Item'];
    return [];
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const validateNumberInput = (text) => {
    return text.replace(/[^0-9]/g, '');
  };

  const handleInputChange = (field, value) => {
    if (['gold', 'silver', 'copper', 'weight'].includes(field)) {
      value = validateNumberInput(value);
    }
    setItem({ ...item, [field]: value });
  };

  const saveItem = () => {
    const newItem = {
      ...item,
      type: selectedType,
      subtype: selectedSubtype,
      rarity: selectedRarity,
    };
    console.log('Item saved:', newItem);
  };

  return (
    <ImageBackground source={theme.background} style={styles.containerCreator}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.GoBack}>
          <TouchableOpacity style={styles.button} onPress={handleGoBack}>
            <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
              <Text style={styles.GoBackText}>{t('Go_back')}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

          <View style={styles.centeredBlock}>
            <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Name')}</Text>
            <TextInput
              style={styles.inputItemCreator}
              placeholder={t('Enter item name')}
              value={item.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>

          <View style={styles.centeredBlock}>
            <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Cost')}</Text>
            <View style={styles.rowCreateItemContainer}>
              <View style={styles.column}>
                <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Gold')}</Text>
                <TextInput
                  style={styles.inputItemCreatorSmall}
                  placeholder={t('Enter gold')}
                  value={item.gold}
                  onChangeText={(text) => handleInputChange('gold', text)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.column}>
                <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Silver')}</Text>
                <TextInput
                  style={styles.inputItemCreatorSmall}
                  placeholder={t('Enter silver')}
                  value={item.silver}
                  onChangeText={(text) => handleInputChange('silver', text)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.column}>
                <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Copper')}</Text>
                <TextInput
                  style={styles.inputItemCreatorSmall}
                  placeholder={t('Enter copper')}
                  value={item.copper}
                  onChangeText={(text) => handleInputChange('copper', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.centeredBlock}>
            <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Weight')}</Text>
            <TextInput
              style={styles.inputItemCreatorSmall}
              placeholder={t('Enter item weight')}
              value={item.weight}
              onChangeText={(text) => handleInputChange('weight', text)}
              keyboardType="numeric"
            />
          </View>

        <View style={styles.rowCreateItemContainer}>
         <View style={styles.column}>
         <View style={styles.centeredBlock}>
           <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Type')}</Text>
           <Picker
             selectedValue={selectedType}
             style={styles.pickerMagicItemCre}
             onValueChange={(value) => {
               setSelectedType(value);
               setSelectedSubtype('Subtype');
             }}
           >
             {categories.map((category) => (
               <Picker.Item key={category} label={t(category)} value={category} />
             ))}
           </Picker>
         </View>
         </View>

         <View style={styles.column}>
         {selectedType !== 'Type' && (
           <View style={styles.centeredBlock}>
             <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Subtype')}</Text>
             <Picker
               selectedValue={selectedSubtype}
               style={styles.pickerMagicItemCre}
               onValueChange={(value) => setSelectedSubtype(value)}
             >
               <Picker.Item label={t('Subtype')} value="Subtype" />
               {handleSubtypePicker(selectedType).map((subtype) => (
                 <Picker.Item key={subtype} label={t(subtype)} value={subtype} />
               ))}
             </Picker>
           </View>
         )}
         </View>
         </View>

         <View style={styles.centeredBlock}>
           <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Rarity')}</Text>
           <Picker
             selectedValue={selectedRarity}
             style={styles.pickerMagicItemCre}
             onValueChange={(value) => setSelectedRarity(value)}
           >
             {rarities.map((rarity) => (
               <Picker.Item key={rarity} label={t(rarity)} value={rarity} />
             ))}
           </Picker>
         </View>

          <View style={styles.centeredBlock}>
            <Text style={[styles.labelItemCre, { color: theme.textColor }]}>{t('Description')}</Text>
            <TextInput
              style={[styles.inputItemCreator, { height: 100 }]}
              multiline
              placeholder={t('Enter item description')}
              value={item.description}
              onChangeText={(text) => handleInputChange('description', text)}
            />
          </View>

        </ScrollView>

        <View style={styles.saveButton}>
          <TouchableOpacity style={styles.buttonMonstrum} onPress={saveItem}>
            <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
              <Text style={styles.GoBackText}>{t('Save Item')}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default ItemCreator;