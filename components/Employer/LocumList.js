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
            is_end:this.props.navigation.getParam("isEnd")
        }
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }
        this.fetchLocumList = this._fetchLocumList.bind(this);
        console.log(this.state);
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    componentDidMount(){
        this.props.navigation.addListener('didFocus',this.onFocus);
    }
    onFocus = ()=>{
        this.setUserData();
        setTimeout(()=>{
            this.shiftDetails();
            this.fetchLocumList();
        },150);
    }
    shiftDetails(){
        var fetchFrom = (this.state.job_type == 'perm')?'permanent_details':'locumshift_details';
        fetch(SERVER_URL+fetchFrom+'?id='+this.state.job_id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>res.json())
        .then(response=>{
            var r = response.result;
            this.setState({
                name:r.name,
                FirstDate:r.start_date,
                EndDate:r.end_date,
                startTime:r.start_time,
                endTime:r.end_time,
                detail:r.detail,
                dispense:r.dispense,
                travel:r.travel,
                offer:r.offer,
                is_filled:r.is_filled
            });
        })
        .catch(err=>{
            console.log(err);
        })
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
            this.setState({loading:false,isRefreshingShift:false});
        })
        .catch(err=>{
            console.log(err);
            Toast.show('Please check ou internet connection',Toast.SHORT);
            this.setState({loading:false,isRefreshingShift:false});
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
    render (){
        const RemoveHiehgt = height - 50;
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Shift Details" />
                <View style={{height:RemoveHiehgt}}>
                <View style={{backgroundColor:"#f7f7f7",padding:10,}}>
                      <View style={{flexWrap:'wrap'}}>
                      <Text style={{color:'#212121',fontFamily:'AvenirLTStd-Light',fontSize:14}}>Shift Name: {this.state.name}</Text>
                      <Text style={{color:'#212121',padding:3,fontFamily:'AvenirLTStd-Light',fontSize:14}}>First Date of Shift: {this.state.FirstDate}</Text>
                      <Text style={{color:'#212121',padding:3,fontFamily:'AvenirLTStd-Light',fontSize:14}}>Last  Date of Shift: {this.state.EndDate} </Text>
                      {(this.state.job_type != 'perm') && <Text style={{color:'#212121',padding:3,fontFamily:'AvenirLTStd-Light',fontSize:14}}>Start Time: {this.state.startTime}</Text>}
                      {(this.state.job_type != 'perm') && <Text style={{color:'#212121',padding:3,fontFamily:'AvenirLTStd-Light',fontSize:14}}>End Time: {this.state.endTime}</Text>}
                      <Text style={{color:'#212121',padding:3,fontFamily:'AvenirLTStd-Light',fontSize:14}}>Shift Details: {this.state.detail}</Text>
                      <Text style={{color:'#212121',padding:3,fontFamily:'AvenirLTStd-Light',fontSize:14}}>Dispensing  System: {this.state.dispense}</Text>
                      <Text style={{color:'#212121',padding:3,fontFamily:'AvenirLTStd-Light',fontSize:14}}>Pharmacy offerss Pharmacotheraphy  System: {this.state.offer}</Text>
                      <Text style={{color:'#212121',padding:3,fontFamily:'AvenirLTStd-Light',fontSize:14}}>Travel and Accommodation: {this.state.travel}</Text>
                      {
                          this.state.is_end == 1 && 
                          <Text style={{color:'#212121',padding:3,fontFamily:'AvenirLTStd-Light',fontSize:14}}>Completed</Text>
                      }
                </View>
                </View>
                    {
                        this.state.locumList.length > 0 && 
                        <FlatList data={this.state.locumList} style={{minHeight:RemoveHiehgt,paddingBottom:10}}
                            renderItem={({item}) => {
                                console.log(item);
                                var ratingStar = [];
                                var dotRating = (''+item.rating).split('.');
                                for(var i=0;i<dotRating[0];i++){
                                    ratingStar.push(
                                        <Icon key={i} name="star" style={{fontSize:16,color:'#fc8c15'}} />
                                    );
                                }
                                if(typeof(dotRating[1]) !='undefined' && dotRating[1] != 0){
                                    ratingStar.push(<Icon key={i+1} name="star-half" style={{fontSize:16,color:'#fc8c15'}} />);
                                }
                                return(
                                <View>
                                    <TouchableOpacity style={[MainStyles.JLELoopItem,(item.state == 1)?{backgroundColor:'#e6e6e6'}:'']} onPress={()=>{
                                        this.props.navigation.navigate('LocumDetails',{job_id:this.state.job_id,job_type:this.state.job_type,locum_id:item.locum_id,applied:item.status,isEnd:this.state.is_end,is_filled:this.state.is_filled});
                                    }}>
                                        <View style={{flexWrap:'wrap'}}>
                                            <Text style={MainStyles.JLELoopItemName}>{item.name} {ratingStar}
                                            </Text>
                                            <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.applied_date).replace(' ', 'T'))}</Text>
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
                                )}}
                            keyExtractor={(item) => 'key-'+(new Date()).getTime()+item.job_id}
                            viewabilityConfig={this.viewabilityConfig}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshingShift}
                                    onRefresh={()=>{this.setState({isRefreshingShift:true}),this.fetchLocumList()}}
                                    title="Pull to refresh"
                                    colors={["#1d7bc3","red", "green", "blue"]}
                                />
                            }
                            />
                    }
                </View>
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
                    this.setState({isRefreshingShift:true});
                    this.fetchLocumList();
                }}>
                    <Icon name="refresh" style={{color:'#FFFFFF',fontSize:20,}}/>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}
export default LocumList;