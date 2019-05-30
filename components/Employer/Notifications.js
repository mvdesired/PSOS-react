import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,RefreshControl,ImageBackground,AsyncStorage,
    ActionSheetIOS,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions,NavigationActions } from 'react-navigation';
import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import { FlatList } from 'react-native-gesture-handler';
import Header from '../Navigation/Header';
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
const { height, width } = Dimensions.get('window');
class Notifications extends Component{
    _isMounted = false;
    clearTime = '';
    constructor(props){
        super(props);
        this.state={
            loading:true,
            isRefreshing:false,
            notiList:{},
        };
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    componentDidMount =()=>{
        this._isMounted = true;
        this.setUserData();
        setTimeout(()=>{
            this._fetchNotifications();
            this.clearTime = setInterval(()=>{
                this._fetchNotifications();
            },10000);
        },1500);
    }
    _fetchNotifications = ()=>{
        fetch(SERVER_URL+'fetch_notification?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>res.json())
        .then(response=>{
            if (this._isMounted) {
                console.log(response);
                if(response.status == 200){
                    this.setState({notiList:response.result});
                }
                this.setState({loading:false});
            }
        })
        .catch(err=>{
            console.log(err);
            this.setState({loading:false});
        });
    }
    componentWillUnmount(){
        this._isMounted = false;
        clearTimeout(this.clearTime);
    }
    clearNotification(){
        clearTimeout(this.clearTime);
        fetch(SERVER_URL+'clear_notification?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>res.json())
        .then(response=>{
            console.log(response);
            if(response.status == 200){
                this.setState({notiList:{}});
            }
            this.clearTime = setInterval(()=>{
                this._fetchNotifications();
            },3000);
            Toast.show(response.message,Toast.SHORT);
        })
        .catch(err=>{

        });
    }
    render(){
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <View style={MainStyles.navHeaderWrapper}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.goBack();}} style={{paddingHorizontal:5,paddingVertical:15}}>
                        <Image source={require('../../assets/back-icon.png')} style={{width:10,height:19}}/>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'AvenirLTStd-Roman',color:'#FFFFFF',fontSize:16}}>Notifications</Text>
                    <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}} onPress={()=>this.clearNotification()}>
                        <Text style={{color:'#FFFFFF'}}>Clear all</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.notiList.length > 0 && 
                    <FlatList data={this.state.notiList} 
                        renderItem={({item}) => (
                            <View style={{
                                backgroundColor:'#FFFFFF',
                                paddingHorizontal:10,
                                paddingVertical:15,
                                flexDirection:'row',
                                justifyContent:'flex-start',
                                alignItems:'center',
                                borderBottomColor: '#f0f0f0',
                                borderBottomWidth: 1,
                                flex:1
                            }}>
                                <ImageBackground  source={require('../../assets/default-noti.png')} style={{overflow:'hidden',width:50,height:50,borderRadius: 100}}></ImageBackground>
                                <View style={{flexWrap:'wrap',flex:1}}>
                                    <Text style={[MainStyles.JLELoopItemName,{marginLeft:10,flexWrap:'wrap',fontSize:13,lineHeight:15}]}>{item.message}</Text>
                                </View>
                            </View>
                            )}
                        keyExtractor={(item) => 'key-'+item.id}
                        viewabilityConfig={this.viewabilityConfig}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshingShift}
                                onRefresh={()=>{this.setState({isRefreshingShift:true}),this._fetchNotifications()}}
                                title="Pull to refresh"
                                colors={["#1d7bc3","red", "green", "blue"]}
                            />
                        }
                    />
                }
            </SafeAreaView>
        );
    }
}
export default Notifications;