import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import HiddenText from './ProbaUkrytegoTekstu';
import CustomPicker from './Picker';

const CreateCharacter2 = ({ navigation, route }) => {
const handleGoBack = () => {
     navigation.navigate('CreateCharacter');
  };
  //const { selectedRace, selectedGender, selectedPosition } = route.params;

  const { selectedClassInfo, nickname } = route.params;

  const renderDescription = (description) => {
    return description.split('\n\n\n').map((block, index) => {
      const [title, ...contentArr] = block.split(': ');
      const content = contentArr.join(': ');

      if (content) {
        return <HiddenText key={index} title={title} content={content} />;
      }

  const pickerContent = selectedClassInfo[title] ? selectedClassInfo[title].split('\p') : [];

   if (pickerContent.length > 0) {
     return <PickerText key={index} title={title} options={pickerContent} />;
   }

    if (block.trim() === 'Spells:') {
      const spells = block.split('\n').slice(1);
      return (
        <Picker key={index} title="Spells" options={spells} />
      );
    }

   if (selectedClassInfo[block]) {
     return <HiddenText key={index} title={line} content={selectedClassInfo[block]} />;
   }

   return <Text key={index} style={styles.RaceGenderPosContTitle}>{block}</Text>;
    });
  };

  return (
  <ImageBackground
           source={require('./assets/dungeon.jpeg')}
           style={styles.container}
         >

    <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <View style={styles.selectedImageContainer}>
          <Text>Player:</Text>
          <Image
            source={selectedClassInfo.image}
            style={styles.selectedImage}
          />
          <View style={styles.nicknameContainer}>
            <Text style={styles.nicknameText}>{nickname}</Text>
          </View>
          {renderDescription(selectedClassInfo.description)}
        </View>

        <View style={styles.goBack}>
          <TouchableOpacity style={styles.button} onPress={handleGoBack}>
            <Text style={styles.goBackText}>Go back</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


  RaceGenderPosContTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  nicknameContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  nicknameText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },

  selectedImageContainer: {
    marginTop: 70,
    position: 'center',

  },
  selectedImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },

  goBack: {
    position: 'absolute',
    top: 42,
    left: 20,
    width: '20%',
    borderColor: '#7F7F7F',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
  },
  goBackText: {
    color: '#d6d6d6',
  },
});

export default CreateCharacter2;