import React,{Component} from 'react';
import { ScrollView, TouchableOpacity,View,SafeAreaView,ImageBackground,Image,Text,AsyncStorage,StyleSheet } from 'react-native';
import { DrawerItems,NavigationActions,withNavigation } from 'react-navigation';
class DrawerBody extends Component{
    constructor(props){
        super(props);
        this.state = {
            userData:{}
        }
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
        this.setState({userData});
    }
    componentDidMount(){
        this.setUserData();
    }
    /*componentDidUpdate(){
        this.setUserData();
    }*/
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
                            <Image source={{uri:this.state.userData.user_img}} style={{width:60,height:60,marginBottom:7,borderRadius:100}}/>
                            <Text style={{color:'#feffff',fontFamily:'AvenirLTStd-Light',marginBottom:5}}>{this.state.userData.fname} {this.state.userData.lname}</Text>
                            <Text style={{color:'#feffff',fontFamily:'AvenirLTStd-Light'}}>{this.state.userData.email}</Text>
                        </View>
                    </ImageBackground>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Home')}>
                        <Image source={require('../../assets/home-d-icon.png')} style={{width:15,height:13}} />
                        <Text style={styles.DITS}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Profile')}>
                        <Image source={require('../../assets/user-d-icon.png')} style={{width:15,height:15}} />
                        <Text style={styles.DITS}>Profile</Text>
                    </TouchableOpacity>
                    {
                        this.state.userData.user_type == 'employer' && 
                        <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Pharmacy')}>
                            <Image source={require('../../assets/phar-d-icon.png')} style={{width:15,height:13}} />
                            <Text style={styles.DITS}>Pharmacy</Text>
                        </TouchableOpacity>
                    }
                    {
                        this.state.userData.user_type == 'locum' && 
                        <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Applied')}>
                            <Image source={require('../../assets/applied-d-icon.png')} style={{width:15,height:13}} />
                            <Text style={styles.DITS}>Applied Jobs</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Notifications')}>
                        <Image source={require('../../assets/noti-d-icon.png')} style={{width:15,height:17}} />
                        <Text style={styles.DITS}>Notifications</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Website')}>
                        <Image source={require('../../assets/globe-icon.png')} style={{width:15,height:15}} />
                        <Text style={styles.DITS}>Website</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Twitter')}>
                        <Image source={require('../../assets/t-d-icon.png')} style={{width:15,height:12}} />
                        <Text style={styles.DITS}>Twitter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Facebook')}>
                        <Image source={require('../../assets/f-d-icon.png')} style={{width:15,height:15}} />
                        <Text style={styles.DITS}>Facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('ShareApp')}>
                        <Image source={require('../../assets/share-d-icon.png')} style={{width:15,height:15}} />
                        <Text style={styles.DITS}>Share App</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Support')}>
                        <Image source={require('../../assets/support-icon.png')} style={{width:15,height:18}} />
                        <Text style={styles.DITS}>Support FAQ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('About')}>
                        <Image source={require('../../assets/about-d-icon.png')} style={{width:15,height:9}} />
                        <Text style={styles.DITS}>About</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.DIS} onPress={()=>this.navigateToScreen('Logout')}>
                        <Image source={require('../../assets/logout-d-icon.png')} style={{width:15,height:15}} />
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
export default withNavigation(DrawerBody);