import React from 'react';
import {AsyncStorage} from 'react-native';
setUser = async ()=>{
    return await AsyncStorage.getItem('userData').then(val=>{
        return JSON.parse(val);
    });
}
export const userdata = setUser();