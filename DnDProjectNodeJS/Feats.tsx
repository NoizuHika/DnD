import React, { useState, useContext } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const feats = require('./assets/Library/feats.json');

const Feats = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [searchText, setSearchText] = useState('');
  const [selectedCR, setSelectedCR] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedFeat, setSelectedFeat] = useState(null);

  const crOptions = [0.25, 1, 2, 5, 10, 20, 24];
  const typeOptions = ['Dragon', 'Humanoid', 'Aberration'];
  const environmentOptions = ['Underground', 'Forest', 'Mountains'];

  const categories = ['Type', 'Creature', 'Monster'];
  const environmentCategories = ['Environment'];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const filterFeats = () => {
    let filtered = feats;

    if (searchText) {
      filtered = filtered.filter((feat) =>
        feat.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCR !== null) {
      filtered = filtered.filter((feat) => feat.cr === selectedCR);
    }

    if (selectedType) {
      filtered = filtered.filter((feat) => feat.type === selectedType);
    }

    if (selectedEnvironment) {
      filtered = filtered.filter((feat) => feat.environment === selectedEnvironment);
    }

    return filtered;
  };

  const filteredFeats = filterFeats();

  const handleFeatPress = (feat) => {
    setSelectedFeat(feat);
  };

  const closeFeatModal = () => {
    setSelectedFeat(null);
  };

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder={t('Search feats')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.pickerItemsContainer}>
        <Picker
          selectedValue={selectedType}
          style={styles.pickerItems}
          onValueChange={(value) => setSelectedType(value)}
        >
          <Picker.Item label={t('Type')} value={null} />
          {typeOptions.map((type) => (
            <Picker.Item key={type} label={t(type)} value={type} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedCR}
          style={styles.pickerItems}
          onValueChange={(value) => setSelectedCR(value)}
        >
          <Picker.Item label={t('CR')} value={null} />
          {crOptions.map((cr) => (
            <Picker.Item key={cr} label={t('CR') + ' ' + cr} value={cr} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedEnvironment}
          style={styles.pickerItems}
          onValueChange={(value) => setSelectedEnvironment(value)}
        >
          <Picker.Item label={t('Environment')} value={null} />
          {environmentOptions.map((env) => (
            <Picker.Item key={env} label={t(env)} value={env} />
          ))}
        </Picker>
      </View>

      <ScrollView style={styles.tableContainer}>
        {filteredFeats.length === 0 ? (
          <Text style={styles.noResultsText}>{t('No feats found')}</Text>
        ) : (
          filteredFeats.map((feat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tableRow}
              onPress={() => handleFeatPress(feat)}
            >
              <Text style={styles.tableCell}>{feat.name}</Text>
              <Text style={styles.tableCell}>{t('CR')}: {feat.cr}</Text>
              <Text style={styles.tableCell}>{t('Type')}: {feat.type}</Text>
              <Text style={styles.tableCell}>{t('Environment')}: {feat.environment}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal visible={!!selectedFeat} transparent={true} animationType="slide" onRequestClose={closeFeatModal}>
        <View style={styles.modalOverlayItems}>
          <View style={styles.itemModal}>
            <Text style={styles.itemTitle}>{selectedFeat?.name}</Text>
            <Text style={styles.itemDescription}>
              {selectedFeat?.description}
            </Text>
            <Text style={styles.itemDetails}>
              {t('CR')}: {selectedFeat?.cr} | {t('Type')}: {selectedFeat?.type} | {t('Environment')}: {selectedFeat?.environment}
            </Text>
            <TouchableOpacity onPress={closeFeatModal} style={styles.closeButtonItem}>
              <Text style={styles.closeButtonText}>{t('Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default Feats;
