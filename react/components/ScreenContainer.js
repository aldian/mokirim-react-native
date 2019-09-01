import React from 'react';
import {connect} from 'react-redux';
import { Text } from 'react-native';
import * as RNLocalize from "react-native-localize";
import Actions from '../state/Actions';

class _ScreenContainer extends React.Component {
  componentDidMount() {
    this.props.setErrorMessage('');
  }

  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

const mapStateToProps = state => {
  return {
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setErrorMessage: txt => dispatch(Actions.setErrorMessage(txt)),
  }
};

export const ScreenContainer = connect(mapStateToProps, mapDispatchToProps)(_ScreenContainer);
