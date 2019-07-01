import React,{Component} from 'React';
import {View,Text,Image,TextInput,TouchableOpacity,SafeAreaView,ImageBackground,ScrollView,KeyboardAvoidingView,
    AsyncStorage,Platform,NetInfo,BackHandler} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL,SENDER_ID } from '../../Constants';
import PhoneInput from 'react-native-phone-input';
import SmsListener from 'react-native-android-sms-listener';
import Permissions from 'react-native-permissions';
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
            resetPassField:false,
            resetPass:'',
            resetPassC:''
        }
        this.signIn = this._signIn.bind(this);
    }
    subscription = SmsListener.addListener(message => {
        let verificationCodeRegex = /Your OTP for reset password: ([\d]{4})/;
        if (verificationCodeRegex.test(message.body)) {
            let verificationCode = message.body.match(verificationCodeRegex)[1];
            this.setState({otp:verificationCode});
        }
    });
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
    }
    _signIn = () =>{
        if(this.state.mobileNumber == ''){
            Toast.show('Mobile number should not be blank',Toast.SHORT);
            return false;
        }
        else if(this.state.mobileNumber.length < 10){
            Toast.show('Mobile number should be atleast 10 digits',Toast.SHORT);
            return false;
        }
        //this.sendDataToServer();
        this.setState({loading:true});
        this.sendDataToServer();
    }
    checkOtp =()=>{
        if(this.state.otp == ''){
            Toast.show('OTP should not be blank',Toast.SHORT);
            return false;
        }
        if(this.state.otp != this.state.serverOtp){
            Toast.show('OTP not matched',Toast.SHORT);
            return false;
        }
        this.setState({resetPassField:true,otpField:false});
    }
    restPassword = ()=>{
        if(this.state.resetPass == ''){
            Toast.show('New password should not be blank',Toast.SHORT);
            return false;
        }
        if(this.state.resetPassC == ''){
            Toast.show('New confirm password should not be blank',Toast.SHORT);
            return false;
        }
        if(this.state.resetPass != this.state.resetPassC){
            Toast.show('Password did not matched',Toast.SHORT);
            return false;
        }
        this.setState({loading:true});
        fetch(SERVER_URL+'user_reset_pass',{
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: this.state.userId,
                newpass:this.state.resetPass,
                confirmPass:this.state.resetPassC
            })
        })
        .then((res)=>{console.log(res._bodyInit);return res.json()})
        .then((response)=>{
            console.log(response);
            if(response.status == 200){
                Toast.show(response.message,Toast.SHORT);
                //if(response.result.user_type == 'employer'){
                    setTimeout(()=>{this.props.navigation.navigate('Login');},1000);
                    this.setState({otpField:false,serverOtp:'',userId:'',otp:'',mobileNumber:''});
                //}
            }
            else{
                Toast.show(response.message,Toast.SHORT);
            }
            this.setState({loading:false});
        })
        .catch((err)=>{
            console.log(err);
            this.checkNetInfo();
            this.setState({loading:false});
        });
    }
    sendDataToServer(){
        var jsonArray = {
            phone: this.state.mobileCode+''+this.state.mobileNumber,
        };
        fetch(SERVER_URL+'user_forgot',{
            method:'POST',
            headers: {
                //Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonArray)
        })
        .then((res)=>{console.log(res._bodyInit);return res.json()})
        .then((response)=>{
            console.log(response);
            if(response.status == 200){
                //Toast.show(''+response.result.otp,Toast.SHORT);
                this.setState({userId:response.result.id,otpField:true,serverOtp:response.result.otp});
            }
            else{
                setTimeout(()=>{Toast.show(response.message,Toast.SHORT);},300);
            }
            this.setState({loading:false});
        })
        .catch((err)=>{
            console.log(err);
            this.checkNetInfo();
            this.setState({loading:false});
        });
    }
    componentDidMount = ()=>{
        this.props.navigation.addListener('willFocus',payload=>{
            if((payload.context).search('Navigation/BACK_Root') != -1){
                BackHandler.exitApp();
            }
        });
        this.checkNetInfo();
        Permissions.request('readSms').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            this.setState({ photoPermission: response })
        });
        Permissions.request('receiveSms').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            this.setState({ photoPermission: response })
        });
    }
    componentWillUnmount(){
        this.subscription.remove();
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
        var sendText = 'Send';
        if(this.state.otpField && !this.state.resetPassField){
            sendText = 'Check OTP';
        }
        else if(!this.state.otpField && this.state.resetPassField){
            sendText = 'Reset Password';
        }
        return(
            <ImageBackground source={require('../../assets/splash-bg.png')} style={{flex:1,backgroundColor:'#FFFFFF',justifyContent:'center',alignItems:'center'}}>
                <Loader loading={this.state.loading} />
                <KeyboardAvoidingView enabled style={{flex:1,justifyContent:'center',alignItems:'center',width:'100%',height:'100%'}} behavior={behavior}>
                    <ScrollView contentContainerStyle={{flex:1,justifyContent:'center',alignItems:'center',width:'100%',height:'100%'}} keyboardShouldPersistTaps="always">
                        <Image source={require('../../assets/web-logo.png')} style={{width:280,height:48}} />
                        <View style={{marginTop: 60,width:'100%',maxWidth:'70%'}}>
                            {
                                !this.state.otpField && !this.state.resetPassField && 
                                <View 
                                    style={{borderRadius: 35,borderStyle:"dashed",borderWidth: 3,borderColor: '#147dbf',
                                    width:'100%',
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    flexDirection: 'row',
                                    marginBottom: 22.5,
                                    justifyContent:'center',
                                    alignItems: 'center',
                                    marginTop:10,
                                    flexDirection:'row',
                                    }}
                                >
                                    <PhoneInput
                                    ref={(ref) => { this.mobileCode = ref; }}
                                    style={{
                                        textAlign:'left',
                                        paddingLeft: 10,
                                        height:40,
                                        fontSize:17,
                                        fontFamily:'AvenirLTStd-Medium',
                                        width:75
                                    }} 
                                    initialCountry={"au"}
                                    onChangePhoneNumber={(number)=>this.setState({mobileCode:number})}
                                    value={this.state.mobileCode}
                                    />
                                    <TextInput 
                                        style={{
                                            flex:1,
                                            textAlign:'left',
                                            paddingLeft: 3,
                                            height:40,
                                            fontSize:14,
                                            justifyContent:'center',
                                            alignItems:'center',
                                            fontFamily:'AvenirLTStd-Medium',
                                        }} 
                                        maxLength={10}
                                        placeholder="Mobile Number *" 
                                        returnKeyType={"go"} 
                                        keyboardType="number-pad"
                                        ref={(input) => { this.mobileNumber = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>this.setState({mobileNumber:text})} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.mobileNumber}
                                        onSubmitEditing={ () => this.signIn() }
                                    />
                                </View>
                            }
                            {
                                this.state.otpField && !this.state.resetPassField && 
                                <View style={{borderRadius: 35,borderStyle:"dashed",borderWidth: 3,borderColor: '#bebebe',width:'100%',paddingHorizontal: 12,paddingVertical: 6,flexDirection: 'row',justifyContent:'center',alignItems: 'center'}}>
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
                                        placeholder="OTP *" 
                                        returnKeyType={"go"} 
                                        keyboardType="number-pad"
                                        ref={(input) => { this.otp = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>this.setState({otp:text})} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.otp}
                                    />
                                </View>
                            }
                            {
                                !this.state.otpField && this.state.resetPassField && 
                                <View style={{width:'100%',}}>
                                    <View style={{borderRadius: 35,borderStyle:"dashed",borderWidth: 3,
                                        borderColor: '#bebebe',
                                        width:'100%',
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        flexDirection: 'row',
                                        justifyContent:'center',
                                        alignItems: 'center',
                                        marginBottom: 22.5,
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
                                            placeholder="New Password *" 
                                            returnKeyType={"next"} 
                                            keyboardType="default"
                                            secureTextEntry={true}
                                            onSubmitEditing={() => { this.resetPassC.focus(); }}
                                            ref={(input) => { this.resetPass = input; }} 
                                            blurOnSubmit={false}
                                            onChangeText={(text)=>this.setState({resetPass:text})} 
                                            placeholderTextColor="#bebebe" 
                                            underlineColorAndroid="transparent" 
                                            value={this.state.resetPass}
                                        />
                                    </View>
                                    <View style={{borderRadius: 35,borderStyle:"dashed",borderWidth: 3,
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
                                            placeholder="New confirm Password *" 
                                            returnKeyType={"go"} 
                                            keyboardType="default"
                                            secureTextEntry={true}
                                            ref={(input) => { this.resetPassC = input; }} 
                                            blurOnSubmit={false}
                                            onChangeText={(text)=>this.setState({resetPassC:text})} 
                                            placeholderTextColor="#bebebe" 
                                            underlineColorAndroid="transparent" 
                                            value={this.state.resetPassC}
                                        />
                                    </View>
                                </View>
                            }
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:26}}>
                                <TouchableOpacity style={MainStyles.psosBtn} onPress={()=>{
                                   if(this.state.otpField == true){
                                    this.checkOtp();
                                   }
                                   else if(this.state.resetPassField == true){
                                    this.restPassword();
                                   }
                                   else{
                                       this.signIn();
                                    }
                                }}>
                                    <Text style={MainStyles.psosBtnText}>{sendText}</Text>
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
                            <View style={{flexDirection:'row',alignItems: 'center',width:'100%',justifyContent:'center',marginTop:25}}>
                                <TouchableOpacity style={{marginLeft:5}}
                                onPress={()=>{this.props.navigation.navigate('Login')}}
                                >
                                    <Text style={{color:'#147dbf',fontSize:17,fontFamily:'AvenirLTStd-Roman'}}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}