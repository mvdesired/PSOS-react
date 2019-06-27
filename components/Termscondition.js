import React,{Component} from 'react';
import {View,ImageBackground, Image,Text, StyleSheet,Dimensions,ScrollView, TouchableOpacity,SafeAreaView } from 'react-native';
import MainStyles from './Styles';
import Loader from './Loader';
import Header from './Navigation/Header';
import { SERVER_URL } from '../Constants';
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
//myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
const { height, width } = Dimensions.get('window');
class Termscondition  extends Component{
    constructor(props) {
        super(props);
        this.state={loading:true,page_text:''}
    }
    componentDidMount(){
      fetch(SERVER_URL+'app_page_text?page_name=terms',{
        method:'GET',
        headers:myHeaders
      })
      .then(res=>res.json())
      .then(response=>{
        this.setState({loading:false,page_text:response.page_text});
        console.log(response);
      })
      .catch(err=>{
        console.log(err);
      });
    }
    render(){
        const RemoveHiehgt = height - 50;
        return (

            <SafeAreaView style={{flex:1,backgroundColor:'#f0f0f0'}}>
              <Loader loading={this.state.loading} />
               <Header pageName="Term's / Conditions" />
                <ScrollView style={{height:RemoveHiehgt,flex:1,paddingHorizontal:15,backgroundColor:'#FFFFFF',marginTop:10}}>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize:16,color:'#757575',marginTop:20,flexWrap:'wrap',lineHeight:18}}>{this.state.page_text}</Text>
                  </View>
                </ScrollView>
        </SafeAreaView>
       );
    }
}
const styles = StyleSheet.create({
});
export default Termscondition;