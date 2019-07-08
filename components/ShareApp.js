import React,{Component} from 'react';
import {View,ImageBackground, Image,Text,StyleSheet,TextInput,Dimensions,ScrollView, TouchableOpacity,SafeAreaView,Linking } from 'react-native';
import MainStyles from './Styles';
import Header from './Navigation/Header';
import Share from 'react-native-share';
const { height, width } = Dimensions.get('window');
import { SERVER_URL } from '../Constants';
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
class ShareApp extends Component{
    constructor(props) {
        super(props);
        this.state={loading:false}
    }
    componentDidMount(){
        fetch(SERVER_URL + 'share_text', {
            method: 'GET',
            headers: myHeaders
        })
        .then(res => res.json())
        .then(r => {
            console.log(r);
            this.setState({link:r.link,title:r.text});
        })
        .catch(err => {
            console.log(err);
        });
    }
    shareThis(ShareOn){
        const shareOptions = {
            title: 'Share via',
            message: this.state.title,
            url: this.state.link,
            social: ShareOn
        };
        Share.shareSingle(shareOptions);
    }
    render(){

        const RemoveHiehgt = height - 50;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
            <Header pageName="Share App" />
            <View style={{justifyContent: 'center',alignItems:'center',paddingVertical:70,marginTop:60}}>
                    <Image source={require('../assets/share-app-icon.png')} style={{width:70,height:68,}}/>
                   <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize:16,color:'#151515',padding:40,flexWrap:'wrap',lineHeight:16,textAlign:"center"}}>Lorem Ipsum has been the industry's standard dummy text ever since</Text>
                   <View style={{flexDirection:'row',width:250,height:1,backgroundColor:'#e1e1e1',alignItems:'center',marginLeft:70,marginRight:70,borderColor: '#bebebe',marginTop:20}}></View>
                        <Text style={{color:'#151515',fontFamily:'AvenirLTStd-Medium',paddingVertical:20,paddingBottom:40,flexWrap:'wrap',width:80,textAlign:'center'}}>Share Now</Text>
                        <View style={{flexDirection:'row',
                                    alignItems: 'center',
                                    width:'100%',
                                    justifyContent:'space-evenly',
                                    paddingLeft:2,
                                    paddingRight:3,
                        }}>
                        <TouchableOpacity style={styles.shareOptionBtn} onPress={()=>{
                            this.shareThis(Share.Social.WHATSAPP);
                        }}>
                            <Image source={require('../assets/ws-icon.png')} width={30} height={30} style={{width:30,height:30}}/>
                            <Text style={styles.qnaHeading}>WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareOptionBtn} onPress={()=>{
                            this.shareThis(Share.Social.FACEBOOK);
                        }}>
                            <Image source={require('../assets/fb-icon.png')} width={30} height={30} style={{width:30,height:30}}/>
                            <Text style={styles.qnaHeading}>Facebook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style ={styles.shareOptionBtn} onPress={()=>{
                            this.shareThis(Share.Social.TWITTER);
                        }}>
                            <Image source={require('../assets/tt-icon.png')} width={30} height={30} style={{width:30,height:30}}/>
                             <Text style={styles.qnaHeading}>Twitter</Text>
                        </TouchableOpacity>
                       <TouchableOpacity style={styles.shareOptionBtn} onPress={()=>{
                            this.shareThis(Share.Social.EMAIL);
                        }}>
                            <Image source={require('../assets/mail-icon.png')} width={30} height={30} style={{width:30,height:30}}/>
                              <Text style={styles.qnaHeading}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareOptionBtn} onPress={()=>{
                            Share.open({
                                title: 'Share via',
                                message: 'some message',
                                url: 'some share url'
                            });
                        }}>
                            <Image source={require('../assets/more-icon.png')} width={5} height={20} style={{width:5,height:22}}/>
                              <Text style={styles.qnaHeading}>More</Text>
                        </TouchableOpacity>
                    </View> 
               </View>
        </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
        shareOptionBtn:{
            justifyContent:'center',
            alignItems:'center'
        },
            qnaHeading:{
            fontFamily:'AvenirLTStd-Medium',
            fontSize:11,
            flexWrap:'wrap',
            paddingVertical:10,
            alignItems:'center'
        
            }
    });
export default ShareApp;