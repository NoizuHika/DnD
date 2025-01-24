import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { UserData } from './UserData';

const BackLibrary = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { ipv4 } = useContext(UserData);
  const [backLibrary, setBackLibrary] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [feats,setFeats]= useState([]);

  useEffect(() => {
   fetchData();
  }, []);

const fetchData = async () => {
            try {
                const backgroundResponse = await fetch(`http://${ipv4}:8000/backgrounds/all`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'accept': 'application/json'
                            }
                        });


                if (!backgroundResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const backgrounds= await backgroundResponse.json();
                setBackLibrary(backgrounds);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const filterBackLibrary = () => {
    return backLibrary.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filteredBackLibrary = filterBackLibrary();

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setEditedItem({ ...item });
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    setEditedItem(null);
    setIsEditing(false);
  };

  const handleEditChange = (field, value) => {
    setEditedItem((prevItem) => ({
      ...prevItem,
      [field]: value,
    }));
  };

  const saveItemChanges = () => {
    if (!editedItem) return;

    setBackLibrary((prevBackLibrary) =>
      prevBackLibrary.map((item) =>
        item.name === selectedItem.name ? editedItem : item
      )
    );

    setSelectedItem(editedItem);
    setIsEditing(false);
  };

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={t('Search library')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Skill Proficiencies')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Source')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Details')}</Text>
        </View>
        {filteredBackLibrary.length === 0 ? (
          <Text style={styles.noResultsText}>{t('No library found')}</Text>
        ) : (
          filteredBackLibrary.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.nameColumn]}>{item.name}</Text>
              <Text style={[styles.tableCell]}>
                  {Array.isArray(item.skillProficiencies) && item.skillProficiencies.length > 0
                                        ? item.skillProficiencies.join(', ')
                                        : t('None')}</Text>
              <Text style={[styles.tableCell]}>{item.source}</Text>
              <TouchableOpacity
                style={[styles.tableCell, styles.actionsColumn]}
                onPress={() => handleItemPress(item)}
              >
                <Text style={styles.actionText}>{t('Details')}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {selectedItem && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalOverlayItems}>

              <View style={styles.itemModal}>
                <Text style={styles.itemTitle}>{selectedItem.name}</Text>
                <Text style={styles.itemDescriptionAttune}>
                  {t('Skill Proficiencies')}: {selectedItem.skillProficiencies.join(', ') || t('None')}
                </Text>
                <Text style={styles.itemDescription}>
                  {console.log(selectedItem.languages)}
                   {t('Languages')}:{' '}
                    {Array.isArray(selectedItem.languages) && selectedItem.languages.length > 0
                      ? selectedItem.languages.join(', ')
                      : t('None')}
                </Text>
                <Text style={styles.itemDescription}>
                     {t('Tool Proficiencies')}:{' '}
                      {Array.isArray(selectedItem.toolProficiencies) && selectedItem.toolProficiencies.length > 0
                        ? selectedItem.toolProficiencies.join(', ')
                        : t('None')}
                </Text>
                <Text style={styles.itemDescription}>
                  {t('Equipment')}: {' '}
                  {Array.isArray(selectedItem.equipments) && selectedItem.equipments.length > 0
                              ? selectedItem.equipments.join(', ')
                              : t('None')}
                </Text>
                <Text style={styles.itemDescription}>
                  {t('Feature')}: {'\n'}
                   {Array.isArray(selectedItem.features) && selectedItem.features.length > 0
                      ? selectedItem.features.map((feature, index) => (
                              <Text key={index} style={styles.featureItem}>
                                {feature.name}{':\n'}
                                {feature.description}
                              </Text>
                            ))
                      : t('None')}
                </Text>
                <Text style={styles.itemDescription}>{selectedItem.description}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={closeItemModal} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Close')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>
        </Modal>
      )}

      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default BackLibrary;