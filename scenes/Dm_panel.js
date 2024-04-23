import React from 'react';
import Button from './components/Button'
import {SafeAreaView, StyleSheet, ImageBackground, ActivityIndicator, View, Text} from 'react-native'



const Dm_panel = ()=>
{
    return(
        <ImageBackground source={require('../addons/dungeon-master.jpeg')}>
            <SafeAreaView style={styles.area}>


                <Button text='Dzban' backgroundColor='green'/>
                <Button text='Zięba' backgroundColor='blue'/>
                <Button text='login' backgroundColor='grey'/>
            </SafeAreaView>
        </ImageBackground>
    );
};
export default Dm_panel
