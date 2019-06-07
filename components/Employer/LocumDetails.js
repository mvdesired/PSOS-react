import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,RefreshControl,ImageBackground,AsyncStorage,Modal,TouchableHighlight,
    ActionSheetIOS,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions,NavigationActions } from 'react-navigation';
import Loader from '../Loader';
import MainStyles from '../Styles';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import { FlatList } from 'react-native-gesture-handler';
import Dialog, { SlideAnimation,DialogTitle,DialogButton } from 'react-native-popup-dialog';
import Header from '../Navigation/Header';
import PhotoView from "@merryjs/photo-viewer";
import StarRating from 'react-native-star-rating';
const { height, width } = Dimensions.get('window');
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class LocumDetails extends Component{
    constructor(props) {
        super(props);
        this.state={
            modalVisible:true,
            loading:true,
            locumData:{fname:'',lname:''},
            isRefreshing:false,
            job_id:this.props.navigation.getParam("job_id"),
            job_type:this.props.navigation.getParam("job_type"),
            locum_id:this.props.navigation.getParam("locum_id"),
            applied:this.props.navigation.getParam("applied"),
            is_end:this.props.navigation.getParam("isEnd"),
            starCount: 5,
            images:{}
        }
        this.fetchLocumDetails = this._fetchLocumDetails.bind(this);
    }
    componentDidMount = ()=>{
        this.setUserData();
        this.fetchLocumDetails();
    }
    _fetchLocumDetails = ()=>{
        fetch(SERVER_URL+'locum_detail?locum_id='+this.state.locum_id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>res.json())
        .then(response=>{
            if(response.status == 200){
                var images = [];
                images.push({source:{uri:response.result.user_img}});
                this.setState({locumData:response.result,images});
            }
            else{
                Toast.show(response.message,Toast.SHORT);
            }
            this.setState({loading:false});
        })
        .catch(err=>{
            console.log(err);
            this.setState({loading:false});
        });
    }
    async setUserData(){
        let userDataStringfy = await AsyncStorage.getItem('userData');
        let userData = JSON.parse(userDataStringfy);
        this.setState({userData});
    }
    hireThis = ()=>{
        var fd = new FormData();
        fd.append('job_id',this.state.job_id);
        fd.append('type',(this.state.job_type == 'shift')?'locum_shift':'permanent');
        fd.append('locum_id',this.state.locum_id);
        fd.append('employer_id',this.state.userData.id);
        fetch(SERVER_URL+'hire_locum',{
            method:'POST',
            headers:myHeaders,
            body:fd
        })
        .then(res=>res.json())
        .then(response=>{
            Toast.show(response.message,Toast.SHORT);
            if(response.status == 200){
                this.props.navigation.navigate('ChatScreen',{chat_id:response.result});
            }
        })
        .catch(err=>{
            console.log(err);
        });
    }
    submitFeedBack = ()=>{
        this.setState({loading:true});
        var fd = new FormData();
        fd.append("job_id",this.state.job_id);
        fd.append("locum_id",this.state.locum_id);
        fd.append("employer_id",this.state.userData.id);
        fd.append("review",this.state.starCount);
        fetch(SERVER_URL+'add_locumreview',{
            method:"POST",
            header:myHeaders,
            body:fd
        })
        .then(res=>{console.log(res);return res.json()})
        .then(response=>{
            if(response.status == 200){
                this.props.navigation.navigate("Home");
                this.setState({modalVisible:false,loading:false});
            }
            Toast.show(response.message,Toast.SHORT);
        })
        .catch(err=>{
            this.setState({loading:false});
            console.log(err);
        });
    }
    openModal(index) {
        this.setState({isModalOpened: true, currentImageIndex: index })
    }
    render(){
        const RemoveHiehgt = height - 50;
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <Loader loading={this.state.loading} />
                <Header pageName="Locum Detail" />
                <ScrollView style={{paddingHorizontal:15,height:RemoveHiehgt,flex:1}} keyboardShouldPersistTaps="always">
                    <View style={{justifyContent:'center',alignItems:'center',marginVertical: 15}}>
                        {
                            this.state.locumData.user_img && 
                            <TouchableOpacity onPress={() => {this.openModal(0)}} style={{width:100,height:100,justifyContent:'flex-start',alignItems:'center',overflow:'hidden',borderRadius: 100,marginBottom: 10,}}> 
                                <Image source={{uri:this.state.locumData.user_img}} width={100} height={100} style={{width:100,height:100}} />
                            </TouchableOpacity>
                        }
                        <Text style={{fontFamily:'AvenirLTStd-Meduim',color:'#151515',fontSize:17}}>{this.state.locumData.fname+' '+this.state.locumData.lname}</Text>
                    </View>
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>Date of Birth</Text>
                        <Text style={MainStyles.LPISubHeading}>{this.state.locumData.js_dob}</Text>
                    </View>
                    {/* Languga */}
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>AHPRA Number</Text>
                        <Text style={MainStyles.LPISubHeading}>{this.state.locumData.js_ahpra}</Text>
                    </View>
                    {/* Languga */}
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>Dispensing Systems Used</Text>
                        <Text style={MainStyles.LPISubHeading}>{this.state.locumData.js_software}</Text>
                    </View>
                    {/* Languga */}
                    {
                        this.state.applied == 0 && 
                        <View style={{justifyContent:'center',alignItems:'center',marginTop: 10,marginBottom:15}}>
                            <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                                this.hireThis();
                            }}>
                                <Text style={MainStyles.psosBtnText}>Hire</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        this.state.is_end == 1 && 
                        <View style={{justifyContent:'center',alignItems:'center',marginTop: 10,marginBottom:15}}>
                            <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                               this.setState({modalVisible:true});
                            }}>
                                <Text style={MainStyles.psosBtnText}>Submit Feedback</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        this.state.is_end == 1 && 
                        <Dialog
                        visible={this.state.modalVisible}
                        width={0.85}
                        dialogStyle={{padding:0,maxHeight:"75%",alignItems:'center',paddingBottom:20}}
                        dialogAnimation={new SlideAnimation()}
                        containerStyle={{zIndex: 10,flex:1}}
                        rounded={true} 
                        onHardwareBackPress={()=>{this.setState({modalVisible:false});}}
                        >
                            <DialogTitle title="Give Feedback" style={{width:'100%',backgroundColor:'#147dbf',borderRadius:0}} textStyle={{fontFamily:'AvenirLTStd-Medium',color:'#FFF',fontSize: 20,}} />
                            <View style={{marginTop: 22,width:250}}>
                                <StarRating
                                    disabled={false}
                                    fullStarColor="#fc8c15"
                                    starSize={25}
                                    containerStyle={{paddingHorizontal:15,justifyContent:'center'}}
                                    starStyle={{marginHorizontal:2.5}}
                                    maxStars={5}
                                    rating={this.state.starCount}
                                    selectedStar={(rating) => {this.setState({starCount:rating})}}
                                />
                                <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:15}}>
                                    <DialogButton text="Submit" style={[{borderRadius: 35,width:20,backgroundColor:'#147dbf',height:20}]} textStyle={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]} onPress={() => {
                                        this.submitFeedBack();
                                    }}/>
                                    <DialogButton text="Close" style={[{borderRadius: 35,width:20,backgroundColor:'#147dbf',height:20}]} textStyle={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]} onPress={() => {
                                        this.setState({modalVisible:false});
                                    }}/>
                                </View>
                            </View>
                        </Dialog>
                    }
                    
                </ScrollView>
                {
                    this.state.images.length>0 && 
                    // <Modal visible={this.state.isModalOpened} transparent={true}>
                    //     <ImageViewer imageUrls={this.state.images} index={this.state.currentImageIndex} enableSwipeDown={true}/>
                    // </Modal>
                    <PhotoView
                        visible={this.state.isModalOpened}
                        data={this.state.images}
                        hideStatusBar={true}
                        hideShareButton={true}
                        initial={this.state.currentImageIndex}
                        onDismiss={e => {
                        // don't forgot set state back.
                        this.setState({ isModalOpened: false });
                        }}
                    />
                }
            </SafeAreaView>
        );
    }
}
export default LocumDetails;