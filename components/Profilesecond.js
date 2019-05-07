import React,{Component} from 'react';
import {View,ImageBackground, Image,Text,StyleSheet,TextInput,Dimensions,ScrollView, TouchableOpacity,SafeAreaView } from 'react-native';
import MainStyles from './Styles';
const { height, width } = Dimensions.get('window');
class Profilesecond extends Component{
    constructor(props) {
        super(props);

        this.state={loading:false}
    }
    componentDidMount(){
    }
    render(){

        const RemoveHiehgt = height - 50;
        return (

            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>

                      <View style={MainStyles.navHeaderWrapper}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.goBack();}}>
                        <Image source={require('../assets/back-icon.png')} style={{width:10,height:19}}/>
                    </TouchableOpacity>
                    
                    <Text style={{fontFamily:'AvenirLTStd-Roman',color:'#FFFFFF',fontSize:16}}>Profile</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}}>

                    <TouchableOpacity>
                            <Image source={require('../assets/noti-icon.png')} width={20} height={23} style={{width:20,height:23}} />
                            <View style={MainStyles.nHNotiIconNum}>
                                <Text style={{fontSize:9}}>2</Text>
                            </View>
                        </TouchableOpacity>
                         </View>
                         </View>
                         <ScrollView style={{  }}>

                         <View style={{backgroundColor:'#1d7bc3',paddingHorizontal:20,flexDirection:'row'}}>
                         <View style={{width:100,height:100,alignItems:'center',overflow:'hidden',borderRadius: 100,marginBottom: 20,marginTop:20}}>
                             <Image source={require('../assets/default.png')} />
                        </View>
                        <View style={{paddingVertical:50,paddingLeft:20,}}>

                        <Text style={{fontFamily:'AvenirLTStd-Roman',color:'#FFFFFF',fontSize:16,}}>Mustafa</Text> 
                        <Text style={{ fontFamily:'AvenirLTStd-Roman',color:'#FFFFFF',fontSize:16,}}>+91 9876543210</Text> 
                        </View>
                        </View>
                           
                           <View style={{paddingHorizontal:20}}>
                       
                       <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>Email</Text>
                        <Text style={MainStyles.LPISubHeading}>mustafa.123@gmail.com</Text>
                        
                     </View>
                    
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>Language</Text>
                        <Text style={MainStyles.LPISubHeading}>English</Text>
                        
                      
                    </View>
                   
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>Address</Text>
                        <Text style={MainStyles.LPISubHeading}>123, ipsum  A48 Lorem ipsum</Text>
                       
                    </View>

                  </View> 
                   
                  </ScrollView>
                        


                 </SafeAreaView>
                      );
                   }
               }

        const styles = StyleSheet.create({
               
           });
        export default Profilesecond;