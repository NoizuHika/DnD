import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SettingsContext } from './SettingsContext';

const SetupHome: React.FC = () => {
  const { setFontSize, setScaleFactor } = useContext(SettingsContext);
  const navigation = useNavigation();

  const handleSelect = (size: 'small' | 'medium' | 'large') => {
    if (size === 'small') {
      setFontSize(12);
      setScaleFactor(0.8);
    } else if (size === 'medium') {
      setFontSize(20);
      setScaleFactor(1.0);
    } else if (size === 'large') {
      setFontSize(24);
      setScaleFactor(1.2);
    }
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите размер интерфейса:</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleSelect('small')}>
        <Text style={styles.buttonText}>Маленький</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleSelect('medium')}>
        <Text style={styles.buttonText}>Средний</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleSelect('large')}>
        <Text style={styles.buttonText}>Большой</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SetupHome;