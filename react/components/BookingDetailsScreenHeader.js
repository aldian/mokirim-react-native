import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {
  Button,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, Spinner, StyleProvider, Text,
} from 'native-base';
import {translate, numberStr} from "../utils/i18n";
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';

class _BookingDetailsScreenHeader extends React.Component {
  render() {

    return <StyleProvider style={getTheme(themeVars)}>
      <Header noShadow style={{backgroundColor: themeVars.toolbarDefaultBg}}>
        <HeaderLeft style={{flex: 0, paddingRight: 8}}>
          {this.props.submitting ?
            <Spinner/> :
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{color: 'white'}}/>
            </Button>
          }
        </HeaderLeft>
        <HeaderBody>
          <HeaderTitle>{translate("headerBookingDetails")}</HeaderTitle>
        </HeaderBody>
      </Header>
    </StyleProvider>
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const BookingDetailsScreenHeader = connect(mapStateToProps, mapDispatchToProps)(_BookingDetailsScreenHeader);
