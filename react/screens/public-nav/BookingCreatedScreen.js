import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import uuid from 'uuid';
import {TouchableOpacity, View} from 'react-native';
import {
  Button, DatePicker, Form, Icon, IconNB, Input, Item, Label, Spinner, Text, Toast,
} from 'native-base';
import themeVars from '../../theme/variables/material';
import {translate, getDateDisplayString, getTimeDisplayString, moneyStr, numberStr} from "../../utils/i18n";
import Error from '../../utils/error';
import constants from '../../constants';
import Actions from '../../state/Actions';
import {BookingCreatedScreenHeader} from '../../components/BookingCreatedScreenHeader';
import {ShipmentSenderFormHeader} from '../../components/ShipmentSenderFormHeader';
import {ShipmentSenderForm} from '../../components/ShipmentSenderForm';
import {ShipmentReceiverFormHeader} from '../../components/ShipmentReceiverFormHeader';
import {ShipmentReceiverForm} from '../../components/ShipmentReceiverForm';
import {ShipmentContentFormHeader} from '../../components/ShipmentContentFormHeader';
import {ShipmentContentForm} from '../../components/ShipmentContentForm';
import Accordion, {DefaultContent as DefaultAccordionContent} from '../../components/Accordion';
import {ContentContainer} from '../../components/ContentContainer';
import {RoundedCornerPanel} from '../../components/RoundedCornerPanel';

class _BookingCreatedScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <BookingCreatedScreenHeader navigation={navigation}/>,
  });

  constructor(props) {
    super(props);

    this.state = {
      expirationCountdown: 0,
    };
  }

  componentDidMount() {
    const bookingId = this.props.navigation.getParam('id');
    const booking = this.props.bookings.find(booking => booking.id === bookingId);
    if (!booking) {
       return;
    }

    const now = moment(new Date());
    const expiredAt = moment(booking.expired_at);
    const realCountDown = expiredAt - now;
    let expirationCountdown = booking.expiration_countdown * 1000;
    if (realCountDown < expirationCountdown) {
      expirationCountdown = realCountDown;
    }
    booking.expiration_countdown = expirationCountdown / 1000;
    this.setState({expirationCountdown: booking.expiration_countdown})

    this.intervalId = setInterval(() => {
      expirationCountdown -= 1000;
      if (expirationCountdown <= 0) {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }

        this.props.updateAPIVValue();
        this.props.loadBookings(
           this.props.currentLanguage, this.props.accessToken,
           {ordering: '-created_at', v: uuid.v4()}
        ).then(obj => {
           this.props.setBookings(obj.results);
        });
        this.props.navigation.goBack();
        return;
      }
      booking.expiration_countdown = expirationCountdown / 1000;
      this.setState({expirationCountdown: booking.expiration_countdown})
    }, 1000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  render() {
    const {goBack, navigate} = this.props.navigation;

    const originatingStationComps = this.props.originatingStation.text.split(/\s*,\s*/);
    const destinationStationComps = this.props.destinationStation.text.split(/\s*,\s*/);

    const originatingStationName = originatingStationComps[0];
    const originatingStationState = originatingStationComps[originatingStationComps.length - 1];

    const destinationStationName = destinationStationComps[0];
    const destinationStationState = destinationStationComps[destinationStationComps.length - 1];

    const bookingId = this.props.navigation.getParam('id');
    const booking = this.props.bookings.find(booking => booking.id === bookingId);
    if (!booking) {
      goBack();
      return null;
    }

    let countdownHours = 0;
    let countdownMinutes = 0;
    let countdownSeconds = 0;
    let expirationCountdown = this.state.expirationCountdown;
    if (expirationCountdown > 3600) {
       countdownHours = Math.floor(expirationCountdown / 3600);
       expirationCountdown -= countdownHours * 3600;
    }
    if (expirationCountdown > 60) {
       countdownMinutes = Math.floor(expirationCountdown / 60);
       expirationCountdown -= countdownMinutes * 60;
    }
    countdownSeconds = Math.floor(expirationCountdown);

    return (
      <ContentContainer navigate={navigate} currentTab={"Shipments"}>
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', padding: 0}}>
          <View>
            <Text style={{padding: 16}}>{translate("headerPayment")}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
              <Text style={{padding: 16}}>{translate("labelBookingNumber")}</Text>
              <Text style={{padding: 16}}>{booking.booking_code}</Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
              <Text style={{padding: 16}}>{translate("labelBookingDate")}</Text>
              <Text style={{padding: 16}}>{getDateDisplayString(booking.created_at, 0)} {getTimeDisplayString(booking.created_at, 0)}</Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
              <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
                <Text style={{marginRight: 16}}>{translate("labelStatus")}</Text>
                <Text style={{paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8, backgroundColor: '#FFEFE6', color: themeVars.toolbarDefaultBg, borderRadius: 2}}>Pending</Text>
              </View>

              <Text style={{padding: 16}}>{translate("messageWaitingForPayment")}</Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
              <View style={{flexDirection: 'column', padding: 16}}>
                <Text>{translate("labelMoneyTransferDeadline")}</Text>
                <Text>{translate("labelBeforeAutoCancellation")}</Text>
              </View>

              <View style={{padding: 16}}>
                <Text style={{backgroundColor: '#222B45', color: 'white', borderRadius: 4, paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12}}>
                  {String(countdownHours).padStart(2, '0')}:{String(countdownMinutes).padStart(2, '0')}:{String(countdownSeconds).padStart(2, '0')}
                </Text>
              </View>
             </View>

             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
               <View style={{flexDirection: 'column', padding: 16}}>
                 <Text>{translate("headerReceivingBankAccount")}</Text>
                 <Text>Bank BRI</Text>
                 <Text>1234567890</Text>
                 <Text>Mokirim Indonesia</Text>
               </View>

               <View style={{flexDirection: 'column', alignItems: 'flex-end', padding: 16}}>
                 <Text>{translate("headerTotalCosts")}</Text>
                 <Text>{moneyStr(this.props.currentLanguage, booking.price)}</Text>
               </View>
             </View>
          </View>

          <Button
             style={{margin: 16, justifyContent: 'center'}}
             onPress={() => {
               navigate('MoneyTransferConfirmation', {id: booking.id});
             }}
          >
             <Text>{translate("buttonConfirmPayment")}</Text>
          </Button>
        </RoundedCornerPanel>
      </ContentContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    loggedIn: state.appReducer.loggedIn,
    accessToken: state.appReducer.accessToken || state.appReducer.device.token,

    originatingStation: state.appReducer.findScheduleForm.originatingStation,
    destinationStation: state.appReducer.findScheduleForm.destinationStation,

    colli: state.appReducer.findScheduleForm.colli,
    totalWeight: state.appReducer.findScheduleForm.totalWeight,
    totalVolume: state.appReducer.findScheduleForm.totalVolume,

    schedule: state.appReducer.chooseScheduleForm.chosenSchedule,

    bookings: state.appReducer.bookings,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setShipmentDetailsForm: form => dispatch(Actions.setShipmentDetailsForm(form)),

    loadBookings: (languageCode, accessToken, config) => dispatch(
      Actions.loadBookings(languageCode, accessToken, config)
    ),
    setBookings: bookings => dispatch(Actions.setBookings(bookings)),
    updateAPIVValue: () => dispatch(Actions.updateAPIVValue()),
  }
};

export const BookingCreatedScreen = connect(mapStateToProps, mapDispatchToProps)(_BookingCreatedScreen);
