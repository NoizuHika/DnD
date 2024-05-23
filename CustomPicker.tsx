import React, { useState } from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const Picker = ({ title, options }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>{title}</Text>
      <Picker
        selectedValue={selectedOption}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedOption(itemValue)}
      >
        {options.map((option, index) => (
          <Picker.Item key={index} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    marginVertical: 5,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  picker: {
    height: 50,
    width: 200,
    color: '#ffffff',
    backgroundColor: '#333333',
    borderRadius: 5,
    marginVertical: 10,
  },
});

export default Picker;
