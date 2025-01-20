import React, { useState, useContext } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from './theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';

Appearance.setColorScheme('light');

const SelectionRole: React.FC = () => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [animation, setAnimation] = useState(new Animated.Value(0));

  const handlePress = (type) => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      if (type === 'DM') {
        navigation.navigate('DMPage');
      } else {
        navigation.navigate('LoggedScreen');
      }
    });
  };

  const playerAnimatedStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -250],
        }),
      },
    ],
  };

  const dmAnimatedStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 250],
        }),
      },
    ],
  };

  return (
    <ImageBackground

      style={styles.container}
         source={theme.background}
      resizeMode="cover">

    <View style={styles.container}>
      <Text style={[styles.titleSelect, { fontSize: fontSize * 1.2 }]}>{t('Who are you today')}?</Text>
      <View style={styles.selectionContainer}>
        <Animated.View style={[styles.optionContainer, playerAnimatedStyle]}>
          <TouchableOpacity style={[styles.option, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={() => handlePress('Player')}>
            <Image source={require('./assets/adventurer.jpeg')} style={styles.playericon} />
            <Text style={[styles.optionText, { fontSize: fontSize }]}>{t('Player')}</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.optionContainer, dmAnimatedStyle]}>
          <TouchableOpacity style={[styles.option, { height: 50 * scaleFactor, width: 250 * scaleFactor }]} onPress={() => handlePress('DM')}>
            <Image source={require('./assets/dungeon-master.jpeg')} style={styles.dmicon} />
            <Text style={[styles.optionText, { fontSize: fontSize }]}>{t('Dungeon Master')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
    </ImageBackground>
  );
};

export default SelectionRole;
