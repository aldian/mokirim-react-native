import React from 'react';
import {connect} from 'react-redux';
import currency from 'currency.js';
import {View} from 'react-native';
import {
  Button,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, Spinner, StyleProvider, Text,
} from 'native-base';
import {translate, numberStr} from "../utils/i18n";
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';

class _ShipmentStatusScreenHeader extends React.Component {
  render() {
    const bookingId = this.props.navigation.getParam('id');
    const booking = this.props.bookings.find(booking => booking.id === bookingId);
    if (!booking) {
      return;
    }
    const fromCity = booking.schedule.from_place.address.text.split(',').slice(-2)[0].trim();
    const toCity = booking.schedule.to_place.address.text.split(',').slice(-2)[0].trim();

    const paidAmountInt = currency(booking.paid_amount).intValue;
    const priceInt = currency(booking.price).intValue;
    const paid = paidAmountInt >= priceInt || booking.checkin_time;

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
          {booking.checkin_time ?
            <React.Fragment>
              <HeaderTitle>{booking.awb_number}</HeaderTitle>
              <HeaderTitle style={{fontSize: 13}}>{fromCity} - {toCity} #{booking.booking_code}</HeaderTitle>
            </React.Fragment> :
            <React.Fragment>
              <HeaderTitle>{translate("headerShipmentStatus")}</HeaderTitle>
              <HeaderTitle style={{fontSize: 13}}>{fromCity} - {toCity} #{booking.booking_code}</HeaderTitle>
            </React.Fragment>
          }
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

export const ShipmentStatusScreenHeader = connect(mapStateToProps, mapDispatchToProps)(_ShipmentStatusScreenHeader);
