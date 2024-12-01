import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Button, ImageBackground } from 'react-native';
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

  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleInputChange = (field, value) => {
    setItem({ ...item, [field]: value });
  };

  const saveItem = () => {
    console.log('Item saved:', item);
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
