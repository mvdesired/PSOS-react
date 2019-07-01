import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,
    Picker,Dimensions,RefreshControl,ImageBackground,AsyncStorage,Modal,TouchableHighlight,StyleSheet,
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
            modalVisible:false,
            loading:true,
            locumData:{fname:'',lname:''},
            isRefreshing:false,
            job_id:this.props.navigation.getParam("job_id"),
            job_type:this.props.navigation.getParam("job_type"),
            locum_id:this.props.navigation.getParam("locum_id"),
            applied:this.props.navigation.getParam("applied"),
            is_end:this.props.navigation.getParam("isEnd"),
            is_filled:this.props.navigation.getParam("is_filled"),
            punctuality: 5,
            presentation: 5,
            professionalism: 5,
            custom_service: 5,
            images:{}
        }
        this.fetchLocumDetails = this._fetchLocumDetails.bind(this);
    }
    componentDidMount = ()=>{
        this.props.navigation.addListener('didFocus',this.onFocus);
    }
    onFocus = ()=>{
        this.setUserData();
        setTimeout(()=>{this.fetchLocumDetails();},150);
    }
    _fetchLocumDetails = ()=>{
        fetch(SERVER_URL+'locum_detail?locum_id='+this.state.locum_id+'&emp_id='+this.state.userData.id,{
            method:'GET',
            headers:myHeaders
        })
        .then(res=>{console.log(res);return res.json()})
        .then(response=>{
            console.log(response);
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
        this.setState({loading:true});
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
        .then(res=>{console.log(res);return res.json()})
        .then(response=>{
            Toast.show(response.message,Toast.SHORT);
            if(response.status == 200){
                var userData = this.state.userData;
                userData.chat_id = response.chat_id;
                this.setState({applied:1,userData,loading:false});
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
        fd.append("punctuality",this.state.punctuality);
        fd.append("presentation",this.state.presentation);
        fd.append("professionalism",this.state.professionalism);
        fd.append("custom_service",this.state.custom_service);
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
    SetRating = (rating)=>{
        var ratingStar = [];
        var dotRating = (''+rating).split('.');
        for(var i=0;i<parseInt(dotRating[0]);i++){
            ratingStar.push(
                <Icon key={i} name="star" style={{fontSize:16,color:'#fc8c15'}} />
            );
        }
        if(typeof(dotRating[1]) !='undefined' && parseInt(dotRating[1]) > 0){
            ratingStar.push(<Icon key={i+1} name="star-half" style={{fontSize:16,color:'#fc8c15'}} />);
        }
        return ratingStar;
    }
    render(){
        const RemoveHiehgt = height - 50;
        console.log(this.state);
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
                        <Text style={{fontFamily:'AvenirLTStd-Medium',color:'#151515',fontSize:17}}>{this.state.locumData.fname+' '+this.state.locumData.lname}</Text>
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
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>About {this.state.locumData.fname}</Text>
                        <Text style={MainStyles.LPISubHeading}>{this.state.locumData.about}</Text>
                    </View>
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>Punctuality ({this.state.locumData.punctuality != '0.0'?this.state.locumData.punctuality:'No Feedback yet'})</Text>
                        <View style={{flexDirection:'row',marginTop:10}}>
                            {this.SetRating(this.state.locumData.punctuality)}
                        </View>
                    </View>
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>Presentation ({this.state.locumData.presentation  != '0.0'?this.state.locumData.presentation:'No Feedback yet'})</Text>
                        <View style={{flexDirection:'row',marginTop:10}}>
                            {this.SetRating(this.state.locumData.presentation)}
                        </View>
                    </View>
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>Professionalism ({this.state.locumData.professionalism != '0.0'?this.state.locumData.professionalism:'No Feedback yet'})</Text>
                        <View style={{flexDirection:'row',marginTop:10}}>
                            {this.SetRating(this.state.locumData.professionalism)}
                        </View>
                    </View>
                    <View style={MainStyles.locumProfileItemWrapper}>
                        <Text style={MainStyles.LPIHeading}>Customer Service ({this.state.locumData.custom_service  != '0.0'?this.state.locumData.custom_service:'No Feedback yet'})</Text>
                        <View style={{flexDirection:'row',marginTop:10}}>
                            {this.SetRating(this.state.locumData.custom_service)}
                        </View>
                    </View>
                    {/* Languga */}
                    {
                        this.state.applied == 0 && this.state.is_filled == 0 && 
                        <View style={{justifyContent:'center',alignItems:'center',marginTop: 10,marginBottom:15}}>
                            <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                                this.hireThis();
                            }}>
                                <Text style={MainStyles.psosBtnText}>Hire</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        this.state.applied == 1 && 
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop: 10,marginBottom:15}}>
                            <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                                this.props.navigation.navigate('ChatScreen',{chat_id:this.state.locumData.chat_id});
                                }}>
                                    <Text style={MainStyles.psosBtnText}>Chat</Text>
                                </TouchableOpacity>
                            <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm]} onPress={()=>{
                            this.setState({modalVisible:true});
                            }}>
                                <Text style={MainStyles.psosBtnText}>Give Feedback</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        this.state.applied == 1 && 
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
                                <View style={styles.ratingItem}>
                                    <Text style={styles.ratingItemText}>Punctuality</Text>
                                    <StarRating
                                        disabled={false}
                                        fullStarColor="#fc8c15"
                                        starSize={25}
                                        containerStyle={{paddingHorizontal:15,justifyContent:'center'}}
                                        starStyle={{marginHorizontal:2.5}}
                                        maxStars={5}
                                        rating={this.state.punctuality}
                                        selectedStar={(rating) => {this.setState({punctuality:rating})}}
                                    />
                                </View>
                                <View style={styles.ratingItem}>
                                    <Text style={styles.ratingItemText}>Presentation</Text>
                                    <StarRating
                                        disabled={false}
                                        fullStarColor="#fc8c15"
                                        starSize={25}
                                        containerStyle={{paddingHorizontal:15,justifyContent:'center'}}
                                        starStyle={{marginHorizontal:2.5}}
                                        maxStars={5}
                                        rating={this.state.presentation}
                                        selectedStar={(rating) => {this.setState({presentation:rating})}}
                                    />
                                </View>
                                <View style={styles.ratingItem}>
                                    <Text style={styles.ratingItemText}>Professionalism</Text>
                                    <StarRating
                                        disabled={false}
                                        fullStarColor="#fc8c15"
                                        starSize={25}
                                        containerStyle={{paddingHorizontal:15,justifyContent:'center'}}
                                        starStyle={{marginHorizontal:2.5}}
                                        maxStars={5}
                                        rating={this.state.professionalism}
                                        selectedStar={(rating) => {this.setState({professionalism:rating})}}
                                    />
                                </View>
                                <View style={styles.ratingItem}>
                                    <Text style={styles.ratingItemText}>Customer Service</Text>
                                    <StarRating
                                        disabled={false}
                                        fullStarColor="#fc8c15"
                                        starSize={25}
                                        containerStyle={{paddingHorizontal:15,justifyContent:'center',alignItems:'flex-start'}}
                                        starStyle={{marginHorizontal:2.5}}
                                        maxStars={5}
                                        rating={this.state.custom_service}
                                        selectedStar={(rating) => {this.setState({custom_service:rating})}}
                                    />
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:15}}>
                                    <TouchableOpacity style={MainStyles.psosBtn} onPress={() => {
                                        this.submitFeedBack();
                                    }}>
                                        <Text style={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]}>Submit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={MainStyles.psosBtn} onPress={() => {
                                        this.setState({modalVisible:false});
                                    }}>
                                        <Text style={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]}>Close</Text>
                                    </TouchableOpacity>
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
const styles = StyleSheet.create({
    ratingItem:{
        marginVertical:5,
        paddingBottom:10,
        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#F1F1F1',
        width:'100%'
    },
    ratingItemText:{
        fontFamily:'AvenirLTStd-Medium',
        fontSize:20,
        marginBottom:10
    }
});