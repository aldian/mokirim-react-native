import React from 'react';
import { Text, View, Image } from 'react-native';
import {
  Container, Content,
  StyleProvider, Toast,
} from 'native-base';
import {connect} from 'react-redux';
import Actions from '../state/Actions';
import styles from '../styles';
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';
import Database from '../utils/database';

class _SplashScreen extends React.Component {
  componentDidMount() {
    const timerStart = (new Date()).getTime();
    const delay = 2000;

    this.props.loadAppStatesFromDb(this.props.states, delay).then(() => {
      let nextScreen = 'Register';
      if (!this.props.states.introFinished) {
        nextScreen = 'IntroWhy';
      } else if (this.props.states.loggedIn) {
        if (this.props.states.editProfileForm.id) {
          nextScreen = 'Dashboard';
        } else {
          nextScreen = 'EditProfile';
        }
      }

      const accessToken = (
        this.props.states.accessToken || this.props.states.device.token
      );
      this.props.downloadMasterData(this.props.states.currentLanguage, accessToken);

      if (this.props.states.splashShown) {
        this.props.navigation.navigate(nextScreen, {hasBack: false});
      } else {
        this.props.updateAppStates({splashShown: true});

        Database.openDatabase().then(db => {
          Database.updateUserStates(db, {splashShown: "1"});
        });

        const timerStop = (new Date()).getTime();
        let remainingDelay = delay - (timerStop - timerStart);

        setTimeout(() => {
          this.props.navigation.navigate(nextScreen, {hasBack: false});
        }, remainingDelay);
      }
    }).catch(error => {
      Toast.show({text: error, buttonText: "OK", duration: 60000});
    });
  }

  render() {
    return (
      <StyleProvider style={getTheme(themeVars)}>
        <View style={[styles.screen, styles.splashScreen]}>
          <View style={styles.content}>
            <Image source={require('../img/mokirim_white.png')} style={{flex: 1, width: 200, height: 200, resizeMode: 'contain'}}/>
          </View>
        </View>
      </StyleProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    states: state.appReducer,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateAppStates: states => dispatch(Actions.updateAppStates(states)),
    downloadMasterData: (languageCode, accessToken) => dispatch(Actions.downloadMasterData(languageCode, accessToken)),
    loadAppStatesFromDb: (states, delay) => (
      dispatch(Actions.loadAppStatesFromDb(states, delay))
    ),
  }
};

export const SplashScreen = connect(mapStateToProps, mapDispatchToProps)(_SplashScreen);
