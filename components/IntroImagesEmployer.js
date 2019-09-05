import React,{Component} from 'react';
import {View,ImageBackground, Image,Text, StyleSheet, TouchableOpacity,Dimensions } from 'react-native';
import Loader from './Loader';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppIntroSlider from 'react-native-app-intro-slider';
import MainStyles from './Styles';
const { height, width } = Dimensions.get('window');
const slides = [
    {
      key: 'somethun1',
      image: require('../assets/intro-new-img-1.png'),
    },
    {
      key: 'somethun2',
      image: require('../assets/intro-new-img-2.png'),
    },
    {
      key: 'somethun3',
      image: require('../assets/intro-new-img-3.png'),
    },
    {
      key: 'somethun4',
      image: require('../assets/intro-new-img-4.png'),
    },
    {
        key: 'somethun5',
        image: require('../assets/intro-new-img-5.png'),
    },
    {
        key: 'somethun6',
        image: require('../assets/intro-new-img-6.png'),
    },
    {
        key: 'somethun7',
        image: require('../assets/intro-new-img-7.png'),
    },
    {
        key: 'somethun8',
        image: require('../assets/intro-new-img-8.png'),
    }
  ];
class IntroScreenLocum extends Component{
    constructor(props) {
        super(props);
        this.state={
            loading:false,
            currentBullet:0,
            forwardBtn:'Skip',
            introTagline:[
                'Here is an idea!  An application specifically designed for locuming!',
                'Introducing the Pharmacy SOS Locuming App for Employers & locums.',
                'Post and view jobs short term locuming jobs and permanent opportunities. ',
                'Build up a profile through feedback.  Employers can choose the best candidate.',
                'Operates across all mobile android and iOS devices with in-app chat feature.',
                'Hit "Go" for direct navigation, enter time sheets, submit availability.',
                'Post, view and apply for free. Employers pay only for successful  placements.',
                'For more information, please see FAQ section and terms & conditions in app.'
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
    slideChanged = (index)=>{
        this.setState({currentBullet:index});
        if(index == slides.length - 1){
            this.setState({forwardBtn:'START'});
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
                        {
                            slides.map((item,index)=>{
                                return(
                                    <View style={[styles.bullets,(this.state.currentBullet == index)?styles.bulletsActive:{}]}></View>
                                )
                            })
                        }
                        {/* <View style={[styles.bullets,(this.state.currentBullet == 4)?styles.bulletsActive:{}]}></View> */}
                    </View>
                    <View style={styles.TextWrapper}>
                        {/* <Text style={{fontFamily:"AvenirLTStd-Heavy",fontSize:16,textAlign:'center'}}>{this.state.introText[this.state.currentBullet]}</Text> */}
                        <Text style={{fontFamily:"AvenirLTStd-Light",fontSize:14,marginTop:10,textAlign:'center'}}>{this.state.introTagline[this.state.currentBullet]}</Text>
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
export default IntroScreenLocum;
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
        maxWidth : 280,
        alignItems:'center',
        justifyContent:'center'
    },
    image:{width:250,height:250}
});