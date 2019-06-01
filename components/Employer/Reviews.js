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
class Reviews extends Component{
    constructor(props) {
        super(props);
        this.state={
            loading:true,
            currentTab:'my',
            myList:{},
            locumList:{},
            isRefreshingMy:false,
            isRefreshingLocum:false,
            pageTitle:'LOCUM REVIEW'
        }
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }
        this.getMyReviews = this._getMyReviews.bind(this);
        this.getLocumReviews = this._getLocumReviews.bind(this);
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    componentDidMount(){
        this.setUserData();
        setTimeout(()=>{
            if(this.state.userData.user_type == 'locum'){
                this.setState({pageTitle:'EMPLOYER REVIEW'});
                fetch(SERVER_URL+'locum_review?locum_id='+this.state.userData.id,{
                    headers:myHeaders
                })
                .then(res=>res.json())
                .then(response=>{
                    if(response.status == 200){
                        this.setState({locumList:response.result});
                    }
                    this.setState({loading:false});
                })
                .catch(err=>{
                    console.log(err);
                    this.setState({loading:false});
                });
                fetch(SERVER_URL+'locum_myreview?locum_id='+this.state.userData.id,{
                    headers:myHeaders
                })
                .then(res=>res.json())
                .then(response=>{
                    if(response.status == 200){
                        this.setState({myList:response.result});
                    }
                    this.setState({loading:false});
                })
                .catch(err=>{
                    console.log(err);
                    this.setState({loading:false});
                });
            }
            else{
                this.setState({pageTitle:'EMPLOYER REVIEW'});
                fetch(SERVER_URL+'employer_review?employer_id='+this.state.userData.id,{
                    headers:myHeaders
                })
                .then(res=>res.json())
                .then(response=>{
                    console.log(response);
                    if(response.status == 200){
                        this.setState({locumList:response.result});
                    }
                    this.setState({loading:false});
                })
                .catch(err=>{
                    console.log(err);
                });
                fetch(SERVER_URL+'employer_myreview?employer_id='+this.state.userData.id,{
                    headers:myHeaders
                })
                .then(res=>res.json())
                .then(response=>{
                    if(response.status == 200){
                        this.setState({myList:response.result});
                    }
                    this.setState({loading:false});
                })
                .catch(err=>{
                    console.log(err);
                    this.setState({loading:false});
                });
            }
        },1500);
    }
    _getMyReviews = ()=>{
        this.setState({isRefreshingMy:false});
    }
    _getLocumReviews = ()=>{
        this.setState({isRefreshingLocum:false});
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
                <Header pageName="Reviews" />
                <View style={{backgroundColor:'#FFFFFF',flexDirection:'row',borderBottomColor: '#bebebe',borderBottomWidth: 1}}>
                    <TouchableOpacity style={[MainStyles.jobListETabsItem,(this.state.currentTab == 'my')?MainStyles.activeJLEItem:'']} onPress={()=>{this.setState({currentTab:'my'})}}>
                        <Text style={[MainStyles.jobListETabsItemText,(this.state.currentTab == 'my')?MainStyles.activeJLEItemText:'']}>MY REVIEW</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[MainStyles.jobListETabsItem,(this.state.currentTab == 'locum')?MainStyles.activeJLEItem:'']} onPress={()=>{this.setState({currentTab:'locum'})}}>
                        <Text style={[MainStyles.jobListETabsItemText,(this.state.currentTab == 'locum')?MainStyles.activeJLEItemText:'']}>{this.state.pageTitle}</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.currentTab == 'my' && 
                    <View style={{height:RemoveHiehgt}}>
                        {
                            this.state.myList.length > 0 && 
                            <FlatList data={this.state.myList} 
                                renderItem={({item}) => {
                                    var output = [];
                                    var remaining = 5 -item.review
                                    for(var i=0;i<item.review;i++){
                                        output.push(<Icon name="star" style={{color:"#fac917",fontSize:18,marginRight:3}}/>);
                                    }
                                    for(var i=0;i<remaining;i++){
                                        output.push(<Icon name="star-o" style={{color:"#cccccc",fontSize:18}}/>);
                                    }
                                    return (
                                    <View style={{
                                        backgroundColor:'#FFFFFF',
                                        paddingHorizontal:10,
                                        paddingVertical:15,
                                        flexDirection:'row',
                                        justifyContent:'space-between',
                                        alignItems:'center',
                                        borderBottomColor: '#f0f0f0',
                                        borderBottomWidth: 1,
                                    }}>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <ImageBackground  source={require('../../assets/review-image.png')} style={{overflow:'hidden',width:50,height:50,borderRadius: 100}}></ImageBackground>
                                            <View style={{justifyContent:'center'}}>
                                                <Text style={[MainStyles.JLELoopItemName,{marginLeft:10,flexWrap:'wrap'}]}>{item.name} {item.lname}</Text>
                                                <Text style={{fontFamily:'AvenirLTStd-Book',fontSize:13,marginLeft:10,flexWrap:'wrap',color:'#676767'}}>{item.job_title}</Text>
                                            </View>
                                        </View>
                                        <View style={{alignItems:'center'}}>
                                            <Text style={{fontFamily:'AvenirLTStd-Book',color:'#bebebe',fontSize:10}}>{this.formatAMPM(item.review_date)}</Text>
                                            <View style={{marginTop:5,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                                {output}
                                            </View>
                                        </View>
                                    </View>
                                    )}}
                                keyExtractor={(item) => 'key-'+item.review_id}
                                viewabilityConfig={this.viewabilityConfig}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshingMy}
                                        onRefresh={()=>{this.setState({isRefreshingMy:true}),this.getMyReviews()}}
                                        title="Pull to refresh"
                                        colors={["#1d7bc3"]}
                                    />
                                }
                            />
                        }
                    </View>
                }
                {
                    this.state.currentTab == 'locum' && 
                    <View style={{height:RemoveHiehgt}}>
                        {
                            this.state.locumList.length > 0 && 
                            <FlatList data={this.state.locumList} 
                                renderItem={({item}) => {
                                    var output = [];
                                    var remaining = 5 -item.review
                                    for(var i=0;i<item.review;i++){
                                        output.push(<Icon name="star" style={{color:"#fac917",fontSize:18,marginRight:3}}/>);
                                    }
                                    for(var i=0;i<remaining;i++){
                                        output.push(<Icon name="star-o" style={{color:"#cccccc",fontSize:18}}/>);
                                    }
                                    return (
                                    <View style={{
                                        backgroundColor:'#FFFFFF',
                                        paddingHorizontal:10,
                                        paddingVertical:15,
                                        flexDirection:'row',
                                        justifyContent:'space-between',
                                        alignItems:'center',
                                        borderBottomColor: '#f0f0f0',
                                        borderBottomWidth: 1,
                                    }}>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <ImageBackground  source={require('../../assets/review-image.png')} style={{overflow:'hidden',width:50,height:50,borderRadius: 100}}></ImageBackground>
                                            <View style={{justifyContent:'center'}}>
                                                <Text style={[MainStyles.JLELoopItemName,{marginLeft:10,flexWrap:'wrap'}]}>{item.name} {item.lname}</Text>
                                                <Text style={{fontFamily:'AvenirLTStd-Book',fontSize:13,marginLeft:10,flexWrap:'wrap',color:'#676767'}}>{item.job_title}</Text>
                                            </View>
                                        </View>
                                        <View style={{alignItems:'center'}}>
                                            <Text style={{fontFamily:'AvenirLTStd-Book',color:'#bebebe',fontSize:10}}>{this.formatAMPM(item.review_date)}</Text>
                                            <View style={{marginTop:5,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                                {output}
                                            </View>
                                        </View>
                                    </View>
                                    )}}
                                keyExtractor={(item) => 'key-'+item.review_id}
                                viewabilityConfig={this.viewabilityConfig}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshingLocum}
                                        onRefresh={()=>{this.setState({isRefreshingLocum:true}),this.getLocumReviews()}}
                                        title="Pull to refresh"
                                        colors={["#1d7bc3"]}
                                    />
                                }
                            />
                        }
                    </View>
                }
            </SafeAreaView>
        )
    }
}
export default Reviews;