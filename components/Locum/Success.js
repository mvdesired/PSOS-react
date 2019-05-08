import React,{Component} from 'react';
import {View,ImageBackground, Image,Text, StyleSheet,SafeAreaView } from 'react-native';
class SuccessScreen extends Component{
    constructor(props) {
        super(props);
        this.state={loading:false}
    }
    componentDidMount(){
        //
    }
    render(){
        return (

           <ImageBackground source={require('../../assets/splash-bg.png')} style={{backgroundColor:'#FFFFFF'}}>
              
              <View style={{position:'absolute',
                    alignItems:'center',
                    justifyContent:'center',
                    width:'100%',
                    paddingVertical:150,
                
                     }}>
                <Text style={{color:'#147dbf',marginBottom:5,fontFamily:'AvenirLTStd-Roman',fontSize:35}}>Success</Text>
                <Image source={require('../../assets/share-app-icon.png')} style={{width:70,height:68,margin:35}}/>
               </View>

               <View style={{justifyContent: 'center',alignItems:'center',paddingVertical:345,}}>
                   <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#151515',flexWrap:'wrap',lineHeight:16,textAlign:"center",fontSize:17}}>Thanks for applying.</Text>
                   <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize:13,color:'#151515',flexWrap:'wrap',padding:10,lineHeight:16,textAlign:"center"}}>We'll let you know once we review  your application. </Text>
           
               </View>
               
              </ImageBackground>
         
        );
    }
}
export default SuccessScreen;