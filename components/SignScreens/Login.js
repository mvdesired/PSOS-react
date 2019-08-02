import React,{Component} from 'React';
import {View,Text,Image,TextInput,TouchableOpacity,SafeAreaView,ImageBackground,ScrollView,KeyboardAvoidingView,
    AsyncStorage,Platform,NetInfo} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL,SENDER_ID } from '../../Constants';
import PushNotification from 'react-native-push-notification';
import PhoneInput from 'react-native-phone-input';
export default class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            mobileNumber:'4',
            otp:'',
            serverOtp:'',
            otpField:false,
            userId:0,
            mobileCode:'+61',
            emailAddress:'',
            password:''
        }
        this.signIn = this._signIn.bind(this);
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
    }
    _signIn = () =>{
        if(this.state.emailAddress == ''){
            Toast.show('Email address should not be blank',Toast.SHORT)
            return false;
        }
        if(this.state.password == ''){
            Toast.show('Password should not be blank',Toast.SHORT)
            return false;
        }
        //this.sendDataToServer();
        this.setState({loading:true});
        this.getToken(this.sendDataToServer.bind(this));
    }
    checkOtp =()=>{
        /*if(this.state.otp == ''){
            Toast.show('OTP should not be blank',Toast.SHORT);
            return false;
        }
        if(this.state.otp != this.state.serverOtp){
            Toast.show('OTP not matched',Toast.SHORT);
            return false;
        }
        this.setState({loading:true});*/
        fetch(SERVER_URL+'userdata',{
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: this.state.userId
            })
        })
        .then((res)=>{return res.json()})
        .then((response)=>{
            if(response.status == 200){
                Toast.show(response.message,Toast.SHORT);
                this.saveDetails('isUserLoggedIn',"true");
                this.saveDetails('userData',JSON.stringify(response.result));
                //if(response.result.user_type == 'employer'){
                    this.props.navigation.navigate('Home');
                    this.setState({otpField:false,serverOtp:'',userId:'',otp:'',emailAddress:'',password:''});
                //}
            }
            else{
                Toast.show(response.message,Toast.SHORT);
            }
            this.setState({loading:false});
        })
        .catch((err)=>{
            //console.log(err);
            this.checkNetInfo();
            this.setState({loading:false});
        });
    }
    sendDataToServer(token){
        if(this.state.emailAddress != ''){
            var tokenGenerated = (typeof(token) != "undefined")?token.token:'';
            var jsonArray = {
                email: this.state.emailAddress,
                password: this.state.password,
                device_type:Platform.OS,
                device_key:tokenGenerated
            };
            fetch(SERVER_URL+'user_login',{
                method:'POST',
                headers: {
                    //Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonArray)
            })
            .then((res)=>{return res.json()})
            .then((response)=>{
                if(response.status == 200){
                    //Toast.show(''+response.result.otp,Toast.SHORT);otpField:true,serverOtp:response.result.otp,
                    this.setState({userId:response.result.id});
                    this.checkOtp();
                }
                else{
                    setTimeout(()=>{Toast.show(response.message,Toast.SHORT);},300);
                }
                this.setState({loading:false});
            })
            .catch((err)=>{
                //console.log(err);
                this.checkNetInfo();
                this.setState({loading:false});
            });
        }
    }
    componentDidMount = ()=>{
        this.checkNetInfo();
    }
    getToken = (onToken)=>{
        //if(Platform.OS == 'android'){
            PushNotification.configure({
                onRegister: onToken,
                onNotification: function(notification) {
                },
                senderID: SENDER_ID,
                permissions: {
                    alert: true,
                    badge: true,
                    sound: true
                },
                popInitialNotification: true,
                requestPermissions: true,
            });
        //  }
        //  else{
        //      onToken();
        //  }
    }
    checkNetInfo = ()=>{
        if (Platform.OS === "android") {
            NetInfo.isConnected.fetch().then(isConnected => {
              if (!isConnected) {
                Toast.show("Please connect to internet!",Toast.LONG);
              }
            });
        } else {
            // For iOS devices
            NetInfo.isConnected.addEventListener(
              "connectionChange",
              this.handleFirstConnectivityChange
            );
        }
    };
    handleFirstConnectivityChange = isConnected => {
        NetInfo.isConnected.removeEventListener(
          "connectionChange",
          this.handleFirstConnectivityChange
        );
        if (isConnected === false) {
            Toast.show("Please connect to internet!",Toast.LONG);
        }
    };
    render(){
        var behavior = Platform.OS == 'ios' ? 'padding' :'';
        return(
            <ImageBackground source={require('../../assets/splash-bg.png')} style={{flex:1,backgroundColor:'#FFFFFF',justifyContent:'center',alignItems:'center'}}>
                <Loader loading={this.state.loading} />
                <KeyboardAvoidingView enabled style={{flex:1,justifyContent:'center',alignItems:'center',width:'100%',height:'100%'}} behavior={behavior}>
                    <ScrollView contentContainerStyle={{flex:1,justifyContent:'center',alignItems:'center',width:'100%',height:'100%'}} keyboardShouldPersistTaps="always">
                        <Image source={require('../../assets/web-logo.png')} style={{width:280,height:48}} />
                        <View style={{marginTop: 60,width:'100%',maxWidth:'70%'}}>
                        <View 
                        style={{
                        borderRadius: 35,
                        borderStyle:"dashed",
                        borderWidth: 3,
                        borderColor: '#147dbf',
                        width:'100%',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        flexDirection: 'row',
                        marginBottom: 22.5,
                        justifyContent:'center',
                        alignItems: 'center',
                        }}
                    >
                        <Image source={require('../../assets/envelope.png')} width={18} height={14} style={{width:18,height:14}}/>
                        <TextInput 
                        style={{
                            flex:1,
                            textAlign:'left',
                            paddingLeft: 10,
                            height:40,
                            fontSize:17,
                            fontFamily:'AvenirLTStd-Medium'
                        }} 
                        placeholder="Email *" 
                        returnKeyType={"next"} 
                        //ref={(input) => { this.emailAddress = input; }} 
                        onSubmitEditing={() => { this.password.focus(); }} 
                        blurOnSubmit={false}
                        onChangeText={(text)=>this.setState({emailAddress:text})} 
                        keyboardType="email-address" 
                        autoCapitalize='none' 
                        placeholderTextColor="#147dbf" 
                        underlineColorAndroid="transparent" 
                        value={this.state.emailAddress}
                        />
                    </View>
                    <View style={{
                        borderRadius: 35,
                        borderStyle:"dashed",
                        borderWidth: 3,
                        borderColor: '#bebebe',
                        width:'100%',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        flexDirection: 'row',
                        justifyContent:'center',
                        alignItems: 'center',
                        }}
                    >
                        <Image source={require('../../assets/lock-disable.png')} width={18} height={24} style={{width:18,height:24}}/>
                        <TextInput 
                            style={{
                                flex:1,
                                textAlign:'left',
                                paddingLeft: 10,
                                height:40,
                                fontSize:17,
                                fontFamily:'AvenirLTStd-Medium',
                            }} 
                            placeholder="Password *" 
                            returnKeyType={"go"} 
                            secureTextEntry={true} 
                            ref={(input) => { this.password = input; }} 
                            blurOnSubmit={false}
                            onChangeText={(text)=>this.setState({password:text})} 
                            placeholderTextColor="#bebebe" 
                            underlineColorAndroid="transparent" 
                            value={this.state.password}
                        />
                    </View>
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:26}}>
                                <TouchableOpacity style={MainStyles.psosBtn} onPress={()=>{this.signIn()}}>
                                    <Text style={MainStyles.psosBtnText}>Login</Text>
                                </TouchableOpacity>
                                { 
                                    this.state.otpField && 
                                    <TouchableOpacity style={{marginTop:10}} onPress={()=>{
                                        this.setState({otpField:false});
                                    }}>
                                        <Text style={{color:'#147dbf',fontFamily:'AvenirLTStd-Roman'}}>Previous</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            <View style={{flexDirection:'row',alignItems: 'center',width:'100%',justifyContent:'flex-end',marginTop:15}}>
                                <TouchableOpacity style={{marginLeft:5}}
                                onPress={()=>{this.props.navigation.navigate('ForgotPassword')}}
                                >
                                    <Text style={{color:'#147dbf',fontFamily:'AvenirLTStd-Roman'}}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection:'row',alignItems: 'center',width:'100%',justifyContent:'center',marginTop:25}}>
                                <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Roman'}}>Don’t have an Account ?</Text>
                                <TouchableOpacity style={{marginLeft:5}}
                                onPress={()=>{this.props.navigation.navigate('Registration')}}
                                >
                                    <Text style={{color:'#147dbf',fontFamily:'AvenirLTStd-Roman'}}>Register.</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}