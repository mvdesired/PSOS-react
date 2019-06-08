import React,{Component} from 'react';
import {View,ImageBackground, Image,Text } from 'react-native';
class SuccessScreen extends Component{
    constructor(props) {
        super(props);
        this.state={loading:false}
    }
    componentDidMount(){
        setTimeout(()=>{
            this.props.navigation.navigate('Home');
        },4500);
    }
    render(){
        return (

           <ImageBackground source={require('../../assets/splash-bg.png')} style={{backgroundColor:'#FFFFFF',flex:1,justifyContent:'center',alignItems:'center'}}>
              
              <View style={{alignItems:'center',justifyContent:'center',paddingVertical: 35,}}>
                <Text style={{color:'#147dbf',marginBottom:5,fontFamily:'AvenirLTStd-Roman',fontSize:35}}>Success</Text>
                <Image source={require('../../assets/share-app-icon.png')} style={{width:70,height:65,marginTop:25}}/>
               </View>
               <View style={{justifyContent: 'center',alignItems:'center'}}>
                   <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#151515',textAlign:"center",fontSize:20}}>Thanks for applying.</Text>
                   <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize:13,color:'#151515',flexWrap:'wrap',padding:10,lineHeight:16,textAlign:"center"}}>We'll let you know once we review  your application. </Text>
           
               </View>
            </ImageBackground>
         
        );
    }
}
export default SuccessScreen;