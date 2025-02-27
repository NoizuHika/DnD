import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Button, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { SettingsContext } from './SettingsContext';
import { useAuth } from './AuthContext';
import { UserData } from './UserData';
const ItemCreator: React.FC = ({ navigation }) => {
      const { token } = useAuth();
      const { ipv4 } = useContext(UserData);
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const [item, setItem] = useState({
    name: '',
    gold: '',
    silver: '',
    copper: '',
    weight: '',
    description: '',
    diceNumber: '',
    diceType: '',
    damageType: '',
    specification: '',
    dexBonus: '',
    stealthDisadvantage: false,
    properties: '',
  });

  const [selectedType, setSelectedType] = useState('Type');
  const [selectedSubtype, setSelectedSubtype] = useState('Subtype');
  const [selectedRarity, setSelectedRarity] = useState('Rarity');

  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const categories = ['Type', 'weapon', 'armor', 'adventuring_gear', 'consumable', 'magic', 'other'];
  const rarities = ['Rarity', 'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'];

  const handleSubtypePicker = (type) => {
    if (type === 'weapon') return ['Sword', 'Dagger', 'Hammer', 'Polearm'];
    if (type === 'armor') return ['Plate Armor', 'Shield', 'Leather Armor'];
    if (type === 'adventuring_gear') return ['Magic Container', 'Tool', 'Instrument'];
    if (type === 'consumable') return ['Potion', 'Elixir'];
    if (type === 'magic') return ['Wand', 'Scroll', 'Staff'];
    if (type === 'other') return ['Treasure', 'Alchemical Item'];
    return [];
  };

  const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
  const damageTypes = ['Slashing', 'Piercing', 'Bludgeoning', 'Fire', 'Cold', 'Lightning', 'Acid', 'Thunder', 'Poison', 'Radiant', 'Necrotic', 'Psychic', 'Force'];

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
    if (!item.name.trim() || selectedType === 'Type' || selectedRarity === 'Rarity') {
      alert(t('Please enter a valid item name.'));
      return;
    }
    addNewItem();
  };
const addNewItem = async () => {

  try {
     const requestBody = {
         token: token,
         name: item.name,
         description: item.description|| null,
         dexBonus: item.dexBonus|| 0,
         stealthDisadvantage: String(item.stealthDisadvantage)|| "False",
         damageType: item.damageType|| null,
         diceNumber: item.diceNumber|| 0,
         diceType: item.diceType|| null,
         specification: item.specification|| null,
         properties: item.properties|| null,
         value: `${String(item.gold || 0)} gp, ${String(item.silver || 0)} sp, ${String(item.copper || 0)} cp`,
         weight: `${String(item.weight || 0)} lb`,
         type: selectedType|| null,
         itemType: [selectedSubtype]|| [],
         rarity: selectedRarity|| null};
         console.log(requestBody)
    const response = await fetch(`http://${ipv4}:8000/items/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    console.log('New session:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
  fetchData();
};
  return (
    <ImageBackground source={theme.background} style={styles.containerCreator}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

          <View style={[styles.centeredBlock, { marginTop: 40 * scaleFactor }]}>
            <Text style={[styles.labelNameItemCreA, { fontSize: fontSize, color: theme.textColor }]}>{t('Name')}</Text>
            <TextInput
              style={[styles.inputItemCreator, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              placeholder={t('Enter item name')}
              value={item.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>

          <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
            <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Cost')}</Text>
            <View style={styles.rowCreateItemContainer}>
              <View style={styles.column}>
                <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Gold')}</Text>
                <TextInput
                  style={[styles.inputItemCreatorA, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
                  placeholder={t('Enter gold')}
                  value={item.gold}
                  onChangeText={(text) => handleInputChange('gold', text)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.column}>
                <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Silver')}</Text>
                <TextInput
                  style={[styles.inputItemCreatorA, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
                  placeholder={t('Enter silver')}
                  value={item.silver}
                  onChangeText={(text) => handleInputChange('silver', text)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.column}>
                <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Copper')}</Text>
                <TextInput
                  style={[styles.inputItemCreatorA, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
                  placeholder={t('Enter copper')}
                  value={item.copper}
                  onChangeText={(text) => handleInputChange('copper', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
            <Text style={[styles.labelNameItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Weight')}</Text>
            <TextInput
              style={[styles.inputItemCreatorSmall, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              placeholder={t('Enter item weight')}
              value={item.weight}
              onChangeText={(text) => handleInputChange('weight', text)}
              keyboardType="numeric"
            />
          </View>

        <View style={styles.rowCreateItemContainer}>
         <View style={styles.column}>
          <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
           <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Type')}</Text>
           <Picker
             selectedValue={selectedType}
            style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
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
          <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
             <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Subtype')}</Text>
             <Picker
               selectedValue={selectedSubtype}
               style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
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

        {selectedType === 'weapon' && (
          <>
          <View style={styles.rowCreateItemContainer}>
            <View style={styles.column}>
            <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
              <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Dice Number')}</Text>
              <TextInput
                style={[styles.inputItemCreatorA, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
                placeholder={t('Enter dice number')}
                value={item.diceNumber}
                onChangeText={(text) => handleInputChange('diceNumber', text)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
              <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Dice Type')}</Text>
              <Picker
                selectedValue={item.diceType}
                style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
                onValueChange={(value) => handleInputChange('diceType', value)}
              >
                {diceTypes.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.column}>
            <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
              <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Damage Type')}</Text>
              <Picker
                selectedValue={item.damageType}
                style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
                onValueChange={(value) => handleInputChange('damageType', value)}
              >
                {damageTypes.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>

            <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
              <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Specification')}</Text>
              <TextInput
                style={[styles.inputItemCreatorA, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
                placeholder={t('Enter specification')}
                value={item.specification}
                onChangeText={(text) => handleInputChange('specification', text)}
              />
            </View>
           </View>
           </View>
          </>
        )}

        {selectedType === 'armor' && (
          <>
          <View style={styles.rowCreateItemContainer}>
            <View style={styles.column}>
            <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
              <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Dexterity Bonus')}</Text>
              <TextInput
                style={[styles.inputItemCreatorA, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
                placeholder={t('Enter dexterity bonus')}
                value={item.dexBonus}
                onChangeText={(text) => handleInputChange('dexBonus', text)}
                keyboardType="numeric"
              />
            </View>

             </View>
             <View style={styles.column}>
            <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
              <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Properties')}</Text>
              <TextInput
                style={[styles.inputItemCreatorA, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
                placeholder={t('Enter properties')}
                value={item.properties}
                onChangeText={(text) => handleInputChange('properties', text)}
              />
            </View>
            </View>
            </View>
            <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
              <Text style={[styles.labelNameItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Stealth Disadvantage')}</Text>
              <Picker
                selectedValue={item.stealthDisadvantage}
                style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
                onValueChange={(value) => handleInputChange('stealthDisadvantage', value)}
              >
                <Picker.Item label={t('No')} value={false} />
                <Picker.Item label={t('Yes')} value={true} />
              </Picker>
            </View>
          </>
        )}

          <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
           <Text style={[styles.labelNameItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Rarity')}</Text>
           <Picker
             selectedValue={selectedRarity}
             style={[styles.pickerMagicItemCre, { width: 250 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
             onValueChange={(value) => setSelectedRarity(value)}
           >
             {rarities.map((rarity) => (
               <Picker.Item key={rarity} label={t(rarity)} value={rarity} />
             ))}
           </Picker>
         </View>

          <View style={[styles.centeredBlock, { marginTop: 10 * scaleFactor }]}>
            <Text style={[styles.labelNameItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Description')}</Text>
            <TextInput
              style={[styles.inputItemCreator, { height: 100 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              multiline
              placeholder={t('Enter item description')}
              value={item.description}
              onChangeText={(text) => handleInputChange('description', text)}
            />
          </View>

        </ScrollView>

        <View style={[styles.saveButton, { marginBottom: 10 * scaleFactor }]}>
          <TouchableOpacity style={[styles.buttonMonstrum, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={saveItem}>
            <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 200 * scaleFactor }]}>
              <Text style={[styles.GoBackText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Save Item')}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default ItemCreator;