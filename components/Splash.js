import React,{Component} from 'react';
import {View,ImageBackground, Image,Text, StyleSheet } from 'react-native';
import Loader from './Loader';
class SplashScreen extends Component{
    constructor(props) {
        super(props);
        this.state={loading:false}
    }
    componentDidMount(){
        const { navigation } = this.props;
        //navigation.navigate('Registration');
    }
    render(){
        return (
            <ImageBackground source={require('../assets/splash-bg.png')} style={{flex:1,backgroundColor:'#FFFFFF'}}>
                <Loader loading={this.state.loading} />
                <View style={{
                flex:1,justifyContent: 'center',alignItems:'center'
                }}>
                    <Image source={require('../assets/psos-logo.png')} style={{width:180,height:131}}/>
                </View>
                <View style={{position:'absolute',
                    alignItems:'center',
                    justifyContent:'center',
                    width:'100%',
                    bottom:20
                }}>
                    <Text style={{color:'#147dbf',marginBottom:5,fontFamily:'AvenirLTStd-Roman'}}>Version 1.0.0</Text>
                    <Text style={{color:'#147dbf',fontFamily:'AvenirLTStd-Roman'}}>Powerd by Pharmacy SOS</Text>
                </View>
            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({

});
export default SplashScreen;