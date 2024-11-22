import React, { useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity, FlatList, Image, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const initialAttributes = {
  Strength: 8,
  Dexterity: 8,
  Constitution: 8,
  Intelligence: 8,
  Wisdom: 8,
  Charisma: 8,
};

const maxPoints = 27;

const CreateCharacter3 = ({ navigation, route }) => {
const handleGoBack = () => {
     navigation.navigate('CreateCharacter');
  };

  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const { selectedClassInfo, nickname } = route.params;

  const handleContinue = () => {
    navigation.navigate('CreateCharacter4', { selectedClassInfo, nickname });
  };

  const [attributes, setAttributes] = useState(initialAttributes);
  const [remainingPoints, setRemainingPoints] = useState(maxPoints);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const calculateCost = (current, target) => {
    let cost = 0;
    for (let i = current + 1; i <= target; i++) {
      cost += i > 13 ? 2 : 1;
    }
    return cost;
  };

  const handleAttributeSelect = (attribute) => {
    setSelectedAttribute(attribute);
    setModalVisible(true);
  };


  const handleValueChange = (newValue) => {
    const currentPoints = attributes[selectedAttribute];
    const cost = calculateCost(currentPoints, newValue);

    if (remainingPoints >= cost || newValue < currentPoints) {
      setAttributes({
        ...attributes,
        [selectedAttribute]: newValue,
      });
      setRemainingPoints(remainingPoints - cost + calculateCost(newValue, currentPoints));
      setModalVisible(false);
      setSelectedAttribute(null);
    }
  };

  const generateOptions = (currentPoints) => {
    const options = [];
    for (let i = 8; i <= 15; i++) {
      if (i < currentPoints) {
        const refund = calculateCost(i, currentPoints);
        options.push({ value: i, label: `${i} (+${refund} points)` });
      } else if (i > currentPoints) {
        const cost = calculateCost(currentPoints, i);
        if (remainingPoints >= cost) {
          options.push({ value: i, label: `${i} (-${cost} points)` });
        }
      } else {
        options.push({ value: i, label: `${i} (0 points)` });
      }
    }
    return options;
  };

  const getRemainingPointsColor = () => {
    if (remainingPoints >= 18) {
      return 'green';
    } else if (remainingPoints >= 9) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  return (
  <ImageBackground
         source={theme.background}
           style={styles.container}
         >

        <Text style={[styles.remainingPointsText, { color: getRemainingPointsColor() }]}>
          {t('Points_Remaining')}: {remainingPoints}/{maxPoints}
        </Text>

        {Object.keys(attributes).map((attribute) => (
          <TouchableOpacity key={attribute} onPress={() => handleAttributeSelect(attribute)}>
            <View style={styles.attributeContainer}>
              <Text style={styles.attributeText}>{attribute}: {attributes[attribute]}</Text>
            </View>
          </TouchableOpacity>
        ))}

      <View style={styles.GoBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={styles.GoBackText}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

        {selectedAttribute && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              setSelectedAttribute(null);
            }}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContentCharacter}>
                  {generateOptions(attributes[selectedAttribute]).map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => handleValueChange(option.value)}
                    >
                      <Text style={styles.modalOption}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}

        <View style={styles.ConButton}>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.ConButtonText}>{t('Continue')}</Text>
          </TouchableOpacity>
        </View>

    </ImageBackground>
  );
};

export default CreateCharacter3;