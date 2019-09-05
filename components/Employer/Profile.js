import React,{Component} from 'react';
import {View,ImageBackground, Image,Text,StyleSheet,TextInput,KeyboardAvoidingView,
    Dimensions,ScrollView, TouchableOpacity,Picker,Platform,AsyncStorage,
    SafeAreaView } from 'react-native';
import MainStyles from '../Styles';
import Loader from '../Loader';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../Navigation/Header';
import DateTimePicker from "react-native-modal-datetime-picker";
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
const { height, width } = Dimensions.get('window');
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class Profile extends Component{
    constructor(props) {
        super(props);
        var todayDate = new Date();
        todayDate.setFullYear(todayDate.getFullYear() - 21);
        this.state={
            loading:false,
            isEditing:false,
            CountryList:['Australia','New Zealand'],
            stateList:['VIC','NSW','QLD','ACT','TAS','NT','WA','SA','North Island','South Island'],
            userData:{
                user_img:''
            },
            about:'',
            js_restrict:'No',
            js_software:['Simple'],
            js_admin_vaccin:'No',
            js_comfort:'No',
            js_medi_review:'No',
            des_restrict:'',
            resumFileName:'',
            isDatePickerVisible:false,
            resumFile:'',
            maxDate:todayDate,
            selectedDate:todayDate,
            noti_sound:'default'
        }
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
    }
    setUserData = async()=>{
        await AsyncStorage.getItem('userData').then((userDataStringfy)=>{
            let userData = JSON.parse(userDataStringfy);
            console.log(userData);
            var dob = (userData.js_dob)?(userData.js_dob).split('-'):'';
            var dd,mm,yy;
            if(dob.length > 0){
                dd = dob[0];
                mm = dob[1];
                yy = dob[2];
            }
            var selectedDate = new Date(yy+'-'+mm+'-'+dd);
            this.setState({
                userData,
                fname:userData.fname,
                lname:userData.lname,
                user_img:userData.user_img,
                email:userData.email,
                phone:userData.phone,
                address:userData.address,
                city:userData.city,
                state:userData.state,
                country:userData.country,
                postal:userData.postal,
                about:userData.about,
                js_ahpra:userData.js_ahpra,
                dd,
                mm,
                yy,
                js_reg:userData.js_reg,
                user_type:userData.user_type,
                js_restrict:userData.js_restrict,
                js_software:(userData.js_software)?userData.js_software.split(','):'',
                js_admin_vaccin:userData.js_admin_vaccin,
                js_comfort:userData.js_medi_review,
                js_medi_review:userData.js_medi_review,
                des_restrict:userData.des_restrict,
                loading:false,
                selectedDate,
                noti_sound:userData.noti_sound
            });
        });
    }
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
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
              this.setState({
                profilePicName:response.fileName,
                fileData:{data:response.data,name:response.fileName},
                user_img: response.uri,
              });
            }
          });
    }
    componentDidMount(){
        this.props.navigation.addListener('didFocus',this.setUserData);
    }
    updateProfile = ()=>{
        var cureYear = new Date();
        if(this.state.js_reg >= cureYear.getFullYear()){
            Toast.show("Initial year should be less than current year",Toast.SHORT);
            return false;
        }
        this.setState({loading:true});
        var formdata = new FormData();
        formdata.append('user_id',this.state.userData.id);
        formdata.append('fname',this.state.fname);
        formdata.append('lname',this.state.lname);
        formdata.append('email',this.state.email);
        formdata.append('address',this.state.address);
        formdata.append('city',this.state.city);
        formdata.append('state',this.state.state);
        formdata.append('postal',this.state.postal);
        formdata.append('country',this.state.country);
        formdata.append('about',this.state.about);
        formdata.append('user_img',this.state.fileData);
        var jsonArray = {
            user_id:this.state.userData.id,
            fname:this.state.fname,
            lname:this.state.lname,
            address:this.state.address,
            city:this.state.city,
            state:this.state.state,
            postal:this.state.postal,
            country:this.state.country,
            user_img:this.state.fileData,
            email:this.state.email,
            about:this.state.about,
            js_dob:this.state.dd+'-'+this.state.mm+'-'+this.state.yy,
            js_ahpra:this.state.js_ahpra,
            js_reg:this.state.js_reg,
            user_type:this.state.user_type,
            js_restrict:this.state.js_restrict,
            js_software:this.state.js_software,
            js_admin_vaccin:this.state.js_admin_vaccin,
            js_comfort:this.state.js_medi_review,
            js_medi_review:this.state.js_medi_review,
            des_restrict:this.state.des_restrict,
            js_resume:this.state.resumFile,
        }
        fetch(SERVER_URL+'update_emp_profile',{
            method:'POST',
            credentials: 'same-origin',
            mode: 'same-origin',
            headers:myHeaders,
            body: JSON.stringify(jsonArray)
        })
        .then((res)=>{console.log(res);return res.json()})
        .then((response)=>{
            if(response.status == 200){
                Toast.show(response.message,Toast.SHORT);
                this.saveDetails('userData',JSON.stringify(response.result));
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
    }
    chooseDoc = ()=>{
        this.setState({loading:true});
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
          },(error,res) => {
              if(res){
                var fileExtArra = res.fileName.split('.');
                var fileExt = fileExtArra[fileExtArra.length-1];
                if(fileExt != "pdf" && fileExt != "docx" && fileExt != "doc"){
                    Toast.show('Please upload only document or pdf file',Toast.SHORT);
                    this.setState({loading:false});
                    return false;
                }
                this.setState({resumFileName:res.fileName});
                RNFS.readFile(res.uri, 'base64')
                .then(result => {this.setState({resumFile:{data:result,filename:res.fileName}});this.setState({loading:false});})
                .catch(error => {this.setState({loading:false});});
              }
              else{
                this.setState({loading:false});
              }
          });
    }
    checkSoftware = (value)=>{
        if(this.state.js_software.indexOf(value) === -1){
            var selected = this.state.js_software;
            selected.push(value);
            this.setState({js_software:selected});
        }
        else{
            var selected = this.state.js_software;
            selected.splice(this.state.js_software.indexOf(value),1);
            this.setState({js_software:selected});
        }
    }
    showDatePicker = () => {
        this.setState({ isDatePickerVisible: true });
    };
    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };
    handleDatePicked = date => {
        var changeDate = new Date(date);
        var dd = ''+changeDate.getDate();
        var mm = ''+(changeDate.getMonth()+1);
        var yy = ''+changeDate.getFullYear();
        if(dd < 10){dd = '0'+dd;}
        if(mm < 10){mm = '0'+mm;}
        this.setState({
            dd,mm,yy
        });
        this.hideDatePicker();
    };
    saveNotificationSound = (noti_sound)=>{
        var fd = new FormData();
        fd.append('user_id',this.state.userData.id);
        fd.append('noti_sound',noti_sound);
        console.log(this.state.noti_sound);
        fetch(SERVER_URL+'save_user_notification_sound',{
            method:'POST',
            //headers:myHeaders,
            body:fd
            // JSON.stringify({
            //     user_id:this.state.userData.user_id,
            //     noti_sound:this.state.noti_sound
            // })
        })
        .then(res=>{console.log(res);return res.json()})
        .then(r=>{
            this.updateProfile();
            console.log(r);

        })
        .catch(err=>{console.log(err);});
    }
    render(){
        const RemoveHiehgt = height - 50;
        var behavior = (Platform.OS == 'ios')?'padding':'';
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Profile" style={{elevation:5,
                    shadowColor:'#000000',
                    shadowOffset:3,
                    shadowOpacity:0.8,
                    shadowRadius:3,}} />
                <KeyboardAvoidingView enabled behavior={behavior} style={{flex:1}}>
                    <ScrollView keyboardShouldPersistTaps="always" style={{flex:1,backgroundColor:'#FFFFFF',height:RemoveHiehgt}}>
                        <View style={{backgroundColor:'#1d7bc3',paddingHorizontal:10,flexDirection:'row',alignItems:'center'}}>
                            <View style={{width:100,height:100,borderRadius: 100,justifyContent:'center',alignItems:'center',marginBottom: 10,marginTop:20,elevation:50}}>
                                {
                                    this.state.user_img != '' && 
                                    <ImageBackground  source={{uri:this.state.user_img}} style={{overflow:'hidden',width:100,height:100,borderRadius: 100}}></ImageBackground>
                                }
                                {this.state.isEditing == true &&
                                    <TouchableOpacity style={{
                                            width:25,
                                            height:25,
                                            backgroundColor:'#FFFFFF',
                                            position: 'absolute',
                                            right:1,
                                            bottom:1,
                                            borderWidth: 2,
                                            borderColor: '#FFFFFF',
                                            borderRadius:100,
                                            alignItems:'center',
                                            justifyContent: 'center',
                                    }} onPress={()=>{this.pickFile()}}>
                                        <Image source={require('../../assets/camera-icon.png')} style={{width:15,height:14}}/>
                                    </TouchableOpacity>
                                }
                            </View>
                            <View style={{alignItems:'center',marginLeft: 15}}>
                                <View style={{alignItems:'center',flexDirection:'row'}}>
                                    <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:16}}>{this.state.fname} {this.state.lname}</Text>
                                    <TouchableOpacity style={{marginLeft:10,paddingHorizontal:5}} onPress={()=>{
                                        if(this.state.isEditing == true){this.setState({isEditing:false});}
                                        else{this.setState({isEditing:true});}
                                        }}>
                                        <Image source={require('../../assets/pencil-white-icon.png')} style={{width:15,height:15}} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{justifyContent:'flex-start',alignItems:'flex-start'}}>
                                    <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:16,textAlign:'left'}}>{this.state.phone}</Text>
                                </View>
                                
                            </View>
                        </View>
                        {this.state.isEditing == false && <View style={{paddingHorizontal:20}}>
                            <View style={MainStyles.locumProfileItemWrapper}>
                                <Text style={MainStyles.LPIHeading}>Mobile Number</Text>
                                <Text style={MainStyles.LPISubHeading}>{this.state.phone}</Text>
                            </View>
                            <View style={MainStyles.locumProfileItemWrapper}>
                                <Text style={MainStyles.LPIHeading}>Email</Text>
                                <Text style={MainStyles.LPISubHeading}>{this.state.email}</Text>
                            </View>
                            <View style={MainStyles.locumProfileItemWrapper}>
                                <Text style={MainStyles.LPIHeading}>Address</Text>
                                <Text style={MainStyles.LPISubHeading}>{this.state.address} {this.state.city} {this.state.state}, {this.state.country} {this.state.postal} </Text>
                            </View>
                            {
                                this.state.userData.user_type == 'locum' && 
                                <View>
                                    <View style={MainStyles.locumProfileItemWrapper}>
                                        <Text style={MainStyles.LPIHeading}>About You – Mini Resume</Text>
                                        <Text style={MainStyles.LPISubHeading}>{this.state.about}</Text>
                                    </View>
                                    <View style={MainStyles.locumProfileItemWrapper}>
                                        <Text style={MainStyles.LPIHeading}>DOB</Text>
                                        <Text style={MainStyles.LPISubHeading}>{this.state.dd+'-'+this.state.mm+'-'+this.state.yy}</Text>
                                    </View>
                                    <View style={MainStyles.locumProfileItemWrapper}>
                                        <Text style={MainStyles.LPIHeading}>AHPRA Registration Number</Text>
                                        <Text style={MainStyles.LPISubHeading}>{this.state.js_ahpra}</Text>
                                    </View>
                                    <View style={MainStyles.locumProfileItemWrapper}>
                                        <Text style={MainStyles.LPIHeading}>Initial year of registration</Text>
                                        <Text style={MainStyles.LPISubHeading}>{this.state.js_reg}</Text>
                                    </View>
                                    <View style={MainStyles.locumProfileItemWrapper}>
                                        <Text style={MainStyles.LPIHeading}>Restriction imposed</Text>
                                        <Text style={MainStyles.LPISubHeading}>{this.state.js_restrict}</Text>
                                    </View>
                                    <View style={MainStyles.locumProfileItemWrapper}>
                                        <Text style={MainStyles.LPIHeading}>Dispensing Software</Text>
                                        <Text style={MainStyles.LPISubHeading}>{this.state.js_software.join(',')}</Text>
                                    </View>
                                    <View style={MainStyles.locumProfileItemWrapper}>
                                        <Text style={MainStyles.LPIHeading}>Admin Vaccinations</Text>
                                        <Text style={MainStyles.LPISubHeading}>{this.state.js_admin_vaccin}</Text>
                                    </View>
                                    <View style={MainStyles.locumProfileItemWrapper}>
                                        <Text style={MainStyles.LPIHeading}>Administer Vaccinations</Text>
                                        <Text style={MainStyles.LPISubHeading}>{this.state.js_comfort}</Text>
                                    </View>
                                    <View style={MainStyles.locumProfileItemWrapper}>
                                        <Text style={MainStyles.LPIHeading}>Medication Review</Text>
                                        <Text style={MainStyles.LPISubHeading}>{this.state.js_medi_review}</Text>
                                    </View>
                                </View>
                            }
                        </View>
                        } 
                        {
                            this.state.isEditing == true && 
                            <View style={{paddingHorizontal:20}}>
                                <View style={{marginTop:15}}></View>
                                <View style={{justifyContent:'center',alignItems:'center',marginTop: 10,marginBottom:15}}>
                                    <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{this.updateProfile()}}>
                                        <Text style={[MainStyles.psosBtnText,{fontFamily:'AvenirLTStd-Light',fontSize:15}]}>Save Details</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginTop:15}}></View>
                                <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                    Name
                                    <Text style={{color:'#ee1b24'}}>*</Text>
                                </Text>
                                <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10}}>
                                    <TextInput 
                                        style={MainStyles.TInput} 
                                        placeholder="First Name" 
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.fname = input; }} 
                                        onSubmitEditing={() => { this.lname.focus(); }}
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>this.setState({fname:text})} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.fname}
                                    />
                                    <View style={{paddingHorizontal:10}}></View>
                                    <TextInput 
                                        style={MainStyles.TInput} 
                                        placeholder="Last Name" 
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.lname = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>this.setState({lname:text})} 
                                        onSubmitEditing={() => { this.email.focus(); }}
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.lname}
                                    />
                                </View>
                                {/* First & Last Name Ends */}
                                <View style={{marginTop:15}}></View>
                                <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                    Email
                                    <Text style={{color:'#ee1b24'}}>*</Text>
                                </Text>
                                <View style={{marginTop:10}}></View>
                                <TextInput 
                                    style={MainStyles.TInput} 
                                    placeholder="Email" 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.email = input; }} 
                                    onSubmitEditing={() => { this.address.focus(); }}
                                    blurOnSubmit={false}
                                    onChangeText={(text)=>this.setState({email:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.email}
                                />
                                {/* Email Field */}
                                <View style={{marginTop:15}}></View>
                                <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                    Address
                                    <Text style={{color:'#ee1b24'}}>*</Text>
                                </Text>
                                <View style={{marginTop:10}}></View>
                                <TextInput 
                                    style={MainStyles.TInput} 
                                    placeholder="Street Address" 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.address = input; }} 
                                    onSubmitEditing={() => { this.city.focus(); }}
                                    blurOnSubmit={false}
                                    onChangeText={(text)=>this.setState({address:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.address}
                                />
                                <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:15}}>
                                    <TextInput 
                                        style={MainStyles.TInput} 
                                        placeholder="City" 
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.city = input; }} 
                                        onSubmitEditing={() => { this.postal.focus(); }}
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
                                            selectedValue={this.state.state}
                                            style={{
                                                flex:1,
                                                paddingLeft: 10,
                                                paddingVertical:2,
                                                height:30,
                                            }}
                                            textStyle={{fontSize: 14,fontFamily:'AvenirLTStd-Medium'}}
                                            itemTextStyle= {{fontSize: 14,fontFamily:'AvenirLTStd-Medium'}}
                                            itemStyle={MainStyles.TInput}
                                            onValueChange={(itemValue, itemIndex) => this.setState({state: itemValue})}>
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
                                            <Text style={{color:'#03163a',fontFamily:'Roboto-Light',fontSize:18}}>{this.state.state}</Text>
                                        </TouchableOpacity>
                                        
                                    }
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:15}}>
                                    <TextInput 
                                        style={MainStyles.TInput} 
                                        placeholder="Postal / Zipcode" 
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.postal = input; }} 
                                        onSubmitEditing={() => { this.about.focus(); }}
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>this.setState({postal:text})} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.postal}
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
                                {
                                    this.state.userData.user_type == 'locum' && 
                                    <View>
                                        <View style={{marginTop:15}}></View>
                                        <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                            About You – Mini Resume
                                        </Text>
                                        <View style={{marginTop:10}}></View>
                                        <TextInput 
                                            style={[MainStyles.TAInput]} 
                                            placeholder="About You – Mini Resume" 
                                            multiline={true}
                                            returnKeyType={"go"} 
                                            ref={(input) => { this.about = input; }} 
                                            blurOnSubmit={false}
                                            onChangeText={(text)=>this.setState({about:text})} 
                                            placeholderTextColor="#bebebe" 
                                            underlineColorAndroid="transparent" 
                                            value={this.state.about}
                                            numberOfLines={5}
                                        />
                                        {/* About Me Field */}
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                                            <View>
                                                <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13}}>
                                                    Please upload your resume 
                                                    {/* <Text style={{color:'#ee1b24'}}>*</Text> */}
                                                </Text>
                                                <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Light',fontSize:11,marginTop:4}}>Supported Files: .pdf, .docx, .doc</Text>
                                            </View>
                                            <View style={{paddingHorizontal:10}}></View>
                                            <TouchableOpacity style={[MainStyles.selectFilesBtn,{flexWrap:'wrap'}]} onPress={()=>{this.chooseDoc()}}>
                                                <Text style={{flex:1,color:'#FFFFFF',flexWrap: 'wrap'}}>{(this.state.resumFileName != '')?this.state.resumFileName:'Select File'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {/* Resume Field Ends */}
                                        <View style={{marginTop:15}}></View>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13,width:'40%'}}>
                                                Date of Birth
                                                <Text style={{color:'#ee1b24'}}>*</Text>
                                            </Text>
                                            <View style={{flexDirection:'row',justifyContent:'space-around',width:'60%'}}>
                                                <TextInput 
                                                    style={MainStyles.TInput} 
                                                    placeholder="DD" 
                                                    returnKeyType={"next"} 
                                                    ref={(input) => { this.dd = input; }} 
                                                    onSubmitEditing={() => { this.mm.focus(); }}
                                                    blurOnSubmit={false}
                                                    onChangeText={(text)=>this.setState({dd:text})} 
                                                    placeholderTextColor="#bebebe" 
                                                    underlineColorAndroid="transparent" 
                                                    value={this.state.dd}
                                                    maxLength={2}
                                                    keyboardType="number-pad"
                                                />
                                                <View style={{paddingHorizontal:4}}></View>
                                                <TextInput 
                                                    style={MainStyles.TInput} 
                                                    placeholder="MM" 
                                                    returnKeyType={"next"} 
                                                    ref={(input) => { this.mm = input; }} 
                                                    onSubmitEditing={() => { this.yy.focus(); }}
                                                    blurOnSubmit={false}
                                                    onChangeText={(text)=>this.setState({mm:text})} 
                                                    placeholderTextColor="#bebebe" 
                                                    underlineColorAndroid="transparent" 
                                                    value={this.state.mm}
                                                    maxLength={2}
                                                    keyboardType="number-pad"
                                                />
                                                <View style={{paddingHorizontal:4}}></View>
                                                <TextInput 
                                                    style={MainStyles.TInput} 
                                                    placeholder="YYYY" 
                                                    returnKeyType={"next"} 
                                                    ref={(input) => { this.yy = input; }} 
                                                    onSubmitEditing={() => { this.ahprano.focus(); }}
                                                    blurOnSubmit={false}
                                                    maxLength={4}
                                                    onChangeText={(text)=>this.setState({yy:text})} 
                                                    placeholderTextColor="#bebebe" 
                                                    underlineColorAndroid="transparent" 
                                                    value={this.state.yy}
                                                    keyboardType="number-pad"
                                                />
                                                <View style={{paddingLeft:4,alignItems:'center',justifyContent:'center'}}>
                                                    <TouchableOpacity onPress={this.showDatePicker}>
                                                        <Image source={require('../../assets/calendar-icon.png')} style={{width:20,height:20}} />
                                                    </TouchableOpacity>
                                                    <DateTimePicker
                                                    isVisible={this.state.isDatePickerVisible}
                                                    onConfirm={this.handleDatePicked}
                                                    onCancel={this.hideDatePicker}
                                                    maximumDate={this.state.maxDate}
                                                    date={this.state.selectedDate}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        {/* DOB Ends */}
                                        <View style={{marginTop:15}}></View>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13}}>
                                                Your AHPRA Registration number
                                                <Text style={{color:'#ee1b24'}}>*</Text>
                                            </Text>
                                            <View style={{paddingHorizontal:10}}></View>
                                            <TextInput 
                                                style={MainStyles.TInput} 
                                                returnKeyType={"next"} 
                                                ref={(input) => { this.js_ahpra = input; }} 
                                                onSubmitEditing={() => { this.js_reg.focus(); }}
                                                blurOnSubmit={false}
                                                maxLength={10}
                                                onChangeText={(text)=>this.setState({js_ahpra:text})} 
                                                placeholderTextColor="#bebebe" 
                                                underlineColorAndroid="transparent" 
                                                value={this.state.js_ahpra}
                                            />
                                        </View>
                                        {/* AHPRA Ends */}
                                        <View style={{marginTop:15}}></View>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13}}>
                                                Initial year of registration in Australia 
                                                <Text style={{color:'#ee1b24'}}>*</Text>
                                            </Text>
                                            <View style={{paddingHorizontal:10}}></View>
                                            <TextInput 
                                                style={MainStyles.TInput} 
                                                returnKeyType={"go"} 
                                                ref={(input) => { this.js_reg = input; }} 
                                                blurOnSubmit={false}
                                                keyboardType={"phone-pad"}
                                                maxLength={4}
                                                onChangeText={(text)=>this.setState({js_reg:text})} 
                                                placeholderTextColor="#bebebe" 
                                                underlineColorAndroid="transparent" 
                                                value={this.state.js_reg}
                                            />
                                        </View>
                                        {/* Initial Ends */}
                                        <View style={{marginTop:15}}></View>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13,flexWrap:'wrap',width:'60%'}}>
                                            Have any restrictions been imposed on your registration?
                                                <Text style={{color:'#ee1b24'}}>*</Text>
                                            </Text>
                                            <View style={{paddingHorizontal:10}}></View>
                                            <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',marginTop:10}}>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.setState({js_restrict:'Yes'});}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                    {this.state.js_restrict == 'Yes' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>Yes</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper,{marginLeft:10}]} onPress={()=>{this.setState({js_restrict:'No'});}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                        {this.state.js_restrict == 'No' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>No</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        
                                        {
                                            this.state.js_restrict == 'Yes' &&  
                                            <View style={{justifyContent:'flex-start',width:'100%',marginTop:10}}>
                                                <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13}}>
                                                    Please describe the restrictions so we can better assess your needs
                                                </Text>
                                                <View style={{marginTop:10}}></View>
                                                <TextInput 
                                                    style={[MainStyles.TInput,{height:80}]} 
                                                    ref={(input) => { this.des_restrict = input; }} 
                                                    blurOnSubmit={false}
                                                    multiline={true}
                                                    onChangeText={(text)=>this.setState({des_restrict:text})} 
                                                    placeholderTextColor="#bebebe" 
                                                    underlineColorAndroid="transparent" 
                                                    value={this.state.des_restrict}
                                                />
                                            </View>
                                        }
                                        {/* Restriction Ends */}
                                        <View style={{flexDirection:'column',marginTop:15}}>
                                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13,flexWrap:'wrap'}}>
                                                Which dispensing software are you familiar with:
                                                <Text style={{color:'#ee1b24'}}>*</Text>
                                            </Text>
                                            <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',marginTop:10}}>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.checkSoftware('WiniFRED');}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                    {this.state.js_software.indexOf('WiniFRED') !== -1 &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>WiniFRED</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.checkSoftware('FredNXT');}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                        {this.state.js_software.indexOf('FredNXT') !== -1 &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>FredNXT</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.checkSoftware('LOTS');}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                        {this.state.js_software.indexOf('LOTS') !== -1 &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>LOTS</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.checkSoftware('Simple');}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                        {this.state.js_software.indexOf('Simple') !== -1 &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>Simple</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',marginTop:10}}>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.checkSoftware('MINFOS');}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                        {this.state.js_software.indexOf('MINFOS') !== -1 &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>MINFOS</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.checkSoftware('Merlin');}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                        {this.state.js_software.indexOf('Merlin') !== -1 &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View> 
                                                    <Text style={[MainStyles.checkBoxLabel]}>Merlin</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.checkSoftware('Quickscript');}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                        {this.state.js_software.indexOf('Quickscript') !== -1 &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>Quickscript</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.checkSoftware('Other');}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                        {this.state.js_software.indexOf('Other') !== -1 &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>Other</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {/* Fimiliar Ends */}
                                        <View style={{marginTop:15}}></View>
                                        <View style={{flexDirection:'column',marginTop:15}}>
                                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13,flexWrap:'wrap'}}>
                                                Are you accredited to administer Vaccinations? 
                                                <Text style={{color:'#ee1b24'}}> *</Text>
                                            </Text>
                                            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap',marginTop:10}}>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.setState({js_admin_vaccin:'Yes'});}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                        {this.state.js_admin_vaccin == 'Yes' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>Yes</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper,{alignItems:'flex-start',marginLeft:40}]} onPress={()=>{this.setState({js_admin_vaccin:'No'});}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                        {this.state.js_admin_vaccin == 'No' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>No</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {/* Pharmacotherapy Ends */}
                                        <View style={{marginTop:15}}></View>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13,flexWrap:'wrap',width:'60%'}}>
                                                I am comfortable with administering pharmacotherapy
                                                <Text style={{color:'#ee1b24'}}>*</Text>
                                            </Text>
                                            <View style={{paddingHorizontal:10}}></View>
                                            <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',marginTop:10}}>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.setState({js_comfort:'Yes'});}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                    {this.state.js_comfort == 'Yes' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>Yes</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper,{marginLeft:10}]} onPress={()=>{this.setState({js_comfort:'No'});}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                        {this.state.js_comfort == 'No' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>No</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {/* Comfortable Ends */}
                                        <View style={{marginTop:10}}></View>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13,flexWrap:'wrap',width:'60%'}}>
                                                I am accredited for medication review services
                                                <Text style={{color:'#ee1b24'}}>*</Text>
                                            </Text>
                                            <View style={{paddingHorizontal:10}}></View>
                                            <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',marginTop:10}}>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.setState({js_medi_review:'Yes'});}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                    {this.state.js_medi_review == 'Yes' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>Yes</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[MainStyles.checkBoxWrapper,{marginLeft:10}]} onPress={()=>{this.setState({js_medi_review:'No'});}}>
                                                    <View style={[MainStyles.checkBoxStyle]}>
                                                        {this.state.js_medi_review == 'No' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                                    </View>
                                                    <Text style={[MainStyles.checkBoxLabel]}>No</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {/* Accredited Ends */}
                                    </View>
                                }
                                
                            </View>
                        }
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

export default Profile;