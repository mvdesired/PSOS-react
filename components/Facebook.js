import React,{Component} from 'react';
import {View,Linking } from 'react-native';
class Facebook extends Component{
    componentDidMount(){
        Linking.openURL('https://www.facebook.com/PharmacySOS/');
        setTimeout(()=>{this.props.navigation.goBack()},200);
    };
    render(){
        return(
            <View></View>
        );
    }
}
export default Facebook;