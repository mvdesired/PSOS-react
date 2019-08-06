import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,RefreshControl,ImageBackground,AsyncStorage,Linking,
    ActionSheetIOS,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions,NavigationActions } from 'react-navigation';
import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import { FlatList } from 'react-native-gesture-handler';
import Header from '../Navigation/Header';
const { height, width } = Dimensions.get('window');
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class LocumDetails extends Component{
    constructor(props) {
        super(props);
        this.state={
            loading:true,
            jobData:{},
            isRefreshing:false,
            job_id:this.props.navigation.getParam("job_id"),
            job_type:this.props.navigation.getParam("job_type"),
            is_end:this.props.navigation.getParam("is_end"),
            is_cancelled:this.props.navigation.getParam("is_cancelled"),
            is_hired:this.props.navigation.getParam("is_hired"),
            
        }
        this.fetchLocumDetails = this._fetchLocumDetails.bind(this);
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    componentDidMount = ()=>{
        this.setUserData();
        this.props.navigation.addListener("didFocus", this.fetchLocumDetails);
    }
    _fetchLocumDetails = ()=>{
        var fetchData = 'permanent_detail';
        if(this.state.job_type == 'shift'){
            fetchData = 'locum_shift_detail';
        }
        fetch(SERVER_URL+fetchData+'?job_id='+this.state.job_id+'&user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>{console.log(res);return res.json()})
        .then(response=>{
            console.log(response);
            if(response.status == 200){
                var RR = response.result;
                this.setState({jobData:RR,is_end:RR.is_end,is_cancelled:RR.is_cancelled,applied:RR.applied,is_hired:RR.hired});
            }
            else{
                Toast.show(response.message,Toast.SHORT);
            }
            this.setState({loading:false});
        })
        .catch(err=>{
            console.log(err);
            this.setState({loading:false});
        });
    }
    applyForJob = ()=>{
        this.setState({loading:true});
        var type = (this.state.job_type == 'shift')?'locum_shift':'permanent';
        var jsonArray = {
            type:type,
            job_id:this.state.job_id,
            locum_id:this.state.userData.id
        }
        var fd = new FormData();
        fd.append('type',type);
        fd.append('job_id',this.state.job_id);
        fd.append('locum_id',this.state.userData.id);
        fd.append('employer_id',this.state.jobData.employer_id);
        fetch(SERVER_URL+'apply_job',{
            method:'POST',
            headers: myHeaders,
            body: fd//JSON.stringify(jsonArray)
        })
        .then((res)=>{console.log(res);return res.json()})
        .then(response=>{
            console.log(response);
            this.setState({loading:false});
            setTimeout(()=>{
                Toast.show(""+response.message,Toast.SHORT);
            },200)
            if(response.status == 200){
                this.props.navigation.navigate('SuccessApply');
            }
        })
        .catch(err=>{
            this.setState({loading:false});
        });
    }
    gotPharmacy = (address)=>{
        var url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&destination="+address;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err)); 
    }
    render(){
        const RemoveHiehgt = height - 95;
        applied = this.state.applied;//this.props.navigation.getParam('applied');
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Jobs Description" />
                {
                    this.state.job_type == 'shift' && 
                    <ScrollView style={{paddingHorizontal:15,minHeight:RemoveHiehgt,flex:1,backgroundColor:'#FFFFFF'}} contentContainerStyle={{paddingBottom:15}} keyboardShouldPersistTaps="always">
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Job Title</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.name}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Job Type</Text>
                            <Text style={MainStyles.LPISubHeading}>Locum Shift</Text>
                        </View>
                        {/* Languga */}
                        {
                            applied == true && this.state.is_hired == 1 && 
                            <View style={MainStyles.locumProfileItemWrapper}>
                                <Text style={MainStyles.LPIHeading}>Pharmacy Name</Text>
                                <Text style={MainStyles.LPISubHeading}>{this.state.jobData.P_name}</Text>
                            </View>
                        }
                        {/* Languga */}
                        {
                            applied == true && this.state.is_hired == 1 && 
                            <View style={MainStyles.locumProfileItemWrapper}>
                                <Text style={MainStyles.LPIHeading}>Pharmacy Address</Text>
                                <Text style={MainStyles.LPISubHeading}>{this.state.jobData.address}, {this.state.jobData.city} {this.state.jobData.state}, {this.state.jobData.postal} {this.state.jobData.country}, {this.state.jobData.phone_code} {this.state.jobData.phone}</Text>
                                <View style={{flexDirection:'row'}}>
                                    <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnXm,{width:70,marginTop:10,justifyContent:'center',alignItems:'center'}]} onPress={()=>{
                                        this.gotPharmacy(this.state.jobData.address+', '+this.state.jobData.city+' '+this.state.jobData.state+', '+this.state.jobData.postal+' '+this.state.jobData.country);
                                        }}>
                                        <Text style={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]}>Go</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnXm,{width:70,marginLeft:10,marginTop:10,justifyContent:'center',alignItems:'center'}]} onPress={()=>{
                                        Linking.openURL(`tel:${this.state.jobData.phone_code+''+this.state.jobData.phone}`)
                                        }}>
                                        <Text style={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]}>Call</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        {
                            this.state.is_hired == 0 && 
                            <View style={MainStyles.locumProfileItemWrapper}>
                                <Text style={MainStyles.LPIHeading}>Pharmacy Address</Text>
                                <Text style={MainStyles.LPISubHeading}>{this.state.jobData.city}</Text>
                            </View>
                        }
                        {/* Pharmacy Address */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Shift Start</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.start_date} {this.state.jobData.start_time}</Text>
                        </View>
                        {/* Languga */}
                        {/* <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Shift End</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.end_date} {this.state.jobData.end_time}</Text>
                        </View> */}
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Shift Detail</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.detail}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Travel &amp; Accommodation</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.travel}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Dispensing Systems Required</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.dispense}</Text>
                        </View>
                        {/* Languga */}
                        {/* {
                            (this.state.is_end == 1  && this.state.is_cancelled == 0) && 
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:10,backgroundColor:'#bf9161',paddingVertical:20,borderRadius:15}}>
                                <Text style={{color:'#FFFFFF',fontFamily:'AvenirLTStd-Medium',fontSize:20}}>END</Text>
                            </View>
                        } */}
                        {
                            this.state.is_cancelled == 1 && 
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:10}}>
                                <Text style={{color:'#bf6161',fontFamily:'AvenirLTStd-Medium',fontSize:20}}>CANCELLED</Text>
                            </View>
                        }
                        {
                            applied == true && this.state.is_hired == 0 && 
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:10}}>
                                <Text style={{color:'#61bf6f',fontFamily:'AvenirLTStd-Medium',fontSize:20}}>APPLIED</Text>
                            </View>
                        }
                        {
                            applied == true && this.state.is_hired == 1 && 
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:10,flexDirection:'row'}}>
                                <Text style={{color:'#61bf6f',fontFamily:'AvenirLTStd-Medium',fontSize:20}}>Hired</Text>
                                {
                                    this.state.jobData.chat_id > 0 && 
                                    <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm,{marginLeft:20}]} onPress={()=>{
                                        this.props.navigation.navigate('ChatScreen',{chat_id:this.state.jobData.chat_id});
                                    }}>
                                        <Icon name="comments" style={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]} />
                                    </TouchableOpacity>
                                }
                            </View>
                        }
                        { //&& this.state.is_end == 0
                            applied == false  && this.state.is_cancelled == 0 && this.state.is_hired == 0 && 
                            <View style={{justifyContent:'center',alignItems:'center',marginTop: 10,marginBottom:15}}>
                                <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                                    this.applyForJob();
                                }}>
                                    <Text style={MainStyles.psosBtnText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </ScrollView>
                }
                {
                    this.state.job_type == 'perm' && 
                    <ScrollView style={{paddingHorizontal:15,minHeight:RemoveHiehgt,flex:1,backgroundColor:'#FFFFFF'}} contentContainerStyle={{paddingBottom:15}} keyboardShouldPersistTaps="always">
                        {
                            applied == true && this.state.is_hired == 1 && 
                            <View style={MainStyles.locumProfileItemWrapper}>
                                <Text style={MainStyles.LPIHeading}>Pharmacy Name</Text>
                                <Text style={MainStyles.LPISubHeading}>{this.state.jobData.pharmacy_name}</Text>
                            </View>
                        }
                        {/* Languga */}
                        {
                            applied == true && this.state.is_hired == 1 && 
                            <View>
                                <View style={MainStyles.locumProfileItemWrapper}>
                                    <Text style={MainStyles.LPIHeading}>Pharmacy Address</Text>
                                    <Text style={MainStyles.LPISubHeading}>{this.state.jobData.address}, {this.state.jobData.city} {this.state.jobData.state}, {this.state.jobData.postal} {this.state.jobData.country}</Text>
                                </View>
                                {/* Pharmacy Address */}
                            </View>
                        }
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Type of Pharmacy</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.pharmacy_type}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Role</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.roles}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>About Role</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.abt_role}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Shift Details</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.detail}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Pay Rate</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.rate_hour}/hr &amp; {this.state.jobData.rate_annum}/yr</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Benefits</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.benefits}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Dispensing System</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.dispense}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Pharmacy Offers Pharmacotherapy</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.offer}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Travel and Accommodation (non-metro)</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.travel}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Position Required</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.position_name}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Position Type</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.position_type}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Is there a dispensary technician?</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.technician}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Approx. Scripts Per Day</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.scripts}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Webster Packs or similar</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.webster}</Text>
                        </View>
                        {/* Languga */}
                        <View style={MainStyles.locumProfileItemWrapper}>
                            <Text style={MainStyles.LPIHeading}>Exclusively with Pharmacy SOS</Text>
                            <Text style={MainStyles.LPISubHeading}>{this.state.jobData.listing_role}</Text>
                        </View>
                        {/* Languga */}
                        {
                            applied == true && this.state.is_hired == 0 &&
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:10}}>
                                <Text style={{color:'#61bf6f',fontFamily:'AvenirLTStd-Medium',fontSize:20}}>APPLIED</Text>
                            </View>
                        }
                        {
                            applied == true && this.state.is_hired == 1 && 
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:10,flexDirection:'row'}}>
                                <Text style={{color:'#61bf6f',fontFamily:'AvenirLTStd-Medium',fontSize:20}}>Hired</Text>
                                {
                                    this.state.jobData.chat_id > 0 && 
                                    <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm,{marginLeft:20}]} onPress={()=>{
                                        this.props.navigation.navigate('ChatScreen',{chat_id:this.state.jobData.chat_id});
                                    }}>
                                        <Icon name="comments" style={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]} />
                                    </TouchableOpacity>
                                }
                            </View>
                        }
                        {
                            applied == false && 
                            <View style={{justifyContent:'center',alignItems:'center',marginTop: 10,marginBottom:15}}>
                                <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnXm]} onPress={()=>{
                                    this.applyForJob();
                                }}>
                                    <Text style={MainStyles.psosBtnText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        
                    </ScrollView>
                }
            </SafeAreaView>
        );
    }
}
export default LocumDetails;