import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Button, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CreateCharacter = ({ navigation }) => {
  const handleGoBack = () => {
     navigation.navigate('Characters');
  };

  const races = [
    { name: 'Human' },
    { name: 'Dwarf' },
    { name: 'Halfling' },
    // tut mnogo pzdc ctrl c ctrl v
  ];

  const positions = [
    { name: 'Bard' },
    { name: 'Barbarian' },
    { name: 'Warrior' },
    { name: 'Wizard' },
    { name: 'Druid' },
    { name: 'Priest' },
    { name: 'Inventor' },
    { name: 'Warlock' },
    { name: 'Monk' },
    { name: 'Paladin' },
    { name: 'Rogue' },
    { name: 'Ranger' },
    { name: 'Sorcerer' },
  ];

  const positionsImages = {
    'Dwarf-M-Bard': require('./assets/Dwarf-M-Bard.jpg'),
    'Dwarf-W-Bard': require('./assets/Dwarf-W-Bard.jpg'),
    'Dwarf-M-Barbarian': require('./assets/Dwarf-M-Barbarian.jpg'),
    'Dwarf-W-Barbarian': require('./assets/Dwarf-W-Barbarian.jpg'),
    'Dwarf-M-Warrior': require('./assets/Dwarf-M-Warrior.jpg'),
    'Dwarf-W-Warrior': require('./assets/Dwarf-W-Warrior.jpg'),
    'Dwarf-M-Wizard': require('./assets/Dwarf-M-Wizard.jpg'),
    'Dwarf-W-Wizard': require('./assets/Dwarf-W-Wizard.jpg'),
    'Dwarf-M-Druid': require('./assets/Dwarf-M-Druid.jpg'),
    'Dwarf-W-Druid': require('./assets/Dwarf-W-Druid.jpg'),
    'Dwarf-M-Priest': require('./assets/Dwarf-M-Priest.jpg'),
    'Dwarf-W-Priest': require('./assets/Dwarf-W-Priest.jpg'),
    'Dwarf-M-Inventor': require('./assets/Dwarf-M-Inventor.jpg'),
    'Dwarf-W-Inventor': require('./assets/Dwarf-W-Inventor.jpg'),
    'Dwarf-M-Warlock': require('./assets/Dwarf-M-Warlock.jpg'),
    'Dwarf-W-Warlock': require('./assets/Dwarf-W-Warlock.jpg'),
    'Dwarf-M-Monk': require('./assets/Dwarf-M-Monk.jpg'),
    'Dwarf-W-Monk': require('./assets/Dwarf-W-Monk.jpg'),
    'Dwarf-M-Paladin': require('./assets/Dwarf-M-Paladin.jpg'),
    'Dwarf-W-Paladin': require('./assets/Dwarf-W-Paladin.jpg'),
    'Dwarf-M-Rogue': require('./assets/Dwarf-M-Rogue.jpg'),
    'Dwarf-W-Rogue': require('./assets/Dwarf-W-Rogue.jpg'),
    'Dwarf-M-Ranger': require('./assets/Dwarf-M-Ranger.jpg'),
    'Dwarf-W-Ranger': require('./assets/Dwarf-W-Ranger.jpg'),
    'Dwarf-M-Sorcerer': require('./assets/Dwarf-M-Sorcerer.jpg'),
    'Dwarf-W-Sorcerer': require('./assets/Dwarf-W-Sorcerer.jpg'),
    'Halfling-M-Bard': require('./assets/Halfling-M-Bard.jpg'),
    'Halfling-W-Bard': require('./assets/Halfling-W-Bard.jpg'),
    'Halfling-M-Barbarian': require('./assets/Halfling-M-Barbarian.jpg'),
    'Halfling-W-Barbarian': require('./assets/Halfling-W-Barbarian.jpg'),
    'Halfling-M-Warrior': require('./assets/Halfling-M-Warrior.jpg'),
    'Halfling-W-Warrior': require('./assets/Halfling-W-Warrior.jpg'),
    'Halfling-M-Wizard': require('./assets/Halfling-M-Wizard.jpg'),
    'Halfling-W-Wizard': require('./assets/Halfling-W-Wizard.jpg'),
    'Halfling-M-Druid': require('./assets/Halfling-M-Druid.jpg'),
    'Halfling-W-Druid': require('./assets/Halfling-W-Druid.jpg'),
    'Halfling-M-Priest': require('./assets/Halfling-M-Priest.jpg'),
    'Halfling-W-Priest': require('./assets/Halfling-W-Priest.jpg'),
    'Halfling-M-Inventor': require('./assets/Halfling-M-Inventor.jpg'),
    'Halfling-W-Inventor': require('./assets/Halfling-W-Inventor.jpg'),
    'Halfling-M-Warlock': require('./assets/Halfling-M-Warlock.jpg'),
    'Halfling-W-Warlock': require('./assets/Halfling-W-Warlock.jpg'),
    'Halfling-M-Monk': require('./assets/Halfling-M-Monk.jpg'),
    'Halfling-W-Monk': require('./assets/Halfling-W-Monk.jpg'),
    'Halfling-M-Paladin': require('./assets/Halfling-M-Paladin.jpg'),
    'Halfling-W-Paladin': require('./assets/Halfling-W-Paladin.jpg'),
    'Halfling-M-Rogue': require('./assets/Halfling-M-Rogue.jpg'),
    'Halfling-W-Rogue': require('./assets/Halfling-W-Rogue.jpg'),
    'Halfling-M-Ranger': require('./assets/Halfling-M-Ranger.jpg'),
    'Halfling-W-Ranger': require('./assets/Halfling-W-Ranger.jpg'),
    'Halfling-M-Sorcerer': require('./assets/Halfling-M-Sorcerer.jpg'),
    'Halfling-W-Sorcerer': require('./assets/Halfling-W-Sorcerer.jpg'),
    'Human-M-Mage': require('./assets/Human-M-Mage.jpg'),
    'Human-W-Mage': require('./assets/Human-W-Mage.jpg'),
    // so on
  };


  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const renderRaceItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedRace(item)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderGenderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedGender(item)}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  const renderPositionItem = ({ item }) => (
      <TouchableOpacity onPress={() => setPositionItem(item)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
  );

  const renderPositionsImages = ({ item }) => (
   <TouchableOpacity onPress={() => setPositionsImages(item)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={positionsImages[`${selectedRace?.name}-${selectedGender ? selectedGender.charAt(0) : ''}-${item}`]}
          style={{ width: 30, height: 30, marginRight: 10 }}
        />
        <Text>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >

      <View style={styles.RaceGenderPosCont}>
            <Text style={styles.RaceGenderPosContTitle}>Race</Text>
            <Picker
                selectedValue={selectedRace}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedRace(itemValue)}>
                {races.map((race, index) => (
                  <Picker.Item key={index} label={race.name} value={race.name} />
                ))}
            </Picker>

            <Text style={styles.RaceGenderPosContTitle}>Gender</Text>
              <Picker
                 selectedValue={selectedGender}
                 style={styles.picker}
                 onValueChange={(itemValue) => setSelectedGender(itemValue)}>
                 <Picker.Item label="Male" value="M" />
                 <Picker.Item label="Female" value="W" />
              </Picker>

              <Text style={styles.RaceGenderPosContTitle}>Position</Text>
                <Picker
                  selectedValue={selectedPosition}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedPosition(itemValue)}>
                  {positions.map((position, index) => (
                     <Picker.Item key={index} label={position.name} value={position.name} />
                  ))}
             </Picker>
           </View>

        <View style={styles.selectedImageContainer}>
          {selectedRace && selectedGender && selectedPosition && (
            <Image
              source={positionsImages[`${selectedRace}-${selectedGender}-${selectedPosition}`]}
              style={styles.selectedImage}
            />
          )}
        </View>


       <View style={styles.GoBack}>
      <TouchableOpacity style={styles.button} onPress={() => {handleGoBack()}} >
            <Text style={styles.GoBackText}>Go back</Text>
      </TouchableOpacity>
     </View>
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
  appName: {
    position: 'absolute',
    top: '16%',
    fontSize: 24,
    color: '#7F7F7F',
  },

  RaceGenderPosCont: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  RaceGenderPosContTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },

  picker: {
    height: 40,
    width: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },

  selectedImageContainer: {
    position: 'center',

  },
  selectedImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },


  GoBack: {
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: '20%',
        borderColor: '#7F7F7F',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1.5,
      },
      GoBackText: {
        color: '#d6d6d6',
      },
    });

export default CreateCharacter;