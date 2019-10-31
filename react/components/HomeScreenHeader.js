import React from 'react';
import {connect} from 'react-redux';
import {Image, View} from 'react-native';
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
      <Header noShadow style={{backgroundColor: themeVars.toolbarDefaultBg}}>
        <HeaderLeft style={{flex: 0, paddingRight: 8}}>
          {this.props.loggedIn ?
            <Image source={require('../img/mokirim_white.png')} style={{flex: 1, alignSelf: 'center', width: 100, height: 16, resizeMode: 'contain'}}/> :
            <Image source={require('../img/mokirim_logo.png')} style={{flex: 1, alignSelf: 'center', width: 24, height: 24, resizeMode: 'contain'}}/>
          }
        </HeaderLeft>
        <HeaderBody>
          <HeaderTitle>{this.props.loggedIn ? null : translate("headerWelcome")}</HeaderTitle>
        </HeaderBody>
        {(this.props.loggedIn && this.props.profile.name) ?
          <HeaderRight>
            <Text style={{color: 'white'}}>
              {translate("messageHello", {name: this.props.profile.name.split(/\s+/, 1)[0]})}
            </Text>
          </HeaderRight> :
          null
        }
      </Header>
    </StyleProvider>;
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    loggedIn: state.appReducer.loggedIn,
    profile: state.appReducer.editProfileForm,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const HomeScreenHeader = connect(mapStateToProps, mapDispatchToProps)(_HomeScreenHeader);
