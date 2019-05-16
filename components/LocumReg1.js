import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,
    ActionSheetIOS,Platform } from 'react-native';
import Loader from './Loader';
import MainStyles from './Styles';

const { height, width } = Dimensions.get('window');
class LocumReg1Screen extends Component{
    constructor(props) {
        super(props);
        var cOptionsList = ['Australia','New Zealand'];
        cOptionsList.unshift('Cancel');
        this.state={
            loading:false,
            CountryList:['Australia','New Zealand'],
            stateList:['VIC','NSW','QLD','ACT','TAS','NT','WA','SA','North Island','South Island'],
            cOptions:cOptionsList,
            spr:'VIC',
            country:'Australia',
        }
    }
    componentDidMount(){}
    pickerIos = ()=>{
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.state.cOptions,
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if(buttonIndex != 0){
              this.setState({country: this.state.cOptions[buttonIndex]})
            }
          });
    }
    signUpStep1 = ()=>{
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
        if(this.state.streetAddress == ''){
            Toast.show('Email ID should not be blank',Toast.SHORT)
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
        var step1Data = {
            firsName:this.state.firsName,
            lastName:this.state.lastName,
            phoneNo:this.state.phoneNo,
            emailAddress:this.state.emailAddress,
            streetAddress:this.state.streetAddress,
            city:this.state.city,
            spr:this.state.spr,
            pz:this.state.pz,
            country:this.state.country,
        }
        this.props.navigation.navigate('LocumReg2',{step1Data});
    }
    render(){
        const RemoveHiehgt = height - 66;
        var behavior = (Platform.OS == 'ios')?'padding':'';
        return (
            <SafeAreaView style={{flexDirection:'column',flex:1}}>
                <Loader loading={this.state.loading} />
                <View style={{paddingTop: 15,alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.goBack();}} style={{position:'absolute',left:8,top:8,paddingHorizontal:5,paddingVertical:15,width:10,height:19}}>
                        <Image source={require('../assets/blue-back-icon.png')} style={{width:10,height:19}}/>
                    </TouchableOpacity>
                    <Image source={require('../assets/web-logo.png')} style={{width:200,height:34}}/>
                    <Image source={require('../assets/header-b.png')} style={{width:'100%',marginTop:15}}/>
                </View>
                <KeyboardAvoidingView style={{flex:1,}} enabled behavior={behavior}>
                    <ScrollView style={{paddingHorizontal:15,height:RemoveHiehgt}} keyboardShouldPersistTaps="always">
                        <View style={{paddingVertical:20}}>
                            <Text style={{fontFamily:'AvenirLTStd-Heavy',color:'#151515',fontSize:16}}>Locum Registration Form</Text>
                            <Text style={{marginTop:5,fontFamily:'AvenirLTStd-Medium',color:'#676767',fontSize:13,marginBottom:5,}}>
                                To register and benefit from becoming a Pharmacy SOS locum, please use this form to register.
                            </Text>
                        </View>
                        {/* Locum Registration Heading Ends */}
                        <Image source={require('../assets/dashed-border.png')} width={'100%'} height={2} />
                        <View style={{justifyContent:'center',alignItems: 'center',paddingVertical:18,flexDirection: 'row'}}>
                            <View style={{paddingVertical:10,paddingHorizontal:10,backgroundColor:'#1476c0',borderRadius:10}}>
                                <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:12,}}>Contact Details</Text>
                            </View>
                            <View style={{paddingHorizontal:10}}>
                                <Image source={require('../assets/dashed-b-s.png')} width={100} style={{width:50}}/>
                            </View>
                            <View style={{paddingVertical:10,paddingHorizontal:10,backgroundColor:'#959595',borderRadius:10}}>
                                <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:12,}}>Professional Details</Text>
                            </View>
                        </View>
                        <Image source={require('../assets/dashed-border.png')} width={'100%'} height={2}/>
                        {/* BreadCrumbs Ends */}
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
                                onSubmitEditing={() => { this.lastName.focus(); }}
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
                                onSubmitEditing={() => { this.phoneNo.focus(); }}
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
                        <TextInput 
                            style={MainStyles.TInput} 
                            placeholder="Phone Number" 
                            returnKeyType={"go"} 
                            ref={(input) => { this.phoneNo = input; }} 
                            onSubmitEditing={() => { this.emailAddress.focus(); }}
                            blurOnSubmit={false}
                            keyboardType="phone-pad"
                            onChangeText={(text)=>this.setState({phoneNo:text})} 
                            placeholderTextColor="#bebebe" 
                            underlineColorAndroid="transparent" 
                            value={this.state.phoneNo}
                        />
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
                            onSubmitEditing={() => { this.streetAddress.focus(); }}
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
                            Address
                            <Text style={{color:'#ee1b24'}}>*</Text>
                        </Text>
                        <View style={{marginTop:10}}></View>
                        <TextInput 
                            style={MainStyles.TInput} 
                            placeholder="Street Address" 
                            returnKeyType={"go"} 
                            ref={(input) => { this.streetAddress = input; }} 
                            onSubmitEditing={() => { this.city.focus(); }}
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
                                onSubmitEditing={() => { this.pz.focus(); }}
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
                                <TouchableOpacity style={[MainStyles.TInput,{alignItems:'center'}]} onPress={()=>{this.pickerIos()}}>
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
                            <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                                this.signUpStep1();
                                
                            }}>
                                <Text style={MainStyles.psosBtnText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop:20}}></View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}
export default LocumReg1Screen;