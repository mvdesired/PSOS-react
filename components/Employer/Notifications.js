import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,RefreshControl,ImageBackground,AsyncStorage,FlatList,
    ActionSheetIOS,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions,NavigationActions } from 'react-navigation';
import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
//import { FlatList } from 'react-native-gesture-handler';
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
            isRefreshingNoti:false,
            notiList:{},
        };
    }
    setUserData = async()=>{
        await AsyncStorage.getItem('userData').then((userDataStringfy)=>{
            let userData = JSON.parse(userDataStringfy);
            this.setState({userData});
            this._fetchNotifications();
            this.clearTime = setInterval(()=>{
                this._fetchNotifications();
            },10000);
        });
    }
    componentDidMount =()=>{
        this._isMounted = true;
        this.listener = this.props.navigation.addListener("didFocus", this.onFocus);
    }
    onFocus = ()=>{
        this.setUserData();
    }
    _fetchNotifications = ()=>{
        fetch(SERVER_URL+'fetch_notification?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>{return res.json()})
        .then(response=>{
            if (this._isMounted) {
                if(response.status == 200){
                    this.setState({notiList:response.result.noti_list});
                }
                this.setState({loading:false,isRefreshingNoti:false});
            }
        })
        .catch(err=>{
            //console.log(err);
            this.setState({loading:false,isRefreshingNoti:false});
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
                            <TouchableOpacity style={{
                                backgroundColor:'#FFFFFF',
                                paddingHorizontal:10,
                                paddingVertical:15,
                                flexDirection:'row',
                                justifyContent:'flex-start',
                                alignItems:'center',
                                borderBottomColor: '#f0f0f0',
                                borderBottomWidth: 1,
                                flex:1,
                                opacity:(item.is_read == 1)?0.5:1
                            }} onPress={()=>{
                                fetch(SERVER_URL+'read_notification?user_id='+this.state.userData.id+'&noti_id='+item.id,{
                                    method:'GET',
                                    headers:myHeaders
                                })
                                .then(res=>res.json())
                                .then(response=>{
                                    this._fetchNotifications();
                                })
                                .catch(err=>{
                                    //console.log(err);
                                });
                                if(item.job_id != "0"){
                                    if(this.state.userData.user_type == 'employer'){
                                        if(item.job_type == 'locum_shift'){
                                            this.props.navigation.navigate('LocumList',{job_id:item.job_id,job_type:'shift',locum_id:item.user_id2,isEnd:item.is_end,is_filled:item.is_filled,applied:item.applied});
                                        }
                                        else{
                                            this.props.navigation.navigate('LocumList',{job_id:item.job_id,job_type:'perm',locum_id:item.user_id2,isEnd:item.is_end,is_filled:item.is_filled,applied:item.applied});
                                        }
                                    }
                                    else{
                                        if(item.job_type == 'locum_shift'){
                                            this.props.navigation.navigate('JobDetails',{job_type:'shift',job_id:item.job_id,is_cancelled:item.is_cancelled,isEnd:item.is_end,applied:item.applied,is_filled:item.is_filled});
                                        }
                                        else{
                                            this.props.navigation.navigate('JobDetails',{job_type:'perm',job_id:item.job_id,is_cancelled:item.is_cancelled,applied:item.applied,is_filled:item.is_filled});
                                        }
                                    }
                                }
                            }}>
                                <ImageBackground  source={require('../../assets/default-noti.png')} style={{overflow:'hidden',width:50,height:50,borderRadius: 100}}></ImageBackground>
                                <View style={{flexWrap:'wrap',flex:1}}>
                                    <Text style={[MainStyles.JLELoopItemName,{marginLeft:10,flexWrap:'wrap',fontSize:13,lineHeight:15}]}>{item.message}</Text>
                                </View>
                            </TouchableOpacity>
                            )}
                        keyExtractor={(item) => 'key-'+item.id}
                        viewabilityConfig={this.viewabilityConfig}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshingNoti}
                                onRefresh={()=>{this.setState({isRefreshingNoti:true}),this._fetchNotifications()}}
                                title="Pull to refresh"
                                colors={["#1d7bc3","red", "green", "blue"]}
                            />
                        }
                    />
                }
                <TouchableOpacity style={{
                    position:'absolute',
                    right:10,
                    bottom:20,
                    width:50,
                    height:50,
                    backgroundColor:'#1d7bc3',
                    borderRadius:35,
                    zIndex:98562,
                    justifyContent:'center',
                    alignItems:'center',
                    elevation:3,
                    shadowColor:'#1e1e1e',
                    shadowOffset:3,
                    shadowOpacity:0.7,
                    shadowRadius:3
                }} onPress={()=>{
                    this.setState({isRefreshingNoti:true});
                    this._fetchNotifications();
                }}>
                    <Icon name="refresh" style={{color:'#FFFFFF',fontSize:20,}}/>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}
export default Notifications;