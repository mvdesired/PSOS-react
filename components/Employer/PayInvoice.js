import React,{Component} from 'react';
import {View,Linking } from 'react-native';
class PayInvoice extends Component{
    componentDidMount(){
        Linking.openURL('https://payments.integrapay.com.au/RTP/Payment.aspx?b=407e6a97-a658-408e-aace-903a71937238');
        setTimeout(()=>{this.props.navigation.goBack()},200);
    };
    render(){
        return(
            <View></View>
        );
    }
}
export default PayInvoice;