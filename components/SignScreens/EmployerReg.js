import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,AsyncStorage,Keyboard,BackHandler,Alert,
    ActionSheetIOS,Platform } from 'react-native';
import Loader from '../Loader';
import MainStyles from '../Styles';
//import countryList from 'react-select-country-list';
import Dialog, { SlideAnimation } from "react-native-popup-dialog";
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import PhoneInput from 'react-native-phone-input'
const { height, width } = Dimensions.get('window');
var myHeaders = new Headers();
myHeaders.set('Content-Type', 'application/json');
class EmployerScreen extends Component{
    constructor(props) {
        super(props);
        var cOptionsList = ['Australia'];
        cOptionsList.unshift('Cancel');
        var sOptions = ['VIC','NSW','QLD','ACT','TAS','NT','WA','SA'];
        sOptions.unshift('Cancel');
        this.state={
            loading:false,
            CountryList:['Australia'],
            stateList:['VIC','NSW','QLD','ACT','TAS','NT','WA','SA'],
            cOptions:cOptionsList,
            sOptions:sOptions,
            showTerms:false,
            firsName:'',
            lastName:'',
            phoneNo:'4',
            phoneCode:'+61',
            emailAddress:'',
            password:'',
            city:'',
            spr:'VIC',
            pz:'',
            country:'Australia',
            otpVisible:false,
            otp:'',
            serverOtp:'',
            page_text:''
        }
        this.singup = this._signup.bind(this);
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
    }
    componentDidMount = () => {
        this.props.navigation.addListener('willFocus',payload=>{
            if((payload.context).search('Navigation/BACK_Root') != -1){
                BackHandler.exitApp();
            }
        });
        fetch(SERVER_URL+'app_page_text?page_name=terms',{
            method:'GET',
            headers:myHeaders
          })
          .then(res=>res.json())
          .then(response=>{
            this.setState({page_text:response.page_text});
            console.log(response);
          })
          .catch(err=>{
            console.log(err);
          });
    }
    _signup = () => {
        
        if(this.state.firsName == ''){
            Toast.show('First name should not be blank',Toast.SHORT);
            return false;
        }
        if(this.state.lastName == ''){
            Toast.show('Last name should not be blank',Toast.SHORT)
            return false;
        }
        if(this.state.phoneNo == ''){
            Toast.show('Phone number should not be blank',Toast.SHORT)
            return false;
        }
        if(this.state.emailAddress == ''){
            Toast.show('Email ID should not be blank',Toast.SHORT)
            return false;
        }
        if(this.state.password == ''){
            Toast.show('Password should not be blank',Toast.SHORT)
            return false;
        }
        if(this.state.streetAddress == ''){
            Toast.show('Street address should not be blank',Toast.SHORT)
            return false;
        }
        if(this.state.city == ''){
            Toast.show('City should not be blank',Toast.SHORT)
            return false;
        }
        if(this.state.spr == ''){
            Toast.show('State/Provision/Region should not be blank',Toast.SHORT)
            return false;
        }
        if(this.state.pz == ''){
            Toast.show('Postal/Zipcode should not be blank',Toast.SHORT)
            return false;
        }
        if(this.state.country == ''){
            Toast.show('Country should not be blank',Toast.SHORT)
            return false;
        }
        Alert.alert(
            'Please check you email and mobile number',
            'Email: '+this.state.emailAddress+' \n Mobile Number: '+this.state.phoneCode+''+this.state.phoneNo,
            [
              {
                text: 'Change',
                onPress: () => {
                    this.setState({showTerms:false});
                },
                style: 'cancel',
              },
              {text: 'Correct', onPress: () => {
                this.setState({loading:true});
                var formdata = new FormData();
                formdata.append('fname',this.state.firsName);
                formdata.append('lname',this.state.lastName);
                formdata.append('phone',this.state.phoneCode+''+this.state.phoneNo);
                formdata.append('email',this.state.emailAddress);
                formdata.append('password',this.state.password);
                formdata.append('address',this.state.streetAddress);
                formdata.append('city',this.state.city);
                formdata.append('state',this.state.spr);
                formdata.append('postal',this.state.pz);
                formdata.append('country',this.state.country);
                formdata.append('device_type',Platform.OS);
                formdata.append('device_key','');
                fetch(SERVER_URL+'emp_reg',{
                    method:'POST',
                    headers: {
                        Accept: 'application/json',
                    },
                    body: formdata
                })
                .then((res)=>{return res.json()})
                .then((response)=>{
                    if(response.status == 200){
                        Toast.show(response.message,Toast.SHORT);
                        //this.saveDetails('isUserLoggedIn',"true");
                        //this.saveDetails('userData',JSON.stringify(response.result));
                        this.setState({showTerms:false,otpVisible:true,serverOtp:response.result.otp,userId:response.result.id});
                        //this.props.navigation.navigate('Login',{user_id:response.id,otp:response.otp});
                    }
                    else{
                        Toast.show(response.message,Toast.SHORT);
                    }
                    this.setState({loading:false});
                })
                .catch((err)=>{
                    console.log(err);
                    this.setState({loading:false});
                });
              }},
            ],
            {cancelable: false},
        );
        
    }
    pickerIos = () => {
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.state.cOptions,
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if(buttonIndex != 0){
              this.setState({country: this.state.cOptions[buttonIndex]});
            }
          });
    }
    pickerState = ()=>{
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.state.sOptions,
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if(buttonIndex != 0){
              this.setState({spr: this.state.sOptions[buttonIndex]})
            }
          });
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
        this.setState({loading:true});
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
                    this.setState({otpVisible:false,serverOtp:'',userId:'',otp:''});
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
    render(){
        const RemoveHiehgt = height - 66;
        var behavior = (Platform.OS == 'ios')?'padding':'';
        return (
            <SafeAreaView style={{flexDirection:'column',flex:1}}>
                <Loader loading={this.state.loading} />
                <View style={{
                    paddingTop: 15,
                    alignItems:'center',
                    justifyContent:'center'
                }}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.goBack();}} style={{position:'absolute',left:8,top:8,paddingLeft:10,paddingRight:15,paddingVertical:15,}}>
                        <Image source={require('../../assets/blue-back-icon.png')} style={{width:10,height:19}}/>
                    </TouchableOpacity>
                    <Image source={require('../../assets/web-logo.png')} style={{width:200,height:34}}/>
                    <Image source={require('../../assets/header-b.png')} style={{width:'100%',marginTop:15}}/>
                </View>
                <KeyboardAvoidingView style={{flex:1,}} enabled behavior={behavior}>
                    <ScrollView style={{paddingHorizontal:15,height:RemoveHiehgt}} keyboardShouldPersistTaps="always">
                        <View style={{paddingVertical:20,}}>
                            <Text style={{
                                fontFamily:'AvenirLTStd-Heavy',
                                color:'#151515',
                                fontSize:16
                            }}>Employer Registration</Text>
                            <Text style={{
                                marginTop:5,
                                fontFamily:'AvenirLTStd-Medium',
                                color:'#676767',
                                fontSize:13,
                                marginBottom:5,
                            }}>
                                To register and benefit from becoming a Pharmacy SOS locum, please use this form to register.
                            </Text>
                        </View>
                        {/* Locum Registration Heading Ends */}
                        <Image source={require('../../assets/dashed-border.png')} width={'100%'} height={2} />
                        <View style={{marginTop:15}}></View>
                        <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                            Name
                            <Text style={{color:'#ee1b24'}}>*</Text>
                        </Text>
                        <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10}}>
                            <TextInput 
                                style={MainStyles.TInput} 
                                placeholder="First Name" 
                                returnKeyType={"go"} 
                                ref={(input) => { this.firsName = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({firsName:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.firsName}
                            />
                            <View style={{paddingHorizontal:10}}></View>
                            <TextInput 
                                style={MainStyles.TInput} 
                                placeholder="Last Name" 
                                returnKeyType={"go"} 
                                ref={(input) => { this.lastName = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({lastName:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.lastName}
                            />
                        </View>
                        {/* First & Last Name Ends */}
                        <View style={{marginTop:15}}></View>
                        <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                            Phone
                            <Text style={{color:'#ee1b24'}}>*</Text>
                        </Text>
                        <View style={{marginTop:10}}></View>
                        {/* <TextInput 
                            style={MainStyles.TInput} 
                            placeholder="Phone Number" 
                            returnKeyType={"go"} 
                            ref={(input) => { this.phoneNo = input; }} 
                            blurOnSubmit={false}
                            onChangeText={(text)=>this.setState({phoneNo:text})} 
                            placeholderTextColor="#bebebe" 
                            underlineColorAndroid="transparent" 
                            value={this.state.phoneNo}
                        /> */}
                        <View 
                            style={{paddingLeft: 10,
                                paddingVertical:2,
                                height:30,
                                fontSize:14,
                                borderRadius:20,
                                fontFamily:'AvenirLTStd-Medium',
                                borderColor:'#a1a1a1',
                                borderWidth: 1,
                                borderStyle:"dashed",
                                flexDirection:'row'
                            }}
                        >
                            <PhoneInput
                            ref={(ref) => { this.phoneCode = ref; }}
                            style={{
                                textAlign:'left',
                                paddingLeft: 10,
                                height:25,
                                fontSize:14,
                                fontFamily:'AvenirLTStd-Medium',
                                width:75
                            }} 
                            initialCountry={"au"}
                            onChangePhoneNumber={(number)=>this.setState({phoneCode:number})}
                            value={this.state.phoneCode}
                            />
                            <TextInput 
                                style={[MainStyles.TInput,{
                                    borderWidth:0,
                                    height:26,
                                }]}
                                maxLength={10}
                                placeholder="Mobile Number *" 
                                keyboardType="number-pad"
                                ref={(input) => { this.phoneNo = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({phoneNo:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.phoneNo}
                            />
                        </View>
                        {/* Phone Ends */}
                        <View style={{marginTop:15}}></View>
                        <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                            E-mail
                            <Text style={{color:'#ee1b24'}}>*</Text>
                        </Text>
                        <View style={{marginTop:10}}></View>
                        <TextInput 
                            style={MainStyles.TInput} 
                            placeholder="E-mail" 
                            returnKeyType={"go"} 
                            ref={(input) => { this.emailAddress = input; }} 
                            blurOnSubmit={false}
                            keyboardType="email-address"
                            onChangeText={(text)=>this.setState({emailAddress:text})} 
                            placeholderTextColor="#bebebe" 
                            underlineColorAndroid="transparent" 
                            value={this.state.emailAddress}
                        />
                        {/* Email Ends */}
                        <View style={{marginTop:15}}></View>
                        <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                            Password
                            <Text style={{color:'#ee1b24'}}>*</Text>
                        </Text>
                        <View style={{marginTop:10}}></View>
                        <TextInput 
                            style={MainStyles.TInput} 
                            placeholder="Password *" 
                            returnKeyType={"go"} 
                            ref={(input) => { this.password = input; }} 
                            blurOnSubmit={false}
                            secureTextEntry={true}
                            keyboardType="default"
                            onChangeText={(text)=>this.setState({password:text})} 
                            placeholderTextColor="#bebebe" 
                            underlineColorAndroid="transparent" 
                            value={this.state.password}
                        />
                        {/* Password Ends */}
                        <View style={{marginTop:15}}></View>
                        <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                            Address
                            <Text style={{color:'#ee1b24'}}>*</Text>
                        </Text>
                        <View style={{marginTop:10}}></View>
                        <TextInput 
                            style={MainStyles.TInput} 
                            placeholder="Street Address" 
                            returnKeyType={"go"} 
                            ref={(input) => { this.streetAddress = input; }} 
                            blurOnSubmit={false}
                            onChangeText={(text)=>this.setState({streetAddress:text})} 
                            placeholderTextColor="#bebebe" 
                            underlineColorAndroid="transparent" 
                            value={this.state.streetAddress}
                        />
                        <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:15}}>
                            <TextInput 
                                style={MainStyles.TInput} 
                                placeholder="City" 
                                returnKeyType={"go"} 
                                ref={(input) => { this.city = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({city:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.city}
                            />
                            <View style={{paddingHorizontal:5}}></View>
                            {
                                Platform.OS == 'android' && 
                                <View style={[MainStyles.TInput,{paddingLeft:0,paddingVertical:0}]}>
                                    <Picker
                                    selectedValue={this.state.spr}
                                    style={{
                                        flex:1,
                                        paddingLeft: 10,
                                        paddingVertical:2,
                                        height:30,
                                    }}
                                    textStyle={{fontSize: 14,fontFamily:'AvenirLTStd-Medium'}}
                                    itemTextStyle= {{fontSize: 14,fontFamily:'AvenirLTStd-Medium'}}
                                    itemStyle={MainStyles.TInput}
                                    onValueChange={(itemValue, itemIndex) => this.setState({spr: itemValue})}>
                                        {
                                        this.state.stateList.map(item=>{
                                            return (
                                            <Picker.Item key={'key-'+item} label={item} value={item} />
                                            )
                                        })
                                        }
                                    </Picker>
                                </View>
                            }
                            {
                                Platform.OS == 'ios' && 
                                <TouchableOpacity style={[MainStyles.TInput,{alignItems:'center'}]} onPress={()=>{this.pickerState()}}>
                                    <Text style={{color:'#03163a',fontFamily:'Roboto-Light',fontSize:18}}>{this.state.spr}</Text>
                                </TouchableOpacity>
                                
                            }
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:15}}>
                            <TextInput 
                                style={MainStyles.TInput} 
                                placeholder="Postal / Zipcode" 
                                returnKeyType={"go"} 
                                ref={(input) => { this.pz = input; }} 
                                blurOnSubmit={false}
                                keyboardType="number-pad"
                                maxLength={4}
                                onChangeText={(text)=>this.setState({pz:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.pz}
                            />
                            <View style={{paddingHorizontal:5}}></View>
                            {
                                Platform.OS == 'android' && 
                                <View style={[MainStyles.TInput,{paddingLeft:0,paddingVertical:0}]}>
                                    <Picker
                                    selectedValue={this.state.country}
                                    style={{
                                        flex:1,
                                        paddingLeft: 10,
                                        paddingVertical:2,
                                        height:30,
                                    }}
                                    textStyle={{fontSize: 14,fontFamily:'AvenirLTStd-Medium'}}
                                    itemTextStyle= {{fontSize: 14,fontFamily:'AvenirLTStd-Medium'}}
                                    itemStyle={MainStyles.TInput}
                                    onValueChange={(itemValue, itemIndex) => this.setState({country: itemValue})}>
                                        {
                                        this.state.CountryList.map(item=>{
                                            return (
                                            <Picker.Item key={'key-'+item} label={item} value={item} />
                                            )
                                        })
                                        }
                                    </Picker>
                                </View>
                            }
                            {
                                Platform.OS == 'ios' && 
                                <TouchableOpacity style={[MainStyles.TInput,{alignItems:'center'}]} onPress={()=>{this.pickerIos()}}>
                                    <Text style={{color:'#03163a',fontFamily:'Roboto-Light',fontSize:18}}>{this.state.country}</Text>
                                </TouchableOpacity>
                                
                            }
                        </View>
                        {/* Address Ends */}
                        <View style={{
                            justifyContent:'center',
                            alignItems:'center',
                            marginTop:26
                        }}>
                            <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{Keyboard.dismiss();this.setState({showTerms:true});}}>
                                <Text style={MainStyles.psosBtnText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop:20}}></View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Dialog
                    visible={this.state.showTerms}
                    dialogStyle={{ width: "95%", padding: 0, maxHeight: "90%",marginTop:43 ,flex:1,backgroundColor:'transparent'}}
                    dialogAnimation={new SlideAnimation()}
                    containerStyle={{
                        zIndex: 10,
                        flex: 1,
                        justifyContent: "space-between",
                        backgroundColor:'transparent',
                    }}
                    onTouchOutside={()=>{this.setState({showTerms:false})}}
                    rounded={false}
                    >
                    <SafeAreaView style={{flex:1,width:'100%',height:'90%',padding:0,borderWidth: 0,overflow:'visible',backgroundColor:'#FFFFFF',margin:0}}>
                        <View style={MainStyles.modalHeader} >
                            <Text style={MainStyles.modalHeaderHeading}>Terms and Conditions</Text>
                            <TouchableOpacity onPress={() =>{this.setState({showTerms:false})}}>
                                <Image source={require('../../assets/cross-icon.png')} width={21} height={21} style={{height:21,width:21}} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{paddingHorizontal: 10,paddingVertical:10,backgroundColor:'#FFFFFF'}}>
                            <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#1476c0',fontSize:15}}>
                                Our Terms and Conditions
                            </Text>
                            <View style={MainStyles.tacItems}>
                                <Text style={MainStyles.tacItemsH}>{this.state.page_text}</Text>
                                <Image source={require('../../assets/bd-tc.png')} width={'100%'} style={MainStyles.tacItemsImage}/>
                            </View>
                        </ScrollView>
                        <View style={MainStyles.modalFooter}>
                            <TouchableOpacity style={[MainStyles.psosBtn, MainStyles.psosBtnXm]} onPress={()=>{this.singup()}}>
                                <Text style={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]}>I Agree</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Dialog>
                <Dialog
                    visible={this.state.otpVisible}
                    dialogStyle={{ width: "95%", padding: 0, maxHeight: "95%",marginTop:30 ,flex:1,backgroundColor:'transparent'}}
                    dialogAnimation={new SlideAnimation()}
                    containerStyle={{
                        zIndex: 10,
                        flex: 1,
                        justifyContent: "space-between",
                        backgroundColor:'transparent',
                    }}
                    rounded={false}
                    >
                    <SafeAreaView style={{flex:1,width:'100%',height:'95%',padding:0,borderWidth: 0,overflow:'visible'}}>
                        <View style={MainStyles.modalHeader} >
                            <Text style={MainStyles.modalHeaderHeading}>Enter OTP</Text>
                        </View>
                        <KeyboardAvoidingView enabled behavior={behavior}>
                            <ScrollView keyboardShouldPersistTaps="always"  contentContainerStyle={{paddingHorizontal: 10,paddingVertical:10,backgroundColor:'#FFFFFF'}}>
                                <TextInput 
                                style={MainStyles.TInput} 
                                placeholder="OTP" 
                                returnKeyType={"go"} 
                                ref={(input) => { this.otp = input; }} 
                                onBlur={()=>{Keyboard.dismiss()}}
                                blurOnSubmit={false}
                                keyboardType="number-pad"
                                onChangeText={(text)=>this.setState({otp:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.otp}
                            />
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:26}}>
                                <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{this.checkOtp();}}>
                                    <Text style={MainStyles.psosBtnText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </Dialog>
            </SafeAreaView>
        );
    }
}
export default EmployerScreen;