import React from 'react';
import {connect} from 'react-redux';
import { Text } from 'react-native';
import * as RNLocalize from "react-native-localize";
import Actions from '../state/Actions';
import { Splash } from './Splash';


class _ScreenContainer extends React.Component {
  componentDidMount() {
    if (!this.props.splashShown) {
      setTimeout(() => {
        this.props.clearSplash();
      }, 2000);
    }
  }

  render() {
    if (this.props.splashShown) {
      return <React.Fragment>{this.props.children}</React.Fragment>;
    }

    return <Splash/>;
  }
}

const mapStateToProps = state => {
  return {
    splashShown: state.appReducer.splashShown,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    clearSplash: () => dispatch(Actions.clearSplash()),
  }
};

export const ScreenContainer = connect(mapStateToProps, mapDispatchToProps)(_ScreenContainer);
