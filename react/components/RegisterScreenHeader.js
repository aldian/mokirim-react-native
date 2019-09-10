import React from 'react';
import {connect} from 'react-redux';
import {Image} from 'react-native';
import {
  Button,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, Spinner, StyleProvider,
} from 'native-base';
import { translate } from "../utils/i18n";
import getTheme from '../theme/components';
import themeVars from '../theme/variables/whiteHeader';

class _RegisterScreenHeader extends React.Component {
  render() {
    //      <HeaderTitle style={{color: themeVars.toolbarBtnTextColor}}>{translate("headerRegister")}</HeaderTitle>
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
        <HeaderRight/>
      </Header>
    </StyleProvider>
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    submitting: state.appReducer.registerForm.submitting,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const RegisterScreenHeader = connect(mapStateToProps, mapDispatchToProps)(_RegisterScreenHeader);
