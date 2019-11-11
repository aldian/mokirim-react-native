import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid';
import moment from 'moment';
import {TouchableOpacity, View} from 'react-native';
import {
  Button, DatePicker, Form, Icon, IconNB, Input, Item, Label, Spinner, Text, Toast,
} from 'native-base';
import themeVars from '../../theme/variables/material';
import {translate, getDateDisplayString, getTimeDisplayString, moneyStr, numberStr} from "../../utils/i18n";
import Error from '../../utils/error';
import constants from '../../constants';
import Actions from '../../state/Actions';
import {BookingDetailsScreenHeader} from '../../components/BookingDetailsScreenHeader';
import {ShipmentSenderFormHeader} from '../../components/ShipmentSenderFormHeader';
import {ShipmentSenderForm} from '../../components/ShipmentSenderForm';
import {ShipmentReceiverFormHeader} from '../../components/ShipmentReceiverFormHeader';
import {ShipmentReceiverForm} from '../../components/ShipmentReceiverForm';
import {ShipmentContentFormHeader} from '../../components/ShipmentContentFormHeader';
import {ShipmentContentForm} from '../../components/ShipmentContentForm';
import Accordion, {DefaultContent as DefaultAccordionContent} from '../../components/Accordion';
import {ContentContainer} from '../../components/ContentContainer';
import {RoundedCornerPanel} from '../../components/RoundedCornerPanel';

class _BookingDetailsScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <BookingDetailsScreenHeader navigation={navigation}/>,
  });

  render() {
    const {navigate} = this.props.navigation;

    const originatingStationComps = this.props.originatingStation.text.split(/\s*,\s*/);
    const destinationStationComps = this.props.destinationStation.text.split(/\s*,\s*/);

    const originatingStationName = originatingStationComps[0];
    const originatingStationCity = originatingStationComps[originatingStationComps.length - 2];

    const destinationStationName = destinationStationComps[0];
    const destinationStationCity = destinationStationComps[destinationStationComps.length - 2];

    const schedule = this.props.schedule;
    const checkinTime = moment(schedule.datetime).subtract(2, 'hours').toDate();

    const sender = this.props.sender;
    const receiver = this.props.receiver;

    return (
      <ContentContainer navigate={navigate} hasFooter={false}>
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch'}}>
          <View>
            <Text>{translate("headerShipmentSchedule")}</Text>
            <View style={{borderColor: '#DFE3E8', borderWidth: 1, borderRadius: 4, padding: 8}}>
              <View style={{borderColor: '#DFE3E8', borderBottomWidth: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <Text>{translate("titleOrigin")}</Text>
                  <Text>{translate("titleDestination")}</Text>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <Text>{originatingStationName}</Text>
                    <Text>{originatingStationCity}</Text>
                  </View>
                  <Icon type="FontAwesome" name="long-arrow-right" style={{color: themeVars.toolbarDefaultBg, flex: 0}}/>
                  <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end'}}>
                    <Text style={{textAlign: 'right'}}>{destinationStationName}</Text>
                    <Text style={{textAlign: 'right'}}>{destinationStationCity}</Text>
                  </View>
                </View>
              </View>

              <View style={{borderColor: '#DFE3E8', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <View style={{flexDirection: 'column'}}>
                  <Text>{translate("titleDeparture")}</Text>
                  <Text>{getDateDisplayString(schedule.datetime, 0)}</Text>
                  <Text>{translate("labelAtTime")} {getTimeDisplayString(schedule.datetime, 0)}</Text>
                </View>

                <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                  <Text>{translate("titleArrival")}</Text>
                  <Text>{getDateDisplayString(schedule.datetime, schedule.duration_minutes)}</Text>
                  <Text>{translate("labelAtTime")} {getTimeDisplayString(schedule.datetime, schedule.duration_minutes)}</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text>{translate("labelCheckInDeadline")}</Text>

                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end'}}>
                  <Text>{getDateDisplayString(checkinTime, 0)}</Text>
                  <Text>{getTimeDisplayString(checkinTime, 0)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View>
            <Text>{translate("headerShipmentDetails")}</Text>
            <View style={{borderColor: '#DFE3E8', borderWidth: 1, borderRadius: 4, padding: 8}}>
              <View style={{borderColor: '#DFE3E8', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <View>
                  <Text>{translate("headerStationToStation")}</Text>
                  <Text>{translate("labelWeight")}</Text>
                  <Text>{numberStr(this.props.currentLanguage, this.props.totalWeight)} kg</Text>
                </View>

                <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                  <Text>{translate("labelColli.counting", {count: this.props.colli.length})}</Text>
                  <Text>{translate("labelDimension")}</Text>
                  <Text>{numberStr(this.props.currentLanguage, this.props.totalVolume)} cm³</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <Text>{translate("titleSender")}</Text>
                  <Text>{sender.name}</Text>
                  <Text>{sender.address}</Text>
                  <Text>{sender.email}</Text>
                  <Text>{sender.phone}</Text>
                </View>

                <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end'}}>
                  <Text>{translate("titleReceiver")}</Text>
                  <Text style={{textAlign: 'right'}}>{receiver.name}</Text>
                  <Text style={{textAlign: 'right'}}>{receiver.address}</Text>
                  <Text style={{textAlign: 'right'}}>{receiver.email}</Text>
                  <Text style={{textAlign: 'right'}}>{receiver.phone}</Text>
                </View>
              </View>
            </View>
          </View>

          <View>
            <Text>{translate("headerCosts")}</Text>
            <View style={{borderColor: '#DFE3E8', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <Text>{translate("labelTariff")}</Text>
              <Text>{moneyStr(this.props.currentLanguage, schedule.price_per_kg)}/kg x {numberStr(this.props.currentLanguage, this.props.totalWeight)} kg</Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <Text>{translate("labelTotal")}</Text>
              <Text>{moneyStr(this.props.currentLanguage, schedule.price)}</Text>
            </View>
          </View>

          {this.props.submitting ?
            <Spinner/> :
            <Button
              style={{backgroundColor: themeVars.toolbarDefaultBg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
              onPress={() => {
                this.props.setBookingDetailsForm({submitting: true});
                this.props.submitCreateBookingForm(this.props.currentLanguage, this.props.accessToken, {
                  schedule: this.props.schedule.id,
                  colli: this.props.colli,
                  from_person: this.props.sender,
                  to_person: this.props.receiver,
                  content_description: this.props.content.description || '',
                  content_value_estimate: this.props.content.valueIDR || '0.00',
                }).then(booking => {
                  this.props.setBookingDetailsForm({submitting: true});
                  this.props.loadBookings(
                     this.props.currentLanguage, this.props.accessToken,
                     {ordering: '-created_at', v: uuid.v4()}
                  ).then(obj => {
                    this.props.setBookings(obj.results);
                    navigate("BookingCreated", {id: booking.id});
                  }).catch(error => {
                    Toast.show({
                      text: error,
                      buttonText: "OK",
                      duration: 5000,
                    });
                  }).finally(() => {
                    this.props.setBookingDetailsForm({submitting: false});
                  });
                }).catch(error => {
                  Toast.show({
                    text: error,
                    buttonText: "OK",
                    duration: 5000,
                  });
                }).finally(() => {
                  this.props.updateAPIVValue();
                  this.props.setBookingDetailsForm({submitting: false});
                });
              }}
            >
              <Text>{translate("buttonBookNow")}</Text>
            </Button>

          }
        </RoundedCornerPanel>
      </ContentContainer>
    );
  }
}

/*
          <Button
            style={{backgroundColor: themeVars.toolbarDefaultBg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              navigate("Payment");
            }}
          >
            <Text>{translate("buttonContinueToPayment")}</Text>
          </Button>
*/

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

    sender: state.appReducer.shipmentDetailsForm.sender,
    receiver: state.appReducer.shipmentDetailsForm.receiver,
    content: state.appReducer.shipmentDetailsForm.content,

    submitting: state.appReducer.bookingDetailsForm.submitting,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateAPIVValue: () => dispatch(Actions.updateAPIVValue()),
    setShipmentDetailsForm: form => dispatch(Actions.setShipmentDetailsForm(form)),
    setBookingDetailsForm: form => dispatch(Actions.setBookingDetailsForm(form)),
    submitCreateBookingForm: (languageCode, accessToken, booking) => dispatch(
      Actions.submitCreateBookingForm(languageCode, accessToken, booking),
    ),
    loadBookings: (languageCode, accessToken, config) => dispatch(
      Actions.loadBookings(languageCode, accessToken, config)
    ),
    setBookings: bookings => dispatch(Actions.setBookings(bookings)),
  }
};

export const BookingDetailsScreen = connect(mapStateToProps, mapDispatchToProps)(_BookingDetailsScreen);
