import React,{Component} from 'react';
import {View,ImageBackground, Image,Text, StyleSheet, TouchableOpacity,Dimensions } from 'react-native';
import Loader from './Loader';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppIntroSlider from 'react-native-app-intro-slider';
import MainStyles from './Styles';
const { height, width } = Dimensions.get('window');
const slides = [
    {
      key: 'somethun',
      title: 'Post A Job',
      image: require('../assets/intro-02.png'),
      backgroundColor: '#59b2ab',
    },
    {
      key: 'somethun-dos',
      title: 'Easily pay invoice',
      image: require('../assets/intro-05.png'),
      backgroundColor: '#febe29',
    },
    {
      key: 'somethun1',
      title: 'Find and hire Locums anytime anywhere',
      image: require('../assets/intro-04.png'),
      backgroundColor: '#22bcb5',
    },
    {
      key: 'somethun4',
      title: 'Chat and notifications',
      image: require('../assets/intro-06.png'),
      backgroundColor: '#22bcb5',
    },
    // {
    //   key: 'somethun5',
    //   title: 'Easily share on social media',
    //   image: require('../assets/intro-01.png'),
    //   backgroundColor: '#22bcb5',
    // }
  ];
class IntroScreenEmployer extends Component{
    constructor(props) {
        super(props);
        this.state={
            loading:false,
            currentBullet:0,
            forwardBtn:'Skip',
            introgImagesList:[
                require('../assets/intro-02.png'),
                require('../assets/intro-03.png'),
                require('../assets/intro-04.png'),
                require('../assets/intro-05.png'),
                //require('../assets/intro-01.png'),
            ],
            introText:[
                'Post A Job',
                'Get Notifications',
                'Feedback',
                'Free Download and Post',
            ],
            introTagline:[
                'In just a few clicks!  With your pharmacy details saved with in the application, it’s easy to quickly post a shift.',
                'Get notifications of new jobs in your state as a locum, and applications as an employer for shifts you have posted.',
                'View locum profiles and choose the best application based for your position.',
                'You can post shifts free of charge. Pay only for successfully hiring a pharmacist.'
            ]
        }
    }
    _renderItem = ({item}) => {
        return (
            <View  style={{alignItems:'center',justifyContent:'center',marginTop:40}}>
                <Image source={item.image} style={{width:250,height:250}} />
            </View>
        );
      }
    componentDidMount = ()=>{
        this.props.navigation.addListener('willFocus',payload=>{
            if((payload.context).search('Navigation/BACK_Root') != -1){
                BackHandler.exitApp();
            }
        });
    }
    runSlider = ()=>{
        setInterval(()=>{
            if(this.state.currentBullet < 4){
                this.setState({currentBullet:this.state.currentBullet+1});
            }
            else{
                this.setState({currentBullet:0});
            }
        },5000);
    }
    slideChanged = (index)=>{
        this.setState({currentBullet:index});
        if(index == slides.length - 1){
            this.setState({forwardBtn:'Get Started'});
        }
        else{
            this.setState({forwardBtn:'SKIP'});
        }
    }
    render(){
        const removeHeight = height - 200;
        return(
            <ImageBackground source={require('../assets/splash-bg.png')} style={{flex:1,backgroundColor:'#FFFFFF'}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <View style={{overflow:'hidden',height:300}}>
                        <AppIntroSlider style={{height:300}} hidePagination={true} dotStyle={styles.bullets} nextLabel="" doneLabel="" activeDotStyle={styles.bulletsActive} onSlideChange={(slideChange)=>{this.slideChanged(slideChange)}} renderItem={this._renderItem} slides={slides} />
                    </View>
                    {/* <View style={{width:250,height:250,overflow:'hidden'}}>
                        <Image source={this.state.introgImagesList[this.state.currentBullet]} style={{width:250,height:250}} />
                    </View> */}
                    <View style={styles.bulletWrapper}>
                        <View style={[styles.bullets,(this.state.currentBullet == 0)?styles.bulletsActive:{}]}></View>
                        <View style={[styles.bullets,(this.state.currentBullet == 1)?styles.bulletsActive:{}]}></View>
                        <View style={[styles.bullets,(this.state.currentBullet == 2)?styles.bulletsActive:{}]}></View>
                        <View style={[styles.bullets,(this.state.currentBullet == 3)?styles.bulletsActive:{}]}></View>
                        {/* <View style={[styles.bullets,(this.state.currentBullet == 4)?styles.bulletsActive:{}]}></View> */}
                    </View>
                    <View style={styles.TextWrapper}>
                        <Text style={{fontFamily:"AvenirLTStd-Heavy",fontSize:16}}>{this.state.introText[this.state.currentBullet]}</Text>
                        <Text style={{fontFamily:"AvenirLTStd-Light",fontSize:14,marginTop:10,textAlign:'center',height:65,lineHeight:18}}>{this.state.introTagline[this.state.currentBullet]}</Text>
                    </View>
                    <TouchableOpacity style={[MainStyles.psosBtn,MainStyles.psosBtnSm,{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:20}]} onPress={()=>{
                        this.props.navigation.navigate('Home');
                    }}>
                        <Text style={[MainStyles.psosBtnText,MainStyles.psosBtnXsText,{marginRight:5}]}>{this.state.forwardBtn}</Text>
                        <Icon name="chevron-right" style={[MainStyles.psosBtnText,MainStyles.psosBtnXsText]} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }
}
export default IntroScreenEmployer;
const styles = StyleSheet.create({
    bulletWrapper:{
        marginVertical:30,
        flexDirection:"row"
    },
    bullets:{
        width:16,
        marginHorizontal:5,
        height:16,
        backgroundColor:'#c9cdd0',
        borderRadius:100
    },
    bulletsActive:{
        backgroundColor:'#66707c',
        width:16,
        marginHorizontal:5,
        height:16,
        borderRadius:100
    },
    TextWrapper:{
        marginTop:0,
        marginBottom:30,
        alignItems:'center',
        maxWidth : 300,
        alignItems:'center',
        justifyContent:'center'
    },
    image:{width:250,height:250}
});