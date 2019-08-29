import React from 'react';
import { Text } from 'react-native';
import {connect} from 'react-redux';

class _Splash extends React.Component {
  render() {
    return <Text>SPLASH SCREEN!!!</Text>;
  }
}

const mapStateToProps = state => {
  return {
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const Splash = connect(mapStateToProps, mapDispatchToProps)(_Splash);
