import React from 'react';
import { Text } from 'react-native';
import {connect} from 'react-redux';
import Actions from '../state/Actions';

class _SplashScreen extends React.Component {
  componentDidMount() {
    this.props.loadAppStatesFromDb(this.props.states, this.props.navigation.navigate, 2000);
  }

  render() {
    return <Text>SPLASH SCREEN AHAY BAGUS!!!</Text>;
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
