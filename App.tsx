/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { enableScreens } from 'react-native-screens';
enableScreens();
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import 'intl-pluralrules';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './UserData';



import HomeScreen from './HomeScreen';
import LogInScreen from './LogInScreen';
import Registration from './Registration';
import ForgotPass from './ForgotPass';
import EmailSend from './EmailSend';
import RegistrationOkEmail from './RegistrationOkEmail';
import KontoGoogle from './KontoGoogle';
import KontoFacebook from './KontoFacebook';
import KontoApple from './KontoApple';
import LoggedScreen from './LoggedScreen';
import RzutKostka from './RzutKostka';
import Characters from './Characters';
import CreateCharacter from './CreateCharacter'
import Character1 from './Character1'
import Character2 from './Character2'
import CreateCharacter2 from './CreateCharacter2'
import CreateCharacter3 from './CreateCharacter3'
import CreateCharacter4 from './CreateCharacter4'
import CreateCharacter5 from './CreateCharacter5'
import SelectionRole from './SelectionRole'
import DMPage from './DMPage'
import YourCampaigns from './YourCampaigns';
import YourBook from './YourBook';
import CampaignOne from './CampaignOne';
import GenericCampaign from './GenericCampaign';
import RzutKostka_Bonus from './RzutKostka_Bonus';

const Stack = createStackNavigator();

const App = () => {
  return (
  <I18nextProvider i18n={i18n}>
    <UserProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LogIn" component={LogInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} options={{ headerShown: false }} />
        <Stack.Screen name="EmailSend" component={EmailSend} options={{ headerShown: false }} />
        <Stack.Screen name="RegistrationOkEmail" component={RegistrationOkEmail} options={{ headerShown: false }} />
        <Stack.Screen name="KontoGoogle" component={KontoGoogle} options={{ headerShown: false }} />
        <Stack.Screen name="KontoFacebook" component={KontoFacebook} options={{ headerShown: false }} />
        <Stack.Screen name="KontoApple" component={KontoApple} options={{ headerShown: false }} />
        <Stack.Screen name="LoggedScreen" component={LoggedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RzutKostka" component={RzutKostka} options={{ headerShown: false }} />
        <Stack.Screen name="Characters" component={Characters} options={{ headerShown: false }} />
        <Stack.Screen name="CreateCharacter" component={CreateCharacter} options={{ headerShown: false }} />
        <Stack.Screen name="Character1" component={Character1} options={{ headerShown: false }} />
        <Stack.Screen name="Character2" component={Character2} options={{ headerShown: false }} />
        <Stack.Screen name="CreateCharacter2" component={CreateCharacter2} options={{ headerShown: false }} />
        <Stack.Screen name="CreateCharacter3" component={CreateCharacter3} options={{ headerShown: false }} />
        <Stack.Screen name="CreateCharacter4" component={CreateCharacter4} options={{ headerShown: false }} />
        <Stack.Screen name="CreateCharacter5" component={CreateCharacter5} options={{ headerShown: false }} />
        <Stack.Screen name="SelectionRole" component={SelectionRole} options={{ headerShown: false }} />
        <Stack.Screen name="DMPage" component={DMPage} options={{ headerShown: false }} />
        <Stack.Screen name="YourCampaigns" component={YourCampaigns} options={{ headerShown: false }} />
        <Stack.Screen name="YourBook" component={YourBook} options={{ headerShown: false }} />
        <Stack.Screen name="GenericCampaign" component={GenericCampaign} options={{ headerShown: false }} />
        <Stack.Screen name="CampaignOne" component={CampaignOne} options={{ headerShown: false }} />
        <Stack.Screen name="RzutKostka_Bonus" component={RzutKostka_Bonus} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  </I18nextProvider>
  );
};

export default App;
