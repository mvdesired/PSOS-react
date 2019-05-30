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
const { height, width } = Dimensions.get('window');
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class Pharmacy extends Component{
    _isMounted = false;
    clearTime = '';
    constructor(props){
        super(props);
        this.state={
            loading:true,
            isRefreshing:false,
            pharmaList:{},
            currentTab:'add',
        };
        this.fetchPharma = this._fetchPharma.bind(this);
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    componentDidMount = ()=>{
        this._isMounted = true;
        this.listener = this.props.navigation.addListener("didFocus", this.onFocus);
    }
    onFocus =()=>{
        this.setUserData();
        setTimeout(()=>{
            this.fetchPharma();
            /*this.clearTime = setInterval(()=>{
                //this.fetchPharma();
            },3500);*/
        },1500);
    }
    _fetchPharma = ()=>{
        fetch(SERVER_URL+'pharmacy_list?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>res.json())
        .then(response=>{
            if(response.status == 200){
                this.setState({pharmaList:response.result});
                
            }
            this.setState({isRefreshingShift:false,loading:false});
            //Toast.show(response.message,Toast.SHORT);
        })
        .catch(err=>{
            this.setState({isRefreshingShift:false,loading:false});
        });
    }
    timeSince = (date) => {
        var newDateFormate = new Date(date);
        var seconds = Math.floor((new Date() - newDateFormate) / 1000);
        var interval = Math.floor(seconds / 31536000);      
        if (interval > 1) {return interval + " years";}
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {return interval + " months";}
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {return interval + " days";}
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {return interval + " hours";}
        interval = Math.floor(seconds / 60);
        if (interval > 1) {return interval + " minutes";}
        return Math.floor(seconds) + " seconds";
    }
    componentWillUnmount(){
        this._isMounted = false;
        //clearTimeout(this.clearTime);
    }
    render(){
        const RemoveHiehgt = height - 88;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Pharmacy" />
                
                {
                    this.state.pharmaList.length > 0 && 
                    <FlatList data={this.state.pharmaList} 
                        renderItem={({item}) => (
                            <TouchableOpacity style={MainStyles.JLELoopItem} onPress={()=>{}}>
                                <View style={{flexWrap:'wrap'}}>
                                    <Text style={MainStyles.JLELoopItemName}>{item.business_name}</Text>
                                    <Text style={MainStyles.JLELoopItemTime}>{this.timeSince(item.created_on)}</Text>
                                </View>
                            </TouchableOpacity>
                            )}
                        keyExtractor={(item) => 'key-'+item.pharm_id}
                        viewabilityConfig={this.viewabilityConfig}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshingShift}
                                onRefresh={()=>{this.setState({isRefreshingShift:true}),this.fetchPharma()}}
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
                    width:40,
                    height:40,
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
                }} onPress={()=>{this.props.navigation.navigate('AddPharmacy');}}>
                    <Icon name="plus" style={{color:'#FFFFFF',fontSize:17,}}/>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}
export default Pharmacy;