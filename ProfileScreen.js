import React from 'react';
import {connect} from 'react-redux';
import { MokirimScreen } from './MokirimScreen';
import { translate } from "./utils/i18n";

class _ProfileScreen extends MokirimScreen {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    title: navigation.getParam('title', translate('headerProfile'))
  });
  setNavigationHeader() {
   this.props.navigation.setParams({title: translate('headerProfile')});
  }

  render() {
    const {navigate} = this.props.navigation;
    return null;
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

export const ProfileScreen = connect(mapStateToProps, mapDispatchToProps)(_ProfileScreen);
