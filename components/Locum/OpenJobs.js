import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,RefreshControl,AsyncStorage,Alert,Linking,
    ActionSheetIOS,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL,SENDER_ID } from '../../Constants';
import { FlatList } from 'react-native-gesture-handler';
import Dialog, { SlideAnimation,DialogTitle,DialogButton } from 'react-native-popup-dialog';
import StarRating from 'react-native-star-rating';
import Header from '../Navigation/Header';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
const { height, width } = Dimensions.get('window');
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
            currentTab:'app-jobs',
            shiftList:{},
            permList:{},
            onlineList:{},
            isRefreshingPerm:false,
            isRefreshingShift:false,
            modalVisible:false,
            starCount: 5,
            isRefreshingOnline:false,
            isRefreshingList:false,
            jobList:{}
        }
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }
        //this.fetchLocumShifts = this._fetchLocumShifts.bind(this);
        //this.fetchPermShifts = this._fetchPermShifts.bind(this);
        this.fetchOnlineJobs = this._fetchOnlineJobs.bind(this);
        this.fetchOpenJobs = this._fetchOpenJobs.bind(this);
        this.decodeHtmlEntity = this._decodeHtmlEntity.bind(this);
    }
    _decodeHtmlEntity = (str) => {
        return str.replace(/&#(\d+);/g, function(match, dec) {
          return String.fromCharCode(dec);
        });
    };
    setUserData = async ()=>{
        await AsyncStorage.getItem('userData').then((userDataStringfy)=>{
            let userData = JSON.parse(userDataStringfy);
            this.setState({userData});
            // this.fetchLocumShifts();
            // this.fetchPermShifts();
            this.props.navigation.addListener("didFocus", this.didFocus);
        });
    }
    componentDidMount = ()=>{
        this.setUserData();
        this.goPusNotification(this.onNotification.bind(this));
    }
    didFocus = ()=>{
        //this.fetchLocumShifts();
        //this.fetchPermShifts();
        this.fetchOpenJobs();
        this.fetchOnlineJobs();
    }
    _fetchOpenJobs = ()=>{
        fetch(SERVER_URL+'open_jobs_fetch?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>{console.log(res);return res.json()})
        .then(response=>{
            console.log(response);
            if(response.status == 200){
                this.setState({jobList:response.result});
            }
            //Toast.show(response.message,Toast.SHORT);
            this.setState({loading:false,isRefreshingList:false});
        })
        .catch(err=>{
            Toast.show('Please check your internet connection',Toast.SHORT);
            this.setState({loading:false,isRefreshingList:false});
        });
    }
    _fetchLocumShifts = ()=>{
        fetch(SERVER_URL+'open_job_locum_shift?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>{return res.json()})
        .then(response=>{
            //console.log(response);
            if(response.status == 200){
                this.setState({shiftList:response.result});
            }
            //Toast.show(response.message,Toast.SHORT);
            this.setState({loading:false,isRefreshingShift:false});
        })
        .catch(err=>{
            Toast.show('Please check your internet connection',Toast.SHORT);
            this.setState({loading:false,isRefreshingShift:false});
        })
    }
    _fetchPermShifts = ()=>{
        fetch(SERVER_URL+'open_job_permanent?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>{return res.json()})
        .then(response=>{
            if(response.status == 200){
                this.setState({permList:response.result});
            }
            //Toast.show(response.message,Toast.SHORT);
            this.setState({loading:false,isRefreshingPerm:false});
        })
        .catch(err=>{
            Toast.show('Please check your internet connection',Toast.SHORT);
            this.setState({loading:false,isRefreshingPerm:false});
        })
    }
    _fetchOnlineJobs = ()=>{
        fetch('https://pharmacysos.com.au/wp-json/wp/v2/job_listing?job_listing_category=189')
        .then(res=>{return res.json()})
        .then(response=>{
            var onlineList = [];
            for(var i in response){
                var current = response[i];
                var title = this.decodeHtmlEntity(current.title.rendered);
                onlineList.push({
                    title,
                    link:current.link,
                    date:current.date,
                    id:current.id
                });
            }
            this.setState({onlineList,isRefreshingOnline:false});
        })
        .catch(err=>{
            console.log(err);
            this.setState({isRefreshingOnline:false});
        })
    }
    withdrawApplication = (job_type,job_id)=>{
        Alert.alert(
            'Withdraw Application',
            'Would you like to withdraw your application?',
            [
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
              {text: 'OK', onPress: () => {
                  this.setState({loading:true});
                  var fd = new FormData();
                  fd.append('job_type',job_type);
                  fd.append('job_id',job_id);
                  fd.append('user_id',this.state.userData.id);
                  fetch(SERVER_URL+'withdraw_application',{
                      method:'POST',
                      headers:myHeaders,
                      body:fd
                  })
                  .then(res=>{return res.json();})
                  .then(response=>{
                      this.didFocus();
                      this.setState({loading:false});
                      setTimeout(()=>{
                          Toast.show(response.message,Toast.LONG);
                      })
                  })
                  .catch(err=>{
                      //console.log(err);
                      this.setState({loading:false});
                  })
              }},
            ],
            {cancelable: true},
          );
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
    submitFeedBack = ()=>{
        this.setState({loading:true});
        var fd = new FormData();
        fd.append("job_id",this.state.job_id);
        fd.append("employer_id",this.state.emp_id);
        fd.append("locum_id",this.state.userData.id);
        fd.append("review",this.state.starCount);
        fetch(SERVER_URL+'add_employerreview',{
            method:"POST",
            header:myHeaders,
            body:fd
        })
        .then(res=>{return res.json()})
        .then(response=>{
            if(response.status == 200){
                this.props.navigation.navigate("Home");
                this.setState({modalVisible:false,loading:false});
            }
            Toast.show(response.message,Toast.SHORT);
        })
        .catch(err=>{
            this.setState({loading:false});
            //console.log(err);
        });
    }
    render(){
        const RemoveHiehgt = height - 100;
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Open Jobs" />
                <View style={{backgroundColor:'#FFFFFF',flexDirection:'row',borderBottomColor: '#bebebe',borderBottomWidth: 1}}>
                    <TouchableOpacity style={[MainStyles.jobListETabsItem,(this.state.currentTab == 'app-jobs')?MainStyles.activeJLEItem:'']} onPress={()=>{this.setState({currentTab:'app-jobs'})}}>
                        <Text style={[MainStyles.jobListETabsItemText,(this.state.currentTab == 'app-jobs')?MainStyles.activeJLEItemText:'']}>App Jobs</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={[MainStyles.jobListETabsItem,{width:'33.33333%'},(this.state.currentTab == 'perm')?MainStyles.activeJLEItem:'']} onPress={()=>{this.setState({currentTab:'perm'})}}>
                        <Text style={[MainStyles.jobListETabsItemText,{fontSize:10},(this.state.currentTab == 'perm')?MainStyles.activeJLEItemText:'']}>Permanent Positions</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={[MainStyles.jobListETabsItem,(this.state.currentTab == 'online')?{borderBottomColor:'#c31d1d',borderBottomWidth:2}:'']} onPress={()=>{this.setState({currentTab:'online'})}}>
                        <Text style={[MainStyles.jobListETabsItemText,(this.state.currentTab == 'online')?{color:'#c31d1d'}:'']}>Online Jobs</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.currentTab == 'app-jobs' && 
                            this.state.jobList.length > 0 && 
                            <FlatList data={this.state.jobList} style={{height:RemoveHiehgt,paddingBottom:10}}
                                renderItem={({item}) => (
                                    <View>
                                        {
                                            item.applied == 0 && 
                                            <TouchableOpacity style={[MainStyles.JLELoopItem]} onPress={()=>{
                                                this.props.navigation.navigate('JobDetails',{job_type:item.job_type,job_id:item.id,is_end:item.is_end,is_cancelled:item.is_cancelled,is_hired:0});
                                            }}>
                                                
                                                <View style={{flexWrap:'wrap',paddingLeft:35}}>
                                                    <View style={{fontSize:20,position:'absolute',alignItems:'center',justifyContent:'center'}}>
                                                        {
                                                            item.job_type == 'shift' && 
                                                            <Icon name="clock-o" style={{fontSize:20,color:'#c31d1d'}} />
                                                        }
                                                        {
                                                            item.job_type == 'perm' && 
                                                            <Icon name="handshake-o" style={{fontSize:20,color:'#1d7bc3'}} />
                                                        }
                                                    </View>
                                                    <Text style={MainStyles.JLELoopItemName}>{item.name} ({item.start_date})</Text>
                                                    <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.created_on).replace(' ', 'T'))}</Text>
                                                    {
                                                        item.job_type == 'shift' && 
                                                        <Text style={[{fontFamily:'AvenirLTStd-Book',fontSize:14,color:'#c31d1d',marginTop:10}]}>Locum Shift</Text>
                                                    }
                                                    {
                                                        item.job_type == 'perm' && 
                                                        <Text style={[{fontFamily:'AvenirLTStd-Book',fontSize:14,color:'#1d7bc3',marginTop:10}]}>Permanent</Text>
                                                    }
                                                </View>
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    {
                                                        // item.is_cancelled == 1 && 
                                                        // <View style={{flexDirection:'row',alignItems:'center'}}>
                                                        //     <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Cancelled</Text>
                                                        // </View>
                                                    }
                                                    {
                                                        item.isAHired == 1 && 
                                                        <View style={{flexDirection:'row',alignItems:'center',marginRight:5}}>
                                                            <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Filled</Text>
                                                        </View>
                                                    }
                                                    {
                                                        item.is_end == 1 && 
                                                        <View style={{width:15,height:15,backgroundColor:'#bf9161',borderRadius:50,marginLeft:5,marginRight:5}}></View>
                                                    }
                                                    <Image source={require('../../assets/list-fd-icon.png')} style={{width:8,height:15}}/>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                        {
                                            item.applied == 1 && item.hired == 0 &&
                                            <View style={[MainStyles.JLELoopItem]}>
                                                <View style={{flexWrap:'wrap',paddingLeft:35,flex:1}}>
                                                    <View style={{fontSize:20,position:'absolute',alignItems:'center',justifyContent:'center'}}>
                                                        {
                                                            item.job_type == 'shift' && 
                                                            <Icon name="clock-o" style={{fontSize:20,color:'#c31d1d'}} />
                                                        }
                                                        {
                                                            item.job_type == 'perm' && 
                                                            <Icon name="handshake-o" style={{fontSize:20,color:'#1d7bc3'}} />
                                                        }
                                                    </View>
                                                    <Text style={[MainStyles.JLELoopItemName]}>{item.name} ({item.start_date})</Text>
                                                    <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.created_on).replace(' ', 'T'))}</Text>
                                                    {
                                                        item.job_type == 'shift' && 
                                                        <Text style={[{fontFamily:'AvenirLTStd-Book',fontSize:14,color:'#c31d1d',marginTop:10}]}>Locum Shift</Text>
                                                    }
                                                    {
                                                        item.job_type == 'perm' && 
                                                        <Text style={[{fontFamily:'AvenirLTStd-Book',fontSize:14,color:'#1d7bc3',marginTop:10}]}>Permanent</Text>
                                                    }
                                                </View>
                                                <View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap',justifyContent:'flex-end',flex:1}}>
                                                    {
                                                        item.applied == 1 && item.hired == 0 &&
                                                        <View style={{flexDirection:'row'}}>
                                                            <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:14}}>Applied</Text>
                                                            <TouchableOpacity style={{marginLeft:8}} onPress={()=>{
                                                                this.withdrawApplication('shift',item.id);
                                                            }}>
                                                                <Icon name="trash" style={{fontSize:18,color:'#d9534f'}} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    }
                                                    {
                                                        item.applied == 1 && item.hired == 1 &&
                                                        <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:14}}>Hired</Text>
                                                    }
                                                    {
                                                        item.is_end == 1 && 
                                                        <View style={{width:15,height:15,backgroundColor:'#61bf6f',borderRadius:50,marginLeft:5,marginRight:5}}></View>
                                                    }
                                                    {
                                                        // item.is_cancelled == 1 && 
                                                        // <View style={{flexDirection:'row',alignItems:'center'}}>
                                                        //     <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Cancelled</Text>
                                                        // </View>
                                                    }
                                                    
                                                </View>
                                            </View>
                                        }
                                        {
                                            item.applied == 1 && item.hired == 1 && 
                                            <TouchableOpacity style={[MainStyles.JLELoopItem]} onPress={()=>{
                                                this.props.navigation.navigate('JobDetails',{job_type:item.job_type,job_id:item.id,is_end:item.is_end,is_cancelled:item.is_cancelled,is_hired:1,applied:1});
                                            }}>
                                                <View style={{flexWrap:'wrap',paddingLeft:35}}>
                                                    <View style={{fontSize:20,position:'absolute',alignItems:'center',justifyContent:'center'}}>
                                                        {
                                                            item.job_type == 'shift' && 
                                                            <Icon name="clock-o" style={{fontSize:20,color:'#c31d1d'}} />
                                                        }
                                                        {
                                                            item.job_type == 'perm' && 
                                                            <Icon name="handshake-o" style={{fontSize:20,color:'#1d7bc3'}} />
                                                        }
                                                    </View>
                                                    <Text style={MainStyles.JLELoopItemName}>{item.name} ({item.start_date})</Text>
                                                    <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.created_on).replace(' ', 'T'))}</Text>
                                                    {
                                                        item.job_type == 'shift' && 
                                                        <Text style={[{fontFamily:'AvenirLTStd-Book',fontSize:14,color:'#c31d1d',marginTop:10}]}>Locum Shift</Text>
                                                    }
                                                    {
                                                        item.job_type == 'perm' && 
                                                        <Text style={[{fontFamily:'AvenirLTStd-Book',fontSize:14,color:'#1d7bc3',marginTop:10}]}>Permanent</Text>
                                                    }
                                                </View>
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    {
                                                        // item.is_cancelled == 1 && 
                                                        // <View style={{flexDirection:'row',alignItems:'center'}}>
                                                        //     <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Cancelled</Text>
                                                        // </View>
                                                    }
                                                    {
                                                        item.applied == 1 && item.hired == 1 &&
                                                        <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:14,marginRight:8}}>Hired</Text>
                                                    }
                                                    {
                                                        //item.is_end == 1 && 
                                                        //<View style={{width:15,height:15,backgroundColor:'#bf9161',borderRadius:50,marginLeft:5,marginRight:5}}></View>
                                                    }
                                                    {
                                                        item.is_end == 1 && item.is_review == 0 && 
                                                        <TouchableOpacity style={{marginRight:4}} onPress={()=>{
                                                            this.setState({job_id:item.id,emp_id:item.employer_id,modalVisible:true});
                                                        }}>
                                                            <Icon name="star" style={{fontSize:20,color:'#c2c2c2'}} />
                                                        </TouchableOpacity>
                                                    }
                                                    {
                                                        item.is_end == 1 && item.is_review == 1 && 
                                                        <TouchableOpacity style={{marginRight:4}} onPress={()=>{
                                                            Toast.show("Already reviewed!",Toast.SHORT);
                                                        }}>
                                                            <Icon name="star" style={{fontSize:20,color:'#fc8c15'}} />
                                                        </TouchableOpacity>
                                                    }
                                                    <Image source={require('../../assets/list-fd-icon.png')} style={{width:8,height:15}}/>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                        
                                    </View>
                                    
                                    )}
                                keyExtractor={(item) => 'key-'+item.id}
                                viewabilityConfig={this.viewabilityConfig}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshingList}
                                        onRefresh={()=>{this.setState({isRefreshingList:true}),this.fetchOpenJobs()}}
                                        title="Pull to refresh"
                                        colors={["#1d7bc3","red", "green", "blue"]}
                                    />
                                }
                             />
                }
                {/* Shift Tab Content Ends */}
                {
                    /*this.state.currentTab == 'perm' && 
                        this.state.permList.length > 0 && 
                        <FlatList data={this.state.permList}  style={{height:RemoveHiehgt,paddingBottom:10}}
                            renderItem={({item}) => (
                                <View>
                                    {
                                        (item.applied == 0 && item.is_cancelled == 0 && item.hired == 0) && 
                                        <TouchableOpacity style={MainStyles.JLELoopItem} onPress={()=>{
                                            this.props.navigation.navigate('JobDetails',{job_type:'perm',job_id:item.id,is_cancelled:item.is_cancelled,is_hired:0,applied:0});
                                        }}>
                                            <View style={{flexWrap:'wrap'}}>
                                                <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                                <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.created_on).replace(' ', 'T'))}</Text>
                                            </View>
                                            {
                                                // item.is_cancelled == 1 && 
                                                // <View style={{flexDirection:'row',alignItems:'center'}}>
                                                //     <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Cancelled</Text>
                                                // </View>
                                            }
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <Image source={require('../../assets/list-fd-icon.png')} style={{width:8,height:15}}/>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        item.applied == 1 && item.hired == 0 &&
                                        <View style={[MainStyles.JLELoopItem,{backgroundColor:'#e6e6e6'}]}>
                                            <View style={{flexWrap:'wrap'}}>
                                                <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                                <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.created_on).replace(' ', 'T'))}</Text>
                                            </View>
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                {   
                                                    item.applied == 1 && item.hired == 1 &&
                                                    <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:12}}>Hired</Text>
                                                }
                                                {
                                                    item.applied == 1 && item.hired == 0 &&
                                                    <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Applied</Text>
                                                }
                                                {
                                                    // item.is_cancelled == 1 && 
                                                    // <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    //     <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Cancelled</Text>
                                                    // </View>
                                                }
                                            </View>
                                        </View>
                                    }
                                    {
                                        (item.applied == 1 && item.hired == 1) && 
                                        <TouchableOpacity style={MainStyles.JLELoopItem} onPress={()=>{
                                            this.props.navigation.navigate('JobDetails',{job_type:'perm',job_id:item.id,is_cancelled:item.is_cancelled,is_hired:1,applied:1});
                                        }}>
                                            <View style={{flexWrap:'wrap'}}>
                                                <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                                <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.created_on).replace(' ', 'T'))}</Text>
                                            </View>
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                {   
                                                    item.applied == 1 && item.hired == 1 &&
                                                    <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:12,marginRight:8}}>Hired</Text>
                                                }
                                                {
                                                    // item.is_cancelled == 1 && 
                                                    // <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    //     <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Cancelled</Text>
                                                    // </View>
                                                }
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    <Image source={require('../../assets/list-fd-icon.png')} style={{width:8,height:15}}/>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
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
                {/* Shift Tab Content Ends */}
                {
                    this.state.currentTab == 'online' && 
                        this.state.onlineList.length > 0 && 
                        <FlatList data={this.state.onlineList}  style={{height:RemoveHiehgt,paddingBottom:10}}
                            renderItem={({item}) => (
                                <View>
                                    <TouchableOpacity style={MainStyles.JLELoopItem} onPress={()=>{
                                        Linking.openURL(item.link);
                                    }}>
                                        <View style={{flexWrap:'wrap'}}>
                                            <Text style={MainStyles.JLELoopItemName}>{item.title}</Text>
                                            <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM(item.date)}</Text>
                                        </View>
                                        {
                                            // item.is_cancelled == 1 && 
                                            // <View style={{flexDirection:'row',alignItems:'center'}}>
                                            //     <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Cancelled</Text>
                                            // </View>
                                        }
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Image source={require('../../assets/list-fd-icon.png')} style={{width:8,height:15}}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                )}
                            keyExtractor={(item) => 'key-'+item.id}
                            viewabilityConfig={this.viewabilityConfig}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshingOnline}
                                    onRefresh={()=>{this.setState({isRefreshingOnline:true}),this.fetchOnlineJobs()}}
                                    title="Pull to refresh"
                                    colors={["#1d7bc3","red", "green", "blue"]}
                                />
                            }
                        />
                }
                {/* Shift Tab Content Ends */}
                <Dialog
                visible={this.state.modalVisible}
                width={0.85}
                dialogStyle={{padding:0,maxHeight:"75%",alignItems:'center',paddingBottom:20}}
                dialogAnimation={new SlideAnimation()}
                containerStyle={{zIndex: 10,flex:1}}
                rounded={true} 
                >
                    <DialogTitle title="Give Feedback" style={{width:'100%',backgroundColor:'#147dbf',borderRadius:0}} textStyle={{fontFamily:'AvenirLTStd-Medium',color:'#FFF',fontSize: 20,}} />
                    <View style={{marginTop: 22,width:250}}>
                        <StarRating
                            disabled={false}
                            fullStarColor="#fc8c15"
                            starSize={25}
                            containerStyle={{paddingHorizontal:15,justifyContent:'center'}}
                            starStyle={{marginHorizontal:2.5}}
                            maxStars={5}
                            rating={this.state.starCount}
                            selectedStar={(rating) => {this.setState({starCount:rating})}}
                        />
                        <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:15}}>
                            <DialogButton text="Submit" style={[{borderRadius: 35,width:20,backgroundColor:'#147dbf',height:20}]} textStyle={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]} onPress={() => {
                                this.submitFeedBack();
                            }}/>
                            <DialogButton text="Close" style={[{borderRadius: 35,width:20,backgroundColor:'#147dbf',height:20}]} textStyle={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]} onPress={() => {
                                this.setState({modalVisible:false});
                            }}/>
                        </View>
                    </View>
                </Dialog>
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
                    this.setState({isRefreshingList:true});
                    this.fetchOpenJobs();
                    this.fetchOnlineJobs();
                    //this.fetchLocumShifts();
                    //this.fetchPermShifts();
                }}>
                    <Icon name="refresh" style={{color:'#FFFFFF',fontSize:20,}}/>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}
export default JobList;