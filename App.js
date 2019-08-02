/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';

import { createAppContainer,NavigationActions } from 'react-navigation';
import {AsyncStorage} from 'react-native';
import Navigation from './components/Navigation/Navigation'
import { SENDER_ID } from './Constants';
import PushNotification from 'react-native-push-notification';
const AppContainer = createAppContainer(Navigation);
class PSOSApp extends Component {
  componentDidMount(){
    //this.goPusNotification(this.redirectOnPushNotifcation.bind(this));
    this.setUserData();
  }
  goPusNotification(onNotification){
    PushNotification.configure({
        //onRegister: onToken,
        onNotification: onNotification,
        senderID: SENDER_ID,
        permissions: {
            alert: true,
            badge: true,
            sound: true
        },
        popInitialNotification: true,
        requestPermissions: true,
    });
  }
  setUserData = async ()=>{
    await AsyncStorage.getItem('userData').then((userDataStringfy)=>{
      let userData = JSON.parse(userDataStringfy);
      if(userData){
        this.setState({userData});
        this.goPusNotification(this.redirectOnPushNotifcation.bind(this));
      }
    });
  }
  redirectOnPushNotifcation(notification) {
    if(notification.userInteraction){
      if(notification.chat_id){
          const navigateActionS = NavigationActions.navigate({
              routeName: 'ChatScreen',
              params:{chat_id:notification.chat_id}
          });
          this.props.navigation.dispatch(navigateActionS);
      }
      if(notification.job_id){
        var job_type = 'perm';
        if(notification.job_type == 'locum_shift'){
          job_type = 'shift';
        }
        var screenName = 'JobDetails';
        if(this.state.userData.user_type == "employer"){
          screenName = 'LocumList';
        }
        const navigateActionS = NavigationActions.navigate({
            routeName: screenName,
            params:{job_id:notification.job_id,job_type}
        });
        this.props.navigation.dispatch(navigateActionS);
      }
    }
  }
  render() {
    return <AppContainer />;
  }
}
export default PSOSApp;