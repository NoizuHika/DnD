import React from 'react';
import Button from './components/Button'
import {SafeAreaView, StyleSheet, ImageBackground, ActivityIndicator, View, Text} from 'react-native'

const Loader =({isLoading})=>{
    return(<View>
        {isLoading && <ActivityIndicator />}
    </View>) ;
};
const Info = ()=>{
    return <Text style={{color:'red',textTransform:'uppercase'}}>Info</Text>
};
const MODAL_STATES ={
    info:<Info />
};

const showModal=status=>{return(
   <View>
       {MODAL_STATES[status]}
   </View>);
};
const App =()=> {

  return (
      <ImageBackground source={require('./addons/dungeon.jpeg')}>
    <SafeAreaView style={styles.area}>
        <Loader isLoading={false}/>

      <Button text='Dzban' backgroundColor='green'/>
        <Button text='Zięba' backgroundColor='blue'/>
        <Button text='login' backgroundColor='grey'/>
    </SafeAreaView>
      </ImageBackground>
          );
};
const styles=StyleSheet.create({
    area:{
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
    }
})

export default App;