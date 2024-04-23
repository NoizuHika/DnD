import React, {useState} from 'react';
import { ImageBackground, TouchableOpacity, Text, View, StyleSheet, TextInput } from 'react-native';
import email from 'react-native-email';
import setEmail from 'react-native-email';
import { useNavigation,  } from '@react-navigation/native';

// @ts-ignore
const ForgotPass = ({ navigation }) => {

  const [emailValue, setEmailValue] = useState('');
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSendPress = () => {
     navigation.navigate('EmailSend'); console.log('Send request for password reset to email:', email);
  };

  return (
  <ImageBackground
    style={styles.container}
    source={require('./assets/dungeon.jpeg')}
    resizeMode="cover">

    <Text style={styles.appName}>DMBook</Text>

    <View style={styles.separator}>
      <View >
        <Text style={styles.resetPass}>Reset hasła</Text>
        <View style={styles.separatorLine} />
      </View>
    </View>

    <View style={styles.GoBack}>
       <TouchableOpacity  onPress={handleGoBack} >
           <Text style={styles.GoBackText}>Go back</Text>
       </TouchableOpacity>
    </View>

    <Text style={styles.email}>Podaj nazwę użytkownika lub adres email</Text>

    <TextInput
        style={styles.emailInput}
        placeholder="Email"
        value={emailValue}
        onChangeText={setEmailValue}
    />

    <TouchableOpacity style={styles.sendEmail} onPress={handleSendPress}>
        <Text style={styles.sendEmailText}>Wyślij</Text>
    </TouchableOpacity>

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
    resetPass: {
      color: '#d6d6d6',
      fontSize: 22,
    },
    separator: {
      position: 'absolute',
      top: '35%',
      left: '10%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    separatorLine: {
      flex: 3,
      height: 1,
      backgroundColor: 'grey',
      width: '200%',
    },
    email: {
      position: 'absolute',
      color: '#d6d6d6',
      left: '10%',
    },
    emailLabel: {
      position: 'absolute',
      color: '#d6d6d6',
      left: '10%',
      top: '40%',
    },
    emailInput: {
      position: 'absolute',
      backgroundColor: 'white',
      borderColor: '#d6d6d6',
      borderRadius: 4,
      paddingVertical: 0,
      paddingHorizontal: 8,
      fontSize: 16,
      width: '70%',
      top: '53%',
      left: '10%',
      marginBottom: 20,
    },
    sendEmail: {
      position: 'absolute',
      backgroundColor: 'transparent',
      borderRadius: 10,
      paddingVertical: 15,
      paddingHorizontal: 50,
      alignItems: 'center',
      top: '57%',
    },
    sendEmailText: {
      color: '#d6d6d6',
      fontSize: 16,
      fontWeight: 'bold',
    },
});

 export default ForgotPass;