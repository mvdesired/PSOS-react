import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,
    ActionSheetIOS,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions,NavigationActions } from 'react-navigation';
import Loader from '../Loader';
import MainStyles from '../Styles';
const { height, width } = Dimensions.get('window');
class Dashboard extends Component{
    constructor(props) {
        super(props);
        this.state={
            loading:false,
        }
    }
    render(){
        const RemoveHiehgt = height - 52;
        return(
            <SafeAreaView>
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
                    <View style={{
                        backgroundColor:'#FFFFFF',
                        marginTop:8,
                        paddingVertical:10,
                        paddingHorizontal:15
                    }}>

                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
export default Dashboard;