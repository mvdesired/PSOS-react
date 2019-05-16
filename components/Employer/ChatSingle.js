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
const { height, width } = Dimensions.get('window');
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class ChatScreen extends Component{
    _isMounted = false;
    clearTime = '';
    constructor(props){
        super(props);
        this.state={
            loading:true,
            isRefreshing:false,
            chatting:{},
            messageText:'',
            chat_id:this.props.navigation.getParam('chat_id'),
            full_name: '',
            status:'',
            disableBtn:true
        };
        this.fetchChatting = this._fetchChatting.bind(this);
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    componentDidMount(){
        this._isMounted = true;
        this.setUserData();
        setTimeout(()=>{
            this.update();
        },1500);
    }
    _fetchChatting = ()=>{
        if(this._isMounted){
            fetch(SERVER_URL+'fetch_chat_data?chat_id='+this.state.chat_id+'&user_type='+this.state.userData.user_type,{
                method:'GET',
                headers:myHeaders
            })
            .then(res=>res.json())
            .then(response=>{
                if(response.status == 200){
                    this.setState({
                        loading:false,
                        full_name:response.result.full_name,
                        status:response.result.status,
                        chatting:response.result.msg
                    });
                }
            })
            .catch(err=>{
    
            })
        }
    }
    update() {
        this.fetchChatting();
        this.clearTime = setInterval(
          () => {this.fetchChatting();},
          2500
        );
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
            return fullDate+' '+strTime;
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
    onStartTyping(messageText){
        if(messageText && messageText.length >= 1){
            this.setState({disableBtn:false,messageText});
        }
        else {
            this.setState({disableBtn:true});
        }
    }
    sendNewMessage() {
        var message = this.state.messageText;
        var newDate = new Date();
        if (message) {
            this.refs['messageText'].setNativeProps({text: ''});
            if(this.state.chatting.length > 0){
                var messagesCopy = this.state.chatting.slice();
                for (var i = messagesCopy.length; i > 0; i--) {
                    messagesCopy[i] = messagesCopy[i - 1];
                }
                messagesCopy[0] = {
                    send_by:this.state.userData.id,
                    ID:'key-'+messagesCopy.length+1,
                    send_on:newDate.getTime()/1000,
                    msg_text:message
                }
            }
            else{
                var messagesCopy = this.state.chatting
                messagesCopy = {
                    send_by:this.state.userData.id,
                    key:'key-'+messagesCopy.length+1,
                    send_on:newDate.getTime()/1000,
                    msg_text:message
                }
            }
            this.setState({chatting: messagesCopy,messageText: '',disableBtn:true});
            if(this.state.chatting.length > 4){
                //this.scrollToTheBottom();
            }
            var fd = new FormData();
            fd.append('chat_id',this.state.chat_id);
            fd.append('user_id',this.state.userData.id);
            fd.append('message',message);
            fetch( SERVER_URL + 'send_chat_msg',{
                method:'POST',
                headers:myHeaders,
                body:fd
            })
            .then((response) => response.json())
            .then((responseData) => {

            })
            .catch(err=>{
                console.log(err);
            });
        }
    }
    componentWillUnmount(){
        this._isMounted = false;
        clearTimeout(this.clearTime);
    }
    render(){
        const enableBtn = this.state.disableBtn?{color:'rgba(126, 126, 126, 0.1)'}:{color:'#7e7e7e'};
        const RemoveHiehgt = height - 50;
        let behavior = '';
        if(Platform.OS == 'ios'){
            behavior = 'padding';
        }
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <View  style={[MainStyles.navHeaderWrapper]}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.goBack();}}style={{paddingHorizontal:5,paddingVertical:15}}>
                        <Image source={require('../../assets/back-icon.png')} style={{width:10,height:19}}/>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'AvenirLTStd-Roman',color:'#FFFFFF',fontSize:16}}>{this.state.full_name}</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{fontFamily:'AvenirLTStd-Light',color:'#FFFFFF',fontSize:12}}>{this.state.status}</Text>
                    </View>
                </View>
                <View style={{flex:1,height:RemoveHiehgt}}>
                    {
                        this.state.chatting.length > 0 && 
                        <FlatList data={this.state.chatting}
                            renderItem={({item}) => (
                                <View style={[{
                                    flexDirection:'row',
                                    paddingHorizontal:10,
                                    flexWrap:'wrap',
                                    alignItems:'center',
                                    marginVertical: 10,
                                },(item.send_by == this.state.userData.id)?{justifyContent:'flex-end'}:{justifyContent:'flex-start'},
                                ]}>
                                    {
                                        (item.send_by == this.state.userData.id) && <Text style={{color:'#b6b6b6',fontSize:12}}>{this.formatAMPM(item.send_on*1000)}</Text>
                                    }
                                    
                                    <View style={[{backgroundColor:(item.send_by != this.state.userData.id)?'#ffffff':'#99c5e8',flexWrap:'wrap',paddingHorizontal:10,paddingVertical:10,borderRadius:5},
                                    (item.send_by == this.state.userData.id)?{marginLeft:10}:{marginRight:10}]}>
                                        {
                                                (item.send_by != this.state.userData.id) && 
                                                <View style={{width:10,height:5,position:'absolute',left:-4,top:0,backgroundColor:'#FFFFFF'}}>
                                                    <View style={{width:6,height:5,position:'absolute',bottom:-1,left:-2,borderRadius:6,backgroundColor:'#f0f0f0'}}></View>
                                                </View>
                                        }
                                        {
                                                (item.send_by == this.state.userData.id) && 
                                                <View style={{width:10,height:5,position:'absolute',right:-4,top:0,backgroundColor:'#99c5e8'}}>
                                                    <View style={{width:6,height:5,position:'absolute',bottom:-1,right:-2,borderRadius:2,backgroundColor:'#f0f0f0'}}></View>
                                                </View>
                                        }
                                        <Text>{item.msg_text}</Text>
                                    </View>
                                    {
                                        (item.send_by != this.state.userData.id) && <Text style={{color:'#b6b6b6',fontSize:12}}>{this.formatAMPM(item.send_on*1000)}</Text>
                                    }
                                </View>
                            )}
                            inverted
                            keyExtractor={(item) => 'key-'+item.ID}
                            viewabilityConfig={this.viewabilityConfig}
                        />
                    }
                </View>
                <KeyboardAvoidingView behavior={behavior}>
                    <View style={{backgroundColor:'#FFFFFF',paddingHorizontal:10,paddingVertical:10,flexDirection:'row',alignItems:'center'}}>
                        <TextInput 
                            style={{
                                flex:1,
                                paddingHorizontal: 10,
                                paddingVertical:2,
                                height:40,
                                fontSize:14,
                                borderRadius:20,
                                fontFamily:'AvenirLTStd-Medium',
                                backgroundColor:'#f0f0f0'
                            }} 
                            returnKeyType={"go"} 
                            blurOnSubmit={false}
                            multiline={true}
                            onChangeText={(messageText)=>this.onStartTyping(messageText)}
                            ref = {'messageText'}
                            placeholderTextColor="#bebebe" 
                            underlineColorAndroid="transparent" 
                            text={this.state.messageText}
                        />
                        <TouchableOpacity style={{justifyContent:'center',alignItems:'center',marginLeft: 10,}}>
                            <Icon name="paperclip" style={{fontSize:25,color:'#7e7e7e'}} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[{justifyContent:'center',alignItems:'center',marginLeft: 10,}]} disabled={this.state.disableBtn} onPress={()=>this.sendNewMessage()}>
                            <Icon name="paper-plane-o" style={[{fontSize:22},enableBtn]} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}
export default ChatScreen;