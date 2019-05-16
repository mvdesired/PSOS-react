import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,BackHandler,AsyncStorage,
    ActionSheetIOS,Platform } from 'react-native';
import Loader from './Loader';
import MainStyles from './Styles';
import countryList from 'react-select-country-list';
import Dialog, { SlideAnimation } from "react-native-popup-dialog";
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import RNFS from 'react-native-fs';
import { SERVER_URL,SENDER_ID } from '../Constants';
import PushNotification from 'react-native-push-notification';
const { height, width } = Dimensions.get('window');
var myHeaders = new Headers();
//myHeaders.set('Accept', 'application/json');
myHeaders.set('Content-Type', 'application/json');
//myHeaders.set('Cache-Control', 'no-cache');
//myHeaders.set('Pragma', 'no-cache');
//myHeaders.set('Expires', '0');
class LocumReg1Screen extends Component{
    constructor(props) {
        super(props);
        var cOptionsList = countryList().getLabels();
        cOptionsList.unshift('Cancel');
        this.state={
            loading:false,
            showTerms:false,
            step1Data:this.props.navigation.getParam('step1Data'),
            profilePicName:'',
            resumFileName:''
        }
    }
    componentDidMount(){
        this.props.navigation.addListener('willFocus',payload=>{
            if((payload.context).search('Navigation/BACK_Root') != -1){
                BackHandler.exitApp();
            }
        });
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
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
    pickFile = ()=>{
        const options = {
            title: 'Select File',
            storageOptions: {
              skipBackup: false,
              path: 'images',
            },
            maxWidth:400,
            maxHeight:400,
            mediaType:'photo',
            quality:0.7,
            allowsEditing:true,
          };
          
          /**
           * The first arg is the options object for customization (it can also be null or omitted for default options),
           * The second arg is the callback which sends object: response (more info in the API Reference)
           */
          ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
          
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              const source = { uri: response.uri };
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
              this.setState({
                profilePicName:response.fileName,
                fileData:{data:response.data,name:response.fileName},
                avatarSource: source,
              });
            }
          });
    }
    chooseDoc = ()=>{
        this.setState({loading:true});
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
          },(error,res) => {
            var fileExtArra = res.fileName.split('.');
            var fileExt = fileExtArra[fileExtArra.length-1];
            if(fileExt != "pdf" && fileExt != "docx" && fileExt != "doc"){
                Toast.show('Please upload only document or pdf file',Toast.SHORT);
                return false;
            }
            this.setState({resumFileName:res.fileName});
            RNFS.readFile(res.uri, 'base64')
			.then(result => {this.setState({resumFile:{data:result,filename:res.fileName}});this.setState({loading:false});})
			.catch(error => console.log('FS-error', error));
          });
    }
    registerLocum = ()=>{
        this.setState({loading:true});
        this.getToken(this.sendDataToServer.bind(this));
    }
    getToken = (onToken)=>{
        PushNotification.configure({
            onRegister: onToken,
            onNotification: function(notification) {
                console.log('NOTIFICATION:', notification );
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
    }
    sendDataToServer = (token)=>{
        var formdata = new FormData();
        formdata.append('fname',this.state.step1Data.firsName);
        formdata.append('lname',this.state.step1Data.lastName);
        formdata.append('phone',this.state.step1Data.phoneNo);
        formdata.append('email',this.state.step1Data.emailAddress);
        formdata.append('address',this.state.step1Data.streetAddress);
        formdata.append('city',this.state.step1Data.city);
        formdata.append('state',this.state.step1Data.spr);
        formdata.append('country',this.state.step1Data.country);
        formdata.append('postal',this.state.step1Data.pz);
        formdata.append('js_resume',this.state.resumFile);
        formdata.append('user_img',this.state.fileData);
        formdata.append('js_dob',this.state.dd+'-'+this.state.mm+'-'+this.state.yy);
        formdata.append('js_ahpra',this.state.ahprano);
        formdata.append('js_reg',this.state.js_reg);
        formdata.append('js_restrict',this.state.js_restrict);
        formdata.append('js_software',this.state.js_software);
        formdata.append('js_pharma',this.state.js_pharma);
        formdata.append('js_accredit',this.state.js_accredit);
        formdata.append('js_vaccin',this.state.js_vaccin);
        formdata.append('js_admin_vaccin',this.state.js_admin_vaccin);
        formdata.append('js_comfort',this.state.js_comfort);
        formdata.append('js_medi_review',this.state.js_medi_review);
        formdata.append('device_type',Platform.OS);
        formdata.append('device_key',token.token);
        var jsonArray = {
            fname:this.state.step1Data.firsName,
            lname:this.state.step1Data.lastName,
            phone:this.state.step1Data.phoneNo,
            email:this.state.step1Data.emailAddress,
            address:this.state.step1Data.streetAddress,
            city:this.state.step1Data.city,
            state:this.state.step1Data.spr,
            country:this.state.step1Data.country,
            postal:this.state.step1Data.pz,
            js_resume:this.state.resumFile,
            user_img:this.state.fileData,
            js_dob:this.state.dd+'-'+this.state.mm+'-'+this.state.yy,
            js_ahpra:this.state.ahprano,
            js_reg:this.state.js_reg,
            js_restrict:this.state.js_restrict,
            js_software:this.state.js_software,
            js_pharma:this.state.js_pharma,
            js_accredit:this.state.js_accredit,
            js_vaccin:this.state.js_vaccin,
            js_admin_vaccin:this.state.js_admin_vaccin,
            js_comfort:this.state.js_comfort,
            js_medi_review:this.state.js_medi_review,
            device_type:Platform.OS,
            device_key:token.token,
        }
        /*var files = [
            {
              name: 'js_resume',
              filename: this.state.resumFile.name,
              filepath: this.state.resumFile.tmp_name,
              filetype: this.state.resumFile.type
            }
        ];
        console.log(files);
        var uploadBegin = (response) => {
        var jobId = response.jobId;
        console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
        };
        
        var uploadProgress = (response) => {
        var percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
        console.log('UPLOAD IS ' + percentage + '% DONE!');
        };
        RNFS.uploadFiles({
            toUrl: SERVER_URL+'locum_reg',
            files:  files,
            method: 'POST',
            headers: {
              'Accept': 'application/json',
            },
            fields: jsonArray,
            begin: uploadBegin,
            progress: uploadProgress
          }).promise.then((response) => {
              console.log(response);
              if (response.statusCode == 200) {
                console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
              } else {
                console.log('SERVER ERROR');
              }
              this.setState({loading:false});
            })
            .catch((err) => {
              if(err.description === "cancelled") {
                // cancelled by user
              }
              this.setState({loading:false});
              console.log(err);
            });*/
        fetch(SERVER_URL+'locum_reg',{
            method:'POST',
            credentials: 'same-origin',
            mode: 'same-origin',
            headers:myHeaders,
            body:JSON.stringify(jsonArray)
        })
        .then(res=>{console.log(res);return res.json();})
        .then((response) => {
            if(response.status == 200){
                this.saveDetails('isUserLoggedIn',"true");
                this.saveDetails('userData',JSON.stringify(response.result));
                setTimeout(()=>{
                    this.props.navigation.navigate('Home');
                },1500);
            }
            Toast.show(response.message,Toast.SHORT);
            this.setState({loading:false,showTerms:false});
        }).catch((err) => {
            console.log(err);
            this.setState({loading:false});
        });
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
                        <View style={{paddingVertical:20,}}>
                            <Text style={{fontFamily:'AvenirLTStd-Heavy',color:'#151515',fontSize:16}}>Locum Registration Form</Text>
                            <Text style={{marginTop:5,fontFamily:'AvenirLTStd-Medium',color:'#676767',fontSize:13,marginBottom:5,}}>
                                To register and benefit from becoming a Pharmacy SOS locum, please use this form to register.
                            </Text>
                        </View>
                        {/* Locum Registration Heading Ends */}
                        <Image source={require('../assets/dashed-border.png')} width={'100%'} height={2} />
                        <View style={{justifyContent:'center',alignItems: 'center',paddingVertical:18,flexDirection: 'row'}}>
                            <View style={{paddingVertical:10,paddingHorizontal:10,backgroundColor:'#959595',borderRadius:10}}>
                                <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:12}}>Contact Details</Text>
                            </View>
                            <View style={{paddingHorizontal:10}}>
                                <Image source={require('../assets/dashed-b-s.png')} width={100} style={{width:50}}/>
                            </View>
                            <View style={{paddingVertical:10,paddingHorizontal:10,backgroundColor:'#1476c0',borderRadius:10}}>
                                <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:12,}}>Professional Details</Text>
                            </View>
                        </View>
                        <Image source={require('../assets/dashed-border.png')} width={'100%'} height={2}/>
                        {/* BreadCrumbs Ends */}
                        <View style={{marginTop:15}}></View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13}}>
                                Please upload your resume 
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{paddingHorizontal:10}}></View>
                            <TouchableOpacity style={[MainStyles.selectFilesBtn,{flexWrap:'wrap'}]} onPress={()=>{this.chooseDoc()}}>
                                <Text style={{flex:1,color:'#FFFFFF',flexWrap: 'wrap'}}>{(this.state.resumFileName != '')?this.state.resumFileName:'Select Files'}</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Resume Field Ends */}
                        <View style={{marginTop:15}}></View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13}}>
                                Professional Portrait image
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{paddingHorizontal:10}}></View>
                            <TouchableOpacity style={MainStyles.selectFilesBtn} onPress={()=>{this.pickFile()}}>
                                <Text style={{color:'#FFFFFF'}}>{(this.state.profilePicName!='')?this.state.profilePicName:'Select Files'}</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Picture Ends */}
                        <View style={{marginTop:15}}></View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13,width:'50%'}}>
                                Date of Birth
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{flexDirection:'row',justifyContent:'space-around',width:'50%'}}>
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
                                ref={(input) => { this.ahprano = input; }} 
                                onSubmitEditing={() => { this.js_reg.focus(); }}
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({ahprano:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.ahprano}
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
                                returnKeyType={"next"} 
                                ref={(input) => { this.js_reg = input; }} 
                                onSubmitEditing={() => { this.js_restrict.focus(); }}
                                blurOnSubmit={false}
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
                            <TextInput 
                                style={MainStyles.TInput} 
                                returnKeyType={"go"} 
                                ref={(input) => { this.js_restrict = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({js_restrict:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.js_restrict}
                            />
                        </View>
                        {/* Restriction Ends */}
                        <View style={{flexDirection:'column',marginTop:15}}>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13,flexWrap:'wrap'}}>
                                Which dispensing software are you familiar with:
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',marginTop:10}}>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.setState({js_software:'WiniFRED'});}}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                    {this.state.js_software == 'WiniFRED' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>WiniFRED</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.setState({js_software:'FredNXT'});}}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_software == 'FredNXT' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>FredNXT</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.setState({js_software:'LOTS'});}}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_software == 'LOTS' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>LOTS</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.setState({js_software:'Simple'});}}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_software == 'Simple' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>Simple</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',marginTop:10}}>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{
                                    this.setState({js_software:'MINFOS'});
                                }}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_software == 'MINFOS' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>MINFOS</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{
                                    this.setState({js_software:'Merlin'});
                                }}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_software == 'Merlin' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View> 
                                    <Text style={[MainStyles.checkBoxLabel]}>Merlin</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{
                                    this.setState({js_software:'Quickscript'});
                                }}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_software == 'Quickscript' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>Quickscript</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{
                                    this.setState({js_software:'Other'});
                                }}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_software == 'Other' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>Other</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Fimiliar Ends */}
                        <View style={{marginTop:15}}></View>
                        <View style={{flexDirection:'column',marginTop:15}}>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13,flexWrap:'wrap'}}>
                                Pharmacotherapy
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap',marginTop:10}}>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.setState({js_pharma:'Yes'});}}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_pharma == 'Yes' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper,{alignItems:'flex-start',marginLeft:40}]} onPress={()=>{this.setState({js_pharma:'No'});}}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_pharma == 'No' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Pharmacotherapy Ends */}
                        <View style={{marginTop:15}}></View>
                        <View style={{flexDirection:'column',marginTop:15}}>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13,flexWrap:'wrap'}}>
                                Accredited Pharmacist
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap',marginTop:10}}>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.setState({js_accredit:'Yes'});}}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_accredit == 'Yes' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper,{alignItems:'flex-start',marginLeft:40}]} onPress={()=>{this.setState({js_accredit:'No'});}}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_accredit == 'No' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Pharmacotherapy Ends */}
                        <View style={{marginTop:15}}></View>
                        <View style={{flexDirection:'column',marginTop:15}}>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13,flexWrap:'wrap'}}>
                                Vaccination Pharmacist
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap',marginTop:10}}>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={()=>{this.setState({js_vaccin:'Yes'});}}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_vaccin == 'Yes' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper,{alignItems:'flex-start',marginLeft:40}]} onPress={()=>{this.setState({js_vaccin:'No'});}}>
                                    <View style={[MainStyles.checkBoxStyle]}>
                                        {this.state.js_vaccin == 'No' &&  <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                    </View>
                                    <Text style={[MainStyles.checkBoxLabel]}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Pharmacotherapy Ends */}
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
                            <TextInput 
                                style={MainStyles.TInput} 
                                returnKeyType={"go"} 
                                ref={(input) => { this.js_comfort = input; }} 
                                onSubmitEditing={() => { this.js_medi_review.focus(); }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({js_comfort:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.js_comfort}
                            />
                        </View>
                        {/* Comfortable Ends */}
                        <View style={{marginTop:10}}></View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:13,flexWrap:'wrap',width:'60%'}}>
                                I am accredited for medication review services
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{paddingHorizontal:10}}></View>
                            <TextInput 
                                style={MainStyles.TInput} 
                                returnKeyType={"go"} 
                                ref={(input) => { this.js_medi_review = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({js_medi_review:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.js_medi_review}
                            />
                        </View>
                        {/* Accredited Ends */}
                        <View style={{justifyContent:'center',alignItems:'center',marginTop:26}}>
                            <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                                this.setState({showTerms:true});
                            }}>
                                <Text style={MainStyles.psosBtnText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginTop:5}} onPress={()=>{
                                this.props.navigation.goBack();
                            }}>
                                <Text style={{color:'#1476c0',textDecorationLine:'underline',textDecorationColor:'#1476c0',textDecorationStyle:'solid'}}>Previous</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop:20}}></View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Dialog
                    visible={this.state.showTerms}
                    dialogStyle={{ width: "95%", padding: 0, maxHeight: "95%" }}
                    dialogAnimation={new SlideAnimation()}
                    containerStyle={{zIndex: 10,flex: 1,justifyContent: "space-between"}} 
                    rounded={false}
                    >
                    <View style={MainStyles.modalHeader}>
                        <Text style={MainStyles.modalHeaderHeading}>Terms and Conditions</Text>
                        <TouchableOpacity onPress={() =>{this.setState({showTerms:false})}}>
                            <Image source={require('../assets/cross-icon.png')} width={21} height={21} style={{height:21,width:21}} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{paddingHorizontal: 10,paddingVertical:10}}>
                        <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#1476c0',fontSize:15}}>
                            Our Terms and Conditions
                        </Text>
                        <View style={MainStyles.tacItems}>
                            <Text style={MainStyles.tacItemsH}>1. Lorem Ipsum has been</Text>
                            <Text style={MainStyles.tacItemsSH}> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Text>
                            <Image source={require('../assets/bd-tc.png')} width={'100%'} style={MainStyles.tacItemsImage}/>
                        </View>
                        <View style={MainStyles.tacItems}>
                            <Text style={MainStyles.tacItemsH}>2. Lorem Ipsum has been</Text>
                            <Text style={MainStyles.tacItemsSH}> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Text>
                            <Image source={require('../assets/bd-tc.png')} width={'100%'} style={MainStyles.tacItemsImage}/>
                        </View>
                        <View style={MainStyles.tacItems}>
                            <Text style={MainStyles.tacItemsH}>3. Lorem Ipsum has been</Text>
                            <Text style={MainStyles.tacItemsSH}> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Text>
                            <Image source={require('../assets/bd-tc.png')} width={'100%'} style={MainStyles.tacItemsImage}/>
                        </View>
                        <View style={MainStyles.tacItems}>
                            <Text style={MainStyles.tacItemsH}>4. Lorem Ipsum has been</Text>
                            <Text style={MainStyles.tacItemsSH}> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Text>
                            <Image source={require('../assets/bd-tc.png')} width={'100%'} style={MainStyles.tacItemsImage}/>
                        </View>
                        <View style={MainStyles.tacItems}>
                            <Text style={MainStyles.tacItemsH}>5. Lorem Ipsum has been</Text>
                            <Text style={MainStyles.tacItemsSH}> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Text>
                            <Image source={require('../assets/bd-tc.png')} width={'100%'} style={MainStyles.tacItemsImage}/>
                        </View>
                        <View style={MainStyles.tacItems}>
                            <Text style={MainStyles.tacItemsH}>6. Lorem Ipsum has been</Text>
                            <Text style={MainStyles.tacItemsSH}> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Text>
                            <Image source={require('../assets/bd-tc.png')} width={'100%'} style={MainStyles.tacItemsImage}/>
                        </View>
                    </ScrollView>
                    <View style={MainStyles.modalFooter}>
                        <TouchableOpacity style={[MainStyles.psosBtn, MainStyles.psosBtnXm]} onPress={()=>{
                            this.registerLocum();
                        }}>
                            <Text style={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]}>I Agree</Text>
                        </TouchableOpacity>
                    </View>
                </Dialog>
            </SafeAreaView>
        );
    }
}
export default LocumReg1Screen;