import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SettingsContext } from './SettingsContext'; // Замените на реальный путь к вашему контексту
import { ThemeContext } from './theme/ThemeContext';

const HiddenText = ({ title, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { theme } = useContext(ThemeContext);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={[styles.hiddenTextContainer, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={toggleVisibility}>
        <Text style={[styles.hiddenTextTitle, { fontSize: fontSize * 1, color: theme.textColor }]}>{title}</Text>
      </TouchableOpacity>
      {isVisible && (
        <View style={styles.hiddenTextContent}>
          {content.split('\n\n').map((subBlock, index) => {
            const [subTitle, ...subContentArr] = subBlock.split(': ');
            const subContent = subContentArr.join(': ');

            if (subContent) {
              return <HiddenText key={index} title={subTitle} content={subContent} />;
            }

            return <Text key={index} style={[styles.content, { fontSize: fontSize, color: theme.textColor }]}>{subBlock}</Text>;
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenTextContainer: {
    marginBottom: 8,
  },
  hiddenTextTitle: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  hiddenTextContent: {
    marginLeft: 10,
    marginTop: 5,
  },
  content: {
    lineHeight: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});

export default HiddenText;
