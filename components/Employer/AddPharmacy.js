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
import PhoneInput from 'react-native-phone-input'
const { height, width } = Dimensions.get('window');
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class AddPharmacy extends Component{
    constructor(props){
        super(props);
        this.state={
            loading:true,
            pharm_id:this.props.navigation.getParam("pharm_id"),
            redirect:this.props.navigation.getParam("redirect"),
            pageTitle:'Add Pharmacy',
            bPhone:'4',
            abn:'',
            bname:'',
            fname:'',
            lname:'',
            bEmail:'',
            bPhoneCode:'+61'
        };
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    componentDidMount = ()=>{
        this.setUserData();
        if(this.state.pharm_id){
            console.log(this.state.pharm_id);
            fetch(SERVER_URL+'pharmacy_details?p_id='+this.state.pharm_id)
            .then(res=>{console.log(res); return res.json();})
            .then(response=>{
                console.log(response.result);
                var results = response.result;
                this.setState({loading:false,pageTitle:'Edit Pharmacy',bname:results.business_name,abn:results.abn,fname:results.f_name,lname:results.l_name,bEmail:results.email,bPhone:results.phone,bFax:results.fax,mNumber:results.mobile});
            })
            .catch(err=>{
                console.log(err);
                this.setState({loading:false,pageTitle:'Add Pharmacy'});
            });
        }
        else{
            this.setState({loading:false,pageTitle:'Add Pharmacy'});
        }
    }
    submitPharmacy = ()=>{
        if(this.state.bname == ''){
            Toast.show('Business name should not be blank',Toast.SHORT);
            return false;
        }
        if(this.state.abn == ''){
            Toast.show('ABN should not be blank',Toast.SHORT);
            return false;
        }
        if((this.state.abn).length < 11){
            Toast.show('ABN should 11 digit long',Toast.SHORT);
            return false;
        }
        if(this.state.fname == ''){
            Toast.show('First name should not be blank',Toast.SHORT);
            return false;
        }
        if(this.state.lname == ''){
            Toast.show('Last name should not be blank',Toast.SHORT);
            return false;
        }
        if(this.state.bEmail == ''){
            Toast.show('Business E-mail should not be blank',Toast.SHORT);
            return false;
        }
        if(this.state.bPhone == ''){
            Toast.show('Business Phone should not be blank',Toast.SHORT);
            return false;
        }
        if((this.state.bPhone).length > 12){
            Toast.show('Business Phone should be 12 digit long',Toast.SHORT);
            return false;
        }
        this.setState({loading:true});
        var formdata = new FormData();
        formdata.append('user_id',this.state.userData.id);
        formdata.append('business_name',this.state.bname);
        formdata.append('abn',this.state.abn);
        formdata.append('f_name',this.state.fname);
        formdata.append('l_name',this.state.lname);
        formdata.append('email',this.state.bEmail);
        formdata.append('phone',this.state.bPhone);
        formdata.append('fax',this.state.bFax);
        formdata.append('mobile',this.state.mNumber);
        var ActionType = 'add_pharmacy';
        if(this.state.pharm_id){
            formdata.append('pharm_id',this.state.pharm_id);
            ActionType = 'update_pharmacy';
        }
        fetch(SERVER_URL+ActionType,{
            method:'POST',
            headers: {Accept: 'application/json'},
            body:formdata
        })
        .then(res=>res.json())
        .then(response=>{
            this.setState({loading:false,currentTab:'list'});
            Toast.show(response.message,Toast.SHORT);
            this.setState({bname:'',abn:'',fname:'',lname:'',bEmail:'',bPhone:'',bFax:'',mNumber:''});
            if(this.state.redirect){
                this.props.navigation.navigate(this.state.redirect);
            }
            else{
                this.props.navigation.navigate('Pharmacy');
            }
        })
        .catch(err=>{
            this.setState({loading:false});
            console.log(err);
            Toast.show('Something went wrong',Toast.SHORT);
        });
    }
    render(){
        const RemoveHiehgt = height - 88;
        var behavior = (Platform.OS == 'ios')?'padding':'';
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName={this.state.pageTitle} />
                <KeyboardAvoidingView style={{flex:1}} enabled behavior={behavior}>
                    <ScrollView style={{height:RemoveHiehgt,flex:1}} keyboardShouldPersistTaps="always">
                        <View style={{backgroundColor:'#FFFFFF',flex:1,marginTop:10,paddingHorizontal:10,paddingVertical:15}}>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Business Name
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <TextInput 
                                style={[MainStyles.TInput]} 
                                returnKeyType={"next"} 
                                ref={(input) => { this.bname = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({bname:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.bname}
                            />
                            {/* Business Name ends */}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                ABN
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <TextInput 
                                style={[MainStyles.TInput]} 
                                returnKeyType={"next"} 
                                ref={(input) => { this.abn = input; }} 
                                blurOnSubmit={false}
                                keyboardType={"number-pad"}
                                onChangeText={(text)=>this.setState({abn:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.abn}
                                maxLength={11}
                            />
                            {/* ABN ends */}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Contact Name
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:10}}>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    placeholder="First Name"
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.fname = input; }} 
                                    blurOnSubmit={false}
                                    onChangeText={(text)=>this.setState({fname:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.fname}
                                />
                                <View style={{paddingLeft:10}}></View>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    placeholder="Last Name"
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.lname = input; }} 
                                    blurOnSubmit={false}
                                    onChangeText={(text)=>this.setState({lname:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.lname}
                                />
                            </View>
                            {/* F & L Name ends */}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Business E-mail
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <TextInput 
                                style={[MainStyles.TInput]} 
                                placeholder="E-mail"
                                keyboardType={"email-address"}
                                returnKeyType={"next"} 
                                ref={(input) => { this.bEmail = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({bEmail:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.bEmail}
                            />
                            {/* B Email ends */}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Business Phone
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{marginTop:10}}></View>
                            {/* <TextInput 
                                style={[MainStyles.TInput]} 
                                placeholder="Phone"
                                keyboardType={"phone-pad"}
                                returnKeyType={"next"} 
                                ref={(input) => { this.bPhone = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({bPhone:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.bPhone}
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
                                ref={(ref) => { this.bPhoneCode = ref; }}
                                style={{
                                    textAlign:'left',
                                    paddingLeft: 10,
                                    height:25,
                                    fontSize:14,
                                    fontFamily:'AvenirLTStd-Medium',
                                    width:75
                                }}  
                                initialCountry={"au"}
                                onChangePhoneNumber={(number)=>this.setState({bPhoneCode:number})}
                                value={this.state.bPhoneCode}
                                />
                                <TextInput 
                                    style={{
                                        flex:1,
                                        textAlign:'left',
                                        paddingLeft: 3,
                                        height:25,
                                        fontSize:14,
                                        paddingTop:1,
                                        alignItems:'center',
                                        fontFamily:'AvenirLTStd-Medium',
                                        borderTopLeftRadius:0,
                                        borderBottomLeftRadius:0,
                                    }} 
                                    maxLength={10}
                                    keyboardType="number-pad"
                                    ref={(input) => { this.bPhone = input; }} 
                                    blurOnSubmit={false}
                                    onChangeText={(text)=>this.setState({bPhone:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.bPhone}
                                />
                            </View>
                            
                            {/* B Phone ends */}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Business Fax
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <TextInput 
                                style={[MainStyles.TInput]} 
                                placeholder="Fax"
                                returnKeyType={"next"} 
                                keyboardType={"phone-pad"}
                                ref={(input) => { this.bFax = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({bFax:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.bFax}
                            />
                            {/* B Fax ends */}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Mobile Number
                                {/* <Text style={{color:'#ee1b24'}}>*</Text> */}
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <TextInput 
                                style={[MainStyles.TInput]} 
                                maxLength={12}
                                placeholder="Mobile Number"
                                returnKeyType={"next"} 
                                keyboardType={"phone-pad"}
                                ref={(input) => { this.mNumber = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({mNumber:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.mNumber}
                            />
                            {/* B Fax ends */}
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:26}}>
                                <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{this.submitPharmacy()}}>
                                    <Text style={MainStyles.psosBtnText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:20}}></View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                
            </SafeAreaView>
        );
    }
}
export default AddPharmacy;