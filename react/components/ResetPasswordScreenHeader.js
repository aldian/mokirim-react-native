import React from 'react';
import {connect} from 'react-redux';
import {
  Button,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, Spinner, StyleProvider,
} from 'native-base';
import { translate } from "../utils/i18n";
import getTheme from '../theme/components';
//import themeVars from '../theme/variables/material';
import themeVars from '../theme/variables/whiteHeader';

class _ResetPasswordScreenHeader extends React.Component {
  render() {
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
          <HeaderTitle style={{color: themeVars.toolbarBtnTextColor}}>{translate("headerResetPassword")}</HeaderTitle>
        </HeaderBody>
        <HeaderRight/>
      </Header>
    </StyleProvider>
  }
}

const mapStateToProps = state => {
  return {
    submitting: state.appReducer.resetPasswordForm.submitting,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const ResetPasswordScreenHeader = connect(mapStateToProps, mapDispatchToProps)(_ResetPasswordScreenHeader);
