import React,{Component} from 'react';
import {View,Linking } from 'react-native';
class Website extends Component{
    componentDidMount(){
        Linking.openURL('https://pharmacysos.com.au/');
        setTimeout(()=>{this.props.navigation.goBack()},200);
    };
    render(){
        return(
            <View></View>
        );
    }
}
export default Website;