import React,{Component} from 'react';
import {View,ImageBackground, Image,Text, StyleSheet, TouchableOpacity,SafeAreaView } from 'react-native';
import Loader from './Loader';
import MainStyles from './Styles';
import Header from './Navigation/Header';
let pkg = require('../package.json');
class AboutScreen extends Component{
    constructor(props) {
        super(props);
        this.state={loading:false}
    }
    componentDidMount(){
    }
    render(){
       const {navigation} = this.props;
        return (
            <SafeAreaView style={{flex:1}}>
                <ImageBackground source={require('../assets/splash-bg.png')} style={{flex:1,backgroundColor:'#FFFFFF'}}>
                    <Loader loading={this.state.loading} />
                    <Header pageName="About" />
                    <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                        <Image source={require('../assets/web-logo.png')} style={{width:280,height:48}}/>
                        <Text style={{color:'#676767',marginTop:40,flexWrap:'wrap',width:80,textAlign:'center'}}>Version {pkg.version}</Text>
                    </View>
                    <View style={{position:'absolute',alignItems:'center',justifyContent:'center',width:'100%',bottom:20,flexDirection: 'row'}}>
                        <TouchableOpacity onPress={()=>{navigation.navigate('TnC')}}>
                            <Text style={{color:'#147dbf',fontFamily:'AvenirLTStd-Roman'}}>Terms &amp; Conditions</Text>
                        </TouchableOpacity>
                        <View style={{borderLeftColor:'#1d7bc3',borderLeftWidth:1,marginHorizontal:5}}><Text>&nbsp;</Text></View>
                        <TouchableOpacity onPress={()=>{navigation.navigate('Privacy')}}>
                            <Text style={{color:'#147dbf',fontFamily:'AvenirLTStd-Roman'}}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({

});
export default AboutScreen;