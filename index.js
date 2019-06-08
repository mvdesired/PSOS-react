/**
 * @format
 */

import {AppRegistry,NativeModules} from 'react-native';
import PSOSApp from './App';
NativeModules.ExceptionsManager = null;
console.reportErrorsAsExceptions = false;
AppRegistry.registerComponent('psos', () => PSOSApp);
