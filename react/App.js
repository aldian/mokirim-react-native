import React, { Component } from 'react';
import { AppRegistry, FlatList, ActivityIndicator, Text, View  } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/id';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { useScreens } from 'react-native-screens';
import { Root } from 'native-base';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
require('moment/locale/id.js');
import { GoogleSignin } from '@react-native-community/google-signin';
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
import { ChooseScheduleScreen } from './screens/public-nav/ChooseScheduleScreen';
import { ShipmentDetailsScreen } from './screens/public-nav/ShipmentDetailsScreen';
import { BookingDetailsScreen } from './screens/public-nav/BookingDetailsScreen';
import { PaymentScreen } from './screens/public-nav/PaymentScreen';
import { AskLoginScreen } from './screens/public-nav/AskLoginScreen';

import { ProfileScreen } from './screens/user-nav/ProfileScreen';
import { EditProfileScreen } from './screens/user-nav/EditProfileScreen';
import { SearchSubdistrictScreen } from './screens/public-nav/SearchSubdistrictScreen';

import { BookingCreatedScreen } from './screens/public-nav/BookingCreatedScreen';
import { ShipmentsScreen } from './screens/public-nav/ShipmentsScreen';
import { ShipmentStatusScreen } from './screens/public-nav/ShipmentStatusScreen';
import { MoneyTransferConfirmationScreen } from './screens/public-nav/MoneyTransferConfirmationScreen';

console.disableYellowBox = true

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
initI18n(store);
initNotifications(store);

useScreens();

GoogleSignin.configure();

const EditProfileNavigator = createStackNavigator({
  EditProfile: {screen: EditProfileScreen, path: 'editProfile'},
  SearchSubdistrict: {screen: SearchSubdistrictScreen, path: 'editProfile/searchSubdistrict'},
});

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
  Register: {screen: RegisterScreen, path: 'public/register'},
  Login: {screen: LoginScreen, path: 'public/login'},
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
  EditProfile: {screen: EditProfileScreen, path: 'user/editProfile'},
  SearchSubdistrict: {screen: SearchSubdistrictScreen, path: 'user/searchSubdistrict'},
  StationToStation: {screen: StationToStationScreen, path: 'user/stationToStation'},
  SearchStation: {screen: SearchStationScreen, path: 'user/searchStation'},
  SearchSchedule: {screen: SearchScheduleScreen, path: 'user/searchSchedule'},
  ChooseSchedule: {screen: ChooseScheduleScreen, path: 'user/chooseSchedule'},
  ShipmentDetails: {screen: ShipmentDetailsScreen, path: 'user/shipmentDetails'},
  BookingDetails: {screen: BookingDetailsScreen, path: 'user/bookingDetails'},
  Payment: {screen: PaymentScreen, path: 'user/payment'},
  AskLogin: {screen: AskLoginScreen, path: 'user/askLogin'},
}, {
  defaultNavigationOptions: {
    header: props => <NavigationHeader {...props}/>,
  }
});

const ShipmentsNavigator = createStackNavigator({
  Shipments: {screen: ShipmentsScreen, path: 'user/shipments'},
  BookingCreated: {screen: BookingCreatedScreen, path: 'user/bookingCreated/:id'},
  ShipmentStatus: {screen: ShipmentStatusScreen, path: 'user/shipmentStatus/:id'},
  MoneyTransferConfirmation: {screen: MoneyTransferConfirmationScreen, path: 'user/moneyTransferConfirmation/:id'},
}, {
  defaultNavigationOptions: {
    header: props => <NavigationHeader {...props}/>,
  }
});

const SwitchNavigator = createSwitchNavigator({
  Splash: SplashScreen,
  Intro: IntroNavigator,
  Public: PublicNavigator,
  EditProfileNav: EditProfileNavigator,
  User: UserNavigator,
  ShipmentsNav: ShipmentsNavigator,
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
