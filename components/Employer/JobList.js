import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,RefreshControl,AsyncStorage,ActionSheetIOS,Modal,StyleSheet,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions,NavigationActions,withNavigation } from 'react-navigation';
import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL,SENDER_ID } from '../../Constants';
import { FlatList } from 'react-native-gesture-handler';
const { height, width } = Dimensions.get('window');
import Header from '../Navigation/Header';
import moment from 'moment';
import Dialog, { SlideAnimation } from "react-native-popup-dialog";
import PushNotification from 'react-native-push-notification';
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class JobList extends Component{
    constructor(props) {
        super(props);
        this.state={
            loading:true,
            currentTab:'shift',
            shiftList:{},
            permList:{},
            isRefreshingPerm:false,
            isRefreshingShift:false,
            ActionModalShow:false
        }
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }
        this.fetchLocumShifts = this._fetchLocumShifts.bind(this);
        this.fetchPermShifts = this._fetchPermShifts.bind(this);
    }
    setUserData = async() => {
        await AsyncStorage.getItem('userData').then((userDataStringfy)=>{
            let userData = JSON.parse(userDataStringfy);
            this.setState({userData});
            setTimeout(()=>{
                this.fetchLocumShifts();
                this.fetchPermShifts();
            },100);
        });
    }
    componentDidMount = ()=>{
        this.goPusNotification(this.onNotification.bind(this));
        this.setUserData();
    }
    _fetchLocumShifts = ()=>{
        fetch(SERVER_URL+'locum_shift_list?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>res.json())
        .then(response=>{
            console.log(response);
            if(response.status == 200){
                this.setState({shiftList:response.result});
            }
            Toast.show(response.message,Toast.SHORT);
            this.setState({loading:false,isRefreshingShift:false});
        })
        .catch(err=>{
            Toast.show('Please check your internet connection',Toast.SHORT);
            this.setState({loading:false,isRefreshingShift:false});
        })
    }
    _fetchPermShifts = ()=>{
        fetch(SERVER_URL+'permanent_list?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>res.json())
        .then(response=>{
            if(response.status == 200){
                this.setState({permList:response.result});
            }
            Toast.show(response.message,Toast.SHORT);
            this.setState({loading:false,isRefreshingPerm:false});
        })
        .catch(err=>{
            Toast.show('Please check your internet connection',Toast.SHORT);
            this.setState({loading:false,isRefreshingPerm:false});
        })
    }
    onNotification = ()=>{
        this.fetchLocumShifts();
        this.fetchPermShifts();
    }
    goPusNotification(onNotification){
        PushNotification.configure({
            //onRegister: onToken,
            onNotification: onNotification,
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
    formatAMPM = (date) => {
        var date = new Date(date);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var dateToday = (new Date()).getTime();
        var messageDate = date.getTime();
        if(dateToday > messageDate){
            var day = (date.getDate()<10)?'0'+date.getDate():date.getDate();
            var month = (date.getMonth()+1);
            if(month < 10){
                month = '0'+month;
            }
            var fullDate = day+'/'+month+'/'+date.getFullYear();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return fullDate+' '+strTime;
        }
        else{
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }
    }
    cancelShift = ()=>{
        this.setState({loading:true});
        var fd = new FormData();
        fd.append("job_id",this.state.currentJobId);
        var cancelUrl = (this.state.currentJobType == 'perm')?'cancel_permanent':'cancel_locumshift';
        fetch(SERVER_URL+cancelUrl,{
            method:'POST',
            headers:myHeaders,
            body:fd
            // JSON.stringify({
            //     job_id:this.state.currentJobId
            // })
        })
        .then(res=>{return res.json()})
        .then(response=>{
            //console.log(response);
            Toast.show(response.message,Toast.SHORT);
            this.setState({ActionModalShow:false,});
            this._fetchLocumShifts();
            this._fetchPermShifts();
        })
        .catch(err=>{
            this.setState({loading:false});
            //console.log(err);
        })
    }
    showOptions = ()=>{
        if(Platform.OS == 'ios'){
            var travelList = ['close','Cancel Shift','Edit Shift','View Shift/Applicants'];
            if(this.state.currentJobType == 'perm'){
                travelList = ['close','Edit Shift','View Shift/Applicants'];
                ActionSheetIOS.showActionSheetWithOptions(
                    {
                    options: travelList,
                    destructiveButtonIndex: 1,
                    cancelButtonIndex: 0,
                    },
                    (buttonIndex) => {
                    if (buttonIndex === 1) {
                        /* destructive action */
                        if(this.state.currentJobType =='perm'){
                            this.props.navigation.navigate('NPSForm',{job_id:this.state.currentJobId});
                        }
                        else{
                            this.props.navigation.navigate('NLSForm',{job_id:this.state.currentJobId});
                        }
                    }
                    else if(buttonIndex == 3){
                        this.props.navigation.navigate('LocumList',{job_type:this.state.currentJobType,job_id:this.state.currentJobId,isEnd:this.state.isEnd});
                    }
                    },
                );
            }
            else{
                ActionSheetIOS.showActionSheetWithOptions(
                    {
                    options: travelList,
                    destructiveButtonIndex: 1,
                    cancelButtonIndex: 0,
                    },
                    (buttonIndex) => {
                    if (buttonIndex === 1) {
                        /* destructive action */
                        this.cancelShift();
                    }
                    else if (buttonIndex === 2) {
                        /* destructive action */
                        if(this.state.currentJobType =='perm'){
                            this.props.navigation.navigate('NPSForm',{job_id:this.state.currentJobId});
                        }
                        else{
                            this.props.navigation.navigate('NLSForm',{job_id:this.state.currentJobId});
                        }
                    }
                    else if(buttonIndex == 3){
                        this.props.navigation.navigate('LocumList',{job_type:this.state.currentJobType,job_id:this.state.currentJobId,isEnd:this.state.isEnd});
                    }
                    },
                );
            }
        }
        else{
            this.setState({ActionModalShow:true});
        }
    }
    render(){
        const RemoveHiehgt = height - 88;
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Job List" />
                <View style={{backgroundColor:'#FFFFFF',flexDirection:'row',borderBottomColor: '#bebebe',borderBottomWidth: 1}}>
                    <TouchableOpacity style={[MainStyles.jobListETabsItem,(this.state.currentTab == 'shift')?MainStyles.activeJLEItem:'']} onPress={()=>{this.setState({currentTab:'shift'})}}>
                        <Text style={[MainStyles.jobListETabsItemText,(this.state.currentTab == 'shift')?MainStyles.activeJLEItemText:'']}>LOCUM SHIFTS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[MainStyles.jobListETabsItem,(this.state.currentTab == 'perm')?MainStyles.activeJLEItem:'']} onPress={()=>{this.setState({currentTab:'perm'})}}>
                        <Text style={[MainStyles.jobListETabsItemText,(this.state.currentTab == 'perm')?MainStyles.activeJLEItemText:'']}>PERMANENT POSITIONS</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.currentTab == 'shift' && 
                    <View style={{height:RemoveHiehgt}}>
                        {
                            this.state.shiftList.length > 0 && 
                            <FlatList data={this.state.shiftList} 
                                renderItem={({item}) => (
                                    <TouchableOpacity style={MainStyles.JLELoopItem} onPress={()=>{
                                        this.setState({currentJobId:item.id,currentJobType:'shift',isEnd:item.is_end,isCancelled:item.is_cancelled});
                                        this.showOptions();
                                        //this.props.navigation.navigate('LocumList',{job_type:'shift',job_id:item.id,isEnd:item.is_end});
                                    }}>
                                        <View style={{flexWrap:'wrap'}}>
                                            <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                            <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.created_on).replace(' ', 'T'))}</Text>
                                        </View>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Text style={MainStyles.JLELoopItemCount}>{item.applier}</Text>
                                            <Icon name="eye" style={MainStyles.JLELoopItemIcon}/>
                                            {
                                                item.is_filled == "1" && item.is_end == 0 && 
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Filled</Text>
                                                </View>
                                            }
                                            {
                                                item.is_filled == "1" && item.is_end == 1 && 
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Filled</Text>
                                                </View>
                                            }
                                            {
                                                item.is_filled == "0" && item.is_end == 0 && 
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Open</Text>
                                                </View>
                                            }
                                            {
                                                item.is_filled == "0" && item.is_end == 1 &&
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    <Text style={{transform: [{ rotate: "45deg" }],color:'#FF9800',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Expired</Text>
                                                </View>
                                                // <Text style={{marginLeft:5,color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:10}}>Completed</Text>
                                            }
                                            {
                                            item.is_cancelled == 1 && 
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Cancelled</Text>
                                            </View>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                    )}
                                keyExtractor={(item) => 'key-'+item.id}
                                viewabilityConfig={this.viewabilityConfig}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshingShift}
                                        onRefresh={()=>{this.setState({isRefreshingShift:true}),this.fetchLocumShifts()}}
                                        title="Pull to refresh"
                                        colors={["#1d7bc3","red", "green", "blue"]}
                                    />
                                }
                             />
                        }
                    </View>
                }
                {/* Shift Tab Content Ends */}
                {
                    this.state.currentTab == 'perm' && 
                    <View style={{height:RemoveHiehgt}}>
                        {
                            this.state.permList.length > 0 && 
                            <FlatList data={this.state.permList} 
                                renderItem={({item}) => (
                                    <TouchableOpacity style={MainStyles.JLELoopItem} onPress={()=>{
                                        var stateItem = {currentJobId:item.id,currentJobType:'perm',isEnd:0,isCancelled:item.is_cancelled};
                                        this.setState(stateItem);
                                        this.showOptions();
                                        //this.props.navigation.navigate('LocumList',{job_type:'perm',job_id:item.id,isEnd:item.is_end});
                                    }}>
                                        <View style={{flexWrap:'wrap'}}>
                                            <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                            <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.created_on).replace(' ', 'T'))}</Text>
                                        </View>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>    
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <Text style={MainStyles.JLELoopItemCount}>{item.applier}</Text>
                                                <Icon name="eye" style={MainStyles.JLELoopItemIcon}/>
                                            </View>
                                            {
                                                item.is_cancelled == 1 && 
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Cancelled</Text>
                                                </View>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                    )}
                                keyExtractor={(item) => 'key-'+item.id}
                                viewabilityConfig={this.viewabilityConfig}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshingPerm}
                                        onRefresh={()=>{this.setState({isRefreshingPerm:true}),this.fetchPermShifts()}}
                                        title="Pull to refresh"
                                        colors={["#1d7bc3","red", "green", "blue"]}
                                    />
                                }
                            />
                        }
                    </View>
                }
                {/* Shift Tab Content Ends */}
                {
                    Platform.OS == 'android' && 
                    <Dialog
                    width={220}
                    dialogStyle={{ width: "100%", padding: 0,zIndex:1000, maxHeight: "95%",flex:1,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}
                    dialogAnimation={new SlideAnimation()}
                    visible={this.state.ActionModalShow}
                    containerStyle={{
                        zIndex: 1000,
                        flex: 1,
                        justifyContent:'center',
                        alignItems:'center',
                        backgroundColor:'transparent',
                    }}
                    onTouchOutside={()=>{this.setState({ActionModalShow:false})}}
                    rounded={false}
                    >
                        <View style={{paddingHorizontal: 10,paddingBottom:40,borderRadius:15,backgroundColor:'#FFFFFF',width:230,alignItems:'center',justifyContent:'center'}}>
                            <View style={{
                                paddingVertical:20,
                            }}><Text style={{fontSize:20}}>Choose Actions</Text></View>
                            <TouchableOpacity style={styles.ModalActionsButtons} onPress={()=>{
                                this.setState({ActionModalShow:false});
                                this.props.navigation.navigate('LocumList',{job_type:this.state.currentJobType,job_id:this.state.currentJobId,isEnd:this.state.isEnd});
                                
                            }}>
                                <Text style={styles.ModalActionsButtonsText}>View Shift/Applicants</Text>
                            </TouchableOpacity>
                            {
                                (this.state.isCancelled == 0 && this.state.isEnd == 0) && 
                                <TouchableOpacity style={styles.ModalActionsButtons} onPress={()=>{
                                    this.setState({ActionModalShow:false});
                                    if(this.state.currentJobType =='perm'){
                                        this.props.navigation.navigate('NPSForm',{job_id:this.state.currentJobId});
                                    }
                                    else{
                                        this.props.navigation.navigate('NLSForm',{job_id:this.state.currentJobId});
                                    }
                                }}>
                                    <Text style={styles.ModalActionsButtonsText}>Edit Shift</Text>
                                </TouchableOpacity>
                            }
                            {
                                (this.state.isCancelled == 0 && this.state.isEnd == 0) && 
                                <TouchableOpacity style={styles.ModalActionsButtons} onPress={()=>{
                                    this.cancelShift();
                                }}>
                                    <Text style={styles.ModalActionsButtonsText}>Cancel Shift</Text>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={[styles.ModalActionsButtons,{marginTop:10}]} onPress={()=>{
                                this.setState({ActionModalShow:false});
                            }}>
                                <Text style={styles.ModalActionsButtonsText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Dialog>
                }
                <TouchableOpacity style={{
                    position:'absolute',
                    right:10,
                    bottom:20,
                    width:50,
                    height:50,
                    backgroundColor:'#1d7bc3',
                    borderRadius:35,
                    zIndex:98562,
                    justifyContent:'center',
                    alignItems:'center',
                    elevation:3,
                    shadowColor:'#1e1e1e',
                    shadowOffset:3,
                    shadowOpacity:0.7,
                    shadowRadius:3
                }} onPress={()=>{
                    if(this.state.currentTab == 'shift'){
                        this.props.navigation.navigate('NewLocumShift');
                    }
                    else {
                        this.props.navigation.navigate('NewPermShift');
                    }
                }}>
                    <Icon name="plus" style={{color:'#FFFFFF',fontSize:20,}}/>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    position:'absolute',
                    right:65,
                    bottom:20,
                    width:50,
                    height:50,
                    backgroundColor:'#1d7bc3',
                    borderRadius:35,
                    zIndex:98562,
                    justifyContent:'center',
                    alignItems:'center',
                    elevation:3,
                    shadowColor:'#1e1e1e',
                    shadowOffset:3,
                    shadowOpacity:0.7,
                    shadowRadius:3
                }} onPress={()=>{
                    this.setState({isRefreshingPerm:true,isRefreshingShift:true});
                    this.fetchLocumShifts();
                    this.fetchPermShifts();
                }}>
                    <Icon name="refresh" style={{color:'#FFFFFF',fontSize:20,}}/>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}
export default withNavigation(JobList);
const styles = StyleSheet.create({
    ModalActionsButtons:{
        padding:10,
        backgroundColor:'#147dbf',
        marginVertical:5,
        alignItems:'center',
        justifyContent:'center',
        width:200,
        borderRadius:15
    },
    ModalActionsButtonsText:{
        fontSize:17,
        color:'#FFFFFF'
    }
});