import React,{Component} from 'react';
import {View,Linking } from 'react-native';
class Twitter extends Component{
    componentDidMount(){
        Linking.openURL('https://twitter.com/pharmacysos');
        setTimeout(()=>{this.props.navigation.goBack()},200);
    };
    render(){
        return(
            <View></View>
        );
    }
}
export default Twitter;