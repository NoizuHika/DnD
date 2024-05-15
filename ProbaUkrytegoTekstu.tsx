import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HiddenText = ({ title, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={styles.hiddenTextContainer}>
      <TouchableOpacity onPress={toggleVisibility}>
        <Text style={styles.hiddenTextTitle}>{title}</Text>
      </TouchableOpacity>
      {isVisible && (
        <View style={styles.hiddenTextContent}>
          {content.split('\n\n').map((subBlock, index) => {
            const [subTitle, ...subContentArr] = subBlock.split(': ');
            const subContent = subContentArr.join(': ');

            if (subContent) {
              return <HiddenText key={index} title={subTitle} content={subContent} />;
            }

            return <Text key={index} style={styles.content}>{subBlock}</Text>;
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenTextContainer: {
    marginBottom: 10,
  },
  hiddenTextTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  hiddenTextContent: {
    marginLeft: 10,
    marginTop: 5,
  },
  content: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default HiddenText;
