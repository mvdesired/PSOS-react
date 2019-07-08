import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,RefreshControl,AsyncStorage,
    ActionSheetIOS,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import { FlatList } from 'react-native-gesture-handler';
import Dialog, { SlideAnimation,DialogTitle,DialogButton } from 'react-native-popup-dialog';
import StarRating from 'react-native-star-rating';
import Header from '../Navigation/Header';
import moment from 'moment';
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
            currentTab:'shift',
            shiftList:{},
            permList:{},
            isRefreshingPerm:false,
            isRefreshingShift:false,
            modalVisible:false,
            starCount: 5
        }
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }
        this.fetchLocumShifts = this._fetchLocumShifts.bind(this);
        this.fetchPermShifts = this._fetchPermShifts.bind(this);
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    componentDidMount = ()=>{
        this.setUserData();
        setTimeout(()=>{
            this.fetchLocumShifts();
            this.fetchPermShifts();
        },1500);
        
    }
    _fetchLocumShifts = ()=>{
        fetch(SERVER_URL+'open_job_locum_shift?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>{console.log(res);return res.json()})
        .then(response=>{
            console.log(response);
            if(response.status == 200){
                this.setState({shiftList:response.result});
            }
            Toast.show(response.message,Toast.SHORT);
            this.setState({loading:false,isRefreshingShift:false});
        })
        .catch(err=>{
            Toast.show('Please check ou internet connection',Toast.SHORT);
            this.setState({loading:false,isRefreshingShift:false});
        })
    }
    _fetchPermShifts = ()=>{
        fetch(SERVER_URL+'open_job_permanent?user_id='+this.state.userData.id,{
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
            Toast.show('Please check ou internet connection',Toast.SHORT);
            this.setState({loading:false,isRefreshingPerm:false});
        })
    }
    formatAMPM = (date) => {
        var date = new Date(date);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var dateToday = (new Date()).getTime();
        var messageDate = date.getTime();
        if(dateToday > messageDate){
            var fullDate = date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear();
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
        .then(res=>{console.log(res);return res.json()})
        .then(response=>{
            if(response.status == 200){
                this.props.navigation.navigate("Home");
                this.setState({modalVisible:false,loading:false});
            }
            Toast.show(response.message,Toast.SHORT);
        })
        .catch(err=>{
            this.setState({loading:false});
            console.log(err);
        });
    }
    render(){
        const RemoveHiehgt = height - 100;
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Open Jobs" />
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
                            this.state.shiftList.length > 0 && 
                            <FlatList data={this.state.shiftList} style={{height:RemoveHiehgt,paddingBottom:10}}
                                renderItem={({item}) => (
                                    <View>
                                        {
                                            item.applied == 0 && 
                                            <TouchableOpacity style={MainStyles.JLELoopItem} onPress={()=>{
                                                this.props.navigation.navigate('JobDetails',{job_type:'shift',job_id:item.id,is_end:item.is_end,is_cancelled:item.is_cancelled});
                                            }}>
                                                <View style={{flexWrap:'wrap'}}>
                                                    <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                                    <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.created_on).replace(' ', 'T'))}</Text>
                                                </View>
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    {
                                                        // item.is_cancelled == 1 && 
                                                        // <View style={{flexDirection:'row',alignItems:'center'}}>
                                                        //     <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Cancelled</Text>
                                                        // </View>
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
                                            item.applied == 1 && 
                                            <View style={[MainStyles.JLELoopItem,{backgroundColor:'#e6e6e6'}]}>
                                                <View style={{flexWrap:'wrap',flex:1}}>
                                                    <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                                    <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.created_on).replace(' ', 'T'))}</Text>
                                                </View>
                                                <View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap',justifyContent:'flex-end',flex:1}}>
                                                    {
                                                        item.applied == 1 && 
                                                        <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:10}}>Applied</Text>
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
                                                    {
                                                        item.is_end == 1 && item.is_review == 0 && 
                                                        <TouchableOpacity onPress={()=>{
                                                            this.setState({job_id:item.id,emp_id:item.employer_id,modalVisible:true});
                                                        }}>
                                                            <Icon name="star" style={{fontSize:20,color:'#fc8c15'}} />
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                            </View>
                                        }
                                    </View>
                                    
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
                {/* Shift Tab Content Ends */}
                {
                    this.state.currentTab == 'perm' && 
                        this.state.permList.length > 0 && 
                        <FlatList data={this.state.permList}  style={{height:RemoveHiehgt,paddingBottom:10}}
                            renderItem={({item}) => (
                                <View>
                                    {
                                        (item.applied == 0 && item.is_cancelled == 0) && 
                                        <TouchableOpacity style={MainStyles.JLELoopItem} onPress={()=>{
                                            this.props.navigation.navigate('JobDetails',{job_type:'perm',job_id:item.id,is_cancelled:item.is_cancelled});
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
                                        item.applied == 1 && 
                                        <View style={[MainStyles.JLELoopItem,{backgroundColor:'#e6e6e6'}]}>
                                            <View style={{flexWrap:'wrap'}}>
                                                <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                                <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.created_on).replace(' ', 'T'))}</Text>
                                            </View>
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Applied</Text>
                                                {
                                                    // item.is_cancelled == 1 && 
                                                    // <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    //     <Text style={{transform: [{ rotate: "45deg" }],color:'#bf6161',fontFamily:'AvenirLTStd-Light',fontSize:13}}>Cancelled</Text>
                                                    // </View>
                                                }
                                            </View>
                                        </View>
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
export default JobList;