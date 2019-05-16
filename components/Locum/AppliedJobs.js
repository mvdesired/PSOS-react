import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,RefreshControl,AsyncStorage,
    ActionSheetIOS,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions,NavigationActions } from 'react-navigation';
import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import { FlatList } from 'react-native-gesture-handler';
const { height, width } = Dimensions.get('window');
import Header from '../Navigation/Header';
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class AppliedJob extends Component{
    _isMounted = false;
    clearTime = '';
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
        this._isMounted = true;
        this.setUserData();
        setTimeout(()=>{
            this.fetchLocumShifts();
            this.fetchPermShifts();
            this.clearTime = setInterval(()=>{
                this.fetchLocumShifts();
                this.fetchPermShifts();
            },3000);
        },1500);
        
    }
    _fetchLocumShifts = ()=>{
        fetch(SERVER_URL+'applied_locumshift_jobs?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>res.json())
        .then(response=>{
            if(response.status == 200){
                this.setState({shiftList:response.result});
            }
            this.setState({loading:false,isRefreshingShift:false});
        })
        .catch(err=>{
            Toast.show('Please check ou internet connection',Toast.SHORT);
            this.setState({loading:false,isRefreshingShift:false});
        })
    }
    _fetchPermShifts = ()=>{
        fetch(SERVER_URL+'applied_permanentshift_jobs?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>res.json())
        .then(response=>{
            if(response.status == 200){
                this.setState({permList:response.result});
            }
            this.setState({loading:false,isRefreshingPerm:false});
        })
        .catch(err=>{
            Toast.show('Please check ou internet connection',Toast.SHORT);
            this.setState({loading:false,isRefreshingPerm:false});
        })
    }
    timeSince = (date) => {
        var newDateFormate = new Date(date);
        var seconds = Math.floor((new Date() - newDateFormate) / 1000);
        var interval = Math.floor(seconds / 31536000);      
        if (interval > 1) {return interval + " years";}
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {return interval + " months";}
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {return interval + " days";}
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {return interval + " hours";}
        interval = Math.floor(seconds / 60);
        if (interval > 1) {return interval + " minutes";}
        return Math.floor(seconds) + " seconds";
    }
    componentWillUnmount(){
        this._isMounted = false;
        clearTimeout(this.clearTime);
    }
    render(){
        const RemoveHiehgt = height - 88;
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Applied Jobs" />
                <View style={{backgroundColor:'#FFFFFF',flexDirection:'row',borderBottomColor: '#bebebe',borderBottomWidth: 1}}>
                    <TouchableOpacity style={[MainStyles.jobListETabsItem,(this.state.currentTab == 'shift')?MainStyles.activeJLEItem:'']} onPress={()=>{this.setState({currentTab:'shift'})}}>
                        <Text style={[MainStyles.jobListETabsItemText,(this.state.currentTab == 'shift')?MainStyles.activeJLEItemText:'']}>LOCUM SHIFT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[MainStyles.jobListETabsItem,(this.state.currentTab == 'perm')?MainStyles.activeJLEItem:'']} onPress={()=>{this.setState({currentTab:'perm'})}}>
                        <Text style={[MainStyles.jobListETabsItemText,(this.state.currentTab == 'perm')?MainStyles.activeJLEItemText:'']}>PARMANENT POSITION</Text>
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
                                        this.props.navigation.navigate('JobDetails',{job_type:'shift',job_id:item.job_id,applied:true});
                                    }}>
                                        <View style={{flexWrap:'wrap'}}>
                                            <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                            <Text style={MainStyles.JLELoopItemTime}>{this.timeSince(item.created_on)}</Text>
                                        </View>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Text style={MainStyles.JLELoopItemCount}>{item.applier}</Text>
                                            <Icon name="eye" style={MainStyles.JLELoopItemIcon}/>
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
                                        console.log(item);
                                        this.props.navigation.navigate('JobDetails',{job_type:'perm',job_id:item.job_id,applied:true});
                                    }}>
                                        <View style={{flexWrap:'wrap'}}>
                                            <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                            <Text style={MainStyles.JLELoopItemTime}>{this.timeSince(item.created_on)}</Text>
                                        </View>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Text style={MainStyles.JLELoopItemCount}>{item.applier}</Text>
                                            <Icon name="eye" style={MainStyles.JLELoopItemIcon}/>
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
            </SafeAreaView>
        )
    }
}
export default AppliedJob;