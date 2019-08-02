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
import Header from '../Navigation/Header';
import { FlatList } from 'react-native-gesture-handler';
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
const { height, width } = Dimensions.get('window');
class EChatList extends Component{
    _isMounted = false;
    clearTime = '';
    constructor(props){
        super(props);
        this.state={
            loading:true,
            isRefreshing:false,
            chatList:[]
        };
        //this.fetchChatList = this._fetchChatList.bind(this);
    }
    setUserData = async()=>{
        await AsyncStorage.getItem('userData').then((userDataStringfy)=>{
            let userData = JSON.parse(userDataStringfy);
            this.setState({userData});
            this._fetchChatList();
            this.clearTime = setInterval(() => {this._fetchChatList();},5000);
        });
    }
    componentDidMount(){
        this._isMounted = true;
        this.setUserData();
    }
    _fetchChatList = ()=>{
        if(this._isMounted){
            fetch(SERVER_URL+'fethc_chat_list?user_id='+this.state.userData.id+'&user_type='+this.state.userData.user_type,{
                method:'GET',
                headers:myHeaders,
            })
            .then(res=>{console.log(res);return res.json()})
            .then(response=>{
                console.log(response);
                if(response.status == 200){
                    this.setState({chatList:response.result});
                }
                this.setState({loading:false,isRefreshing:false});
            })
            .catch(err=>{
                this.setState({loading:false,isRefreshing:false});
                console.log(err);
            })
        }
    }
    formatAMPM(date) {
        var date = new Date(date);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var dateToday = (new Date()).getDate();
        var messageDate = date.getDate();
        if(dateToday > messageDate){
            var fullDate = date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return fullDate;//+' '+strTime;
        }
        else{
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }
    }
    componentWillUnmount(){
        this._isMounted = false;
        clearTimeout(this.clearTime);
    }
    render(){
        const RemoveHiehgt = height - 50;
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Chat" />
                <View style={{height:RemoveHiehgt}}>
                    {
                        this.state.chatList.length > 0 && 
                        <FlatList data={this.state.chatList} 
                            renderItem={({item}) => (
                                <TouchableOpacity style={{
                                    backgroundColor:'#FFFFFF',
                                    paddingHorizontal:10,
                                    paddingVertical:15,
                                    flexDirection:'row',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                    borderBottomColor: '#f0f0f0',
                                    borderBottomWidth: 1,
                                }} onPress={()=>{
                                    this.props.navigation.navigate('ChatScreen',{chat_id:item.chat_id});
                                }}>
                                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                        <View style={{width:50,height:50,borderRadius: 100,justifyContent:'center',alignItems:'center'}}>
                                            <ImageBackground  source={{uri:item.user_img}} style={{overflow:'hidden',width:50,height:50,borderRadius: 100,borderColor:'#afafaf',borderWidth:1}}></ImageBackground>
                                            <View style={{
                                                    width:13,
                                                    height:13,
                                                    backgroundColor:(item.status == 'Offline')?'#afafaf':'#00ff00',
                                                    position: 'absolute',
                                                    right:1,
                                                    bottom:1,
                                                    borderWidth: 2,
                                                    borderColor: '#FFFFFF',
                                                    borderRadius:100
                                                }}></View>
                                        </View>
                                        <View style={{flexWrap:'wrap',flex:1,maxWidth:180}}>
                                            <Text style={[MainStyles.JLELoopItemName,{marginLeft:10,flexWrap:'wrap'}]}>{item.full_name}</Text>
                                            <Text style={[MainStyles.JLELoopItemName,{fontSize:13,marginLeft:10,flexWrap:'wrap'}]}>{item.msg}</Text>
                                        </View>
                                    </View>
                                    <View style={{alignItems:'center'}}>
                                        {
                                            item.lastMsg > 0 && 
                                            <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#676767',fontSize:11}}>{this.formatAMPM(item.lastMsg)}</Text>
                                        }
                                        
                                        {
                                            item.unread > 0 && 
                                            <View style={{marginTop:5,backgroundColor:'#02aeee',width:18,height:18,alignItems:'center',justifyContent:'center',borderRadius:100,alignContent:'center'}}>
                                                <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:10,lineHeight:20,textAlign:"center"}}>{item.unread}</Text>
                                            </View>
                                        }
                                        
                                    </View>
                                </TouchableOpacity>
                                )}
                            keyExtractor={(item) => 'key-'+item.user_id}
                            viewabilityConfig={this.viewabilityConfig}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={()=>{this.setState({isRefreshing:true}),this._fetchChatList()}}
                                    title="Pull to refresh"
                                    colors={["#1d7bc3","red", "green", "blue"]}
                                />
                            }
                            />
                    }
                    {
                        this.state.chatList.length < 1 && 
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize: 18,}}>No chats here</Text>
                            <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnXm,{marginTop:10}]} onPress={()=>{
                                this.setState({loading:true,isRefreshing:true});
                                this._fetchChatList();
                            }}>
                                <Text style={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </SafeAreaView>
        );
    }
}
export default EChatList;