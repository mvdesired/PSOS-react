/**
 * Bizzner App
 * http://bizzner.com
 *
 * @format
 * @flow
 */
import React from 'react';
import { ScrollView, TouchableOpacity,View,SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createDrawerNavigator, DrawerItems, createStackNavigator } from 'react-navigation';
import { HomeScreen } from './Screens';
import SplashScreen from '../Splash';
import LocumReg1Screen from '../LocumReg1';
import Registration from '../Registration';
import Login from '../SignScreens/Login';
const drawerItemStyle = { 
    borderBottomWidth: 1, 
    borderBottomColor: '#147dbf', 
    height: 60, 
    textAlign: 'left' 
};
const drawerLabelStyle = { 
    margin: 0, 
    fontSize: 15, 
    fontFamily: 'AvenirLTStd-Medium',
    paddingHorizontal:20
};
const Drawer = createDrawerNavigator({
    Home:{
        screen:HomeScreen
    }
},
    {
        initialRouteName: 'Home',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        drawerWidth: 250,
        contentComponent: props =>
            <SafeAreaView>
            <ScrollView style={{marginTop:10,padding:0}}>
                <TouchableOpacity style={{ paddingLeft: 20,justifyContent:'flex-end' }} onPress={props.navigation.closeDrawer}>
                    <Icon name="bars" style={{ fontSize: 20, color: '#147dbf' }} />
                </TouchableOpacity>
                <DrawerItems
                    {...props}
                    itemStyle={drawerItemStyle}
                    inactiveTintColor={'#147dbf'}
                    itemsContainerStyle={{ paddingHorizontal: 0 }}
                    labelStyle={drawerLabelStyle}
                    iconContainerStyle={{ marginHorizontal: 0, marginLeft: 16 }}
                    activeBackgroundColor={'#fff'}
                />

            </ScrollView>
            </SafeAreaView>
});
const shadow = {
    shadowColor: '#000', shadowRadius: 5, shadowOpacity: 0.6, shadowOffset: {
        width: 5, height: 0
    }
}
const Navigation = createStackNavigator({
    
    Splash: {
        screen: SplashScreen
    },
    Home: {
        screen: Drawer,
    },
    LocumReg1:{
        screen:LocumReg1Screen
    },
    Registration: {
        screen: Registration,
    },
    Login:{
        screen:Login
    }
}, {
    headerMode: 'none',
    initialRouteName: 'Login',
    containerOptions: {
        style: {
            backgroundColor: '#147dbf',
            flex: 1

            }
        }
    });
export default Navigation;