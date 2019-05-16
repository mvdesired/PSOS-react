/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Text, View,SafeAreaView,Image,AsyncStorage } from 'react-native';
import Dashboard from '../Employer/Dashboard';
import Pharmacy from '../Employer/Pharmacy';
import Notifications from '../Employer/Notifications';
import AppliedJob from '../Locum/AppliedJobs';
import Profile from '../Employer/Profile';
import About from '../About';
import Support from '../Support';
import Website from '../Website';
import Twitter from '../Twitter';
import Facebook from '../Facebook';
import ShareApp from '../ShareApp';
import Logout from '../SignScreens/Logout';
const assetsPath = '../../assets/';
function createEmptyScreen(label, icon) {
    return class extends React.Component {
        static navigationOptions = {
            drawerLabel: label,
            drawerIcon: () => (
                <Icon name={icon} solid={true} style={{ fontSize: 20, color: '#147dbf' }} />
            )
        };
        render() {
            return <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}><Text>{label}</Text></View>;
        }
    }
}
function createScreen(label, Icon, Component) {    
    return class extends React.Component {
        static navigationOptions = ({ navigation }) =>  {
            const { params } = navigation.state;
            return {
                drawerLabel: ()=>{
                    return label
                },
                drawerIcon: () => (
                    Icon
                )
            }
        };
        render() {
            return <Component {...this.props} />;
        }
    }
}
export const DashboardScreen = createScreen('Home',<Image source={require(assetsPath+'home-d-icon.png')} style={{width:15,height:13}} />,Dashboard);
export const ProfileScreen = createScreen('Profile',<Image source={require(assetsPath+'user-d-icon.png')} style={{width:15,height:13}} />,Profile);
export const NotificationsScreen = createScreen('Notifications',<Image source={require(assetsPath+'noti-d-icon.png')} style={{width:15,height:17}} />,Notifications);
export const WebsiteScreen = createScreen('Website',<Image source={require(assetsPath+'globe-icon.png')} style={{width:15,height:15}} />,Website);
export const TwitterScreen = createScreen('Twitter',<Image source={require(assetsPath+'t-d-icon.png')} style={{width:18,height:15}} />,Twitter);
export const FacebookScreen = createScreen('Facebook',<Image source={require(assetsPath+'f-d-icon.png')} style={{width:15,height:15}} />,Facebook);
export const ShareAppScreen = createScreen('Share App',<Image source={require(assetsPath+'share-d-icon.png')} style={{width:15,height:15}} />,ShareApp);
export const SupportScreen = createScreen('Support FAQ',<Image source={require(assetsPath+'support-icon.png')} style={{width:18,height:21}} />,Support);
export const AboutScreen = createScreen('About',<Image source={require(assetsPath+'about-d-icon.png')} style={{width:18,height:11}} />,About);
export const LogoutScreen = createScreen('Logout',<Image source={require(assetsPath+'logout-d-icon.png')} style={{width:15,height:15}} />,Logout);
export const PharmacyScreen = createScreen('Pharmacy',<Image source={require(assetsPath+'phar-d-icon.png')} style={{width:18,height:15}} />,Pharmacy);
export const AppliedScreen = createScreen('Applied Jobs',<Image source={require(assetsPath+'applied-d-icon.png')} style={{width:18,height:16}} />,AppliedJob);