import React,{Component} from 'react';
import {View,ImageBackground, Image,Text, StyleSheet,AsyncStorage,BackHandler } from 'react-native';
import Loader from './Loader';
import { SERVER_URL } from '../Constants';
class SplashScreen extends Component{
    constructor(props) {
        super(props);
        this.state={loading:false}
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
    }
    componentDidMount(){
        this.props.navigation.addListener('willFocus',payload=>{
            if((payload.context).search('Navigation/BACK_Root') != -1){
                BackHandler.exitApp();
            }
        });
        setTimeout(()=>{
            this.authenticateSession();
            //navigation.navigate('Login');
        },2500);
        //
    }
    authenticateSession = async()=> {
        const { navigation } = this.props;
        let isUserLoggedIn = await AsyncStorage.getItem('isUserLoggedIn');
        if(isUserLoggedIn == "true"){
            let userDataStringfy = await AsyncStorage.getItem('userData');
            let userData = JSON.parse(userDataStringfy);
            if(userData){
                var fd = new FormData();
                fd.append('user_id',userData.id);
                //if(userData.user_type == 'employer'){
                    fetch(SERVER_URL+'check_user_exists',{
                        method:'POST',
                        body:fd
                    })
                    .then(res=>res.json())
                    .then(r=>{
                        console.log(r);
                        if(r.status == '0'){
                            navigation.navigate('Home');
                            this.saveDetails('userData',JSON.stringify(r));
                        }
                        else if(r.status == '2'){
                            Toast.show("Your account is deactive",Toast.SHORT);
                            this.saveDetails('isUserLoggedIn',"false");
                            this.saveDetails('userData',"");
                            navigation.navigate('Login');
                        }
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                //}
            }
            else{
                navigation.navigate('Login');
            }
        }
        else{
            navigation.navigate('Login');
        }
    }
    render(){
        return (
            <ImageBackground source={require('../assets/splash-bg.png')} style={{flex:1,backgroundColor:'#FFFFFF'}}>
                <Loader loading={this.state.loading} />
                <View style={{
                flex:1,justifyContent: 'center',alignItems:'center'
                }}>
                    <Image source={require('../assets/psos-logo.png')} style={{width:250,height:181}}/>
                </View>
                <View style={{position:'absolute',
                    alignItems:'center',
                    justifyContent:'center',
                    width:'100%',
                    bottom:20
                }}>
                    <Text style={{color:'#147dbf',marginBottom:5,fontFamily:'AvenirLTStd-Roman'}}>Version 1.0.0</Text>
                    <Text style={{color:'#147dbf',fontFamily:'AvenirLTStd-Roman'}}>Powered by Pharmacy SOS</Text>
                </View>
            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({

});
export default SplashScreen;