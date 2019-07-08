/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';

import { createAppContainer,NavigationActions } from 'react-navigation';

import Navigation from './components/Navigation/Navigation'
import { SENDER_ID } from './Constants';
import PushNotification from 'react-native-push-notification';
const AppContainer = createAppContainer(Navigation);
class PSOSApp extends Component {
  componentDidMount(){
    //this.goPusNotification(this.redirectOnPushNotifcation.bind(this));
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
  redirectOnPushNotifcation(notification) {
    console.log(notification);
    if(notification.userInteraction){
      if(notification.chat_id){
          const navigateActionS = NavigationActions.navigate({
              routeName: 'ChatScreen',
              params:{chat_id:notification.chat_id}
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