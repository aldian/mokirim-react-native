import React, { Component } from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './reducers';
import { HomeScreen } from './HomeScreen';
import { LoginScreen } from './LoginScreen';
import { ProfileScreen } from './ProfileScreen';
import { AppRegistry, FlatList, ActivityIndicator, Text, View  } from 'react-native';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Login: {screen: LoginScreen, path: 'login'},
  Profile: {screen: ProfileScreen, path: 'profile'},
});

const Navigation = createAppContainer(MainNavigator);

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

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
