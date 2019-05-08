import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,
    ActionSheetIOS,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions,NavigationActions } from 'react-navigation';

import MainStyles from '../Styles';
import { SERVER_URL } from '../../Constants';
const { height, width } = Dimensions.get('window');
class Locumdashboardscreen extends Component{
    constructor(props) {
        super(props);
      
    }
  
    render(){
        const RemoveHiehgt = height - 52;
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={{
                    flexDirection:'row',
                    justifyContent:"space-between",
                    paddingVertical: 13,
                    paddingHorizontal: 10,
                    backgroundColor:'#1d7bc3',
                    alignItems: 'center',
                }}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.dispatch(DrawerActions.toggleDrawer())}}>
                        <Icon name="bars" style={{
                            fontSize:20,
                            color:'#FFFFFF'
                        }} />
                    </TouchableOpacity>
                    <Image source={require('../../assets/web-logo-wight.png')} width={150} height={26} style={{width:150,height:26}} />
                    <View style={{
                        flexDirection:'row',
                        alignItems:'center'
                    }}>
                        <TouchableOpacity style={{marginRight:10}}>
                            <Image source={require('../../assets/share-icon.png')} width={20} height={20} style={{width:20,height:20}} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{
                                position:'absolute',
                                right:-5,
                                top:-5,
                                width:15,
                                height:15,
                                alignItems:'center',
                                justifyConten:'center',
                                backgroundColor:'#FFFFFF',
                                borderRadius: 35,
                            }}>
                                <Text style={{fontSize:10}}>99</Text>
                            </View>
                            <Image source={require('../../assets/noti-icon.png')} width={20} height={23} style={{width:20,height:23}} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={{height:RemoveHiehgt,flex:1,backgroundColor:'#f0f0f0'}}>
                    <View style={MainStyles.eDW}>
                        <TouchableOpacity style={MainStyles.eDTWI}>
                            <Image source={require('../../assets/locum-shift.png')} width={50} height={50} style={{width:50,height:50,marginBottom:10}} />
                            <Text style={[MainStyles.eDTWIT,{ paddingHorizontal:60}]}>OPEN JOBS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[MainStyles.eDTWI,{marginTop:5,backgroundColor:'#a29bfe',}]}>
                            <Image source={require('../../assets/perm-pos.png')}  width={50} height={55} style={{width:50,height:55,marginBottom:10,}} />
                            <Text style={[MainStyles.eDTWIT,{ paddingHorizontal:60}]}>eTIMESSHEET</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[MainStyles.eDTWI,{marginTop:5,backgroundColor:'#00cec9'}]}>
                            <Image source={require('../../assets/job-list.png')}  width={50} height={57} style={{width:50,height:57,marginBottom:10}} />
                            <Text style={[MainStyles.eDTWIT,{ paddingHorizontal:20}]}>SUMIT YOUR AVAILABILITY</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[MainStyles.eDTWI,{marginTop:5,backgroundColor:'#0984e3'}]}>
                            <Image source={require('../../assets/pay-invoice.png')}  width={50} height={50} style={{width:50,height:50,marginBottom:10,}} />
                            <Text style={[MainStyles.eDTWIT,{ paddingHorizontal:40}]}>PAY RUN CALENDAR</Text>
                        </TouchableOpacity>
                      <TouchableOpacity style={[MainStyles.eDTWI,{marginTop:5,backgroundColor:'#e77f67'}]}>
                            <Image source={require('../../assets/feedback.png')}  width={50} height={52} style={{width:50,height:52,marginBottom:10}} />
                            <Text style={[MainStyles.eDTWIT,{ paddingHorizontal:60}]}>FEEBACK</Text>
                        </TouchableOpacity>
                    </View>
                  
                </ScrollView>
            </SafeAreaView>
        );
    }
}
export default Locumdashboardscreen;