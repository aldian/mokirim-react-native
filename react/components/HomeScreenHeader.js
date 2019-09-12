import React from 'react';
import {connect} from 'react-redux';
import {Image} from 'react-native';
import {
  Button, Text,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  StyleProvider,
} from 'native-base';
import { translate } from "../utils/i18n";
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';

class _HomeScreenHeader extends React.Component {
  render() {
    return <StyleProvider style={getTheme(themeVars)}>
      <Header noShadow><HeaderLeft/><HeaderBody>
      <HeaderTitle>{this.props.loggedIn ? translate("headerDashboard") : translate("headerWelcome")}</HeaderTitle>
      </HeaderBody><HeaderRight/></Header>
    </StyleProvider>;
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    loggedIn: state.appReducer.loggedIn,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const HomeScreenHeader = connect(mapStateToProps, mapDispatchToProps)(_HomeScreenHeader);
