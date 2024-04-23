import {TouchableOpacity,Text,StyleSheet} from "react-native";



const Button=props=>
{
    const{viewStyle,textStyle}=styles
    const {text,backgroundColor}=props;
    return(
    <TouchableOpacity style={{...viewStyle, backgroundColor}} onPress={()=>{}}>
       <Text style={textStyle}>{text}</Text>

    </TouchableOpacity>);
};
const styles = StyleSheet.create({
    viewStyle:{
        height:40,
        width:200,
        backgroundColor:'blue',
        borderRadius:40,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        borderWidth:3,
    },
    textStyle:{
        color:'white',
        fontSize:15,
    }
});
export default Button;