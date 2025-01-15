import React, { useState, useEffect, useContext } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';

Appearance.setColorScheme('light');

const Encounters = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [encounters, setEncounters] = useState([
    { id: 1, name: 'Forest Encounter', campaign: 'Campaign 1', level: 1 },
    { id: 2, name: 'Cave Encounter', campaign: 'Campaign 1', level: 3 },
    { id: 3, name: 'Town Encounter', campaign: 'Campaign 1', level: 5 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newEncounter, setNewEncounter] = useState({
    name: '',
    campaign: '',
    level: '',
  });

  const handleAddEncounter = () => {
    if (!newEncounter.name || !newEncounter.campaign || !newEncounter.level) {
      Alert.alert(t('Error'), t('Please fill all fields'));
      return;
    }

    const newId = encounters.length ? Math.max(...encounters.map((e) => e.id)) + 1 : 1;
    const encounterToAdd = { ...newEncounter, id: newId, level: parseInt(newEncounter.level) };
    setEncounters((prev) => [...prev, encounterToAdd]);
    setNewEncounter({ name: '', campaign: '', level: '' });
    setModalVisible(false);
  };

  const handleDeleteEncounter = (id) => {
    Alert.alert(
      t('Delete Encounter'),
      t('Are you sure you want to delete this encounter?'),
      [
        { text: t('Cancel'), style: 'cancel' },
        {
          text: t('Delete'),
          style: 'destructive',
          onPress: () => {
            const filteredEncounters = encounters.filter((e) => e.id !== id);
            setEncounters(filteredEncounters);
          },
        },
      ]
    );
  };

  const handleEditEncounter = (encounter) => {
    navigation.navigate('EncounterEdit', { encounter });
  };

  const handleRunEncounter = (encounter) => {
    navigation.navigate('EncounterRun', { encounter });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground source={theme.background} style={styles.containerCreator}>
      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <View style={styles.tableContainerEncounter}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>{t('Name')}</Text>
          <Text style={styles.tableHeaderText}>{t('Campaign')}</Text>
          <Text style={styles.tableHeaderText}>{t('Level')}</Text>
          <Text style={styles.tableHeaderText}>{t('Action')}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {encounters.map((encounter) => (
            <View key={encounter.id} style={styles.tableRow}>
              <Text style={styles.tableCellEncounter}>{encounter.name}</Text>
              <Text style={styles.tableCellEncounter}>{encounter.campaign}</Text>
              <Text style={styles.tableCellEncounter}>{encounter.level}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditEncounter(encounter)}
                >
                  <Text style={styles.editButtonText}>{t('Edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.runButton}
                  onPress={() => handleRunEncounter(encounter)}
                >
                  <Text style={styles.runButtonText}>{t('Run')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButtonEncounter}
                  onPress={() => handleDeleteEncounter(encounter.id)}
                >
                  <Text style={styles.deleteButtonTextEncounter}>{t('Delete')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.addButtonEncounter}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonTextEncounter}>{t('Add Encounter')}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentEncounter}>
            <Text style={styles.modalTitleEncounterName}>{t('Add Encounter')}</Text>
            <TextInput
              placeholder={t('Name')}
              style={styles.modalInputEncounter}
              value={newEncounter.name}
              onChangeText={(text) => setNewEncounter((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
              placeholder={t('Campaign')}
              style={styles.modalInputEncounter}
              value={newEncounter.campaign}
              onChangeText={(text) => setNewEncounter((prev) => ({ ...prev, campaign: text }))}
            />
            <TextInput
              placeholder={t('Level')}
              style={styles.modalInputEncounter}
              keyboardType="numeric"
              value={newEncounter.level}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setNewEncounter((prev) => ({ ...prev, level: numericValue }));
              }}
            />
            <View style={styles.modalActionsEncounter}>
              <TouchableOpacity
                style={styles.cancelButtonEncounter}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonTextEncounter}>{t('Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButtonEncounter}
                onPress={handleAddEncounter}
              >
                <Text style={styles.confirmButtonTextEncounter}>{t('Add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default Encounters;
