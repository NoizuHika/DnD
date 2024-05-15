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
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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

const Stack = createStackNavigator();

const App = () => {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
