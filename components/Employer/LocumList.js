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
import Header from '../Navigation/Header';
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
const { height, width } = Dimensions.get('window');
class LocumList extends Component{
    constructor(props) {
        super(props);
        this.state={
            loading:true,
            locumList:{},
            isRefreshing:false,
            job_id:this.props.navigation.getParam("job_id"),
            job_type:this.props.navigation.getParam("job_type"),
        }
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }
        this.fetchLocumList = this._fetchLocumList.bind(this);
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    componentDidMount(){
        this.fetchLocumList();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        var paramjob_id = this.props.navigation.getParam("job_id");
        var paramjobType = this.props.navigation.getParam("job_type");
        if (paramjob_id != prevState.job_id) {
          this.setState({job_id: paramjob_id});
        }
        if (paramjobType != prevState.job_type) {
            this.setState({job_type: paramjobType});
        }
    }
    _fetchLocumList = ()=>{
        var fetchFrom = (this.state.job_type == 'perm')?'permanent_applierlist':'locumshift_applierlist';
        //+'&emp_id='+this.state.id
        fetch(SERVER_URL+fetchFrom+'?job_id='+this.state.job_id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>res.json())
        .then(response=>{
            console.log(response);
            if(response.status == 200){
                this.setState({locumList:response.result});
            }
            this.setState({loading:false,isRefreshing:false});
        })
        .catch(err=>{
            console.log(err);
            Toast.show('Please check ou internet connection',Toast.SHORT);
            this.setState({loading:false,isRefreshing:false});
        })
    }
    timeSince = (date) => {
        var newDateFormate = new Date(date);
        var seconds = Math.floor((new Date() - newDateFormate) / 1000);
        var interval = Math.floor(seconds / 31536000);      
        if (interval > 1) {return interval + " years ago";}
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {return interval + " months ago";}
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {return interval + " days ago";}
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {return interval + " hours ago";}
        interval = Math.floor(seconds / 60);
        if (interval > 1) {return interval + " minutes ago";}
        return Math.floor(seconds) + " seconds ago";
    }
    render (){
        const RemoveHiehgt = height - 50;
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Locum List" />
                <View style={{height:RemoveHiehgt}}>
                    {
                        this.state.locumList.length > 0 && 
                        <FlatList data={this.state.locumList} 
                            renderItem={({item}) => (
                                <View>
                                    <TouchableOpacity style={[MainStyles.JLELoopItem,(item.state == 1)?{backgroundColor:'#e6e6e6'}:'']} onPress={()=>{
                                        console.log(item);
                                        this.props.navigation.navigate('LocumDetails',{job_id:this.state.job_id,job_type:this.state.job_type,locum_id:item.locum_id,applied:item.status});
                                    }}>
                                        <View style={{flexWrap:'wrap'}}>
                                            <Text style={MainStyles.JLELoopItemName}>{item.name}</Text>
                                            <Text style={MainStyles.JLELoopItemTime}>{this.timeSince(item.applied_date)}</Text>
                                        </View>
                                        {
                                            item.status == 1 && 
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <Text style={{transform: [{ rotate: "45deg" }],color:'#61bf6f',fontFamily:'AvenirLTStd-Light',fontSize:14}}>Hired</Text>
                                            </View>
                                        }
                                        {
                                            item.status == 0 && 
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <Image source={require('../../assets/list-fd-icon.png')} style={{width:8,height:15}}/>
                                            </View>
                                        }
                                    </TouchableOpacity>
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
            </SafeAreaView>
        );
    }
}
export default LocumList;