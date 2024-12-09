import React, { useState, useEffect, useContext } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const Encounters = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [encounters, setEncounters] = useState([
    { id: 1, name: 'Forest Encounter', campaign: 'Campaign 1', level: 1 },
    { id: 2, name: 'Cave Encounter', campaign: 'Campaign 1', level: 3 },
    { id: 3, name: 'Town Encounter', campaign: 'Campaign 1', level: 5 },
  ]);

  const updateEncounters = (updatedEncounters) => {
    setEncounters(updatedEncounters);
  };

  useEffect(() => {
    if (route.params?.updatedEncounter) {
      const updatedList = encounters.map((e) =>
        e.id === route.params.updatedEncounter.id ? route.params.updatedEncounter : e
      );
      updateEncounters(updatedList);
    }
  }, [route.params?.updatedEncounter]);

  const handleEditEncounter = (encounter) => {
    navigation.navigate('EncounterEdit', { encounter });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRunEncounter = (encounter) => {
    navigation.navigate('EncounterRun', { encounter });
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
              </View>
            </View>
          ))}
      </ScrollView>
        </View>
    </ImageBackground>
  );
};

export default Encounters;
