import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { UserData } from './UserData';

const RulesGloss = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [rulesGloss, setRulesGloss] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRule, setSelectedRule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRule, setEditedRule] = useState(null);
    const { ipv4 } = useContext(UserData);
  useEffect(() => {
         fetchData();
       }, []);

   const fetchData = async () => {
         try {
             const [rulesResponse] = await Promise.all([
               fetch(`http://${ipv4}:8000/rules/all`)
             ]);

             if (!rulesResponse.ok) {
               throw new Error('Failed to fetch data');
             }

             const rules = await rulesResponse.json();
             setRulesGloss(rules);

           } catch (error) {
             console.error('Error fetching data:', error);
           }
         };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const filterRules = () => {
    return rulesGloss.filter((rule) =>
      rule.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filteredRules = filterRules();

  const handleRulePress = (rule) => {
    setSelectedRule(rule);
    setEditedRule({ ...rule });
  };

  const closeRuleModal = () => {
    setSelectedRule(null);
    setEditedRule(null);
    setIsEditing(false);
  };

  const handleEditChange = (field, value) => {
    setEditedRule((prevRule) => ({
      ...prevRule,
      [field]: value,
    }));
  };

  const saveRuleChanges = () => {
    if (!editedRule) return;

    setRulesGloss((prevRulesGloss) =>
      prevRulesGloss.map((rule) =>
        rule.name === selectedRule.name ? editedRule : rule
      )
    );

    setSelectedRule(editedRule);
    setIsEditing(false);
  };

  return (
    <ImageBackground source={theme.background} style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={t('Search rules')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Type')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Source')}</Text>
          <Text style={[styles.tableHeaderText]}>{t('Details')}</Text>
        </View>
        {filteredRules.length === 0 ? (
          <Text style={styles.noResultsText}>{t('No rules found')}</Text>
        ) : (
          filteredRules.map((rule, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.nameColumn]}>{rule.name}</Text>
              <Text style={[styles.tableCell]}>{rule.ruleType || t('None')}</Text>
              <Text style={[styles.tableCell]}>{rule.source}</Text>
              <TouchableOpacity
                style={[styles.tableCell, styles.actionsColumn]}
                onPress={() => handleRulePress(rule)}
              >
                <Text style={styles.actionText}>{t('Details')}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {selectedRule && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalOverlayItems}>
            {!isEditing ? (
              <View style={styles.itemModal}>
                <Text style={styles.itemTitle}>{selectedRule.name}</Text>
                <Text style={styles.itemDescriptionAttune}>
                  {t('Type')}: {selectedRule.ruleType || t('None')}
                </Text>
                <Text style={styles.itemDescription}>{selectedRule.description}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={closeRuleModal} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Close')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.itemModal}>
                <TextInput
                  style={styles.itemTitle}
                  value={editedRule.name}
                  onChangeText={(value) => handleEditChange('name', value)}
                  placeholder={t('Name')}
                />
                <TextInput
                  style={styles.itemDescriptionAttune}
                  value={editedRule.ruleType}
                  onChangeText={(value) => handleEditChange('type', value)}
                  placeholder={t('Type')}
                />
                <TextInput
                  style={styles.itemDescription}
                  value={editedRule.description}
                  onChangeText={(value) => handleEditChange('description', value)}
                  placeholder={t('Description')}
                  multiline
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={closeRuleModal} style={styles.closeButtonItem}>
                    <Text style={styles.closeButtonText}>{t('Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveRuleChanges} style={styles.editButton}>
                    <Text style={styles.editButtonText}>{t('Save')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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

export default RulesGloss;