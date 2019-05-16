import React, {Component} from 'react';
import {View,AsyncStorage,Image,ImageBackground} from 'react-native';
import Loader from '../Loader';
import { SERVER_URL } from '../../Constants';
import PushNotification from 'react-native-push-notification';
class Logout extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
        }
        //this.authenticateSession = this._authenticateSession.bind(this);
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    getToken = (onToken)=>{
        PushNotification.configure({
            onRegister: onToken,
            onNotification: function(notification) {
                console.log('NOTIFICATION:', notification );
            },
            senderID: "71450108131",
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
    }
    authenticateSession(){
        this.getToken(this.logoutFromServer.bind(this));
    }
    logoutFromServer(token){
        fetch(SERVER_URL+'user_logout',{
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: this.state.userData.id,
                device_key:token.token
            })
        })
        .then(res=>res.json())
        .then(response=>{
            console.log(response);
            if(response.status == 200){
                this.saveDetails('isUserLoggedIn',"false");
                this.saveDetails('userData',"");
                setTimeout(()=>{
                    this.setState({loading:false});
                    this.props.navigation.navigate('Login');
                },1000);
            }
        });
    }
    
    componentDidMount(){
        this.setUserData();
        setTimeout(()=>{
            this.authenticateSession();
        },1500);
    }
    render(){
        return(
            <ImageBackground source={require('../../assets/splash-bg.png')} style={{flex:1,backgroundColor:'#FFFFFF',justifyContent:'center',alignItems:'center'}}>
                <Loader loading={this.state.loading} />
                <Image source={require('../../assets/web-logo.png')} style={{width:280,height:48}}/>
            </ImageBackground>
        );
    }
}
export default Logout;