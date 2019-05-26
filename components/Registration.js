import React, { Component } from 'react';
import { View,Text,TouchableOpacity, ImageBackground,Platform,SafeAreaView,Dimensions,Image} from 'react-native';
import { DrawerActions,NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from './Loader';
const { height, width } = Dimensions.get('window');
class Registration extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            registertingFrom:''
        }
    }
    checkbuttonClick = (selected)=>{
        this.setState({registertingFrom:selected});
    }
    render(){
        const RemoveHiehgt = height - 70.3;
        return(
            <ImageBackground source={require('../assets/splash-bg.png')} style={{flex:1,backgroundColor:'#FFFFFF',justifyContent:'center',alignItems:'center'}}>
                <Loader loading={this.state.loading} />
                <TouchableOpacity onPress={()=>{this.props.navigation.goBack();}} style={{position:'absolute',left:8,top:8,paddingLeft:10,paddingRight:15,paddingVertical:15,}}>
                    <Image source={require('../assets/blue-back-icon.png')} style={{width:10,height:19}}/>
                </TouchableOpacity>
                <View style={{
                flex:1,justifyContent: 'center',alignItems:'center',
                width:300
                }}>
                    <Image source={require('../assets/web-logo.png')} style={{width:280,height:48}}/>
                    <Text style={{
                        marginTop:40,
                        fontSize:18,
                        color:'#151515'
                    }}>I am registering as:</Text>
                    <TouchableOpacity onPress={()=>{this.checkbuttonClick('a-locum');this.props.navigation.navigate('LocumReg1')}} style={{
                        borderBottomWidth:1,
                        borderBottomColor:'#acacac',
                        width:'100%',
                        paddingBottom:20,
                        marginBottom:34,
                        marginTop:40
                    }}>
                        <View style={{
                            flexDirection:'row',
                            justifyContent:'space-between'
                        }}>
                            <Text style={{color:'#676767',textAlign:'left'}}>A Locum</Text>
                            <View style={{
                                borderWidth:1,
                                borderColor:'#6e6f71',
                                width:15,
                                height:15,
                                borderRadius:50,
                                marginRight:15,
                                elevation:3,
                                shadowColor:'#a1a09e',
                                shadowOffset:3,
                                shadowRadius:3,
                                shadowOpacity:0.7,
                                backgroundColor:'#FFFFFF',
                                justifyContent:'center',
                                alignItems:'center'
                            }}>
                            {
                                this.state.registertingFrom == 'a-locum' && 
                                <View style={{
                                    width:10,
                                    height:10,
                                    backgroundColor:'#1e7bc1',
                                    borderRadius:50
                                }}></View>
                            }
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{
                        borderBottomWidth:1,
                        borderBottomColor:'#acacac',
                        width:'100%',
                        paddingBottom:20
                    }}>
                        <TouchableOpacity onPress={()=>{this.checkbuttonClick('a-employer');this.props.navigation.navigate('EmployerReg')}} style={{
                            flexDirection:'row',
                            justifyContent:'space-between'
                        }}>
                            <Text style={{color:'#676767',textAlign:'left'}}>A Employer</Text>
                            <View style={{
                                borderWidth:1,
                                borderColor:'#6e6f71',
                                width:15,
                                height:15,
                                borderRadius:50,
                                marginRight:15,
                                elevation:3,
                                shadowColor:'#a1a09e',
                                shadowOffset:3,
                                shadowRadius:3,
                                shadowOpacity:0.7,
                                backgroundColor:'#FFFFFF',
                                justifyContent:'center',
                                alignItems:'center'
                            }}>
                                {
                                    this.state.registertingFrom == 'a-employer' && 
                                    <View style={{
                                        width:10,
                                        height:10,
                                        backgroundColor:'#1e7bc1',
                                        borderRadius:50
                                    }}></View>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}
export default Registration;