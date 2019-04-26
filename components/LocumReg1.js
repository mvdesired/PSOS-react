import React,{Component} from 'react';
import {View,SafeAreaView, Image,Text, StyleSheet } from 'react-native';
import Loader from './Loader';
class LocumReg1Screen extends Component{
    constructor(props) {
        super(props);
        this.state={loading:false}
    }
    componentDidMount(){

    }
    render(){
        return (
            <SafeAreaView>
                <Loader loading={this.state.loading} />
                <View style={[{
                    paddingVertical: 5,
                    borderBottomWidth:2,
                    borderBottomColor: '#bebebe',
                    alignItems:'center',
                    justifyContent:'center'
                }]}>
                    <Image source={require('../assets/psos-logo.png')} style={{width:80,height:58}}/>
                </View>
                <View style={{
                    flex:1
                }}>
                    
                </View>
            </SafeAreaView>
        );
    }
}
export default LocumReg1Screen;