import React, { Component } from 'react';
import {
  View, Image, Text, StyleSheet, Dimensions, ScrollView,
  TouchableOpacity, SafeAreaView, AsyncStorage
} from 'react-native';
import MainStyles from './Styles';
import Header from './Navigation/Header';
import Loader from './Loader';
import { SERVER_URL } from '../Constants';
import { FlatList } from 'react-native-gesture-handler';
var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');
myHeaders.set('Pragma', 'no-cache');
myHeaders.set('Expires', '0');
const { height, width } = Dimensions.get('window');
class Support extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: true, showingQA: 'q1',faqList:{} }
  }
  setUserData = async ()=> {
    await AsyncStorage.getItem('userData').then(async(userDataStringfy)=>{
      let userData = JSON.parse(userDataStringfy);
      this.setState({ userData });
      fetch(SERVER_URL + 'faq_list?type=' + userData.user_type, {
        method: 'GET',
        headers: myHeaders
      })
        .then(res => res.json())
        .then(r => {
          console.log(r);
          this.setState({loading:false,faqList:r.result});
        })
        .catch(err => {
          console.log(err);
          this.setState({loading:false});
        });
    });
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus',this.setUserData);
    //this.setUserData();
  }
  render() {

    const RemoveHiehgt = height - 50;
    return (

      <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
        <Loader loading={this.state.loading} />
        <Header pageName="FAQ" />
        <ScrollView style={{ height: RemoveHiehgt, flex: 1 }}>
          <View style={{ paddingVertical: 2, backgroundColor: '#FFFFFF', marginTop: 1, paddingHorizontal: 10 }}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'AvenirLTStd-Medium', fontSize: 17, color: '#151515', marginTop: 2, flexWrap: 'wrap' }}>How can we help you?</Text>
            </View>
          </View>



          <View style={{ paddingHorizontal: 10, marginTop: 8 }}>
            {
              this.state.faqList.length > 0 && 
              <FlatList 
              data={this.state.faqList}
              renderItem={({item,index})=>{
                console.log(item,index);
                return (
                    <View style={styles.qnaWrapper}>
                      <TouchableOpacity style={[(this.state.showingQA == index) ? { backgroundColor: '#147dbf' } : '', styles.qnaHeadingWrapper]} onPress={() => {
                        this.setState({ showingQA: index });
                      }}
                      >
                        <Text style={[styles.qnaHeading, (this.state.showingQA == index) ? { color: '#FFFFFF' } : { color: '#147dbf' }]}>{item.ques}</Text>
                        <Image source={require('../assets/s-d-arrow.png')} style={{ width: 18, height: 9,position:'absolute',right:10 }} />
                      </TouchableOpacity>
                      {
                        this.state.showingQA == index &&
                        <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                          <Text style={{ fontFamily: 'AvenirLTStd-Medium', fontSize: 13, color: '#151515' }}>{item.ans}</Text>
                        </View>
                      }
                    </View>
                );
              }}
              keyExtractor={(item)=>'key-'+item.id}
              />
            }
          </View>

        </ScrollView>

      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  qnaWrapper: {
    flex: 1,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    borderColor: '#1d7bc3',
    borderWidth: 1,
    borderRadius: 4
  },
  qnaHeadingWrapper: {
    paddingHorizontal: 10,
    paddingRight:30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  qnaHeading: {
    fontFamily: 'AvenirLTStd-Medium',
    fontSize: 18,
    flexWrap: 'wrap',
    paddingVertical: 10
  }
});
export default Support;