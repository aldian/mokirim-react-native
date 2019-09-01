import React, { Component } from 'react';
import { AppRegistry, FlatList, ActivityIndicator, Text, View  } from 'react-native';
import {createStackNavigator, createSwitchNavigator, createAppContainer} from 'react-navigation';
import { useScreens } from 'react-native-screens';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
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
import { DashboardScreen } from './screens/user-nav/DashboardScreen';
import { ProfileScreen } from './screens/user-nav/ProfileScreen';

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
initI18n(store);
initNotifications(store);

useScreens();

const IntroNavigator = createStackNavigator({
  IntroWhy: {screen: IntroWhyScreen, path: 'introWhy'},
  IntroHow: {screen: IntroHowScreen, path: 'introHow'},
  IntroMonitoring: {screen: IntroMonitoringScreen, path: 'introMonitoring'},
}, {
  defaultNavigationOptions: {
    header: null,
  }
});

const PublicNavigator = createStackNavigator({
  Home: {screen: HomeScreen, path: 'home'},
  Login: {screen: LoginScreen, path: 'login'},
  Register: {screen: RegisterScreen, path: 'register'},
}, {
  defaultNavigationOptions: {
    header: props => <NavigationHeader {...props}/>,
  }
});

const UserNavigator = createStackNavigator({
  Dashboard: {screen: DashboardScreen, path: 'dashboard'},
  Profile: {screen: ProfileScreen, path: 'profile'},
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
      <Provider store={store}>
        <Navigation/>
      </Provider>
    );
  }
}

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
//import React, {Fragment} from 'react';
//import {
//  SafeAreaView,
//  StyleSheet,
//  ScrollView,
//  View,
//  Text,
//  StatusBar,
//} from 'react-native';
//
//import {
//  Header,
//  LearnMoreLinks,
//  Colors,
//  DebugInstructions,
//  ReloadInstructions,
//} from 'react-native/Libraries/NewAppScreen';
//
//const App = () => {
//  return (
//    <Fragment>
//      <StatusBar barStyle="dark-content" />
//      <SafeAreaView>
//        <ScrollView
//          contentInsetAdjustmentBehavior="automatic"
//          style={styles.scrollView}>
//          <Header />
//          {global.HermesInternal == null ? null : (
//            <View style={styles.engine}>
//              <Text style={styles.footer}>Engine: Hermes</Text>
//            </View>
//          )}
//          <View style={styles.body}>
//            <View style={styles.sectionContainer}>
//              <Text style={styles.sectionTitle}>Step One</Text>
//              <Text style={styles.sectionDescription}>
//                Edit <Text style={styles.highlight}>App.js</Text> to change this
//                screen and then come back to see your edits.
//              </Text>
//            </View>
//            <View style={styles.sectionContainer}>
//              <Text style={styles.sectionTitle}>See Your Changes</Text>
//              <Text style={styles.sectionDescription}>
//                <ReloadInstructions />
//              </Text>
//            </View>
//            <View style={styles.sectionContainer}>
//              <Text style={styles.sectionTitle}>Debug</Text>
//              <Text style={styles.sectionDescription}>
//                <DebugInstructions />
//              </Text>
//            </View>
//            <View style={styles.sectionContainer}>
//              <Text style={styles.sectionTitle}>Learn More</Text>
//              <Text style={styles.sectionDescription}>
//                Read the docs to discover what to do next:
//              </Text>
//            </View>
//            <LearnMoreLinks />
//          </View>
//        </ScrollView>
//      </SafeAreaView>
//    </Fragment>
//  );
//};
//
//const styles = StyleSheet.create({
//  scrollView: {
//    backgroundColor: Colors.lighter,
//  },
//  engine: {
//    position: 'absolute',
//    right: 0,
//  },
//  body: {
//    backgroundColor: Colors.white,
//  },
//  sectionContainer: {
//    marginTop: 32,
//    paddingHorizontal: 24,
//  },
//  sectionTitle: {
//    fontSize: 24,
//    fontWeight: '600',
//    color: Colors.black,
//  },
//  sectionDescription: {
//    marginTop: 8,
//    fontSize: 18,
//    fontWeight: '400',
//    color: Colors.dark,
//  },
//  highlight: {
//    fontWeight: '700',
//  },
//  footer: {
//    color: Colors.dark,
//    fontSize: 12,
//    fontWeight: '600',
//    padding: 4,
//    paddingRight: 12,
//    textAlign: 'right',
//  },
//});
//
//export default App;
