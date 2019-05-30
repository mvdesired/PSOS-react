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
            locumData:{fname:'',lname:''},
            isRefreshing:false,
            job_id:this.props.navigation.getParam("job_id"),
            job_type:this.props.navigation.getParam("job_type"),
            locum_id:this.props.navigation.getParam("locum_id"),
            applied:this.props.navigation.getParam("applied"),
        }
        this.fetchLocumDetails = this._fetchLocumDetails.bind(this);
    }
    componentDidMount = ()=>{
        this.setUserData();
        this.fetchLocumDetails();
    }
    _fetchLocumDetails = ()=>{
        fetch(SERVER_URL+'locum_detail?locum_id='+this.state.locum_id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>res.json())
        .then(response=>{
            console.log(response);
            if(response.status == 200){
                this.setState({locumData:response.result});
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
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    hireThis = ()=>{
        var fd = new FormData();
        fd.append('job_id',this.state.job_id);
        fd.append('type',(this.state.job_type == 'shift')?'locum_shift':'permanent');
        fd.append('locum_id',this.state.locum_id);
        fd.append('employer_id',this.state.userData.id);
        fetch(SERVER_URL+'hire_locum',{
            method:'POST',
            headers:myHeaders,
            body:fd
        })
        .then(res=>res.json())
        .then(response=>{
            Toast.show(response.message,Toast.SHORT);
            if(response.status == 200){
                this.props.navigation.navigate('ChatScreen',{chat_id:response.result});
            }
        })
        .catch(err=>{
            console.log(err);
        });
    }
    render(){
        const RemoveHiehgt = height - 50;
        console.log(this.state.locumData.user_img);
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Locum Detail" />
                <ScrollView style={{paddingHorizontal:15,height:RemoveHiehgt,flex:1}} keyboardShouldPersistTaps="always">
                    <View style={{justifyContent:'center',alignItems:'center',marginVertical: 15}}>
                        {
                            this.state.locumData.user_img && 
                            <View style={{width:100,height:100,justifyContent:'flex-start',alignItems:'center',overflow:'hidden',borderRadius: 100,marginBottom: 10,}}> 
                                <Image source={{uri:this.state.locumData.user_img}} width={100} height={100} style={{width:100,height:100}} />
                            </View>
                        }
                        <Text style={{fontFamily:'AvenirLTStd-Meduim',color:'#151515',fontSize:17}}>{this.state.locumData.fname+' '+this.state.locumData.lname}</Text>
                    </View>
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>Date of Birth</Text>
                        <Text style={MainStyles.LPISubHeading}>{this.state.locumData.js_dob}</Text>
                    </View>
                    {/* Languga */}
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>AHPRA Number</Text>
                        <Text style={MainStyles.LPISubHeading}>{this.state.locumData.js_ahpra}</Text>
                    </View>
                    {/* Languga */}
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>Dispensing Systems Used</Text>
                        <Text style={MainStyles.LPISubHeading}>{this.state.locumData.js_software}</Text>
                    </View>
                    {/* Languga */}
                    {
                        this.state.applied == 0 && 
                        <View style={{justifyContent:'center',alignItems:'center',marginTop: 10,marginBottom:15}}>
                            <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                                this.hireThis();
                            }}>
                                <Text style={MainStyles.psosBtnText}>Hire</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </ScrollView>
            </SafeAreaView>
        );
    }
}
export default LocumDetails;