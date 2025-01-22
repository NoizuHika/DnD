import React, { useState, useContext } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const MagicItemCreator: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const [itemType, setItemType] = useState('item');
  const [rarity, setRarity] = useState('');
  const [isDamageDiceOverride, setIsDamageDiceOverride] = useState(false);
  const [diceType, setDiceType] = useState('');
  const [diceCount, setDiceCount] = useState('');
  const [isFinesse, setIsFinesse] = useState(false);
  const [isRequiresAttunement, setRequiresAttunement] = useState(false);
  const [armorType, setArmorType] = useState('');
  const [dexBonus, setDexBonus] = useState('');
  const [requiresStealth, setRequiresStealth] = useState(false);
  const [strengthRequirement, setStrengthRequirement] = useState('');

  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [MagicItem, setItem] = useState({
    name: '',
    magicDescription: '',
    attunementDescription: '',
  });

  const handleGoBack = () => {
    navigation.goBack();
  };

  const saveMagicItem = () => {
    console.log('Magic Item saved:', item);
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

          <View style={[styles.centeredBlock, { marginTop: 60 * scaleFactor }]}>
            <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Name')}</Text>
            <TextInput
              style={[styles.inputItemCreator, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              placeholder={t('Enter item name')}
              value={MagicItem.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>

        <View style={[styles.rowCreateItemContainer, { marginTop: 10 * scaleFactor }]}>
          <View style={styles.column}>
            <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Item Type')}</Text>
            <Picker
              selectedValue={itemType}
              style={[styles.pickerMonCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
              onValueChange={(value) => setItemType(value)}
            >
              <Picker.Item label={t('Item')} value="item" />
              <Picker.Item label={t('Weapon')} value="weapon" />
              <Picker.Item label={t('Armor')} value="armor" />
            </Picker>
          </View>

          <View style={styles.column}>
            <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Rarity')}</Text>
            <Picker
              selectedValue={rarity}
              style={[styles.pickerMonCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
              onValueChange={(value) => setRarity(value)}
            >
              <Picker.Item label={t('Common')} value="common" />
              <Picker.Item label={t('Uncommon')} value="uncommon" />
              <Picker.Item label={t('Rare')} value="rare" />
              <Picker.Item label={t('Very Rare')} value="very_rare" />
              <Picker.Item label={t('Legendary')} value="legendary" />
              <Picker.Item label={t('Artifact')} value="Artifact" />
            </Picker>
          </View>
        </View>

        {itemType === 'item' && (
          <View style={styles.pickerLeftContainer}>
            <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Item Type')}</Text>
            <Picker
              selectedValue={armorType}
              style={[styles.pickerMonCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
              onValueChange={(value) => setArmorType(value)}
            >
              <Picker.Item label={t('Wondrous Item')} value="Wondrous_Item" />
              <Picker.Item label={t('Rod')} value="Rod" />
              <Picker.Item label={t('Scroll')} value="Scroll" />
              <Picker.Item label={t('Staff')} value="Staff" />
              <Picker.Item label={t('Wand')} value="Wand" />
              <Picker.Item label={t('Ring')} value="Ring" />
              <Picker.Item label={t('Potion')} value="Potion" />
            </Picker>

          </View>
        )}

        {itemType === 'weapon' && (
          <View style={styles.pickerLeftContainerA}>
          <View style={styles.column}>
            <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Base Weapon')}</Text>
            <Picker
              selectedValue={armorType}
              style={[styles.pickerMonCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
              onValueChange={(value) => setArmorType(value)}
            >
              <Picker.Item label={t('Longbow')} value="longbow" />
              <Picker.Item label={t('Longsword')} value="longsword" />
            </Picker>
          </View>

            {isDamageDiceOverride && (
              <View style={styles.twoColumnContainer}>
              <View style={styles.column}>
                <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Dice Type')}</Text>
                <Picker
                  selectedValue={diceType}
                  style={[styles.pickerMonCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
                  onValueChange={(value) => setDiceType(value)}
                >
                  <Picker.Item label="D4" value="d4" />
                  <Picker.Item label="D6" value="d6" />
                  <Picker.Item label="D8" value="d8" />
                  <Picker.Item label="D10" value="d10" />
                  <Picker.Item label="D12" value="d12" />
                  <Picker.Item label="D20" value="d20" />
                </Picker>

              </View>
              <View style={styles.column}>

                <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Dice Count')}</Text>
                <TextInput
                  style={[styles.inputMagicItemCreatorSmall, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
                  placeholder={t('Enter dice count')}
                  value={diceCount}
                  onChangeText={setDiceCount}
                  keyboardType="numeric"
                />
              </View>
              </View>
            )}

          <View style={styles.rowContainer}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={isDamageDiceOverride}
                onValueChange={(value) => setIsDamageDiceOverride(value)}
                tintColors={{ true: theme.checkboxActive, false: theme.checkboxInactive }}
              />
              <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Damage Dice Override')}</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <CheckBox
                value={isFinesse}
                onValueChange={(value) => setIsFinesse(value)}
                tintColors={{ true: theme.checkboxActive, false: theme.checkboxInactive }}
              />
              <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Is Finesse')}</Text>
            </View>
          </View>
        </View>

        )}

        {itemType === 'armor' && (
          <View style={styles.pickerLeftContainerA}>
          <View style={styles.twoColumnContainer}>
            <View style={styles.column}>
            <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Base Armor')}</Text>
            <Picker
              selectedValue={armorType}
              style={[styles.pickerMonCre, { width: 150 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
              onValueChange={(value) => setArmorType(value)}
            >
              <Picker.Item label={t('Light Armor')} value="light" />
              <Picker.Item label={t('Medium Armor')} value="medium" />
              <Picker.Item label={t('Heavy Armor')} value="heavy" />
            </Picker>

            </View>
            <View style={styles.column}>

            <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Max Dex Bonus')}</Text>
            <Picker
              selectedValue={dexBonus}
              style={[styles.pickerMonCre, { width: 150 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
              onValueChange={(value) => setDexBonus(value)}
            >
              <Picker.Item label={t('None')} value="None" />
              <Picker.Item label={t('Max 2')} value="Max_2" />
              <Picker.Item label={t('Full modifier')} value="Full_modifier" />
            </Picker>

            </View>
            <View style={styles.column}>

            <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Str Requirement')}</Text>
            <TextInput
              style={[styles.inputMagicItemCreatorSmall, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              placeholder={t('Enter Str Requirement')}
              value={strengthRequirement}
              onChangeText={setStrengthRequirement}
              keyboardType="numeric"
            />
          </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={requiresStealth}
                onValueChange={(value) => setRequiresStealth(value)}
                tintColors={{ true: theme.checkboxActive, false: theme.checkboxInactive }}
              />
              <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Requires Stealth')}</Text>
            </View>
          </View>
          </View>
        )}

        <View style={styles.centeredBlockDescription}>
          <View style={styles.centeredBlockMagicItemCont}>
            <Text style={[styles.labelMagicItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Magic item description')}</Text>
            <TextInput
              style={[styles.inputItemCreator, { height: 100 * scaleFactor, width: 300 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              multiline
              placeholder={t('Enter magic item description')}
              value={MagicItem.magicDescription}
              onChangeText={(text) => handleInputChange('description', text)}
            />
          </View>

            <View style={styles.checkboxContainerMagicItem}>
              <CheckBox
                value={isRequiresAttunement}
                onValueChange={(value) => setRequiresAttunement(value)}
                tintColors={{ true: theme.checkboxActive, false: theme.checkboxInactive }}
              />
              <Text style={[styles.label, { fontSize: fontSize, color: theme.textColor }]}>{t('Requires Attunement')}</Text>
            </View>

          <View style={styles.centeredBlockA}>
            <Text style={[styles.labelMagicItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Attunement description')}</Text>
            <TextInput
              style={[styles.inputItemCreator, { width: 300 * scaleFactor, height: 100 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              multiline
              placeholder={t('Enter attunement description')}
              value={MagicItem.attunementDescription}
              onChangeText={(text) => handleInputChange('description', text)}
            />
          </View>
        </View>
      </ScrollView>

        <View style={[styles.saveButton, { marginBottom: 10 * scaleFactor }]}>
          <TouchableOpacity style={[styles.buttonMonstrum, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={saveMagicItem}>
            <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 200 * scaleFactor }]}>
              <Text style={[styles.GoBackText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Save Magic Item')}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default MagicItemCreator;