import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

const YourCampaigns = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const [campaigns, setCampaigns] = useState(["LOREM PSILUM", "UNGA BUNGA", "KRWAWA ŁAŹNIA"]);
  const [newCampaign, setNewCampaign] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddCampaign = () => {
    if (newCampaign) {
      setCampaigns([...campaigns, newCampaign]);
      setNewCampaign('');
      setShowInput(false);
    }
  };

  const handleCampaignPress = (campaign) => {
    switch (campaign) {
      case 'LOREM PSILUM':
        navigation.navigate('CampaignOne');
        break;
      case 'UNGA BUNGA':
        navigation.navigate('CampaignTwo');
        break;
      case 'KRWAWA ŁAŹNIA':
        navigation.navigate('CampaignThree');
        break;
      default:
        navigation.navigate('GenerateCampaign', { campaignName: campaign });
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
  <ImageBackground
         source={require('./assets/dungeon.jpeg')}
         style={styles.container}
       >
       <ScrollView contentContainerStyle={styles.scrollContainer}>

      <Text style={styles.headerText}>{t('Dungeon Master Campaigns')}</Text>
        {campaigns.map((campaign, index) => (
          <View key={index} style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleCampaignPress(campaign)}>
              <Text style={styles.buttonText}>{campaign}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          {showInput ? (
            <View style={styles.addCampaignContainer}>
              <TextInput
                style={styles.input}
                value={newCampaign}
                onChangeText={setNewCampaign}
                placeholder={t('Enter campaign name')}
                placeholderTextColor="#d6d6d6"
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddCampaign}>
                <Text style={styles.buttonText}>{t('Add')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => setShowInput(true)}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>

      <View style={styles.goBack}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.goBackText}>{t('Go_back')}</Text>
        </TouchableOpacity>
      </View>

      </ImageBackground>
);
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  appName: {
    textAlign: 'center',
    fontSize: 24,
    color: '#7F7F7F',
  },
  scrollContainer: {
    paddingTop: '60%',
    paddingHorizontal: 40,
  },
  headerText: {
    marginBottom: 20,
    fontSize: 24,
    color: '#7F7F7F',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    marginBottom: 30,
    backgroundColor: 'transparent',
    borderColor: '#7F7F7F',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
  },
  buttonText: {
    color: '#d6d6d6',
  },
  addCampaignContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '70%',
    borderColor: '#7F7F7F',
    borderWidth: 1.5,
    borderRadius: 10,
    color: '#d6d6d6',
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    borderColor: '#7F7F7F',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
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

export default YourCampaigns;
