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
import Header from '../Navigation/Header';
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
            isRefreshingShift:false
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
        .then(res=>res.json())
        .then(response=>{
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
        var dateToday = (new Date()).getDate();
        var messageDate = date.getDate();
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
    render(){
        const RemoveHiehgt = height - 88;
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Open Jobs" />
                <View style={{backgroundColor:'#FFFFFF',flexDirection:'row',borderBottomColor: '#bebebe',borderBottomWidth: 1}}>
                    <TouchableOpacity style={[MainStyles.jobListETabsItem,(this.state.currentTab == 'shift')?MainStyles.activeJLEItem:'']} onPress={()=>{this.setState({currentTab:'shift'})}}>
                        <Text style={[MainStyles.jobListETabsItemText,(this.state.currentTab == 'shift')?MainStyles.activeJLEItemText:'']}>LOCUM SHIFT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[MainStyles.jobListETabsItem,(this.state.currentTab == 'perm')?MainStyles.activeJLEItem:'']} onPress={()=>{this.setState({currentTab:'perm'})}}>
                        <Text style={[MainStyles.jobListETabsItemText,(this.state.currentTab == 'perm')?MainStyles.activeJLEItemText:'']}>PERMANENT POSITION</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.currentTab == 'shift' && 
                    <View style={{height:RemoveHiehgt}}>
                        {
                            this.state.shiftList.length > 0 && 
                            <FlatList data={this.state.shiftList} 
                                renderItem={({item}) => (
                                    <View>
                                        {
                                            item.applied == 0 && 
                                            <TouchableOpacity style={MainStyles.JLELoopItem} onPress={()=>{
                                                this.props.navigation.navigate('JobDetails',{job_type:'shift',job_id:item.id});
                                            }}>
                                                <View style={{flexWrap:'wrap'}}>
                                                    <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                                    <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM(item.created_on)}</Text>
                                                </View>
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
                                                    <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM(item.created_on)}</Text>
                                                </View>
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:14}}>Applied</Text>
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
                                    <View>
                                        {
                                            item.applied == 0 && 
                                            <TouchableOpacity style={MainStyles.JLELoopItem} onPress={()=>{
                                                this.props.navigation.navigate('JobDetails',{job_type:'perm',job_id:item.id});
                                            }}>
                                                <View style={{flexWrap:'wrap'}}>
                                                    <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                                    <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM(item.created_on)}</Text>
                                                </View>
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
                                                    <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM(item.created_on)}</Text>
                                                </View>
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:14}}>Applied</Text>
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
                    </View>
                }
                {/* Shift Tab Content Ends */}
            </SafeAreaView>
        )
    }
}
export default JobList;