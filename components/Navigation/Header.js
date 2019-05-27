import React,{Component} from 'react';
import {View, Image,Text,TouchableOpacity,AsyncStorage } from 'react-native';
import MainStyles from '../Styles';
import { DrawerActions,NavigationActions,withNavigation } from 'react-navigation';
import { SERVER_URL } from '../../Constants';
class Header extends Component{
    _isMounted = false;
    clearTime = '';
    constructor(props){
        super(props);
        this.state = {
            count:0,
        }
        this.fetchNotifications = this._fetchNotifications.bind(this);
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    componentDidMount =()=>{
        this._isMounted = true;
        this.setUserData();
        setTimeout(()=>{
            this.fetchNotifications();
            this.clearTime = setInterval(()=>{
                this.fetchNotifications();
            },3000);
        },1500);
    }
    _fetchNotifications = ()=>{
        fetch(SERVER_URL+'fetch_notification?user_id='+this.state.userData.id)
        .then(res=>res.json())
        .then(response=>{
            if (this._isMounted) {
                if(response.status == 200){
                    this.setState({count:response.result.length});
                }
                else{
                    this.setState({count:0});
                }
            }
        })
        .catch(err=>{
            console.log(err);
        });
    }
    componentWillUnmount(){
        this._isMounted = false;
        clearTimeout(this.clearTime);
    }
    render(){
        return(
            <View style={MainStyles.navHeaderWrapper}>
                <TouchableOpacity onPress={()=>{this.props.navigation.goBack();}} style={{paddingLeft:5,paddingRight:15,paddingVertical:15}}>
                    <Image source={require('../../assets/back-icon.png')} style={{width:10,height:19}}/>
                </TouchableOpacity>
                <Text style={{fontFamily:'AvenirLTStd-Roman',color:'#FFFFFF',fontSize:16}}>{this.props.pageName}</Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity>
                        <Image source={require('../../assets/noti-icon.png')} width={20} height={23} style={{width:20,height:23}} />
                        {
                            this.state.count > 0 && 
                            <View style={MainStyles.nHNotiIconNum}>
                                <Text style={{fontSize:9}}>{this.state.count}</Text>
                            </View>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
export default withNavigation(Header);