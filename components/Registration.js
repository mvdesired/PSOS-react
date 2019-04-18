import React, { Component } from 'react';
import { View,Text,TouchableOpacity, ImageBackground,
    Platform,
    SafeAreaView,
} from 'react-native';
import { DrawerActions,NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from './Loader';
class Registration extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false
        }
    }
    render(){
        return(
            <SafeAreaView >
                <Loader loading={this.state.loading} />
                <View style={[{
                    alignItems:'center',
                    flexDirection:'row',
                    justifyContent:'space-between',
                    backgroundColor:'#147dbf',
                    paddingVertical: 15,
                }]}>
                    <View style={{alignItems:'center',flexDirection:'row'}}>
                        <TouchableOpacity style={{ paddingLeft: 12 }} onPress={() => {this.props.navigation.dispatch(DrawerActions.toggleDrawer())}}>
                            <Icon name="bars" style={{ fontSize: 24, color: '#FFFFFF' }} />
                        </TouchableOpacity>
                        <Text style={{fontSize:15,color:'#FFFFFF',marginLeft:40,fontFamily:'AvenirLTStd-Medium'}}>Pharmacy SOS Locuming</Text>
                    </View>
                </View>
                <View style={{
                        flex:1,
                        flexDirection:'column'
                    }}>
                        <TouchableOpacity style={{
                            width:'100%',
                            height:'50%'
                        }}>
                            <ImageBackground source={require('../assets/locum-r-bg.png')} style={{width:'100%',height:'100%'}}>
                                <Text>Job Seekers Registration</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
            </SafeAreaView>
        );
    }
}
export default Registration;