import React, { useState, useEffect, useContext } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { Appearance } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { useAuth } from './AuthContext';
import { UserData } from './UserData';

Appearance.setColorScheme('light');

const YourCampaigns: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { token } = useAuth();
  const { ipv4 } = useContext(UserData);
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
      fetchData();
    }, []);

  const fetchData = async () => {
      try {
          console.log('Token:', token.toString());

          const campaignsResponse = await fetch(`http://${ipv4}:8000/user/campaigns`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'accept': 'application/json'
                      },
                      body: JSON.stringify({ token: token.toString() }),
                  });


          if (!campaignsResponse.ok) {
              throw new Error('Failed to fetch data');
          }

          const campaigns = await campaignsResponse.json();
           console.log('Fetched campaigns:', campaigns);
          setCampaigns(campaigns.campaigns);

      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  const handleDeleteCampaign = (index) => {
    Alert.alert(
      t('Delete Campaign'),
      t('Are you sure you want to delete this campaign?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel'
        },
        {
          text: t('Delete'),
          style: 'destructive',
          onPress: () => {
            const updatedCampaigns = campaigns.filter((_, i) => i !== index);
            saveCampaigns(updatedCampaigns);
          }
        }
      ]
    );
  };

  const handleAddCampaign = () => {
    if (newCampaign) {
      const updatedCampaigns = [...campaigns, newCampaign];
      saveCampaigns(updatedCampaigns);
      setNewCampaign('');
      setShowInput(false);
    }
  };

  const handleCampaignPress = (campaign) => {
          navigation.navigate('CampaignOne', { campaign: campaign });
    };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
  <ImageBackground
         source={theme.background}
         style={styles.containerCamp}
       >
       <ScrollView contentContainerStyle={styles.scrollContainerCamp}>

      <Text style={[styles.headerTextCamp, { color: theme.fontColor, fontSize: fontSize * 1.5 }]}>{t('Dungeon Master Campaigns')}</Text>
        {campaigns.map((campaign, index) => (
          <View key={index} style={[styles.buttonContainerCamp, { marginBottom: 20 * scaleFactor }]}>
            <TouchableOpacity style={styles.button} onPress={() => handleCampaignPress(campaign)}>
              <Text style={[styles.buttonTextCamp, { fontSize: fontSize }]}>{campaign.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCampaign(index)}>
              <Text style={[styles.deleteButtonText, { fontSize: fontSize }]}>{t('Delete')}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.buttonContainerCamp}>
          {showInput ? (
            <View style={styles.addCampaignContainer}>
              <TextInput
                style={[styles.inputCamp, { height: 50 * scaleFactor, fontSize: fontSize }]}
                value={newCampaign}
                onChangeText={setNewCampaign}
                placeholder={t('Enter campaign name')}
                placeholderTextColor="#d6d6d6"
              />
              <TouchableOpacity style={[styles.addButtonCamp, { height: 50 * scaleFactor, width: 70 * scaleFactor }]} onPress={handleAddCampaign}>
                <Text style={[styles.buttonTextCamp, { fontSize: fontSize }]}>{t('Add')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => setShowInput(true)}>
              <Text style={[styles.buttonTextPlus, { fontSize: fontSize }]}>{t('Add new')}</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      </ImageBackground>
);
};

export default YourCampaigns;