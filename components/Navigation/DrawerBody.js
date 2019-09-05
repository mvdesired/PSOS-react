import React,{Component} from 'react';
import { ScrollView, TouchableOpacity,View,SafeAreaView,ImageBackground,Image,Text,AsyncStorage,StyleSheet } from 'react-native';
import { DrawerItems,NavigationActions,withNavigation } from 'react-navigation';
import PushNotification from 'react-native-push-notification';
import { SENDER_ID,SERVER_URL } from '../../Constants';
import Icon from 'react-native-vector-icons/FontAwesome';
let pkg = require('../../package.json');
class DrawerBody extends Component{
    isMount = false;
    clearInterval='';
    constructor(props){
        super(props);
        this.state = {
            userImg:require('../../assets/defaul-p-bg.png'),
            userData:{},
            noti_sound:'default'
        }
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
    }
    navigateToScreen = (route) => {
        const navigateAction = NavigationActions.navigate({
          routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
      }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        if(this.state.userData != userData){
            if(userData){
                this.setState({userData,noti_sound:userData.noti_sound,userImg:{uri:userData.user_img}});
                this.goPusNotification(this.redirectOnPushNotifcation.bind(this));
            }
        }
    }
    setBlankUserData = ()=>{
        this.setState({userData:{name:'',user_img:''}});
    }
    componentDidMount(){
        this.isMount = true;
        this.setUserData();
        
        this.clearInterval = setInterval(()=>{
            this.setUserData();
        },1000);
    }
    componentWillUnmount(){
        this.setBlankUserData();
        this.isMount = false;
        clearInterval(this.clearInterval);
    }
    goPusNotification(onNotification){
        PushNotification.configure({
            //onRegister: onToken,
            onNotification: onNotification,
            senderID: SENDER_ID,
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
    }
    redirectOnPushNotifcation(notification) {
        if(notification.userInteraction){
          if(notification.chat_id){
              const navigateActionS = NavigationActions.navigate({
                  routeName: 'ChatScreen',
                  params:{chat_id:notification.chat_id}
              });
              this.props.navigation.dispatch(navigateActionS);
          }
          if(notification.job_id){
              var job_type = 'perm';
              if(notification.job_type == 'locum_shift'){
                job_type = 'shift';
              }
              var screenName = 'JobDetails';
              if(this.state.userData.user_type == "employer"){
                screenName = 'LocumList';
              }
            const navigateActionS = NavigationActions.navigate({
                routeName: screenName,
                params:{job_id:notification.job_id,job_type:job_type}
            });
            this.props.navigation.dispatch(navigateActionS);
          }
        }
    }
    saveNotificationSound = (noti_sound)=>{
        var fd = new FormData();
        fd.append('user_id',this.state.userData.id);
        fd.append('noti_sound',noti_sound);
        fetch(SERVER_URL+'save_user_notification_sound',{
            method:'POST',
            body:fd
        })
        .then(res=>{console.log(res);return res.json()})
        .then(r=>{
            this.setState({noti_sound:r.result.noti_sound});
            this.saveDetails('userData',JSON.stringify(r.result));
            //this.updateProfile();
        })
        .catch(err=>{console.log(err);});
    }
    render(){
        const {items} = this.props.props;
        return (
            <SafeAreaView>
                <ScrollView style={{padding:0}}>
                
                    {/* <TouchableOpacity style={{ paddingLeft: 20,justifyContent:'flex-end',position:'absolute',right:-50 }} onPress={this.props.navigation.closeDrawer}>
                        <Icon name="bars" style={{ fontSize: 20, color: '#147dbf' }} />
                    </TouchableOpacity>  */}
                     <ImageBackground source={require('../../assets/defaul-p-bg.png')} style={{
                        height:180,
                        backgroundColor:'rgba(29, 123, 195, 0.8)',
                        justifyContent:'flex-end',
                        paddingBottom: 15,
                        paddingHorizontal:10
                    }}>
                        <View>
                            <View style={{width:60,height:60,overflow:'hidden',borderRadius:50,marginBottom:7}}>
                                <Image source={this.state.userImg} style={{width:60,height:60}}/>
                            </View>
                            <Text style={{color:'#feffff',fontFamily:'AvenirLTStd-Light',marginBottom:5}}>{this.state.userData.fname} {this.state.userData.lname}</Text>
                            <Text style={{color:'#feffff',fontFamily:'AvenirLTStd-Light'}}>{this.state.userData.email}</Text>
                        </View>
                    </ImageBackground>
                    {/* <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Home')}>
                        <Image source={require('../../assets/home-d-icon.png')} style={{width:15,height:13}} />
                        <Text style={styles.DITS}>Home</Text>
                    </TouchableOpacity> */}
                    {/* <View style={{paddingHorizontal:10,marginVertical:20}}>
                        <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:16}}>Notification Sound</Text>
                        <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-around',alignItems:'center'}}>
                            <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{
                                if(this.state.noti_sound != 'default'){
                                    this.setState({noti_sound:'default'});
                                    this.saveNotificationSound('default');
                                }
                            }}>
                                <View style={currentStyles.radioButton}>
                                    {
                                        this.state.noti_sound == 'default' &&
                                        <View style={{
                                            width: 10,
                                            height: 10,
                                            backgroundColor: '#1e7bc1',
                                            borderRadius: 50
                                        }}></View>
                                    }
                                </View>
                                <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>Notification On</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{
                                if(this.state.noti_sound != 'app'){
                                    this.setState({noti_sound:'app'});
                                    this.saveNotificationSound('app');
                                }
                            }}>
                                <View style={currentStyles.radioButton}>
                                    {
                                        this.state.noti_sound == 'app' &&
                                        <View style={{
                                            width: 10,
                                            height: 10,
                                            backgroundColor: '#1e7bc1',
                                            borderRadius: 50
                                        }}></View>
                                    }
                                </View>
                                <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',fontSize:14}}>Mute</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Profile')}>
                        {/* <Image source={require('../../assets/user-d-icon.png')} style={{width:15,height:15}} /> */}
                        <Icon name="user" style={{fontSize:15,color:'#000000'}} />
                        <Text style={styles.DITS}>Profile</Text>
                    </TouchableOpacity>
                    {
                        this.state.userData.user_type == 'employer' && 
                        <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Pharmacy')}>
                            {/* <Image source={require('../../assets/phar-d-icon.png')} style={{width:15,height:13}} /> */}
                            <Icon name="medkit" style={{fontSize:15,color:'#000000'}} />
                            <Text style={styles.DITS}>Pharmacies</Text>
                        </TouchableOpacity>
                    }
                    {
                        this.state.userData.user_type == 'locum' && 
                        <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('OpenJobs')}>
                            {/* <Image source={require('../../assets/applied-d-icon.png')} style={{width:15,height:13}} /> */}
                            <Icon name="briefcase" style={{fontSize:15,color:'#000000'}} />
                            <Text style={styles.DITS}>Job Dashboard</Text>
                        </TouchableOpacity>
                    }
                    {
                        this.state.userData.user_type == 'locum' && 
                        <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('MyeTimeSheet')}>
                            {/* <Image source={require('../../assets/applied-d-icon.png')} style={{width:15,height:13}} /> */}
                            <Icon name="clock-o" style={{fontSize:15,color:'#000000'}} />
                            <Text style={styles.DITS}>My eTime Sheets</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Notifications')}>
                        {/* <Image source={require('../../assets/noti-d-icon.png')} style={{width:15,height:17}} /> */}
                        <Icon name="bell" style={{fontSize:15,color:'#000000'}} />
                        <Text style={styles.DITS}>Messages</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Website')}>
                        {/* <Image source={require('../../assets/globe-icon.png')} style={{width:15,height:15}} /> */}
                        <Icon name="globe" style={{fontSize:15,color:'#000000'}} />
                        <Text style={styles.DITS}>Website</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Twitter')}>
                        <Image source={require('../../assets/t-d-icon.png')} style={{width:15,height:12}} />
                        <Text style={styles.DITS}>Twitter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Facebook')}>
                        <Image source={require('../../assets/f-d-icon.png')} style={{width:15,height:15}} />
                        <Text style={styles.DITS}>Facebook</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.DIS} onPress={()=>{
                        if(this.state.userData.user_type == "employer"){
                            this.navigateToScreen('IntroEmployer');
                        }
                        else{
                            this.navigateToScreen('IntroLocum');
                        }
                    }}>
                        <Icon name="address-card" style={{fontSize:15,color:'#000000'}} />
                        {/* <Image source={require('../../assets/share-d-icon.png')} style={{width:15,height:15}} /> */}
                        <Text style={styles.DITS}>View Intro</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('ShareApp')}>
                        {/* <Image source={require('../../assets/share-d-icon.png')} style={{width:15,height:15}} /> */}
                        <Icon name="share-alt" style={{fontSize:15,color:'#000000'}} />
                        <Text style={styles.DITS}>Share App</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Support')}>
                        {/* <Image source={require('../../assets/support-icon.png')} style={{width:15,height:18}} /> */}
                        <Icon name="headphones" style={{fontSize:15,color:'#000000'}} />
                        <Text style={styles.DITS}>FAQ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.DIS]} onPress={()=>this.navigateToScreen('About')}>
                        {/* <Image source={require('../../assets/about-d-icon.png')} style={{width:15,height:9}} /> */}
                        <Icon name="users" style={{fontSize:15,color:'#000000'}} />
                        <Text style={styles.DITS}>About </Text>
                        <Text style={{color:'#676767',fontSize:11,paddingLeft:5}}>( Version {pkg.version} )</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('ContactSupport')}>
                        <Icon name="life-ring" style={{fontSize:15,color:'#000000'}} />
                        <Text style={styles.DITS}>Contact Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Logout')}>
                        {/* <Image source={require('../../assets/logout-d-icon.png')} style={{width:15,height:15}} /> */}
                        <Icon name="sign-out" style={{fontSize:15,color:'#000000'}} />
                        <Text style={styles.DITS}>Logout</Text>
                    </TouchableOpacity>
                {/* <DrawerItems 
                    {this.props}
                    //itemStyle={drawerItemStyle}
                    //activeTintColor={'#1d7bc3'}
                    //inactiveTintColor={'#151515'}
                    activeBackgroundColor={'#FFFFFF'}
                    itemsContainerStyle={{ paddingHorizontal: 0 }}
                    //labelStyle={drawerLabelStyle}
                    iconContainerStyle={{ marginHorizontal: 0, marginLeft: 16 }}
                    
                /> */}

                </ScrollView>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    DIS:{
        paddingHorizontal:10,
        paddingVertical: 15,
        textAlign: 'left',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems: 'center'
    },
    DITS:{
        fontSize: 14,
        fontFamily: 'AvenirLTStd-Medium',
        paddingLeft:10
    }
});
const currentStyles = StyleSheet.create({
    radioButton:{
        borderWidth: 1,
        borderColor: '#6e6f71',
        width: 15,
        height: 15,
        borderRadius: 50,
        marginRight: 15,
        elevation: 3,
        shadowColor: '#a1a09e',
        shadowOffset: {height:3,width:3},
        shadowRadius: 3,
        shadowOpacity: 0.7,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default withNavigation(DrawerBody);