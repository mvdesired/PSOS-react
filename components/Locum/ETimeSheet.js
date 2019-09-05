import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,FlatList,AsyncStorage,StyleSheet,
    ActionSheetIOS,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions,NavigationActions } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import SignatureCapture from 'react-native-signature-capture';
import DateTimePicker from "react-native-modal-datetime-picker";
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
const { height, width } = Dimensions.get('window');
var myHeaders = new Headers();
myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class ETimeSheet extends Component{
    constructor(props) {
        super(props);
        this.state={
            loading:true,
            activeTab:'cd',
            pharmacyList:[],
            startDay:'01',
            startMonth:'01',
            startYear:'2019',
            dateDays:{},
            dateMonth:{},
            dateYears:{},
            haveMore:'No',
            //pharmacyId:0,
            paharmacyNamesList:['Cancel'],
            otherPharmacyName:''
        }
    }
    setUserData = async ()=>{
        await AsyncStorage.getItem('userData').then((userDataStringfy)=>{
            let userData = JSON.parse(userDataStringfy);
            this.setState({userData});
            this.setState({fname:userData.fname,lname:userData.lname,email:userData.email});
            this.didFocus();
        });
    }
    componentDidMount(){
        this.props.navigation.addListener('didFocus',this.setUserData);
        var currentDate = new Date();
        var startDay = ''+currentDate.getDate();
        var startMonth = ''+(currentDate.getMonth()+1);
        var startYear = ''+currentDate.getFullYear();
        if(startDay < 10){startDay = '0'+startDay;}
        if(startMonth < 10){startMonth = '0'+startMonth;}
        this.setState({currentDate,startDay,startMonth,startYear});
    }
    didFocus = ()=>{
        fetch(SERVER_URL+"fetch_locum_pharmacy?user_id="+this.state.userData.id)
        .then(res=>{console.log(res);return res.json()})
        .then(response =>{
            var paharmacyNamesList = ['Cancel','Other'];
            var paharmacyIdsList = [];
            if(response.status == 200){
                var pharmacyId = response.result[0].pharm_id;
                for(var i=0;i<response.result.length;i++){
                    paharmacyNamesList.push(response.result[i].name);
                    paharmacyIdsList.push(response.result[i].pharm_id);
                }
                this.setState({paharmacyIdsList,paharmacyNamesList,pharmacyList:response.result,loading:false,pharmacyId});
            }
            else{
                Toast.show(response.message,Toast.SHORT);
                this.setState({loading:false});
            }
        })
        .catch(err=>{
            console.log(err);
            this.setState({loading:false});
        })
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
    _onSaveEvent = (result)=>{
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        this.setState({signature:result.encoded});
    }
    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };
    handleDatePicked = date => {
        var changeDate = new Date(date);
        var dd = ''+changeDate.getDate();
        var mm = ''+(changeDate.getMonth()+1);
        var yy = ''+changeDate.getFullYear();
        if(dd < 10){dd = '0'+dd;}
        if(mm < 10){mm = '0'+mm;}
        this.setState({
            startDay:dd,startMonth:mm,startYear:yy
        });
        this.hideDateTimePicker();
    };
    showDateTimePicker1 = () => {
        this.setState({ isDateTimePickerVisible1: true });
    };
    hideDateTimePicker1 = () => {
        this.setState({ isDateTimePickerVisible1: false });
    };
    handleDatePicked1 = date => {
        var changeDate = new Date(date);
        var dd = ''+changeDate.getDate();
        var mm = ''+(changeDate.getMonth()+1);
        var yy = ''+changeDate.getFullYear();
        if(dd < 10){dd = '0'+dd;}
        if(mm < 10){mm = '0'+mm;}
        this.setState({
            startDay1:dd,startMonth1:mm,startYear1:yy
        });
        this.hideDateTimePicker1();
    };
    showDateTimePicker2 = () => {
        this.setState({ isDateTimePickerVisible2: true });
    };
    hideDateTimePicker2 = () => {
        this.setState({ isDateTimePickerVisible2: false });
    };
    handleDatePicked2 = date => {
        var changeDate = new Date(date);
        var dd = ''+changeDate.getDate();
        var mm = ''+(changeDate.getMonth()+1);
        var yy = ''+changeDate.getFullYear();
        if(dd < 10){dd = '0'+dd;}
        if(mm < 10){mm = '0'+mm;}
        this.setState({
            startDay2:dd,startMonth2:mm,startYear2:yy
        });
        this.hideDateTimePicker2();
    };
    showDateTimePicker3 = () => {
        this.setState({ isDateTimePickerVisible3: true });
    };
    hideDateTimePicker3 = () => {
        this.setState({ isDateTimePickerVisible3: false });
    };
    handleDatePicked3 = date => {
        var changeDate = new Date(date);
        var dd = ''+changeDate.getDate();
        var mm = ''+(changeDate.getMonth()+1);
        var yy = ''+changeDate.getFullYear();
        if(dd < 10){dd = '0'+dd;}
        if(mm < 10){mm = '0'+mm;}
        this.setState({
            startDay3:dd,startMonth3:mm,startYear3:yy
        });
        this.hideDateTimePicker3();
    };
    pickerPharmacyList = () => {
        if(this.state.paharmacyNamesList.length > 0){
            ActionSheetIOS.showActionSheetWithOptions({
                options: this.state.paharmacyNamesList,
                cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    console.log(buttonIndex);
                if(buttonIndex > 1){
                  this.setState({pharmacyId: this.state.paharmacyIdsList[buttonIndex-2]});
                  this.setState({pharmacyName: this.state.paharmacyNamesList[buttonIndex]});
                }
                else if(buttonIndex==1){
                    this.setState({pharmacyId: 0});
                    this.setState({pharmacyName: 'Other'});
                }
            });
        }
    }
    saveSign = () => {
        this.refs["sign"].saveImage();
    }
    submitTimeSheet = () => {
        this.saveSign();
        
        setTimeout(()=>{
            if(typeof(this.state.oFname) == "undefined" || this.state.oFname == ''){
                Toast.show("Staff member first name should no be blank",Toast.LONG);
                return false;
            }
            if(typeof(this.state.oLname) == "undefined" || this.state.oLname == ''){
                Toast.show("Staff member last name should no be blank",Toast.LONG);
                
            }
            var startDateArray = [this.state.startYear+'-'+this.state.startMonth+'-'+this.state.startDay];
            if(typeof(this.state.startYear1) != "undefined"){
                startDateArray.push(this.state.startYear1+'-'+this.state.startMonth1+'-'+this.state.startDay1);
            }
            // if(typeof(this.state.startYear2) != "undefined"){
            //     startDateArray.push(this.state.startYear2+'-'+this.state.startMonth2+'-'+this.state.startDay2);
            // }
            // if(typeof(this.state.startYear3) != "undefined"){
            //     startDateArray.push(this.state.startYear3+'-'+this.state.startMonth3+'-'+this.state.startDay3);
            // }
            var startTimeArray = [this.state.sSTH+':'+this.state.sSTM+':00'];
            if(typeof(this.state.sSTH1) != "undefined"){
                startTimeArray.push(this.state.sSTH1+':'+this.state.sSTM1+':00');
            }
            // if(typeof(this.state.sSTH2) != "undefined"){
            //     startTimeArray.push(this.state.sSTH2+':'+this.state.sSTM2+':00');
            // }
            // if(typeof(this.state.sSTH3) != "undefined"){
            //     startTimeArray.push(this.state.sSTH3+':'+this.state.sSTM3+':00');
            // }
            var unPaidArray = [this.state.sUPH+':'+this.state.sUPM+':00'];
            if(typeof(this.state.sUPH1) != "undefined"){
                unPaidArray.push(this.state.sUPH1+':'+this.state.sUPM1+':00');
            }
            // if(typeof(this.state.sUPH2) != "undefined"){
            //     unPaidArray.push(this.state.sUPH2+':'+this.state.sUPM2+':00');
            // }
            // if(typeof(this.state.sUPH3) != "undefined"){
            //     unPaidArray.push(this.state.sUPH3+':'+this.state.sUPM3+':00');
            // }
            var endTimeArray = [this.state.sETH+':'+this.state.sETM+':00'];
            if(typeof(this.state.sETH1) != "undefined"){
                endTimeArray.push(this.state.sETH1+':'+this.state.sETM1+':00');
            }
            // if(typeof(this.state.sETH2) != "undefined"){
            //     endTimeArray.push(this.state.sETH2+':'+this.state.sETM2+':00');
            // }
            // if(typeof(this.state.sETH3) != "undefined"){
            //     endTimeArray.push(this.state.sETH3+':'+this.state.sETM3+':00');
            // }
            this.setState({loading:true});
            var jsonArray = {
                signature:this.state.signature,
                fname:this.state.fname,
                lname:this.state.lname,
                user_id:this.state.userData.id,
                email:this.state.email,
                sheet_time_file:this.state.resumFile,
                pharmacy:this.state.pharmacyId,
                other_pharmacy_name:this.state.otherPharmacyName,
                other_comments:this.state.otherComments,
                staff_fname:this.state.oFname,
                staff_lname:this.state.oLname,
                shift_date:startDateArray,
                start_time:startTimeArray,
                unpaid_breaks:unPaidArray,
                end_time:endTimeArray
            }
            fetch(SERVER_URL+'time_sheet',
            {
                method:'POST',
                headers:myHeaders,
                body:JSON.stringify(jsonArray)
            })
            .then(res=>{
                console.log(res);
                return res.json();
            })
            .then(response=>{
                this.setState({loading:false});
                setTimeout(()=>{
                    Toast.show(response.message,Toast.LONG);
                },200);
                if(response.status == 200){
                    this.props.navigation.navigate('Home');
                }
            })
            .catch(err=>{
                console.log(err);
                Toast.show('Something went wrong. Please try again',Toast.LONG);
                this.setState({loading:false});
            });
        },1000);
    }
    render(){
        const RemoveHiehgt = height - 52;
        var behavior = (Platform.OS == 'ios')?'padding':'';
        return(
        <SafeAreaView style={{flex:1}}>
            <Loader loading={this.state.loading} />
            <View style={{paddingTop: 15,alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>{this.props.navigation.goBack();}} style={{position:'absolute',left:8,top:8,paddingLeft:10,paddingRight:15,paddingVertical:15,}}>
                    <Image source={require('../../assets/blue-back-icon.png')} style={{width:10,height:19}}/>
                </TouchableOpacity>
                <Image source={require('../../assets/web-logo.png')} style={{width:200,height:34}}/>
                <Image source={require('../../assets/header-b.png')} style={{width:'100%',marginTop:15}}/>
            </View>
            <KeyboardAvoidingView style={{flex:1,}} enabled behavior={behavior}>
                <ScrollView style={{paddingHorizontal:15,height:RemoveHiehgt}} keyboardShouldPersistTaps="always">
                    <View style={{paddingVertical:20,}}>
                        <Text style={{fontFamily:'AvenirLTStd-Heavy',color:'#151515',fontSize:16}}>SOS eTime sheet</Text>
                        <Text style={{marginTop:5,fontFamily:'AvenirLTStd-Medium',color:'#676767',fontSize:13,marginBottom:5,}}>
                            Please Enter Your eTime-sheet Daily.
                        </Text>
                        <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#676767',fontSize:13,marginBottom:5,}}>
                            Please do not submit time sheets more than ONCE.
                        </Text>
                    </View>
                    {/* Locum Registration Heading Ends */}
                    <Image source={require('../../assets/dashed-border.png')} width={'100%'} height={2} />
                    <View style={{justifyContent:'space-between',alignItems: 'center',paddingVertical:18,flexDirection: 'row',}}>
                        <View style={[styles.breadCrumbs,(this.state.activeTab == 'cd')?{backgroundColor:'#1476c0'}:'']}>
                            <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:12,}}>Contact Details</Text>
                        </View>
                        <View style={[styles.breadCrumbs,(this.state.activeTab == 'sd')?{backgroundColor:'#1476c0'}:'']}>
                            <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:12}}>Shift Details</Text>
                        </View>
                        {/* <View style={[styles.breadCrumbs,(this.state.activeTab == 'ms')?{backgroundColor:'#1476c0'}:'']}>
                            <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:12}}>More Shift</Text>
                        </View> */}
                        <View style={[styles.breadCrumbs,(this.state.activeTab == 'so')?{backgroundColor:'#1476c0'}:'']}>
                            <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:12}}>Sign Off</Text>
                        </View>
                    </View>
                    <Image source={require('../../assets/dashed-border.png')} width={'100%'} height={2}/>
                    {/* BreadCrumbs Ends */}
                    {
                        this.state.activeTab == 'cd' && 
                        <View>
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Contact Name
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
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
                                <View style={{paddingHorizontal:5}}></View>
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
                            {/* Contact Name Ends */}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Email
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <TextInput 
                                style={[MainStyles.TInput]} 
                                placeholder="E-mail"
                                returnKeyType={"next"} 
                                ref={(input) => { this.email = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({email:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.email}
                            />
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:26}}>
                                <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                                    this.setState({activeTab:'sd'});
                                }}>
                                    <Text style={MainStyles.psosBtnText}>Continue</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:20}}></View>
                        </View>
                        /*Show CD Tab*/
                    }
                    {
                        this.state.activeTab == 'sd' && 
                        <View>
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Full Name of Pharmacy
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{marginTop:10}}></View>
                            {
                                Platform.OS == 'android' && 
                                <View style={[MainStyles.TInput,{paddingLeft:0,paddingVertical:0}]}>
                                    <Picker
                                    selectedValue={this.state.pharmacyId}
                                    style={{
                                        flex:1,
                                        paddingVertical:2,
                                        height:30,
                                    }}
                                    mode="dropdown"
                                    textStyle={{fontSize: 14,fontFamily:'AvenirLTStd-Medium'}}
                                    itemTextStyle= {{fontSize: 14,fontFamily:'AvenirLTStd-Medium'}}
                                    itemStyle={MainStyles.TInput}
                                    onValueChange={(itemValue, itemIndex) => {this.setState({pharmacyId: itemValue})}}>
                                        <Picker.Item key={'key-other'} label="Other" value={0} />
                                        {
                                        this.state.pharmacyList.map((item,key)=>{
                                            return (
                                            <Picker.Item key={'key-'+key} label={item.name} value={item.pharm_id} />
                                            )
                                        })
                                        }
                                    </Picker>
                                </View>
                            }
                            {
                                Platform.OS == 'ios' && 
                                <TouchableOpacity style={[MainStyles.TInput,{alignItems:'center'}]} onPress={()=>{this.pickerPharmacyList()}}>
                                    <Text style={{color:'#03163a',fontFamily:'Roboto-Light',fontSize:18}}>{this.state.pharmacyName}</Text>
                                </TouchableOpacity>
                                
                            }
                            {
                                this.state.pharmacyId == 0 && 
                                <View>
                                    <View style={{marginTop:15}}></View>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        Pharmacy Name
                                        <Text style={{color:'#ee1b24'}}>*</Text>
                                    </Text>
                                    <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="Pharmacy Name"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.otherPharmacyName = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>this.setState({otherPharmacyName:text})} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.otherPharmacyName}
                                    />
                                </View>
                            }
                            {/* Pharmacy Ends */}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Date of Shift
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.startDay = input; }} 
                                    blurOnSubmit={false}
                                    keyboardType={"number-pad"}
                                    onChangeText={(text)=>this.setState({startDay:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.startDay}
                                    maxLength={2}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.startMonth = input; }} 
                                    blurOnSubmit={false}
                                    keyboardType={"number-pad"}
                                    onChangeText={(text)=>this.setState({startMonth:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.startMonth}
                                    maxLength={2}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.startYear = input; }} 
                                    blurOnSubmit={false}
                                    keyboardType={"number-pad"}
                                    onChangeText={(text)=>this.setState({startYear:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.startYear}
                                    maxLength={4}
                                />
                                <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDateTimePicker}
                                minimumDate={this.state.currentDate}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TouchableOpacity   onPress={this.showDateTimePicker}>
                                    <Image source={require('../../assets/calendar-icon.png')} style={{width:20,height:20}} />
                                </TouchableOpacity>
                            </View>
                            {/* End Date Year End*/}
                            <View style={{marginTop:15}}></View>
                            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                                <View style={{width:'32%'}}>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        Start Time
                                        <Text style={{color:'#ee1b24'}}>*</Text>
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                        <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="HH"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.sSTH = input; }} 
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onChangeText={(text)=>{this.setState({sSTH:text});if(text.length == 2){this.sSTM.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sSTH}
                                    />
                                    <View style={{paddingHorizontal:5}}></View>
                                    <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="MM"
                                        returnKeyType={"next"} 
                                        keyboardType="number-pad"
                                        ref={(input) => { this.sSTM = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>{this.setState({sSTM:text});if(text.length == 2){this.sUPH.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sSTM}
                                    />
                                    </View>
                                </View>
                                {/* Shift Start Time End*/}
                                <View style={{width:'32%'}}>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        Unpaid Breaks
                                        <Text style={{color:'#ee1b24'}}>*</Text>
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:10}}>
                                        <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="HH"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.sUPH = input; }} 
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onChangeText={(text)=>{this.setState({sUPH:text});if(text.length == 2){this.sUPM.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sUPH}
                                        maxLength={2}
                                    />
                                    <View style={{paddingHorizontal:5}}></View>
                                    <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="MM"
                                        returnKeyType={"next"} 
                                        keyboardType="number-pad"
                                        ref={(input) => { this.sUPM = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>{this.setState({sUPM:text});if(text.length == 2){this.sETH.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sUPM}
                                        maxLength={2}
                                    />
                                    </View>
                                </View>
                                {/* Shift Unpaid Breaks End*/}
                                <View style={{width:'32%'}}>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        End Time
                                        <Text style={{color:'#ee1b24'}}>*</Text>
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                        <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="HH"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.sETH = input; }} 
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onChangeText={(text)=>{this.setState({sETH:text});if(text.length == 2){this.sETM.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sETH}
                                        maxLength={2}
                                        />
                                        <View style={{paddingHorizontal:5}}></View>
                                        <TextInput 
                                            style={[MainStyles.TInput]} 
                                            placeholder="MM"
                                            returnKeyType={"next"} 
                                            keyboardType="number-pad"
                                            ref={(input) => { this.sETM = input; }} 
                                            blurOnSubmit={false}
                                            onChangeText={(text)=>this.setState({sETM:text})} 
                                            placeholderTextColor="#bebebe" 
                                            underlineColorAndroid="transparent" 
                                            value={this.state.sETM}
                                            maxLength={2}
                                        />
                                    </View>
                                </View>
                                {/* Shift Unpaid Breaks End*/}
                            </View>
                            {/* Shift Time End*/}
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:26}}>
                                <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                                    console.log(typeof(this.state.pharmacyId),this.state.otherPharmacyName);
                                    if(typeof(this.state.pharmacyId) == "undefined" || this.state.pharmacyId == 0 ){
                                        if(this.state.otherPharmacyName == ''){
                                            Toast.show("Please add Pharmacy Name");
                                            return false;
                                        }
                                    }
                                    else if(typeof(this.state.pharmacyId) == "undefined" || this.state.pharmacyId == '' ){
                                        Toast.show("Please select Pharmacy");
                                        return false;
                                    }

                                    if(typeof(this.state.startDay) == "undefined" || this.state.startDay == ''){
                                        Toast.show('Please select shift day',Toast.SHORT);
                                        return false;
                                    }
                                    if(typeof(this.state.startMonth) == "undefined" || this.state.startMonth == ''){
                                        Toast.show('Please select shift month',Toast.SHORT);
                                        return false;
                                    }
                                    if(typeof(this.state.startYear) == "undefined" || this.state.startYear == ''){
                                        Toast.show('Please select shift year',Toast.SHORT);
                                        return false;
                                    }
                                    if(typeof(this.state.sSTH) == "undefined" || this.state.sSTH == ''){
                                        Toast.show('Please select Shift start hour',Toast.SHORT);
                                        return false;
                                    }
                                    if(typeof(this.state.sSTM) == "undefined" || this.state.sSTM == ''){
                                        Toast.show('Please select Shift start minute',Toast.SHORT);
                                        return false;
                                    }
                                    if(typeof(this.state.sUPH) == "undefined" || this.state.sUPH == ''){
                                        Toast.show('Please select Shift unpaid hour',Toast.SHORT);
                                        return false;
                                    }
                                    if(typeof(this.state.sUPM) == "undefined" || this.state.sUPM == ''){
                                        Toast.show('Please select Shift unpaid break minute',Toast.SHORT);
                                        return false;
                                    }
                                    if(typeof(this.state.sETH) == "undefined" || this.state.sETH == ''){
                                        Toast.show('Please select Shift end hour',Toast.SHORT);
                                        return false;
                                    }
                                    if(typeof(this.state.sETM) == "undefined" || this.state.sETM == ''){
                                        Toast.show('Please select Shift end minute',Toast.SHORT);
                                        return false;
                                    }
                                    if(this.state.haveMore == 'Yes'){
                                        this.setState({activeTab:'ms'});
                                    }
                                    else{
                                        this.setState({activeTab:'so'});
                                    }
                                    
                                }}>
                                    <Text style={MainStyles.psosBtnText}>Continue</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginTop:5}} onPress={()=>{
                                    this.setState({activeTab:'cd'});
                                }}>
                                    <Text style={{color:'#1476c0',textDecorationLine:'underline',textDecorationColor:'#1476c0',textDecorationStyle:'solid'}}>Previous</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:20}}></View>
                        </View>
                        /*Show SD Tab */
                    }
                    {
                        this.state.activeTab == "ms" && 
                        <View>
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Date of Shift
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.startDay1 = input; }} 
                                    blurOnSubmit={false}
                                    keyboardType={"number-pad"}
                                    onChangeText={(text)=>this.setState({startDay1:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.startDay1}
                                    maxLength={2}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.startMonth1 = input; }} 
                                    blurOnSubmit={false}
                                    keyboardType={"number-pad"}
                                    onChangeText={(text)=>this.setState({startMonth1:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.startMonth1}
                                    maxLength={2}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.startYear1 = input; }} 
                                    blurOnSubmit={false}
                                    keyboardType={"number-pad"}
                                    onChangeText={(text)=>this.setState({startYear1:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.startYear1}
                                    maxLength={4}
                                />
                                <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible1}
                                onConfirm={this.handleDatePicked1}
                                onCancel={this.hideDateTimePicker1}
                                minimumDate={this.state.currentDate}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TouchableOpacity   onPress={this.showDateTimePicker1}>
                                    <Image source={require('../../assets/calendar-icon.png')} style={{width:20,height:20}} />
                                </TouchableOpacity>
                            </View>
                            {/* End Date Year End*/}
                            <View style={{marginTop:15}}></View>
                            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                                <View style={{width:'32%'}}>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        Start Time
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                        <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="HH"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.sSTH1 = input; }} 
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onChangeText={(text)=>{this.setState({sSTH1:text});if(text.length == 2){this.sSTM1.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sSTH1}
                                        maxLength={2}
                                    />
                                    <View style={{paddingHorizontal:5}}></View>
                                    <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="MM"
                                        returnKeyType={"next"} 
                                        keyboardType="number-pad"
                                        ref={(input) => { this.sSTM1 = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>{this.setState({sSTM1:text});if(text.length == 2){this.sUPH1.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sSTM1}
                                        maxLength={2}
                                    />
                                    </View>
                                </View>
                                {/* Shift Start Time End*/}
                                <View style={{width:'32%'}}>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        Unpaid Breaks
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:10}}>
                                        <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="HH"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.sUPH1 = input; }} 
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onChangeText={(text)=>{this.setState({sUPH1:text});if(text.length == 2){this.sUPM1.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sUPH1}
                                        maxLength={2}
                                    />
                                    <View style={{paddingHorizontal:5}}></View>
                                    <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="MM"
                                        returnKeyType={"next"} 
                                        keyboardType="number-pad"
                                        ref={(input) => { this.sUPM1 = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>{this.setState({sUPM1:text});if(text.length == 2){this.sETH1.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sUPM1}
                                        maxLength={2}
                                    />
                                    </View>
                                </View>
                                {/* Shift Unpaid Breaks End*/}
                                <View style={{width:'32%'}}>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        End Time
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                        <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="HH"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.sETH1 = input; }} 
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onChangeText={(text)=>{this.setState({sETH1:text});if(text.length == 2){this.sETM1.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sETH1}
                                        maxLength={2}
                                        />
                                        <View style={{paddingHorizontal:5}}></View>
                                        <TextInput 
                                            style={[MainStyles.TInput]} 
                                            placeholder="MM"
                                            returnKeyType={"next"} 
                                            keyboardType="number-pad"
                                            ref={(input) => { this.sETM1 = input; }} 
                                            blurOnSubmit={false}
                                            onChangeText={(text)=>this.setState({sETM1:text})} 
                                            placeholderTextColor="#bebebe" 
                                            underlineColorAndroid="transparent" 
                                            value={this.state.sETM1}
                                            maxLength={2}
                                        />
                                    </View>
                                </View>
                                {/* Shift Unpaid Breaks End*/}
                            </View>
                            {/* Shift Time End*/}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Date of Shift
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.startDay2 = input; }} 
                                    blurOnSubmit={false}
                                    keyboardType={"number-pad"}
                                    onChangeText={(text)=>this.setState({startDay2:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.startDay2}
                                    maxLength={2}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.startMonth2 = input; }} 
                                    blurOnSubmit={false}
                                    keyboardType={"number-pad"}
                                    onChangeText={(text)=>this.setState({startMonth2:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.startMonth2}
                                    maxLength={2}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.startYear2 = input; }} 
                                    blurOnSubmit={false}
                                    keyboardType={"number-pad"}
                                    onChangeText={(text)=>this.setState({startYear2:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.startYear2}
                                    maxLength={4}
                                />
                                <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible2}
                                onConfirm={this.handleDatePicked2}
                                onCancel={this.hideDateTimePicker2}
                                minimumDate={this.state.currentDate}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TouchableOpacity   onPress={this.showDateTimePicker2}>
                                    <Image source={require('../../assets/calendar-icon.png')} style={{width:20,height:20}} />
                                </TouchableOpacity>
                            </View>
                            {/* End Date Year End*/}
                            <View style={{marginTop:15}}></View>
                            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                                <View style={{width:'32%'}}>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        Start Time
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                        <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="HH"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.sSTH2 = input; }} 
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onChangeText={(text)=>{this.setState({sSTH2:text});if(text.length == 2){this.sSTM2.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sSTH2}
                                        maxLength={2}
                                    />
                                    <View style={{paddingHorizontal:5}}></View>
                                    <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="MM"
                                        returnKeyType={"next"} 
                                        keyboardType="number-pad"
                                        ref={(input) => { this.sSTM2 = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>{this.setState({sSTM2:text});if(text.length == 2){this.sUPH2.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sSTM2}
                                        maxLength={2}
                                    />
                                    </View>
                                </View>
                                {/* Shift Start Time End*/}
                                <View style={{width:'32%'}}>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        Unpaid Breaks
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:10}}>
                                        <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="HH"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.sUPH2 = input; }} 
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onChangeText={(text)=>{this.setState({sUPH2:text});if(text.length == 2){this.sUPM2.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sUPH2}
                                        maxLength={2}
                                    />
                                    <View style={{paddingHorizontal:5}}></View>
                                    <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="MM"
                                        returnKeyType={"next"} 
                                        keyboardType="number-pad"
                                        ref={(input) => { this.sUPM2 = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>{this.setState({sUPM2:text});if(text.length == 2){this.sETH2.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sUPM2}
                                        maxLength={2}
                                    />
                                    </View>
                                </View>
                                {/* Shift Unpaid Breaks End*/}
                                <View style={{width:'32%'}}>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        End Time
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                        <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="HH"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.sETH2 = input; }} 
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onChangeText={(text)=>{this.setState({sETH2:text});if(text.length == 2){this.sETM2.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sETH2}
                                        maxLength={2}
                                        />
                                        <View style={{paddingHorizontal:5}}></View>
                                        <TextInput 
                                            style={[MainStyles.TInput]} 
                                            placeholder="MM"
                                            returnKeyType={"next"} 
                                            keyboardType="number-pad"
                                            ref={(input) => { this.sETM2 = input; }} 
                                            blurOnSubmit={false}
                                            onChangeText={(text)=>this.setState({sETM2:text})} 
                                            placeholderTextColor="#bebebe" 
                                            underlineColorAndroid="transparent" 
                                            value={this.state.sETM2}
                                            maxLength={2}
                                        />
                                    </View>
                                </View>
                                {/* Shift Unpaid Breaks End*/}
                            </View>
                            {/* Shift Time End*/}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Date of Shift
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.startDay3 = input; }} 
                                    blurOnSubmit={false}
                                    keyboardType={"number-pad"}
                                    onChangeText={(text)=>this.setState({startDay3:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.startDay3}
                                    maxLength={2}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.startMonth3 = input; }} 
                                    blurOnSubmit={false}
                                    keyboardType={"number-pad"}
                                    onChangeText={(text)=>this.setState({startMonth3:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.startMonth3}
                                    maxLength={2}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.startYear3 = input; }} 
                                    blurOnSubmit={false}
                                    keyboardType={"number-pad"}
                                    onChangeText={(text)=>this.setState({startYear3:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.startYear3}
                                    maxLength={4}
                                />
                                <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible3}
                                onConfirm={this.handleDatePicked3}
                                onCancel={this.hideDateTimePicker3}
                                minimumDate={this.state.currentDate}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TouchableOpacity   onPress={this.showDateTimePicker3}>
                                    <Image source={require('../../assets/calendar-icon.png')} style={{width:20,height:20}} />
                                </TouchableOpacity>
                            </View>
                            {/* End Date Year End*/}
                            <View style={{marginTop:15}}></View>
                            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                                <View style={{width:'32%'}}>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        Start Time
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                        <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="HH"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.sSTH3 = input; }} 
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onChangeText={(text)=>{this.setState({sSTH3:text});if(text.length == 2){this.sSTM3.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sSTH3}
                                        maxLength={2}
                                    />
                                    <View style={{paddingHorizontal:5}}></View>
                                    <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="MM"
                                        returnKeyType={"next"} 
                                        keyboardType="number-pad"
                                        ref={(input) => { this.sSTM3 = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>{this.setState({sSTM3:text});if(text.length == 2){this.sUPH3.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sSTM3}
                                        maxLength={2}
                                    />
                                    </View>
                                </View>
                                {/* Shift Start Time End*/}
                                <View style={{width:'32%'}}>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        Unpaid Breaks
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:10}}>
                                        <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="HH"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.sUPH3 = input; }} 
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onChangeText={(text)=>{this.setState({sUPH3:text});if(text.length == 2){this.sUPM3.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sUPH3}
                                        maxLength={2}
                                    />
                                    <View style={{paddingHorizontal:5}}></View>
                                    <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="MM"
                                        returnKeyType={"next"} 
                                        keyboardType="number-pad"
                                        ref={(input) => { this.sUPM3 = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>{this.setState({sUPM3:text});if(text.length == 2){this.sETH3.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sUPM3}
                                        maxLength={2}
                                    />
                                    </View>
                                </View>
                                {/* Shift Unpaid Breaks End*/}
                                <View style={{width:'32%'}}>
                                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                        End Time
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                        <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="HH"
                                        returnKeyType={"next"} 
                                        ref={(input) => { this.sETH3 = input; }} 
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onChangeText={(text)=>{this.setState({sETH3:text});if(text.length == 2){this.sETM3.focus();}}} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sETH3}
                                        maxLength={2}
                                        />
                                        <View style={{paddingHorizontal:5}}></View>
                                        <TextInput 
                                            style={[MainStyles.TInput]} 
                                            placeholder="MM"
                                            returnKeyType={"next"} 
                                            keyboardType="number-pad"
                                            ref={(input) => { this.sETM3 = input; }} 
                                            blurOnSubmit={false}
                                            onChangeText={(text)=>this.setState({sETM3:text})} 
                                            placeholderTextColor="#bebebe" 
                                            underlineColorAndroid="transparent" 
                                            value={this.state.sETM3}
                                            maxLength={2}
                                        />
                                    </View>
                                </View>
                                {/* Shift Unpaid Breaks End*/}
                            </View>
                            {/* Shift Time End*/}
                            
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:26}}>
                                <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                                    this.setState({activeTab:'so'});
                                }}>
                                    <Text style={MainStyles.psosBtnText}>Continue</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginTop:5}} onPress={()=>{
                                    this.setState({activeTab:'sd'});
                                }}>
                                    <Text style={{color:'#1476c0',textDecorationLine:'underline',textDecorationColor:'#1476c0',textDecorationStyle:'solid'}}>Previous</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:20}}></View>
                        </View>
                    }
                    {
                        this.state.activeTab == 'so' && 
                        <View>
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Other Comments
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <TextInput 
                                multiline={true}
                                style={[MainStyles.TInput,{height:80}]} 
                                returnKeyType={"go"} 
                                ref={(input) => { this.otherComments = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({otherComments:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.otherComments}
                            />
                            {/* Other comments Ends */}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Staff member you worked with and approving this time sheet
                                <Text style={{color:'#ee1b24'}}>*</Text>
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:10}}>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    placeholder="First Name"
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.oFname = input; }} 
                                    blurOnSubmit={false}
                                    onChangeText={(text)=>this.setState({oFname:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.oFname}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    placeholder="Last Name"
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.oLname = input; }} 
                                    blurOnSubmit={false}
                                    onChangeText={(text)=>this.setState({oLname:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.oLname}
                                />
                            </View>
                            {/* Other name Ends */}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                File upload if necessary 
                            </Text>
                            <View style={{marginTop:10}}></View>
                            <TouchableOpacity style={MainStyles.selectFilesBtn} onPress={()=>{this.chooseDoc()}}>
                                <Text style={{
                                    color:'#FFFFFF'
                                }}>Select File</Text>
                            </TouchableOpacity>
                            <View style={{marginTop:10}}></View>
                            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap',marginTop:10}}>
                                <TouchableOpacity style={[MainStyles.checkBoxWrapper]}>
                                    <View style={[MainStyles.checkBoxStyle]}><View style={MainStyles.checkBoxCheckedStyle}></View></View>
                                    <Text style={[MainStyles.checkBoxLabel]}>I declare that these hours are true and correct, and approved by payment by the pharmacy*</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[MainStyles.TInput,{justifyContent:'center',alignItems:'center',marginTop:26,height:300,}]}>
                                <SignatureCapture
                                style={{
                                    borderColor: '#000033',
                                    borderWidth: 1,
                                    width:'100%',
                                    height:260,
                                    backgroundColor:'#010101'
                                }}
                                ref="sign"
                                onSaveEvent={this._onSaveEvent}
                                saveImageFileInExtStorage={false}
                                showNativeButtons={false}
                                showTitleLabel={false}
                                viewMode={"portrait"}/>
                                <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnXm,{paddingHorizontal:10,position:'absolute',top:10,right:10}]} onPress={()=>{
                                    this.refs["sign"].resetImage();
                                }}>
                                    <Icon name="times"  style={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:26}}>
                                <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{this.submitTimeSheet();
                                }}>
                                    <Text style={MainStyles.psosBtnText}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginTop:5}} onPress={()=>{
                                    this.setState({activeTab:'sd'});
                                }}>
                                    <Text style={{color:'#1476c0',textDecorationLine:'underline',textDecorationColor:'#1476c0',textDecorationStyle:'solid'}}>Previous</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:20}}></View>
                        </View>
                        /*Show SO Tab */
                    }
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>);
    }
}
const styles = StyleSheet.create({
    breadCrumbs:{
        paddingVertical:8,
        paddingHorizontal:8,
        backgroundColor:'#959595',
        borderRadius:100
    }
});
export default ETimeSheet;