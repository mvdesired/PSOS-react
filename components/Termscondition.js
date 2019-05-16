import React,{Component} from 'react';
import {View,ImageBackground, Image,Text, StyleSheet,Dimensions,ScrollView, TouchableOpacity,SafeAreaView } from 'react-native';
import MainStyles from './Styles';
const { height, width } = Dimensions.get('window');
class Termscondition  extends Component{
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
                    
                    <Text style={{fontFamily:'AvenirLTStd-Roman',color:'#FFFFFF',fontSize:16,marginRight:130,flexWrap:'wrap'}}>Term's / Conditions</Text>
                    <View style={{flexDirection:'row',marginLeft:10}}>
                        <TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={{height:RemoveHiehgt,flex:1,paddingHorizontal:15,backgroundColor:'#FFFFFF',marginTop:10}}>
                    
                <View style={{justifyContent: 'center'}}>
                  <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize:20,color:'#151515',marginTop:20,flexWrap:'wrap'}}>Lorem Ipsum has</Text>
                  <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize:16,color:'#757575',marginTop:20,flexWrap:'wrap',lineHeight:18}}>Lorem Ipsum is that it has a more-or-less normal distribution of letters ,as opposed to using 'Content here, content here',marking it look like redable English.</Text>
                </View>
                <View style={{justifyContent: 'center'}}>
                <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize:16,color:'#757575',marginTop:20,flexWrap:'wrap',lineHeight:18}}>
                  Lorem Ipsum is that it has a more-or-less normal distribution of letters ,as opposed to using 'Content here, content here',marking it look like redable English.Many desktop publishing packages and web page editors now use Lorem Ipsum as their deafault model text.</Text>
                </View>
                <View style={{justifyContent: 'center'}}>
                <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize:16,color:'#757575',marginTop:20,flexWrap:'wrap',lineHeight:18}}>
                  Lorem Ipsum is that it has a more-or-less normal 
                  distribution of letters ,as opposed to using 'Content here,
                 content here',marking it look like redable English.</Text>
                </View>
                <View style={{justifyContent: 'center'}}>
                <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize:16,color:'#757575',marginTop:20,flexWrap:'wrap',lineHeight:18}}>
                  Lorem Ipsum is that it has a more-or-less normal 
                  distribution of letters ,as opposed to using 'Content here,
                 content here',marking it look like redable English.Many desktop publishing packages
                  and web page editors now use Lorem Ipsum as their deafault model text.</Text>
                </View>
                </ScrollView>
        </SafeAreaView>
       );
    }
}
const styles = StyleSheet.create({
});
export default Termscondition;