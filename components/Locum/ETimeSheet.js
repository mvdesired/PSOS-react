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
const { height, width } = Dimensions.get('window');
class ETimeSheet extends Component{
    constructor(props) {
        super(props);
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
            haveMore:'No'
        }
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
        this.setState({fname:userData.fname,lname:userData.lname,email:userData.email});
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
                        <View style={[styles.breadCrumbs,(this.state.activeTab == 'ms')?{backgroundColor:'#1476c0'}:'']}>
                            <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:12}}>More Shift</Text>
                        </View>
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
                                    selectedValue={this.state.pharmacy}
                                    style={{
                                        flex:1,
                                        paddingVertical:2,
                                        height:30,
                                    }}
                                    mode="dropdown"
                                    textStyle={{fontSize: 14,fontFamily:'AvenirLTStd-Medium'}}
                                    itemTextStyle= {{fontSize: 14,fontFamily:'AvenirLTStd-Medium'}}
                                    itemStyle={MainStyles.TInput}
                                    onValueChange={(itemValue, itemIndex) => this.setState({pharmacy: itemValue})}>
                                        {
                                        this.state.pharmacyList.map((item,key)=>{
                                            return (
                                            <Picker.Item key={'key-'+key} label={item.name} value={item.id} />
                                            )
                                        })
                                        }
                                    </Picker>
                                </View>
                            }
                            {
                                Platform.OS == 'ios' && 
                                <TouchableOpacity style={[MainStyles.TInput,{alignItems:'center'}]} onPress={()=>{this.pickerIos()}}>
                                    <Text style={{color:'#03163a',fontFamily:'Roboto-Light',fontSize:18}}>{this.state.pharmacy}</Text>
                                </TouchableOpacity>
                                
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
                                        ref={(input) => { this.sSTM = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>this.setState({sSTM:text})} 
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
                                        onChangeText={(text)=>this.setState({sUPH:text})} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sUPH}
                                    />
                                    <View style={{paddingHorizontal:5}}></View>
                                    <TextInput 
                                        style={[MainStyles.TInput]} 
                                        placeholder="MM"
                                        returnKeyType={"next"} 
                                        keyboardType="number-pad"
                                        ref={(input) => { this.sUPM = input; }} 
                                        blurOnSubmit={false}
                                        onChangeText={(text)=>this.setState({sUPM:text})} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sUPM}
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
                                        onChangeText={(text)=>this.setState({sETH:text})} 
                                        placeholderTextColor="#bebebe" 
                                        underlineColorAndroid="transparent" 
                                        value={this.state.sETH}
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
                                        />
                                    </View>
                                </View>
                                {/* Shift Unpaid Breaks End*/}
                            </View>
                            {/* Shift Time End*/}
                            <View style={{marginTop:15}}></View>
                            <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>
                                Do you have more days to fill time sheet for same Pharmacy location?
                            </Text>
                            <View style={{marginTop:10}}></View>
                            {
                                Platform.OS == 'android' && 
                                <View style={[MainStyles.TInput,{paddingLeft:0,paddingVertical:0}]}>
                                    <Picker
                                    selectedValue={this.state.haveMore}
                                    style={{
                                        flex:1,
                                        paddingVertical:2,
                                        height:30,
                                    }}
                                    mode="dropdown"
                                    textStyle={{fontSize: 14,fontFamily:'AvenirLTStd-Medium'}}
                                    itemTextStyle= {{fontSize: 14,fontFamily:'AvenirLTStd-Medium'}}
                                    itemStyle={MainStyles.TInput}
                                    onValueChange={(itemValue, itemIndex) => this.setState({haveMore: itemValue})}>
                                        <Picker.Item label={'Yes - I do'} value={'Yes'} />
                                        <Picker.Item label={'No - I am finished'} value={'No'} />
                                    </Picker>
                                </View>
                            }
                            {
                                Platform.OS == 'ios' && 
                                <TouchableOpacity style={[MainStyles.TInput,{alignItems:'center'}]} onPress={()=>{this.pickerIos()}}>
                                    <Text style={{color:'#03163a',fontFamily:'Roboto-Light',fontSize:18}}>{this.state.haveMore}</Text>
                                </TouchableOpacity>
                                
                            }
                            {/* More Days End*/}
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:26}}>
                                <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
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
                            <TouchableOpacity style={MainStyles.selectFilesBtn} onPress={()=>{this.pickFile()}}>
                                <Text style={{
                                    color:'#FFFFFF'
                                }}>Select Files</Text>
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
                                showNativeButtons={true}
                                showTitleLabel={false}
                                viewMode={"portrait"}/>
                            </View>
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:26}}>
                                <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
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