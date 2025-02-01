import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { UserData } from './UserData';
import { SettingsContext } from './SettingsContext';
const RulesGloss: React.FC = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { fontSize, scaleFactor } = useContext(SettingsContext);

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
        style={[styles.searchInput, { fontSize: fontSize, height: 40 * scaleFactor }]}
        placeholder={t('Search rules')}
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView style={styles.tableContainer}>
        <View style={[styles.tableHeader, { paddingVertical: 10 * scaleFactor }]}>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Name')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Type')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Source')}</Text>
          <Text style={[styles.tableHeaderText, { fontSize: fontSize * 0.9 }]}>{t('Details')}</Text>
        </View>
        {filteredRules.length === 0 ? (
          <Text style={[styles.noResultsText, { fontSize: fontSize }]}>{t('No rules found')}</Text>
        ) : (
          filteredRules.map((rule, index) => (

            <View key={index} style={[styles.tableRow, { paddingVertical: 10 * scaleFactor }]}>
              <Text style={[styles.tableCell, styles.nameColumn, { fontSize: fontSize }]}>{rule.name}</Text>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{rule.ruleType || t('None')}</Text>
              <Text style={[styles.tableCell, { fontSize: fontSize }]}>{rule.source}</Text>
              <TouchableOpacity
                style={[styles.tableCell, styles.actionsColumn]}
                onPress={() => handleRulePress(rule)}
              >
                <Text style={[styles.actionText, { fontSize: fontSize }]}>{t('Details')}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {selectedRule && (
        <Modal visible={true} transparent={true} animationType="fade">
          <ScrollView contentContainerStyle={styles.modalOverlaySpells}>
            {!isEditing ? (

              <View style={[styles.itemModal, { padding: 20 * scaleFactor }]}>
                <Text style={[styles.itemTitle, { fontSize: fontSize * 1.2 }]}>{selectedRule.name}</Text>
                <Text style={[styles.itemDescriptionAttune, { fontSize: fontSize }]}>
                  {t('Type')}: {selectedRule.ruleType || t('None')}
                </Text>
                <Text style={[styles.itemDescription, { fontSize: fontSize }]}>{selectedRule.description}</Text>
                <View style={styles.modalButtons}>

                  <TouchableOpacity onPress={closeRuleModal} style={[styles.closeButtonItem, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.closeButtonText, { fontSize: fontSize }]}>{t('Close')}</Text>

                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={[styles.itemModal, { padding: 20 * scaleFactor }]}>
                <TextInput
                  style={[styles.itemTitle, { fontSize: fontSize * 1.2 }]}
                  value={editedRule.name}
                  onChangeText={(value) => handleEditChange('name', value)}
                  placeholder={t('Name')}
                  placeholderTextColor="#b5b5b5"
                />
                <TextInput

                  style={[styles.itemDescriptionAttune, { fontSize: fontSize }]}

                  value={editedRule.ruleType}
                  onChangeText={(value) => handleEditChange('type', value)}
                  placeholder={t('Type')}
                  placeholderTextColor="#b5b5b5"
                />
                <TextInput
                  style={[styles.itemDescription, { fontSize: fontSize }]}
                  value={editedRule.description}
                  onChangeText={(value) => handleEditChange('description', value)}
                  placeholder={t('Description')}
                  placeholderTextColor="#b5b5b5"
                  multiline
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={closeRuleModal} style={[styles.closeButtonItem, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.closeButtonText, { fontSize: fontSize }]}>{t('Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveRuleChanges} style={[styles.editButton, { padding: 10 * scaleFactor }]}>
                    <Text style={[styles.editButtonText, { fontSize: fontSize }]}>{t('Save')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </Modal>
      )}

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

export default RulesGloss;