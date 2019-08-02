import React, { Component } from 'react';
import { View, Text, SafeAreaView,Dimensions,Linking,ScrollView,TouchableOpacity } from 'react-native';
import Loader from './Loader';
import MainStyles from './Styles';
import Header from './Navigation/Header';
const { height, width } = Dimensions.get('window');
class ContactSupport extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading:false
        }
    }
    render() {
        const RemoveHiehgt = height - 50;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
                <Loader loading={this.state.loading} />
                <Header pageName="Contact Support" />
                <ScrollView style={{ height: RemoveHiehgt, flex: 1, paddingHorizontal: 15, marginTop: 10}} contentContainerStyle={{justifyContent: 'center',alignItems:'center'}}>
                    <TouchableOpacity style={[MainStyles.psosBtn,{alignItems:'center',marginBottom:20}]} onPress={()=>{
                        Linking.openURL('mailto:sos@pharmacysos.com.au?subject=App Support:');
                    }}>
                        <Text style={[MainStyles.psosBtnText,{}]}>Send an email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[MainStyles.psosBtn,{alignItems:'center'}]} onPress={()=>{
                        Linking.openURL('tel:1300505247');
                    }}>
                        <Text style={[MainStyles.psosBtnText,{}]}>Call 1300505247</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
export default ContactSupport;