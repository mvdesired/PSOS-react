import React, { Component } from 'react';
import {NavigationActions,withNavigation } from 'react-navigation';
import PushNotification from 'react-native-push-notification';
import { SENDER_ID } from '../Constants';
class NotifService extends Component  {
    constructor(props) {
        super(props);
      //this.configure(this.onNotification);
      //this.lastId = 0;
    }
    configure() {
      PushNotification.configure({
        // (required) Called when a remote or local notification is opened or received
        onNotification: (notification)=>{
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
        }, //this._onNotification,
        // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
        senderID: SENDER_ID,
        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true
        },
        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,
        /**
          * (optional) default: true
          * - Specified if permissions (ios) and token (android and ios) will requested or not,
          * - if not, you must call PushNotificationsHandler.requestPermissions() later
          */
        requestPermissions: true,
      });
    }
}
export default withNavigation(NotifService);