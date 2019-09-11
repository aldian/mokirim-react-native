import React from 'react';
import {connect} from 'react-redux';
import {Image} from 'react-native';
import {
  Button, Text,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, Spinner, StyleProvider,
} from 'native-base';
import { translate } from "../utils/i18n";
import getTheme from '../theme/components';
//import themeVars from '../theme/variables/material';
import themeVars from '../theme/variables/whiteHeader';

class _LoginScreenHeader extends React.Component {
  render() {
    //const whiteThemeVars = {...themeVars, toolbarBtnColor: '#222845', toolbarBtnTextColor: '#222845', toolbarDefaultBg: '#FFFFFF'};
    //return <StyleProvider style={getTheme(whiteThemeVars)}>
    //      <HeaderTitle style={{color: themeVars.toolbarBtnTextColor}}>{translate("headerLogin")}</HeaderTitle>
    return <StyleProvider style={getTheme(themeVars)}>
      <Header noShadow style={{backgroundColor: themeVars.toolbarDefaultBg}}>
        <HeaderLeft>
          {this.props.submitting ?
            <Spinner/> :
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{color: themeVars.toolbarBtnColor}}/>
            </Button>
          }
        </HeaderLeft>
        <HeaderBody>
          <Image source={require('../img/mokirim_colored.png')} style={{flex: 1, width: 91, height: 91, resizeMode: 'contain'}}/>
        </HeaderBody>
        <HeaderRight>
          <Button transparent onPress={() => this.props.navigation.navigate('Register')}><Text style={{color: "#222B45"}}>{translate('headerRegister')}</Text></Button>
        </HeaderRight>
      </Header>
    </StyleProvider>
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    submitting: state.appReducer.loginForm.submitting,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const LoginScreenHeader = connect(mapStateToProps, mapDispatchToProps)(_LoginScreenHeader);
