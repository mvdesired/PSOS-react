/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Text, View,SafeAreaView } from 'react-native';
import Dashboard from '../Employer/Dashboard';
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

function createScreen(label, icon, Component) {    
    return class extends React.Component {
        static navigationOptions = ({ navigation }) =>  {
            const { params } = navigation.state;
            return {
                drawerLabel: ()=>{
                    return label
                },
                drawerIcon: () => (
                    <Icon name={icon} style={{ fontSize: 20, color: '#147dbf' }} />
                )
            }
        };
        render() {
            return <Component {...this.props} />;
        }
    }
}

export const DashboardScreen = createScreen('Home','home',Dashboard);