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
import DateTimePicker from "react-native-modal-datetime-picker";
import PhoneInput from 'react-native-phone-input';
const { height, width } = Dimensions.get('window');
class ETimeSheet extends Component{
    constructor(props) {
        super(props);
        var newDate = new Date();
        var extendedDate = new Date(newDate.getTime()+30*60000);
        var sH = newDate.getHours();
        var sM = newDate.getMinutes();
        var eH = extendedDate.getHours();
        var eM = extendedDate.getMinutes();
        if(sH < 10){sH = '0'+sH;}
        if(sM < 10){sM = '0'+sM;}
        if(eH < 10){eH = '0'+eH;}
        if(eM < 10){sM = '0'+eM;}
        this.state={
            loading:false,
            activeTab:'cd',
            pharmacyList:[],
            startDay:'01',
            startMonth:'01',
            startYear:'2019',
            dateDays:{},
            dateMonth:{},
            dateYears:{},
            haveMore:'No',
            sSTH:'09',
            startMinute:'00',
            endHour:'18',
            endMinute:'00',
        }
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
        this.setState({fname:userData.fname,lname:userData.lname,email:userData.email,mNumber:userData.phone});
    }
    componentDidMount(){
        this.setUserData();
        var currentDate = new Date();
        var startDay = ''+currentDate.getDate();
        var startMonth = ''+(currentDate.getMonth()+1);
        var startYear = ''+currentDate.getFullYear();
        if(startDay < 10){startDay = '0'+startDay;}
        if(startMonth < 10){startMonth = '0'+startMonth;}
        this.setState({currentDate,startDay,startMonth,startYear});
    }
    pickFile = ()=>{
        const options = {
            title: 'Select File',
            storageOptions: {
              skipBackup: false,
              path: 'images',
            },
            maxWidth:1024,
            maxHeight:1024,
            mediaType:'photo',
            quality:1,
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
                avatarSource: source,
              });
            }
          });
    }
    _onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        console.log(result);
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
        console.log("A date has been picked: ", dd,mm,yy);
        this.hideDateTimePicker();
    };
    submitAvailablity = ()=>{
        if(this.state.fname == ''){
            Toast.show('First name should not be blank',Toast.SHORT);
            return false;
        }
        if(this.state.lname == ''){
            Toast.show('Last name should not be blank',Toast.SHORT);
            return false;
        }
        if(this.state.startDay == ''){
            Toast.show('Please select start day',Toast.SHORT);
            return false;
        }
        if(this.state.startMonth == ''){
            Toast.show('Please select start month',Toast.SHORT);
            return false;
        }
        if(this.state.startYear == ''){
            Toast.show('Please select start year',Toast.SHORT);
            return false;
        }
        if(this.state.startHour == ''){
            Toast.show('Please select start hour',Toast.SHORT);
            return false;
        }
        if(this.state.startMinute == ''){
            Toast.show('Please select start minute',Toast.SHORT);
            return false;
        }
        if(this.state.endHour == ''){
            Toast.show('Please select end hour',Toast.SHORT);
            return false;
        }
        if(this.state.endMinute == ''){
            Toast.show('Please select end minute',Toast.SHORT);
            return false;
        }
        if(this.state.email == ''){
            Toast.show('Email should not be blank',Toast.SHORT);
            return false;
        }
        if(this.state.mNumber == ''){
            Toast.show('Mobile number should not be blank',Toast.SHORT);
            return false;
        }
        this.setState({loading:true});
        console.log(this.state);
        var formdata = new FormData();
        formdata.append('user_id',this.state.userData.id);
        formdata.append('fname',this.state.fname);
        formdata.append('lname',this.state.lname);
        formdata.append('available_on',this.state.startYear+'-'+this.state.startMonth+'-'+this.state.startDay);
        formdata.append('start_time',this.state.sSTH+':'+this.state.startMinute+':00');
        formdata.append('end_time',this.state.endHour+':'+this.state.endMinute+':00');
        formdata.append('email',this.state.email);
        formdata.append('mobile',this.state.mNumber);
        fetch(SERVER_URL+'locum_availability',{
            method:'POST',
            headers: {
                Accept: 'application/json',
            },
            body:formdata
        })
        .then(res=>{console.log(res);return res.json()})
        .then(response=>{
            console.log(response);
            this.setState({loading:false});
            Toast.show(response.message,Toast.SHORT);
            //this.props.navigation.navigate('Home');
        })
        .catch(err=>{
            this.setState({loading:false});
            console.log(err);
            Toast.show('Something went wrong',Toast.SHORT);
        });
    }
    showStartTimePicker = () => {
        this.setState({isStartTimePickerVisible:true});
    };
    hideStartTimePicker = () => {
        this.setState({isStartTimePickerVisible:false});
    };
    handleStartTimePicked = date => {
        var changeDate = new Date(date);
        var hh = ''+changeDate.getHours();
        var mm = ''+(changeDate.getMinutes());
        if(hh < 10){hh = '0'+hh;}
        if(mm < 10){mm = '0'+mm;}
        this.setState({
            sSTH:hh,startMinute:mm
        });
        this.hideStartTimePicker();
    };
    showEndTimePicker = () => {
        this.setState({isEndTimePickerVisible:true});
    };
    hideEndTimePicker = () => {
        this.setState({isEndTimePickerVisible:false});
    };
    handleEndTimePicked = date => {
        var changeDate = new Date(date);
        var hh = ''+changeDate.getHours();
        var mm = ''+(changeDate.getMinutes());
        if(hh < 10){hh = '0'+hh;}
        if(mm < 10){mm = '0'+mm;}
        this.setState({
            endHour:hh,endMinute:mm
        });
        this.hideEndTimePicker();
    };
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
                        <Text style={{fontFamily:'AvenirLTStd-Heavy',color:'#151515',fontSize:16}}>Locum Availability</Text>
                        <Text style={{marginTop:5,fontFamily:'AvenirLTStd-Medium',color:'#676767',fontSize:13,marginBottom:5,}}>
                            Let us know when you are available in the next few days. 
                        </Text>
                        <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#676767',fontSize:13,marginBottom:5,}}>
                            PLEASE NOTE: When you click SUBMIT - you will return to this page. There is no submission confirmation page. You will get an email of your submission if you include an email address.
                        </Text>
                    </View>
                    {/* Locum Registration Heading Ends */}
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
                        Date
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
                        <View style={{width:'40%'}}>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Start Time
                            </Text>
                            <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                <TextInput 
                                style={[MainStyles.TInput]} 
                                placeholder="HH"
                                returnKeyType={"next"} 
                                ref={(input) => { this.sSTH = input; }} 
                                blurOnSubmit={false}
                                keyboardType="number-pad"
                                maxLength={2}
                                onChangeText={(text)=>this.setState({sSTH:text})} 
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
                                maxLength={2}
                                ref={(input) => { this.startMinute = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({startMinute:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.startMinute}
                            />
                            <View style={{paddingHorizontal:5}}></View>
                            <View style={{paddingHorizontal:2}}>
                                <TouchableOpacity onPress={()=>{this.showStartTimePicker()}}>
                                    <Icon name="clock-o" style={{fontSize:17}} />
                                </TouchableOpacity>
                                <DateTimePicker
                                isVisible={this.state.isStartTimePickerVisible}
                                onConfirm={this.handleStartTimePicked}
                                onCancel={this.hideStartTimePicker}
                                mode="time"
                                minimumDate={this.state.currentDate}
                                />
                            </View>
                            </View>
                        </View>
                        {/* Shift Start Time End*/}
                        <View style={{width:'40%'}}>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                End Time
                            </Text>
                            <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:10}}>
                                <TextInput 
                                style={[MainStyles.TInput]} 
                                placeholder="HH"
                                returnKeyType={"next"} 
                                ref={(input) => { this.endHour = input; }} 
                                blurOnSubmit={false}
                                keyboardType="number-pad"
                                maxLength={2}
                                onChangeText={(text)=>this.setState({endHour:text})} 
                                placeholderTextColor="#bebebe" 
                                underlineColorAndroid="transparent" 
                                value={this.state.endHour}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <TextInput 
                                    style={[MainStyles.TInput]} 
                                    placeholder="MM"
                                    returnKeyType={"next"} 
                                    keyboardType="number-pad"
                                    maxLength={2}
                                    ref={(input) => { this.endMinute = input; }} 
                                    blurOnSubmit={false}
                                    onChangeText={(text)=>this.setState({endMinute:text})} 
                                    placeholderTextColor="#bebebe" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.endMinute}
                                />
                                <View style={{paddingHorizontal:5}}></View>
                                <View style={{paddingHorizontal:2}}>
                                    <TouchableOpacity onPress={()=>{this.showEndTimePicker()}}>
                                        <Icon name="clock-o" style={{fontSize:17}} />
                                    </TouchableOpacity>
                                    <DateTimePicker
                                    isVisible={this.state.isEndTimePickerVisible}
                                    onConfirm={this.handleEndTimePicked}
                                    onCancel={this.hideEndTimePicker}
                                    mode="time"
                                    minimumDate={this.state.currentDate}
                                    />
                                </View>
                            </View>
                        </View>
                        {/* Shift Unpaid Breaks End*/}
                    </View>
                    {/* Shift Time End*/}
                    <View style={{marginTop:15}}></View>
                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                        Email
                        <Text style={{color:'#ee1b24'}}>*</Text>
                    </Text>
                    <View style={{marginTop:10}}></View>
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
                    <View style={{marginTop:15}}></View>
                    <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                        Mobile Number
                        <Text style={{color:'#ee1b24'}}>*</Text>
                    </Text>
                    <View style={{marginTop:10}}></View>
                    <View 
                        style={{paddingLeft: 10,
                            paddingVertical:2,
                            height:30,
                            fontSize:14,
                            borderRadius:20,
                            fontFamily:'AvenirLTStd-Medium',
                            borderColor:'#a1a1a1',
                            borderWidth: 1,
                            borderStyle:"dashed"
                        }}
                    >
                        <PhoneInput
                        ref={(ref) => { this.mNumber = ref; }}
                        style={{
                            flex:1,
                            textAlign:'left',
                            paddingLeft: 0,
                            height:30,
                            fontSize:14,
                            fontFamily:'AvenirLTStd-Medium'
                        }} 
                        initialCountry={"au"}
                        onChangePhoneNumber={(number)=>this.setState({mNumber:number})}
                        value={this.state.mNumber}
                        />
                    </View>
                    <View style={{justifyContent:'center',alignItems:'center',marginTop:26}}>
                        <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                            this.submitAvailablity();
                        }}>
                            <Text style={MainStyles.psosBtnText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop:10}}></View>
                    {/*Show CD Tab*/}
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