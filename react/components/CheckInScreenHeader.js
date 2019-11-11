import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {
  Button,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, Spinner, StyleProvider, Text,
} from 'native-base';
import {translate} from "../utils/i18n";
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';

class _CheckInScreenHeader extends React.Component {
  render() {
    const bookingId = this.props.navigation.getParam('id');
    const booking = this.props.bookings.find(booking => booking.id === bookingId);
    if (!booking) {
      return;
    }

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
        <HeaderBody style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
          <HeaderTitle>{translate("headerCheckIn")}</HeaderTitle>
        </HeaderBody>
      </Header>
    </StyleProvider>
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    bookings: state.appReducer.bookings,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const CheckInScreenHeader = connect(mapStateToProps, mapDispatchToProps)(_CheckInScreenHeader);
