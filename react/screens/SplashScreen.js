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

class _SplashScreen extends React.Component {
  componentDidMount() {
    this.props.loadAppStatesFromDb(this.props.states, 2000).then(nextScreen => {
      this.props.navigation.navigate(nextScreen);
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
    loadAppStatesFromDb: (states, delay) => (
      dispatch(Actions.loadAppStatesFromDb(states, delay))
    ),
  }
};

export const SplashScreen = connect(mapStateToProps, mapDispatchToProps)(_SplashScreen);
