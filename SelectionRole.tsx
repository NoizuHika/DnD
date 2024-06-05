import React, { useState } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SelectionRole = () => {
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
      source={require('./assets/dungeon.jpeg')}
      resizeMode="cover">

    <View style={styles.container}>
      <Text style={styles.title}>Who are you today?</Text>
      <View style={styles.selectionContainer}>
        <Animated.View style={[styles.optionContainer, playerAnimatedStyle]}>
          <TouchableOpacity style={styles.option} onPress={() => handlePress('Player')}>
            <Image source={require('./assets/adventurer.jpeg')} style={styles.playericon} />
            <Text style={styles.optionText}>Player</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.optionContainer, dmAnimatedStyle]}>
          <TouchableOpacity style={styles.option} onPress={() => handlePress('DM')}>
            <Image source={require('./assets/dungeon-master.jpeg')} style={styles.dmicon} />
            <Text style={styles.optionText}>Dungeon Master</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#d6d6d6',
  },
  selectionContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  optionContainer: {
    flex: 1,
  },
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d6d6d6',
    position: 'absolute',
    bottom: 10,
  },
  playericon: {
    width: '100%',
    height: '100%',
  },
  dmicon: {
    width: '100%',
    height: '100%',
  },
});

export default SelectionRole;
