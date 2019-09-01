import React from 'react';
import { Text, View } from 'react-native';
import {connect} from 'react-redux';
import Actions from '../state/Actions';
import styles from '../styles';

class _SplashScreen extends React.Component {
  componentDidMount() {
    this.props.loadAppStatesFromDb(this.props.states, this.props.navigation.navigate, 2000);
  }

  render() {
    return (
      <View style={[styles.screen, styles.splashScreen]}>
        <View style={styles.content}>
        <Text style={styles.splashText}>MOKIRIM</Text>
        </View>
      </View>
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
    loadAppStatesFromDb: (states, navigate, delay) => (
      dispatch(Actions.loadAppStatesFromDb(states, navigate, delay))
    ),
  }
};

export const SplashScreen = connect(mapStateToProps, mapDispatchToProps)(_SplashScreen);
