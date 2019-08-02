import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,RefreshControl,ImageBackground,AsyncStorage,TouchableWithoutFeedback,
    ActionSheetIOS,Platform,Modal  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions,NavigationActions } from 'react-navigation';
import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import { FlatList } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import PhotoView from "@merryjs/photo-viewer";
const { height, width } = Dimensions.get('window');
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class ChatScreen extends Component{
    _isMounted = false;
    clearTime = '';
    clearTimeR = '';
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
            disableBtn:true,
            isFile:0,
            media:'',
            isModalOpened: false,  //Controls if modal is opened or closed
            currentImageIndex: 0,
            images:{}
        };
        this.readMsgs = this._readMsgs.bind(this);
        this.fetchChatting = this._fetchChatting.bind(this);
    }
    setUserData = async ()=>{
        await AsyncStorage.getItem('userData').then((userDataStringfy)=>{
            let userData = JSON.parse(userDataStringfy);
            this.setState({userData});
            this.readMsgs();
            this.clearTimeR = setInterval(()=>{
                this.readMsgs();
            },2000)
            this.update();
        });
    }
    componentDidMount(){
        this._isMounted = true;
        this.setUserData();
    }
    _fetchChatting = ()=>{
        if(this._isMounted){
            fetch(SERVER_URL+'fetch_chat_data?chat_id='+this.state.chat_id+'&user_type='+this.state.userData.user_type,{
                method:'GET',
                headers:myHeaders
            })
            .then(res=>{return res.json()})
            .then(response=>{
                if(response.status == 200){
                    this.setState({
                        loading:false,
                        full_name:response.result.full_name,
                        status:response.result.status,
                        chatting:response.result.msg
                    });
                    let images = [];
                    for(var i=0;i<response.result.media_list.length;i++){
                        images.push({source:{uri:response.result.media_list[i]}});
                    }
                    this.setState({loading:false,images});
                }
            })
            .catch(err=>{
                this.setState({loading:false,});
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
        var isFile = this.state.isFile;
        var newDate = new Date();
        if (message || isFile == 1) {
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
                    msg_text:message,
                    is_file:isFile,
                    media:this.state.avatarSource
                }
            }
            else{
                var messagesCopy = this.state.chatting
                messagesCopy = {
                    send_by:this.state.userData.id,
                    key:'key-'+messagesCopy.length+1,
                    send_on:newDate.getTime()/1000,
                    msg_text:message,
                    is_file:isFile,
                    media:this.state.avatarSource
                }
            }
            this.setState({chatting: messagesCopy,messageText: '',disableBtn:true,media:'',});
            if(this.state.chatting.length > 4){
                //this.scrollToTheBottom();
            }
            /*var fd = new FormData();
            fd.append('chat_id',this.state.chat_id);
            fd.append('user_id',this.state.userData.id);
            fd.append('message',message);
            fd.append('is_file',this.state.isFile);
            fd.append('media',this.state.fileData);*/
            var jsonData = {
                chat_id:this.state.chat_id,
                user_id:this.state.userData.id,
                message:message,
                is_file:this.state.isFile,
                media:this.state.fileData,
            }
            fetch( SERVER_URL + 'send_chat_msg',{
                method:'POST',
                headers:myHeaders,
                body:JSON.stringify(jsonData)
            })
            .then((response) => {return response.json()})
            .then((responseData) => {
                this.setState({isFile:0,fileData:{}});
            })
            .catch(err=>{
                console.log(err);
            });
        }
    }
    componentWillUnmount(){
        this._isMounted = false;
        clearTimeout(this.clearTime);
        clearInterval(this.clearTimeR);
    }
    pickFile = ()=>{
        const options = {
            title: 'Select File',
            storageOptions: {
              skipBackup: false,
              path: 'images',
            },
            maxWidth:800,
            maxHeight:800,
            mediaType:'photo',
            quality:1,
            allowsEditing:true,
          };
          
          /**
           * The first arg is the options object for customization (it can also be null or omitted for default options),
           * The second arg is the callback which sends object: response (more info in the API Reference)
           */
          ImagePicker.showImagePicker(options, (response) => {
            //console.log('Response = ', response);
          
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              const source = response.uri ;
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
              this.setState({
                profilePicName:response.fileName,
                fileData:{data:response.data,name:response.fileName},
                avatarSource: source,
                isFile:1
              });
              this.sendNewMessage();
            }
          });
    }
    openModal(index) {
        console.log(index);
        this.setState({isModalOpened: true, currentImageIndex: index })
    }
    _readMsgs = async ()=>{
        fetch(SERVER_URL+'/read_msg?chat_id='+this.state.chat_id+'&userId='+this.state.userData.id)
        .then(response=>{
        })
        .catch(err=>{
            console.log(err);
        });
        
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
                            renderItem={({item,key}) => (
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
                                        {
                                            item.is_file == '1' && 
                                            <TouchableOpacity onPress={() => {console.log(item.media.i_index);this.openModal(item.media.i_index)}} style={(item.msg_text!='')?{marginBottom:10}:''}>
                                                <Image source={{uri:item.media.url}} width={200} height={200} style={[{width:200,height:200,},]} />
                                            </TouchableOpacity>
                                            
                                        }
                                        {
                                            item.msg_text != '' && 
                                            <Text>{item.msg_text}</Text>
                                        }
                                        
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
                        <TouchableOpacity style={{justifyContent:'center',alignItems:'center',marginLeft: 10,}} onPress={()=>this.pickFile()}>
                            <Icon name="paperclip" style={{fontSize:25,color:'#7e7e7e'}} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[{justifyContent:'center',alignItems:'center',marginLeft: 10,}]} disabled={this.state.disableBtn} onPress={()=>this.sendNewMessage()}>
                            <Icon name="paper-plane-o" style={[{fontSize:22},enableBtn]} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
                {
                    this.state.images.length>0 && 
                    // <Modal visible={this.state.isModalOpened} transparent={true}>
                    //     <ImageViewer imageUrls={this.state.images} index={this.state.currentImageIndex} enableSwipeDown={true}/>
                    // </Modal>
                    <PhotoView
                        visible={this.state.isModalOpened}
                        data={this.state.images}
                        hideStatusBar={true}
                        hideShareButton={true}
                        initial={this.state.currentImageIndex}
                        onDismiss={e => {
                        // don't forgot set state back.
                        this.setState({ isModalOpened: false });
                        }}
                    />
                }
                
            </SafeAreaView>
        );
    }
}
export default ChatScreen;