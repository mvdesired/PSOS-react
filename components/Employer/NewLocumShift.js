import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,FlatList,AsyncStorage,
    ActionSheetIOS,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions,NavigationActions } from 'react-navigation';
import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
const { height, width } = Dimensions.get('window');
class NewLocumShift extends Component{
    constructor(props) {
        super(props);
        this.state={
            loading:true,
            pharmacyList:{},
            userData:{}
        }
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    componentDidMount = ()=>{
        this.listener = this.props.navigation.addListener("didFocus", this.onFocus);
    }
    onFocus =()=>{
        this.setUserData();
        setTimeout(()=>{
            this.fetchPharmacyList();
            /*this.clearTime = setInterval(()=>{
                //this.fetchPharma();
            },3500);*/
        },1500);
    }
    fetchPharmacyList = ()=>{
        fetch(SERVER_URL+'pharmacy_list?user_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>res.json())
        .then(response=>{
            if(response.status == 200){
                Toast.show(response.message,Toast.SHORT);
                this.setState({pharmacyList:response.result});
            }
            this.setState({loading:false});
        })
        .catch((err)=>{
            this.setState({loading:false});
            console.log(err);
        });
    }
    render(){
        var colors = ['#e67e22','#a29bfe','#00cec9','#0984e3','#febe76','#e77f67'];
        var newColors = [];
        var indexing = 0;
        const RemoveHiehgt = height - 52;
        var behavior = (Platform.OS == 'ios')?'padding':'';
        return(
            <SafeAreaView style={{flexDirection:'column',flex:1}}>
                <Loader loading={this.state.loading} />
                <View style={{
                    paddingTop: 15,
                    alignItems:'center',
                    justifyContent:'center'
                }}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.goBack();}} style={{position:'absolute',left:8,top:8,paddingLeft:5,paddingRight:15,paddingVertical:15}}>
                        <Image source={require('../../assets/blue-back-icon.png')} style={{width:10,height:19}}/>
                    </TouchableOpacity>
                    <Image source={require('../../assets/web-logo.png')} style={{width:205,height:35}}/>
                    <Image source={require('../../assets/header-b.png')} style={{width:'100%',marginTop:15}}/>
                </View>
                <KeyboardAvoidingView style={{flex:1,}} enabled behavior={behavior}>
                    <ScrollView style={{paddingHorizontal:15,height:RemoveHiehgt}}>
                        <View style={{paddingVertical:20,}}>
                            <Text style={{fontFamily:'AvenirLTStd-Heavy',color:'#151515',fontSize:16}}>New Locum Shift</Text>
                            <Text style={{
                                marginTop:5,
                                fontFamily:'AvenirLTStd-Medium',
                                color:'#676767',
                                fontSize:13,
                                marginBottom:5,
                            }}>
                               For quick, easy and efficient New Locum Shift, please use this form
                            </Text>
                        </View>
                        {/* Locum Registration Heading Ends */}
                        <Image source={require('../../assets/dashed-border.png')} width={'100%'} height={2} />
                        <View style={{
                            justifyContent:'center',
                            alignItems: 'center',
                            paddingVertical:18,
                            flexDirection: 'row',
                        }}>
                            <View style={{
                                paddingVertical:10,
                                paddingHorizontal:10,
                                backgroundColor:'#1476c0',
                                borderRadius:10
                            }}>
                                <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:12,}}>Select Pharmacy</Text>
                            </View>
                            <View style={{paddingHorizontal:10}}>
                                <Image source={require('../../assets/dashed-b-s.png')} width={100} style={{width:50}}/>
                            </View>
                            <View style={{paddingVertical:10,paddingHorizontal:10,backgroundColor:'#959595',borderRadius:10}}>
                                <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#FFFFFF',fontSize:12}}>Shift Details</Text>
                            </View>
                        </View>
                        <Image source={require('../../assets/dashed-border.png')} width={'100%'} height={2}/>
                        {/* BreadCrumbs Ends */}
                        <View style={[MainStyles.eDW,{justifyContent:'space-between'}]}>
                            {
                                this.state.pharmacyList.length > 0 && 
                                this.state.pharmacyList.map((item,key)=>{
                                    indexing = key;
                                    if(!colors[key]){
                                        indexing = key - colors.length;
                                    }
                                    return(
                                        <TouchableOpacity key={'key-'+item.pharm_id} onPress={()=>{
                                            var pharmaId = item.pharm_id;
                                            this.props.navigation.navigate('NLSForm',{pharm_id:pharmaId});
                                        }} style={{
                                            backgroundColor:colors[indexing],
                                            width:'47%',
                                            paddingVertical:15,
                                            paddingHorizontal:25,
                                            justifyContent:'center',
                                            alignItems:'center',
                                            borderRadius:5,
                                            marginTop:10
                                        }}>
                                            <Image source={require('../../assets/total-job.png')} width={40} height={36} style={{width:40,height:36,marginBottom:10}} />
                                            <Text style={[MainStyles.eDTWIT,{fontSize:16}]}>{item.business_name}</Text>
                                        </TouchableOpacity>
                                    )
                                    
                                })
                            }
                        </View>
                        <View style={{marginVertical:5}}></View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <TouchableOpacity style={{
                    position:'absolute',
                    right:10,
                    bottom:20,
                    width:60,
                    height:60,
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
                }} onPress={()=>{this.props.navigation.navigate('AddPharmacy',{redirect:'NewLocumShift'});}}>
                    <Icon name="plus" style={{color:'#FFFFFF',fontSize:25,}}/>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}
export default NewLocumShift;