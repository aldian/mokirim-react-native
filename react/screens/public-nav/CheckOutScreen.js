import React from 'react';
import {connect} from 'react-redux';
import currency from 'currency.js';
import moment from 'moment';
import uuid from 'uuid';
import qs from 'query-string';
import {TouchableOpacity, View} from 'react-native';
import {
  Button, DatePicker, Form, Icon, IconNB, Input, Item, Label, Spinner, Text, Toast,
} from 'native-base';
import QRCode from 'react-native-qrcode-svg';
import themeVars from '../../theme/variables/material';
import {translate, getDateDisplayString, getTimeDisplayString, moneyStr, numberStr} from "../../utils/i18n";
import Error from '../../utils/error';
import constants from '../../constants';
import Actions from '../../state/Actions';
import {CheckOutScreenHeader} from '../../components/CheckOutScreenHeader';
import {ContentContainer} from '../../components/ContentContainer';
import {RoundedCornerPanel} from '../../components/RoundedCornerPanel';

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    loggedIn: state.appReducer.loggedIn,
    accessToken: state.appReducer.accessToken || state.appReducer.device.token,
    bookings: state.appReducer.bookings,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

class _CheckOutScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <CheckOutScreenHeader navigation={navigation}/>,
  });

  render() {
    const {goBack, navigate} = this.props.navigation;

    const bookingId = this.props.navigation.getParam('id');
    const booking = this.props.bookings.find(booking => booking.id === bookingId);
    if (!booking) {
      goBack();
      return null;
    }

    return (
      <ContentContainer navigate={navigate} hasFooter={false}>
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <QRCode
            value={"https://mokirim.aldianfazrihady.com/" + this.props.currentLanguage + "/admin/checkout/checkout/add/?" + qs.stringify({
              code: booking.checkout_code,
              booking: booking.id,
              place: booking.schedule.from_place.id,
            })}
          />
          <Text>{booking.checkout_code}</Text>
        </RoundedCornerPanel>
      </ContentContainer>
    );
  }
}

export const CheckOutScreen = connect(mapStateToProps, mapDispatchToProps)(_CheckOutScreen);
