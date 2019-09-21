import React, { Component } from 'react';
import { AppRegistry, FlatList, ActivityIndicator, Text, View  } from 'react-native';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { useScreens } from 'react-native-screens';
import { Root } from 'native-base';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { GoogleSignin } from 'react-native-google-signin';
import { rootReducer } from './state/reducers';
import { initNotifications } from './utils/notifications';
import { initI18n } from './utils/i18n';
import { NavigationHeader } from './components/NavigationHeader';

import { SplashScreen } from './screens/SplashScreen';

import { IntroWhyScreen } from './screens/intro-nav/IntroWhyScreen';
import { IntroHowScreen } from './screens/intro-nav/IntroHowScreen';
import { IntroMonitoringScreen } from './screens/intro-nav/IntroMonitoringScreen';

import { HomeScreen } from './screens/public-nav/HomeScreen';
import { LoginScreen } from './screens/public-nav/LoginScreen';
import { RegisterScreen } from './screens/public-nav/RegisterScreen';
import { ResetPasswordScreen } from './screens/public-nav/ResetPasswordScreen';
import { MemberBenefitsScreen } from './screens/public-nav/MemberBenefitsScreen';
import { StationToStationScreen } from './screens/public-nav/StationToStationScreen';
import { SearchStationScreen } from './screens/public-nav/SearchStationScreen';
import { SearchScheduleScreen } from './screens/public-nav/SearchScheduleScreen';

import { ProfileScreen } from './screens/user-nav/ProfileScreen';

console.disableYellowBox = true

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
initI18n(store);
initNotifications(store);

useScreens();

GoogleSignin.configure();

const IntroNavigator = createStackNavigator({
  IntroWhy: {screen: IntroWhyScreen, path: 'intro/why'},
  IntroHow: {screen: IntroHowScreen, path: 'intro/wow'},
  IntroMonitoring: {screen: IntroMonitoringScreen, path: 'intro/monitoring'},
}, {
  defaultNavigationOptions: {
    header: null,
  }
});

const PublicNavigator = createStackNavigator({
  Login: {screen: LoginScreen, path: 'public/login'},
  Register: {screen: RegisterScreen, path: 'public/register'},
  ResetPassword: {screen: ResetPasswordScreen, path: 'public/resetPassword'},
  MemberBenefits: {screen: MemberBenefitsScreen, path: 'public/memberBenefits'},
}, {
  defaultNavigationOptions: {
    header: props => <NavigationHeader {...props}/>,
  }
});

const UserNavigator = createStackNavigator({
  Dashboard: {screen: HomeScreen, path: 'user/dashboard'},
  Profile: {screen: ProfileScreen, path: 'user/profile'},
  StationToStation: {screen: StationToStationScreen, path: 'user/stationToStation'},
  SearchStation: {screen: SearchStationScreen, path: 'user/searchStation'},
  SearchSchedule: {screen: SearchScheduleScreen, path: 'user/searchSchedule'},
}, {
  defaultNavigationOptions: {
    header: props => <NavigationHeader {...props}/>,
  }
});

const SwitchNavigator = createSwitchNavigator({
  Splash: SplashScreen,
  Intro: IntroNavigator,
  Public: PublicNavigator,
  User: UserNavigator,
});

const Navigation = createAppContainer(SwitchNavigator);

export default class App extends React.Component {
  render() {
    return (
      <Root>
        <Provider store={store}>
          <Navigation/>
        </Provider>
      </Root>
    );
  }
}
