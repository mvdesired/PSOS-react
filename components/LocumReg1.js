import React, { Component } from 'react';
import {
    View, SafeAreaView, Image, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView,
    Picker, Dimensions, AsyncStorage, Keyboard, Alert,
    ActionSheetIOS, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from './Loader';
import MainStyles from './Styles';
import Toast from 'react-native-simple-toast';
import PhoneInput from 'react-native-phone-input'
import Dialog, { SlideAnimation } from "react-native-popup-dialog";
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { SERVER_URL, SENDER_ID } from '../Constants';
import PushNotification from 'react-native-push-notification';
import DateTimePicker from "react-native-modal-datetime-picker";
import SmsListener from 'react-native-android-sms-listener';
import Permissions from 'react-native-permissions';
const { height, width } = Dimensions.get('window');
var myHeaders = new Headers();
myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class LocumReg1Screen extends Component {
    constructor(props) {
        super(props);
        var cOptionsList = ['Australia'];
        cOptionsList.unshift('Cancel');
        var sOptions = ['VIC', 'NSW', 'QLD', 'ACT', 'TAS', 'NT', 'WA', 'SA'];
        sOptions.unshift('Cancel');
        var todayDate = new Date();
        todayDate.setFullYear(todayDate.getFullYear() - 21);
        this.state = {
            loading: false,
            CountryList: ['Australia'],
            stateList: ['VIC', 'NSW', 'QLD', 'ACT', 'TAS', 'NT', 'WA', 'SA'],
            cOptions: cOptionsList,
            sOptions: sOptions,
            spr: 'VIC',
            country: 'Australia',
            firsName: "",
            lastName: "",
            phoneNo: "4",
            phoneCode: '+61',
            emailAddress: "",
            password: '',
            streetAddress: "",
            city: "",
            pz: "",
            profilePicName: '',
            resumFileName: '',
            showTerms: false,
            form2: false,
            js_restrict: 'No',
            js_software: ['Simple'],
            js_admin_vaccin: 'No',
            js_comfort: 'No',
            js_medi_review: 'No',
            des_restrict: '',
            about: '',
            isDatePickerVisible: false,
            otpVisible: false,
            otp: '',
            serverOtp: '',
            page_text: '',
            todayDate
        }
    }
    subscription = SmsListener.addListener(message => {
        let verificationCodeRegex = /Your OTP for registration is: ([\d]{4})/;
        console.log(message.body);
        if (verificationCodeRegex.test(message.body)) {
            let verificationCode = message.body.match(verificationCodeRegex)[1];
            this.setState({ otp: verificationCode });
        }
    });
    componentDidMount() {
        this.props.navigation.addListener('willFocus', payload => {
            if ((payload.context).search('Navigation/BACK_Root') != -1) {
                BackHandler.exitApp();
            }
        });
        Permissions.request('readSms').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            this.setState({ photoPermission: response })
        });
        Permissions.request('receiveSms').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            this.setState({ photoPermission: response })
        })
        fetch(SERVER_URL + 'app_page_text?page_name=terms', {
            method: 'GET',
            headers: myHeaders
        })
            .then(res => res.json())
            .then(response => {
                this.setState({ page_text: response.page_text });
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    }
    componentWillUnmount() {
        var currentDate = new Date();
        this.setState({ currentDate });
        this.subscription.remove();
    }
    async saveDetails(key, value) {
        await AsyncStorage.setItem(key, value);
    }
    pickerIos = () => {
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.state.cOptions,
            cancelButtonIndex: 0,
        },
            (buttonIndex) => {
                if (buttonIndex != 0) {
                    this.setState({ country: this.state.cOptions[buttonIndex] })
                }
            });
    }
    pickerState = () => {
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.state.sOptions,
            cancelButtonIndex: 0,
        },
            (buttonIndex) => {
                if (buttonIndex != 0) {
                    this.setState({ spr: this.state.sOptions[buttonIndex] })
                }
            });
    }
    signUpStep1 = () => {
        if (this.state.firsName == '') {
            Toast.show('First name should not be blank', Toast.SHORT);
            return false;
        }
        if (this.state.lastName == '') {
            Toast.show('Last name should not be blank', Toast.SHORT)
            return false;
        }
        if (this.state.phoneNo == '') {
            Toast.show('Phone number should not be blank', Toast.SHORT)
            return false;
        }
        if (this.state.phoneNo < 9) {
            Toast.show('Phone number should not be less than 9 digits', Toast.SHORT)
            return false;
        }
        if (this.state.emailAddress == '') {
            Toast.show('Email ID should not be blank', Toast.SHORT)
            return false;
        }
        if (this.state.password == '') {
            Toast.show('password should not be blank', Toast.SHORT)
            return false;
        }
        if (this.state.streetAddress == '') {
            Toast.show('Street address should not be blank', Toast.SHORT)
            return false;
        }
        if (this.state.city == '') {
            Toast.show('City should not be blank', Toast.SHORT)
            return false;
        }
        if (this.state.spr == '') {
            Toast.show('State/Provision/Region should not be blank', Toast.SHORT)
            return false;
        }
        if (this.state.pz == '') {
            Toast.show('Postal/Zipcode should not be blank', Toast.SHORT)
            return false;
        }
        if (this.state.country == '') {
            Toast.show('Country should not be blank', Toast.SHORT)
            return false;
        }
        this.setState({ form2: true });
    }
    pickFile = () => {
        const options = {
            title: 'Select File',
            storageOptions: {
                skipBackup: false,
                path: 'images',
            },
            maxWidth: 800,
            maxHeight: 800,
            mediaType: 'photo',
            quality: 1,
            allowsEditing: true,
        };

        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info in the API Reference)
         */
        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
            } else if (response.error) {
                console.log(response.error);
            } else if (response.customButton) {
            } else {
                const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    profilePicName: response.fileName,
                    fileData: { data: response.data, name: response.fileName },
                    avatarSource: source,
                });
            }
        });
    }
    chooseDoc = () => {
        this.setState({ loading: true });
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        }, (error, res) => {
            if (res) {
                var fileExtArra = res.fileName.split('.');
                var fileExt = fileExtArra[fileExtArra.length - 1];
                if (fileExt != "pdf" && fileExt != "docx" && fileExt != "doc") {
                    Toast.show('Please upload only document or pdf file', Toast.SHORT);
                    this.setState({ loading: false });
                    return false;
                }
                this.setState({ resumFileName: res.fileName });
                RNFS.readFile(res.uri, 'base64')
                    .then(result => { this.setState({ resumFile: { data: result, filename: res.fileName } }); this.setState({ loading: false }); })
                    .catch(error => { this.setState({ loading: false }); });
            }
            else {
                this.setState({ loading: false });
            }
        });
    }
    registerLocum = () => {
        Alert.alert(
            'Please check your email and mobile number',
            'Email: ' + this.state.emailAddress + '\nMobile Number: ' + this.state.phoneCode + '' + this.state.phoneNo,
            [
                {
                    text: 'Change',
                    onPress: () => {
                        this.setState({ showTerms: false, form2: false });
                    },
                    style: 'cancel',
                },
                {
                    text: 'Correct', onPress: () => {
                        this.setState({ loading: true });
                        this.getToken(this.sendDataToServer.bind(this));
                    }
                },
            ],
            { cancelable: false },
        );

    }
    getToken = (onToken) => {
        if (Platform.OS == 'android') {
            PushNotification.configure({
                onRegister: onToken,
                onNotification: function (notification) {
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
        else {
            onToken();
        }
    }
    sendDataToServer = (token) => {
        if (this.state.emailAddress != '') {
            var tokenGenerated = (typeof (token) != "undefined") ? token.token : '';
            var jsonArray = {
                fname: this.state.firsName,
                lname: this.state.lastName,
                phone: this.state.phoneCode + '' + this.state.phoneNo,
                email: this.state.emailAddress,
                password: this.state.password,
                address: this.state.streetAddress,
                city: this.state.city,
                state: this.state.spr,
                country: this.state.country,
                postal: this.state.pz,
                js_resume: this.state.resumFile,
                user_img: this.state.fileData,
                js_dob: this.state.dd + '-' + this.state.mm + '-' + this.state.yy,
                js_ahpra: this.state.ahprano,
                js_reg: this.state.js_reg,
                js_restrict: this.state.js_restrict,
                js_software: this.state.js_software.join(','),
                js_admin_vaccin: this.state.js_admin_vaccin,
                js_comfort: this.state.js_comfort,
                js_medi_review: this.state.js_medi_review,
                about: this.state.about,
                device_type: Platform.OS,
                device_key: tokenGenerated,
                js_pharma: '',
                js_accredit: '',
                js_vaccin: '',
                des_restrict: this.state.des_restrict
            }
            fetch(SERVER_URL + 'locum_reg', {
                method: 'POST',
                credentials: 'same-origin',
                mode: 'same-origin',
                headers: myHeaders,
                body: JSON.stringify(jsonArray)
            })
            .then(res => { console.log(res); return res.json(); })
            .then((response) => {
                if (response.status == 200) {
                    // this.saveDetails('isUserLoggedIn',"true");
                    // this.saveDetails('userData',JSON.stringify(response.result));
                    // setTimeout(()=>{
                    //     this.props.navigation.navigate('Home');
                    // },1500);
                    this.setState({ showTerms: false, otpVisible: true, serverOtp: response.result.otp, userId: response.result.id });
                }
                Toast.show(response.message, Toast.SHORT);
                this.setState({ loading: false, showTerms: false });
            }).catch((err) => {
                console.log(err);
                this.setState({ loading: false });
            });
        }
    }
    checkSoftware = (value) => {
        if (this.state.js_software.indexOf(value) === -1) {
            var selected = this.state.js_software;
            selected.push(value);
            this.setState({ js_software: selected });
        }
        else {
            var selected = this.state.js_software;
            selected.splice(this.state.js_software.indexOf(value), 1);
            this.setState({ js_software: selected });
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
        var dd = '' + changeDate.getDate();
        var mm = '' + (changeDate.getMonth() + 1);
        var yy = '' + changeDate.getFullYear();
        if (dd < 10) { dd = '0' + dd; }
        if (mm < 10) { mm = '0' + mm; }
        this.setState({
            dd, mm, yy
        });
        this.hideDatePicker();
    };
    checkOtp = () => {
        if (this.state.otp == '') {
            Toast.show('OTP should not be blank', Toast.SHORT);
            return false;
        }
        if (this.state.otp != this.state.serverOtp) {
            Toast.show('OTP not matched', Toast.SHORT);
            return false;
        }
        this.setState({ loading: true });
        fetch(SERVER_URL + 'userdata', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: this.state.userId
            })
        })
            .then((res) => { return res.json() })
            .then((response) => {
                if (response.status == 200) {
                    Toast.show(response.message, Toast.SHORT);
                    this.saveDetails('isUserLoggedIn', "true");
                    this.saveDetails('userData', JSON.stringify(response.result));
                    //if(response.result.user_type == 'employer'){
                    this.props.navigation.navigate('IntroLocum');
                    this.setState({ otpVisible: false, serverOtp: '', userId: '', otp: '' });
                    //}
                }
                else {
                    Toast.show(response.message, Toast.SHORT);
                }
                this.setState({ loading: false });
            })
            .catch((err) => {
                console.log(err);
                this.checkNetInfo();
                this.setState({ loading: false });
            });
    }
    render() {
        const RemoveHiehgt = height - 66;
        var behavior = (Platform.OS == 'ios') ? 'padding' : '';
        return (
            <SafeAreaView style={{ flexDirection: 'column', flex: 1 }}>
                <Loader loading={this.state.loading} />
                <View style={{ paddingTop: 15, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack(); }} style={{ position: 'absolute', left: 8, top: 8, paddingLeft: 10, paddingRight: 15, paddingVertical: 15, }}>
                        <Image source={require('../assets/blue-back-icon.png')} style={{ width: 10, height: 19 }} />
                    </TouchableOpacity>
                    <Image source={require('../assets/web-logo.png')} style={{ width: 200, height: 34 }} />
                    <Image source={require('../assets/header-b.png')} style={{ width: '100%', marginTop: 15 }} />
                </View>
                {
                    this.state.form2 == false &&
                    <KeyboardAvoidingView style={{ flex: 1, }} enabled behavior={behavior}>
                        <ScrollView style={{ paddingHorizontal: 15, height: RemoveHiehgt }} keyboardShouldPersistTaps="always">
                            <View style={{ paddingVertical: 20 }}>
                                <Text style={{ fontFamily: 'AvenirLTStd-Heavy', color: '#151515', fontSize: 16 }}>Locum Registration Form</Text>
                                <Text style={{ marginTop: 5, fontFamily: 'AvenirLTStd-Medium', color: '#676767', fontSize: 13, marginBottom: 5, }}>
                                    To register and benefit from becoming a Pharmacy SOS locum, please use this form to register.
                                </Text>
                            </View>
                            {/* Locum Registration Heading Ends */}
                            <Image source={require('../assets/dashed-border.png')} width={'100%'} height={2} />
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 18, flexDirection: 'row' }}>
                                <View style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#1476c0', borderRadius: 10 }}>
                                    <Text style={{ fontFamily: 'AvenirLTStd-Medium', color: '#FFFFFF', fontSize: 12, }}>Contact Details</Text>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Image source={require('../assets/dashed-b-s.png')} width={100} style={{ width: 50 }} />
                                </View>
                                <View style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#959595', borderRadius: 10 }}>
                                    <Text style={{ fontFamily: 'AvenirLTStd-Medium', color: '#FFFFFF', fontSize: 12, }}>Professional Details</Text>
                                </View>
                            </View>
                            <Image source={require('../assets/dashed-border.png')} width={'100%'} height={2} />
                            {/* BreadCrumbs Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 14 }}>
                                Name
                                <Text style={{ color: '#ee1b24' }}>*</Text>
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                <TextInput
                                    style={MainStyles.TInput}
                                    placeholder="First Name"
                                    returnKeyType={"go"}
                                    ref={(input) => { this.firsName = input; }}
                                    onSubmitEditing={() => { this.lastName.focus(); }}
                                    blurOnSubmit={false}
                                    onChangeText={(text) => this.setState({ firsName: text })}
                                    placeholderTextColor="#bebebe"
                                    underlineColorAndroid="transparent"
                                    value={this.state.firsName}
                                />
                                <View style={{ paddingHorizontal: 10 }}></View>
                                <TextInput
                                    style={MainStyles.TInput}
                                    placeholder="Last Name"
                                    returnKeyType={"go"}
                                    ref={(input) => { this.lastName = input; }}
                                    onSubmitEditing={() => { this.mobileNumber.focus(); }}
                                    blurOnSubmit={false}
                                    onChangeText={(text) => this.setState({ lastName: text })}
                                    placeholderTextColor="#bebebe"
                                    underlineColorAndroid="transparent"
                                    value={this.state.lastName}
                                />
                            </View>
                            {/* First & Last Name Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 14 }}>
                                Phone
                                <Text style={{ color: '#ee1b24' }}>*</Text>
                            </Text>
                            <View style={{ marginTop: 10 }}></View>
                            <View
                                style={{
                                    paddingLeft: 10,
                                    paddingVertical: 2,
                                    height: 30,
                                    fontSize: 14,
                                    borderRadius: 20,
                                    fontFamily: 'AvenirLTStd-Medium',
                                    borderColor: '#a1a1a1',
                                    borderWidth: 1,
                                    borderStyle: "dashed",
                                    flexDirection: 'row'
                                }}
                            >
                                {/* <PhoneInput
                                ref={(ref) => { this.mobileNumber = ref; }}
                                style={{
                                    textAlign:'left',
                                    paddingLeft: 10,
                                    height:25,
                                    fontSize:14,
                                    fontFamily:'AvenirLTStd-Medium'
                                }} 
                                initialCountry={"au"}
                                maxLength={9}
                                onChangePhoneNumber={(number)=>this.setState({phoneNo:number})}
                                value={this.state.phoneNo}
                                /> */}
                                <PhoneInput
                                    ref={(ref) => { this.phoneCode = ref; }}
                                    style={{
                                        textAlign: 'left',
                                        paddingLeft: 10,
                                        height: 25,
                                        fontSize: 14,
                                        fontFamily: 'AvenirLTStd-Medium',
                                        width: 75
                                    }}
                                    initialCountry={"au"}
                                    onChangePhoneNumber={(number) => this.setState({ phoneCode: number })}
                                    value={this.state.phoneCode}
                                />
                                <TextInput
                                    style={[MainStyles.TInput, {
                                        borderWidth: 0,
                                        height: 26,
                                    }]}
                                    maxLength={9}
                                    placeholder="Mobile Number *"
                                    keyboardType="number-pad"
                                    ref={(input) => { this.phoneNo = input; }}
                                    onSubmitEditing={() => { this.emailAddress.focus(); }}
                                    blurOnSubmit={false}
                                    onChangeText={(text) => this.setState({ phoneNo: text })}
                                    placeholderTextColor="#bebebe"
                                    underlineColorAndroid="transparent"
                                    value={this.state.phoneNo}
                                />
                            </View>
                            {/* <TextInput 
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
                                /> */}
                            {/* Phone Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 14 }}>
                                E-mail
                                <Text style={{ color: '#ee1b24' }}>*</Text>
                            </Text>
                            <View style={{ marginTop: 10 }}></View>
                            <TextInput
                                style={MainStyles.TInput}
                                placeholder="E-mail"
                                returnKeyType={"go"}
                                ref={(input) => { this.emailAddress = input; }}
                                onSubmitEditing={() => { this.password.focus(); }}
                                blurOnSubmit={false}
                                keyboardType="email-address"
                                onChangeText={(text) => this.setState({ emailAddress: text })}
                                placeholderTextColor="#bebebe"
                                underlineColorAndroid="transparent"
                                value={this.state.emailAddress}
                            />
                            {/* Email Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 14 }}>
                                Password
                                <Text style={{ color: '#ee1b24' }}>*</Text>
                            </Text>
                            <View style={{ marginTop: 10 }}></View>
                            <TextInput
                                style={MainStyles.TInput}
                                placeholder="Password *"
                                returnKeyType={"go"}
                                ref={(input) => { this.password = input; }}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.about.focus(); }}
                                secureTextEntry={true}
                                keyboardType="default"
                                onChangeText={(text) => this.setState({ password: text })}
                                placeholderTextColor="#bebebe"
                                underlineColorAndroid="transparent"
                                value={this.state.password}
                            />
                            {/* Password Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 14 }}>
                                About
                            </Text>
                            <View style={{ marginTop: 10 }}></View>
                            <TextInput
                                style={MainStyles.TInput}
                                placeholder="About"
                                returnKeyType={"next"}
                                ref={(input) => { this.about = input; }}
                                onSubmitEditing={() => { this.streetAddress.focus(); }}
                                blurOnSubmit={false}
                                keyboardType="default"
                                onChangeText={(text) => this.setState({ about: text })}
                                placeholderTextColor="#bebebe"
                                underlineColorAndroid="transparent"
                                value={this.state.about}
                            />
                            {/* About Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 14 }}>
                                Address
                                <Text style={{ color: '#ee1b24' }}>*</Text>
                            </Text>
                            <View style={{ marginTop: 10 }}></View>
                            <TextInput
                                style={MainStyles.TInput}
                                placeholder="Street Address"
                                returnKeyType={"go"}
                                ref={(input) => { this.streetAddress = input; }}
                                onSubmitEditing={() => { this.city.focus(); }}
                                blurOnSubmit={false}
                                onChangeText={(text) => this.setState({ streetAddress: text })}
                                placeholderTextColor="#bebebe"
                                underlineColorAndroid="transparent"
                                value={this.state.streetAddress}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
                                <TextInput
                                    style={MainStyles.TInput}
                                    placeholder="City"
                                    returnKeyType={"go"}
                                    ref={(input) => { this.city = input; }}
                                    onSubmitEditing={() => { this.pz.focus(); }}
                                    blurOnSubmit={false}
                                    onChangeText={(text) => this.setState({ city: text })}
                                    placeholderTextColor="#bebebe"
                                    underlineColorAndroid="transparent"
                                    value={this.state.city}
                                />
                                <View style={{ paddingHorizontal: 5 }}></View>
                                {
                                    Platform.OS == 'android' &&
                                    <View style={[MainStyles.TInput, { paddingLeft: 0, paddingVertical: 0 }]}>
                                        <Picker
                                            selectedValue={this.state.spr}
                                            style={{
                                                flex: 1,
                                                paddingLeft: 10,
                                                paddingVertical: 2,
                                                height: 30,
                                            }}
                                            textStyle={{ fontSize: 14, fontFamily: 'AvenirLTStd-Medium' }}
                                            itemTextStyle={{ fontSize: 14, fontFamily: 'AvenirLTStd-Medium' }}
                                            itemStyle={MainStyles.TInput}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ spr: itemValue })}>
                                            {
                                                this.state.stateList.map(item => {
                                                    return (
                                                        <Picker.Item key={'key-' + item} label={item} value={item} />
                                                    )
                                                })
                                            }
                                        </Picker>
                                    </View>
                                }
                                {
                                    Platform.OS == 'ios' &&
                                    <TouchableOpacity style={[MainStyles.TInput, { alignItems: 'center' }]} onPress={() => { this.pickerState() }}>
                                        <Text style={{ color: '#03163a', fontFamily: 'Roboto-Light', fontSize: 18 }}>{this.state.spr}</Text>
                                    </TouchableOpacity>

                                }
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
                                <TextInput
                                    style={MainStyles.TInput}
                                    placeholder="Postal / Zipcode"
                                    returnKeyType={"go"}
                                    ref={(input) => { this.pz = input; }}
                                    blurOnSubmit={false}
                                    keyboardType="number-pad"
                                    maxLength={4}
                                    onChangeText={(text) => this.setState({ pz: text })}
                                    placeholderTextColor="#bebebe"
                                    underlineColorAndroid="transparent"
                                    value={this.state.pz}
                                />
                                <View style={{ paddingHorizontal: 5 }}></View>
                                {
                                    Platform.OS == 'android' &&
                                    <View style={[MainStyles.TInput, { paddingLeft: 0, paddingVertical: 0 }]}>
                                        <Picker
                                            selectedValue={this.state.country}
                                            style={{
                                                flex: 1,
                                                paddingLeft: 10,
                                                paddingVertical: 2,
                                                height: 30,
                                            }}
                                            textStyle={{ fontSize: 14, fontFamily: 'AvenirLTStd-Medium' }}
                                            itemTextStyle={{ fontSize: 14, fontFamily: 'AvenirLTStd-Medium' }}
                                            itemStyle={MainStyles.TInput}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ country: itemValue })}>
                                            {
                                                this.state.CountryList.map(item => {
                                                    return (
                                                        <Picker.Item key={'key-' + item} label={item} value={item} />
                                                    )
                                                })
                                            }
                                        </Picker>
                                    </View>
                                }
                                {
                                    Platform.OS == 'ios' &&
                                    <TouchableOpacity style={[MainStyles.TInput, { alignItems: 'center' }]} onPress={() => { this.pickerIos() }}>
                                        <Text style={{ color: '#03163a', fontFamily: 'Roboto-Light', fontSize: 18 }}>{this.state.country}</Text>
                                    </TouchableOpacity>

                                }
                            </View>
                            {/* Address Ends */}
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 26
                            }}>
                                <TouchableOpacity style={[MainStyles.psosBtn, MainStyles.psosBtnSm]} onPress={() => {
                                    this.signUpStep1();

                                }}>
                                    <Text style={MainStyles.psosBtnText}>Continue</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 20 }}></View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                }
                {
                    this.state.form2 == true &&
                    <KeyboardAvoidingView style={{ flex: 1, }} enabled behavior={behavior}>
                        <ScrollView style={{ paddingHorizontal: 15, height: RemoveHiehgt }} keyboardShouldPersistTaps="always">
                            <View style={{ paddingVertical: 20, }}>
                                <Text style={{ fontFamily: 'AvenirLTStd-Heavy', color: '#151515', fontSize: 16 }}>Locum Registration Form</Text>
                                <Text style={{ marginTop: 5, fontFamily: 'AvenirLTStd-Medium', color: '#676767', fontSize: 13, marginBottom: 5, }}>
                                    To register and benefit from becoming a Pharmacy SOS locum, please use this form to register.
                                </Text>
                            </View>
                            {/* Locum Registration Heading Ends */}
                            <Image source={require('../assets/dashed-border.png')} width={'100%'} height={2} />
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 18, flexDirection: 'row' }}>
                                <View style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#959595', borderRadius: 10 }}>
                                    <Text style={{ fontFamily: 'AvenirLTStd-Medium', color: '#FFFFFF', fontSize: 12 }}>Contact Details</Text>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Image source={require('../assets/dashed-b-s.png')} width={100} style={{ width: 50 }} />
                                </View>
                                <View style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#1476c0', borderRadius: 10 }}>
                                    <Text style={{ fontFamily: 'AvenirLTStd-Medium', color: '#FFFFFF', fontSize: 12, }}>Professional Details</Text>
                                </View>
                            </View>
                            <Image source={require('../assets/dashed-border.png')} width={'100%'} height={2} />
                            {/* BreadCrumbs Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <View>
                                    <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 13 }}>
                                        Please upload your resume
                                        <Text style={{ color: '#ee1b24' }}>*</Text>
                                    </Text>
                                    <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Light', fontSize: 11, marginTop: 4 }}>Supported Files: .pdf, .docx, .doc</Text>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}></View>
                                <TouchableOpacity style={[MainStyles.selectFilesBtn, { flexWrap: 'wrap' }]} onPress={() => { this.chooseDoc() }}>
                                    <Text style={{ flex: 1, color: '#FFFFFF', flexWrap: 'wrap' }}>{(this.state.resumFileName != '') ? this.state.resumFileName : 'Select File'}</Text>
                                </TouchableOpacity>
                            </View>
                            {/* Resume Field Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 13 }}>
                                    Professional Portrait image
                                    <Text style={{ color: '#ee1b24' }}>*</Text>
                                </Text>
                                <View style={{ paddingHorizontal: 10 }}></View>
                                <TouchableOpacity style={MainStyles.selectFilesBtn} onPress={() => { this.pickFile() }}>
                                    <Text style={{ color: '#FFFFFF' }}>{(this.state.profilePicName != '') ? this.state.profilePicName : 'Select File'}</Text>
                                </TouchableOpacity>
                            </View>
                            {/* Picture Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 13, width: '40%' }}>
                                    Date of Birth
                                    <Text style={{ color: '#ee1b24' }}>*</Text>
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '60%' }}>
                                    <TextInput
                                        style={MainStyles.TInput}
                                        placeholder="DD"
                                        returnKeyType={"next"}
                                        ref={(input) => { this.dd = input; }}
                                        onSubmitEditing={() => { this.mm.focus(); }}
                                        blurOnSubmit={false}
                                        onChangeText={(text) => this.setState({ dd: text })}
                                        placeholderTextColor="#bebebe"
                                        underlineColorAndroid="transparent"
                                        value={this.state.dd}
                                        maxLength={2}
                                        keyboardType="number-pad"
                                    />
                                    <View style={{ paddingHorizontal: 4 }}></View>
                                    <TextInput
                                        style={MainStyles.TInput}
                                        placeholder="MM"
                                        returnKeyType={"next"}
                                        ref={(input) => { this.mm = input; }}
                                        onSubmitEditing={() => { this.yy.focus(); }}
                                        blurOnSubmit={false}
                                        onChangeText={(text) => this.setState({ mm: text })}
                                        placeholderTextColor="#bebebe"
                                        underlineColorAndroid="transparent"
                                        value={this.state.mm}
                                        maxLength={2}
                                        keyboardType="number-pad"
                                    />
                                    <View style={{ paddingHorizontal: 4 }}></View>
                                    <TextInput
                                        style={MainStyles.TInput}
                                        placeholder="YYYY"
                                        returnKeyType={"next"}
                                        ref={(input) => { this.yy = input; }}
                                        onSubmitEditing={() => { this.ahprano.focus(); }}
                                        blurOnSubmit={false}
                                        maxLength={4}
                                        onChangeText={(text) => this.setState({ yy: text })}
                                        placeholderTextColor="#bebebe"
                                        underlineColorAndroid="transparent"
                                        value={this.state.yy}
                                        keyboardType="number-pad"
                                    />
                                    <View style={{ paddingLeft: 4, alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={this.showDatePicker}>
                                            <Image source={require('../assets/calendar-icon.png')} style={{ width: 20, height: 20 }} />
                                        </TouchableOpacity>
                                        <DateTimePicker
                                            isVisible={this.state.isDatePickerVisible}
                                            onConfirm={this.handleDatePicked}
                                            onCancel={this.hideDatePicker}
                                            maximumDate={this.state.todayDate}
                                            date={this.state.todayDate}
                                        />
                                    </View>
                                </View>
                            </View>
                            {/* DOB Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 13 }}>
                                    Your AHPRA Registration number
                                    <Text style={{ color: '#ee1b24' }}>*</Text>
                                </Text>
                                <View style={{ paddingHorizontal: 10 }}></View>
                                <TextInput
                                    style={MainStyles.TInput}
                                    returnKeyType={"next"}
                                    ref={(input) => { this.ahprano = input; }}
                                    onSubmitEditing={() => { this.js_reg.focus(); }}
                                    blurOnSubmit={false}
                                    maxLength={10}
                                    onChangeText={(text) => this.setState({ ahprano: text })}
                                    placeholderTextColor="#bebebe"
                                    underlineColorAndroid="transparent"
                                    value={this.state.ahprano}
                                />
                            </View>
                            {/* AHPRA Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 13 }}>
                                    Initial year of registration in Australia
                                    <Text style={{ color: '#ee1b24' }}>*</Text>
                                </Text>
                                <View style={{ paddingHorizontal: 10 }}></View>
                                <TextInput
                                    style={MainStyles.TInput}
                                    returnKeyType={"go"}
                                    ref={(input) => { this.js_reg = input; }}
                                    blurOnSubmit={false}
                                    keyboardType={"phone-pad"}
                                    maxLength={4}
                                    onChangeText={(text) => this.setState({ js_reg: text })}
                                    placeholderTextColor="#bebebe"
                                    underlineColorAndroid="transparent"
                                    value={this.state.js_reg}
                                />
                            </View>
                            {/* Initial Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 13, flexWrap: 'wrap', width: '60%' }}>
                                    Have any restrictions been imposed on your registration?
                                    <Text style={{ color: '#ee1b24' }}>*</Text>
                                </Text>
                                <View style={{ paddingHorizontal: 10 }}></View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 10 }}>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={() => { this.setState({ js_restrict: 'Yes' }); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_restrict == 'Yes' && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper, { marginLeft: 10 }]} onPress={() => { this.setState({ js_restrict: 'No' }); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_restrict == 'No' && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {
                                this.state.js_restrict == 'Yes' &&
                                <View style={{ justifyContent: 'flex-start', width: '100%', marginTop: 10 }}>
                                    <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 13 }}>
                                        Please describe the restrictions so we can better assess your needs
                                    </Text>
                                    <View style={{ marginTop: 10 }}></View>
                                    <TextInput
                                        style={[MainStyles.TInput, { height: 80 }]}
                                        ref={(input) => { this.des_restrict = input; }}
                                        blurOnSubmit={false}
                                        multiline={true}
                                        onChangeText={(text) => this.setState({ des_restrict: text })}
                                        placeholderTextColor="#bebebe"
                                        underlineColorAndroid="transparent"
                                        value={this.state.des_restrict}
                                    />
                                </View>
                            }
                            {/* Restriction Ends */}
                            <View style={{ flexDirection: 'column', marginTop: 15 }}>
                                <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 13, flexWrap: 'wrap' }}>
                                    Which dispensing software are you familiar with:
                                    <Text style={{ color: '#ee1b24' }}>*</Text>
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 10 }}>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={() => { this.checkSoftware('WiniFRED'); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_software.indexOf('WiniFRED') !== -1 && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>WiniFRED</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={() => { this.checkSoftware('FredNXT'); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_software.indexOf('FredNXT') !== -1 && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>FredNXT</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={() => { this.checkSoftware('LOTS'); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_software.indexOf('LOTS') !== -1 && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>LOTS</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={() => { this.checkSoftware('Simple'); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_software.indexOf('Simple') !== -1 && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>Simple</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 10 }}>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={() => { this.checkSoftware('MINFOS'); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_software.indexOf('MINFOS') !== -1 && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>MINFOS</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={() => { this.checkSoftware('Merlin'); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_software.indexOf('Merlin') !== -1 && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>Merlin</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={() => { this.checkSoftware('Quickscript'); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_software.indexOf('Quickscript') !== -1 && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>Quickscript</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={() => { this.checkSoftware('Other'); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_software.indexOf('Other') !== -1 && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>Other</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* Fimiliar Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <View style={{ flexDirection: 'column', marginTop: 15 }}>
                                <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 13, flexWrap: 'wrap' }}>
                                    Are you accredited to administer Vaccinations?
                                    <Text style={{ color: '#ee1b24' }}> *</Text>
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: 10 }}>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={() => { this.setState({ js_admin_vaccin: 'Yes' }); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_admin_vaccin == 'Yes' && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper, { alignItems: 'flex-start', marginLeft: 40 }]} onPress={() => { this.setState({ js_admin_vaccin: 'No' }); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_admin_vaccin == 'No' && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* Pharmacotherapy Ends */}
                            <View style={{ marginTop: 15 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 13, flexWrap: 'wrap', width: '60%' }}>
                                    I am comfortable with administering pharmacotherapy
                                    <Text style={{ color: '#ee1b24' }}>*</Text>
                                </Text>
                                <View style={{ paddingHorizontal: 10 }}></View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 10 }}>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={() => { this.setState({ js_comfort: 'Yes' }); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_comfort == 'Yes' && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper, { marginLeft: 10 }]} onPress={() => { this.setState({ js_comfort: 'No' }); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_comfort == 'No' && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* Comfortable Ends */}
                            <View style={{ marginTop: 10 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: '#151515', fontFamily: 'AvenirLTStd-Medium', fontSize: 13, flexWrap: 'wrap', width: '60%' }}>
                                    I am accredited for medication review services
                                    <Text style={{ color: '#ee1b24' }}>*</Text>
                                </Text>
                                <View style={{ paddingHorizontal: 10 }}></View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 10 }}>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper]} onPress={() => { this.setState({ js_medi_review: 'Yes' }); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_medi_review == 'Yes' && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[MainStyles.checkBoxWrapper, { marginLeft: 10 }]} onPress={() => { this.setState({ js_medi_review: 'No' }); }}>
                                        <View style={[MainStyles.checkBoxStyle]}>
                                            {this.state.js_medi_review == 'No' && <View style={MainStyles.checkBoxCheckedStyle}></View>}
                                        </View>
                                        <Text style={[MainStyles.checkBoxLabel]}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* Accredited Ends */}
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 26 }}>
                                <TouchableOpacity style={[MainStyles.psosBtn, MainStyles.psosBtnSm]} onPress={() => {
                                    if (typeof (this.state.resumFile) == 'undefined') {
                                        Toast.show('Please select your resume', Toast.SHORT);
                                        return false;
                                    }
                                    if (typeof (this.state.fileData) == 'undefined') {
                                        Toast.show('Please select your profile picture', Toast.SHORT);
                                        return false;
                                    }
                                    if ((typeof (this.state.dd) == 'undefined' || typeof (this.state.mm) == 'undefined' || typeof (this.state.yy) == 'undefined') || (this.state.dd == '' || this.state.mm == '' || this.state.yy == '')) {
                                        Toast.show('Please select your birth date', Toast.SHORT);
                                        return false;
                                    }
                                    if (typeof (this.state.ahprano) == 'undefined' || this.state.ahprano == '') {
                                        Toast.show('Please enter your AHPRA number', Toast.SHORT);
                                        return false;
                                    }
                                    if (typeof (this.state.ahprano) == 'undefined' || this.state.ahprano.length < 10) {
                                        Toast.show('AHPRA number should be 10 digits long', Toast.SHORT);
                                        return false;
                                    }
                                    if (typeof (this.state.js_reg) == 'undefined' || this.state.js_reg == '') {
                                        Toast.show('Please enter your intial registration', Toast.SHORT);
                                        return false;
                                    }
                                    var todayYear = new Date();
                                    if (this.state.js_reg >= todayYear.getFullYear()) {
                                        Toast.show('Initial year should be less than current year', Toast.SHORT);
                                        return false;
                                    }
                                    Keyboard.dismiss();
                                    this.setState({ showTerms: true });
                                }}>
                                    <Text style={MainStyles.psosBtnText}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginTop: 5 }} onPress={() => {
                                    // if(typeof(this.state.resumFile) == 'undefined'){
                                    //     Toast.show('Please select your resume',Toast.SHORT);
                                    //     return false;
                                    // }
                                    // if(typeof(this.state.fileData) == 'undefined'){
                                    //     Toast.show('Please select your profile picture',Toast.SHORT);
                                    //     return false;
                                    // }
                                    // if((typeof(this.state.dd) == 'undefined' || typeof(this.state.mm) == 'undefined' || typeof(this.state.yy) == 'undefined') ||(this.state.dd == '' || this.state.mm == '' || this.state.yy == '')){
                                    //     Toast.show('Please select your birth date',Toast.SHORT);
                                    //     return false;
                                    // }
                                    // if(typeof(this.state.ahprano) == 'undefined' || this.state.ahprano == ''){
                                    //     Toast.show('Please enter your AHPRA number',Toast.SHORT);
                                    //     return false;
                                    // }
                                    // if(typeof(this.state.js_reg) == 'undefined' || this.state.js_reg == ''){
                                    //     Toast.show('Please enter your intial registration',Toast.SHORT);
                                    //     return false;
                                    // }
                                    this.setState({ form2: false });
                                }}>
                                    <Text style={{ color: '#1476c0', textDecorationLine: 'underline', textDecorationColor: '#1476c0', textDecorationStyle: 'solid' }}>Previous</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 20 }}></View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                }
                <Dialog
                    visible={this.state.showTerms}
                    dialogStyle={{ width: "95%", padding: 0, maxHeight: "90%", marginTop: 43, flex: 1, backgroundColor: 'transparent' }}
                    dialogAnimation={new SlideAnimation()}
                    containerStyle={{
                        zIndex: 100000,
                        flex: 1,
                        justifyContent: "space-between",
                        backgroundColor: 'transparent',
                    }}
                    rounded={false}
                >
                    <SafeAreaView style={{ flex: 1, width: '100%', height: '90%', padding: 0, borderWidth: 0, overflow: 'visible', backgroundColor: '#FFFFFF', margin: 0 }}>
                        <View style={MainStyles.modalHeader}>
                            <Text style={MainStyles.modalHeaderHeading}>Terms and Conditions</Text>
                            <TouchableOpacity onPress={() => { this.setState({ showTerms: false }) }}>
                                <Image source={require('../assets/cross-icon.png')} width={21} height={21} style={{ height: 21, width: 21 }} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#FFFFFF' }}>
                            <Text style={{ fontFamily: 'AvenirLTStd-Medium', color: '#1476c0', fontSize: 15 }}>
                                Our Terms and Conditions
                                </Text>
                            <View style={MainStyles.tacItems}>
                                <Text style={MainStyles.tacItemsH}>{this.state.page_text}</Text>
                                <Image source={require('../assets/bd-tc.png')} width={'100%'} style={MainStyles.tacItemsImage} />
                            </View>
                        </ScrollView>
                        <View style={MainStyles.modalFooter}>
                            <TouchableOpacity style={[MainStyles.psosBtn, MainStyles.psosBtnXm]} onPress={() => {
                                this.registerLocum();
                            }}>
                                <Text style={[MainStyles.psosBtnText, MainStyles.psosBtnXsText]}>I Agree</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Dialog>
                <Dialog
                    visible={this.state.otpVisible}
                    dialogStyle={{ width: "95%", padding: 0, maxHeight: "95%", marginTop: 30, flex: 1, backgroundColor: 'transparent' }}
                    dialogAnimation={new SlideAnimation()}
                    containerStyle={{
                        zIndex: 10,
                        flex: 1,
                        justifyContent: "space-between",
                        backgroundColor: 'transparent',
                    }}
                    rounded={false}
                >
                    <SafeAreaView style={{ flex: 1, width: '100%', height: '95%', padding: 0, borderWidth: 0, overflow: 'visible' }}>
                        <View style={MainStyles.modalHeader} >
                            <Text style={MainStyles.modalHeaderHeading}>Enter OTP</Text>
                        </View>
                        <KeyboardAvoidingView enabled behavior={behavior}>
                            <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#FFFFFF' }}>
                                <TextInput
                                    style={MainStyles.TInput}
                                    placeholder="OTP"
                                    returnKeyType={"go"}
                                    ref={(input) => { this.otp = input; }}
                                    onBlur={() => { Keyboard.dismiss() }}
                                    blurOnSubmit={false}
                                    keyboardType="number-pad"
                                    onChangeText={(text) => this.setState({ otp: text })}
                                    placeholderTextColor="#bebebe"
                                    underlineColorAndroid="transparent"
                                    value={this.state.otp}
                                />
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 26 }}>
                                    <TouchableOpacity style={[MainStyles.psosBtn, MainStyles.psosBtnSm]} onPress={() => { this.checkOtp(); }}>
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
export default LocumReg1Screen;