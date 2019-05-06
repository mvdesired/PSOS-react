import React,{Component} from 'react';
import {View,ImageBackground, Image,Text,StyleSheet,TextInput,Dimensions,ScrollView, TouchableOpacity,SafeAreaView } from 'react-native';
import MainStyles from './Styles';
const { height, width } = Dimensions.get('window');
class Support  extends Component{
    constructor(props) {
        super(props);
        this.state={loading:false}
    }
    componentDidMount(){
    }
    render(){
        const RemoveHiehgt = height - 50;
        return (

            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>

                    <View style={MainStyles.navHeaderWrapper}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.goBack();}}>
                        <Image source={require('../assets/back-icon.png')} style={{width:10,height:19}}/>
                    </TouchableOpacity>
                    
                    <Text style={{fontFamily:'AvenirLTStd-Roman',color:'#FFFFFF',fontSize:16,marginRight:130,flexWrap:'wrap'}}>Support</Text>
                    <View style={{flexDirection:'row',marginLeft:10}}>
                        <TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={{height:RemoveHiehgt,flex:1}}>

                <View style={{paddingVertical:2,backgroundColor:'#FFFFFF',marginTop:5,paddingHorizontal:10}}>

                  <View style={{justifyContent: 'center'}}>
                  <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize:17,color:'#151515',marginTop:2,flexWrap:'wrap'}}>How can we help you ?</Text>
                </View>
              </View>





              <View style={{paddingHorizontal:10}}>
                <View style={{flex: 1,flexDirection:'row',marginVertical:5,paddingHorizontal:10,backgroundColor: '#FFFFFF',borderColor:'#1d7bc3',borderWidth:1,height:40,borderRadius:10,marginTop:20}}>
                    <View style={{     }}>
                    
                    </View>
                    <Text style={{fontFamily:'AvenirLTStd-Medium',marginLeft:10,fontSize:20,color:'#147dbf',marginTop:2,flexWrap:'wrap'}}>Question ?</Text>
                </View>
              </View>           

               
              <View style={{paddingHorizontal:10}}>
                <View style={{flex: 1,flexDirection:'row',marginVertical:5,paddingHorizontal:10,backgroundColor: '#FFFFFF',borderColor:'#1d7bc3',borderWidth:1,height:40,borderRadius:10}}>
                    <View style={{       }}>

                    </View>
                    <Text style={{fontFamily:'AvenirLTStd-Medium',marginLeft:10,fontSize:20,color:'#147dbf',marginTop:1,flexWrap:'wrap'}}>Question ?</Text>
                </View>
              </View>         

              <View style={{paddingHorizontal:10}}>
                <View style={{flex: 1,flexDirection:'row',marginVertical:5,paddingHorizontal:10,backgroundColor: '#FFFFFF',borderColor:'#1d7bc3',borderWidth:1,height:40,borderRadius:10}}>
                    <View style={{       }}>

                    </View>
                    <Text style={{fontFamily:'AvenirLTStd-Medium',marginLeft:10,fontSize:20,color:'#147dbf',marginTop:2,flexWrap:'wrap'}}>Question ?</Text>
                </View>
              </View>         

              <View style={{paddingHorizontal:10}}>
                <View style={{flex: 1,flexDirection:'row',marginVertical:5,paddingHorizontal:10,backgroundColor: '#FFFFFF',borderColor:'#1d7bc3',borderWidth:1,height:40, borderRadius:10}}>
                    <View style={{       }}>

                    </View>
                    <Text style={{fontFamily:'AvenirLTStd-Medium',marginLeft:10,fontSize:20,color:'#147dbf',marginTop:2,flexWrap:'wrap'}}>Question ?</Text>
                </View>
              </View>         

              <View style={{paddingHorizontal:10}}>
                <View style={{flex: 1,flexDirection:'row',marginVertical:5,paddingHorizontal:10,backgroundColor: '#FFFFFF',borderColor:'#1d7bc3',borderWidth:1,height:40,borderRadius:10}}>
                    <View style={{       }}>

                    </View>
                    <Text style={{fontFamily:'AvenirLTStd-Medium',marginLeft:10,fontSize:20,color:'#147dbf',marginTop:2,flexWrap:'wrap'}}>Question ?</Text>
                </View>
              </View>         

              <View style={{paddingHorizontal:10}}>
                <View style={{flex: 1,flexDirection:'row',marginVertical:5,paddingHorizontal:10,backgroundColor: '#FFFFFF',borderColor:'#1d7bc3',borderWidth:1,height:40,borderRadius:10}}>
                    <View style={{       }}>

                    </View>
                    <Text style={{fontFamily:'AvenirLTStd-Medium',marginLeft:10,fontSize:20,color:'#147dbf',marginTop:2,flexWrap:'wrap'}}>Question ?</Text>
                </View>
              </View>         

              <View style={{paddingHorizontal:10}}>
                <View style={{flex: 1,flexDirection:'row',marginVertical:5,paddingHorizontal:10,backgroundColor: '#FFFFFF',borderColor:'#1d7bc3',borderWidth:1,height:40,borderRadius:10}}>
                    <View style={{       }}>

                    </View>
                    <Text style={{fontFamily:'AvenirLTStd-Medium',marginLeft:10,fontSize:20,color:'#147dbf',marginTop:2,flexWrap:'wrap'}}>Question ?</Text>
                </View>
              </View>         

 

            </ScrollView>

        </SafeAreaView>
       );
    }
}
const styles = StyleSheet.create({

});
export default Support;