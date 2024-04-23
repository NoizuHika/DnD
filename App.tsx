
import { enableScreens } from 'react-native-screens';
enableScreens();
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import LoggedInScreen from './LoggedInScreen';
import Registration from './Registration';
import ForgotPass from './ForgotPass';
import EmailSend from './EmailSend';
import RegistrationOkEmail from './RegistrationOkEmail';
import KontoGoogle from './KontoGoogle';
import KontoFacebook from './KontoFacebook';
import KontoApple from './KontoApple';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="LoggedIn" component={LoggedInScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
                <Stack.Screen name="ForgotPass" component={ForgotPass} options={{ headerShown: false }} />
                <Stack.Screen name="EmailSend" component={EmailSend} options={{ headerShown: false }} />
                <Stack.Screen name="RegistrationOkEmail" component={RegistrationOkEmail} options={{ headerShown: false }} />
                <Stack.Screen name="KontoGoogle" component={KontoGoogle} options={{ headerShown: false }} />
                <Stack.Screen name="KontoFacebook" component={KontoFacebook} options={{ headerShown: false }} />
                <Stack.Screen name="KontoApple" component={KontoApple} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;