import React,{Component} from 'react';
import {View,ImageBackground, Image,Text,StyleSheet,TextInput,Dimensions,ScrollView, TouchableOpacity,SafeAreaView } from 'react-native';
import MainStyles from './Styles';
const { height, width } = Dimensions.get('window');
class ShareApp extends Component{
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
                    
                    <Text style={{fontFamily:'AvenirLTStd-Roman',color:'#FFFFFF',fontSize:16}}>Share App</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}}>

                    <TouchableOpacity>
                            <Image source={require('../assets/noti-icon.png')} width={20} height={23} style={{width:20,height:23}} />
                            <View style={MainStyles.nHNotiIconNum}>
                                <Text style={{fontSize:9}}>2</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
            </View>

            
            <View style={{justifyContent: 'center',alignItems:'center',paddingVertical:70,marginTop:60}}>
                    <Image source={require('../assets/share-app-icon.png')} style={{width:70,height:68,}}/>
                   <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize:16,color:'#151515',padding:40,flexWrap:'wrap',lineHeight:16,textAlign:"center"}}>Lorem Ipsum has been the industry's standard dummy text ever since</Text>
                   <View style={{flexDirection:'row',width:250,
                                    height:1,
                                    backgroundColor:'#e1e1e1',
                                    alignItems:'center',
                                    marginLeft:70,
                                    marginRight:70,
                                    borderColor: '#bebebe',
                                    marginTop:20}}></View>
                                     <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',paddingVertical:20,paddingBottom:40,flexWrap:'wrap',width:80,textAlign:'center'}}>Share Now</Text>
                                     <View style={{flexDirection:'row',
                                                 alignItems: 'center',
                                                  width:'100%',
                                                  justifyContent:'space-evenly',
                                                  paddingLeft:2,
                                                 paddingRight:3,
                                      }}>
                        <TouchableOpacity style={styles.shareOptionBtn}>
                            <Image source={require('../assets/ws-icon.png')} width={30} height={30} style={{width:30,height:30}}/>
                        <Text style={styles.qnaHeading}>WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareOptionBtn}>
                            <Image source={require('../assets/fb-icon.png')} width={30} height={30} style={{width:30,height:30}}/>
                        <Text style={styles.qnaHeading}>Facebook</Text>
                        </TouchableOpacity>
                
                        <TouchableOpacity style ={styles.shareOptionBtn}>
                            <Image source={require('../assets/tt-icon.png')} width={30} height={30} style={{width:30,height:30}}/>
                             <Text style={styles.qnaHeading}>Twitter</Text>
                         
                        </TouchableOpacity>
                      
                       <TouchableOpacity style={styles.shareOptionBtn}>
                            <Image source={require('../assets/mail-icon.png')} width={30} height={30} style={{width:30,height:30}}/>
                              <Text style={styles.qnaHeading}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareOptionBtn}>
                            <Image source={require('../assets/more-icon.png')} width={5} height={20} style={{width:5,height:22}}/>
                              <Text style={styles.qnaHeading}>More</Text>
                        </TouchableOpacity>
                    </View> 
               </View>
        </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
        shareOptionBtn:{
            justifyContent:'center',
            alignItems:'center'
        },
            qnaHeading:{
            fontFamily:'AvenirLTStd-Medium',
            fontSize:11,
            flexWrap:'wrap',
            paddingVertical:10,
            alignItems:'center'
        
            }
    });
export default ShareApp;