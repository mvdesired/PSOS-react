import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text,TouchableOpacity,Dimensions,RefreshControl,AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL,SENDER_ID } from '../../Constants';
import { FlatList } from 'react-native-gesture-handler';
import Header from '../Navigation/Header';
const { height, width } = Dimensions.get('window');
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class TimeSheetList extends Component{
    constructor(props) {
        super(props);
        this.state={
            loading:true,
            timeSheetList:{},
            isRefreshing:false,
        }
    }
    setUserData = async ()=>{
        await AsyncStorage.getItem('userData').then((userDataStringfy)=>{
            let userData = JSON.parse(userDataStringfy);
            this.setState({userData});
            this.didFocus();
        });
    }
    componentDidMount = ()=>{
        this.props.navigation.addListener("didFocus", this.setUserData);
    }
    didFocus = ()=>{
        fetch(SERVER_URL+'get_timesheet_list?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>{console.log(res);if(res.status == 200){return res.json()}else{return false;}})
        .then(response=>{
            if(response.status == 200){
                this.setState({timeSheetList:response.result});
                console.log(response.result);
            }
            else{
                Toast.show(response.message,Toast.SHORT);
            }
            this.setState({loading:false,isRefreshing:false});
        })
        .catch(err=>{
            console.log(err);
            this.setState({loading:false,isRefreshing:false});
        })
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
    render(){
        const RemoveHiehgt = height - 100;
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="My eTime Sheets" />
                {
                    this.state.timeSheetList.length > 0 && 
                    <FlatList data={this.state.timeSheetList} style={{height:RemoveHiehgt,paddingBottom:10}}
                        renderItem={({item}) => (
                            <View>
                                    <TouchableOpacity style={[MainStyles.JLELoopItem]} onPress={()=>{
                                    }}>
                                        <View style={{flexWrap:'wrap'}}>
                                            {/* <Text style={MainStyles.JLELoopItemName}>{item.staff_fname} {item.staff_lname}</Text> */}
                                            <Text style={MainStyles.JLELoopItemName}>Pharmacy Name :  {item.pharmacy_name}</Text>
                                            <Text style={MainStyles.JLELoopItemName}>Shift Date: {item.shift_date}</Text>
                                            <Text style={MainStyles.JLELoopItemName}>Start Time: {item.start_time}</Text>
                                            <Text style={MainStyles.JLELoopItemName}>Unpaid Breaks: {item.unpaid_breaks}</Text>
                                            <Text style={MainStyles.JLELoopItemName}>End Time: {item.end_time}</Text>
                                            <Text style={MainStyles.JLELoopItemTime}>{this.formatAMPM((item.created_on).replace(' ', 'T'))}</Text>
                                        </View>
                                    </TouchableOpacity>
                            </View>
                            )}
                        keyExtractor={(item) => 'key-'+item.id}
                        viewabilityConfig={this.viewabilityConfig}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={()=>{this.setState({isRefreshing:true}),this.didFocus()}}
                                title="Pull to refresh"
                                colors={["#1d7bc3","red", "green", "blue"]}
                            />
                        }
                        />
                }
            </SafeAreaView>
        );
    }
}
export default TimeSheetList;