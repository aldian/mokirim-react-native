import React from 'react';
import {connect} from 'react-redux';
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
import {PaymentScreenHeader} from '../../components/PaymentScreenHeader';
import {ShipmentSenderFormHeader} from '../../components/ShipmentSenderFormHeader';
import {ShipmentSenderForm} from '../../components/ShipmentSenderForm';
import {ShipmentReceiverFormHeader} from '../../components/ShipmentReceiverFormHeader';
import {ShipmentReceiverForm} from '../../components/ShipmentReceiverForm';
import {ShipmentContentFormHeader} from '../../components/ShipmentContentFormHeader';
import {ShipmentContentForm} from '../../components/ShipmentContentForm';
import Accordion, {DefaultContent as DefaultAccordionContent} from '../../components/Accordion';
import {ContentContainer} from '../../components/ContentContainer';
import {RoundedCornerPanel} from '../../components/RoundedCornerPanel';

class _PaymentScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <PaymentScreenHeader navigation={navigation}/>,
  });

  render() {
    const {navigate} = this.props.navigation;

    const originatingStationComps = this.props.originatingStation.text.split(/\s*,\s*/);
    const destinationStationComps = this.props.destinationStation.text.split(/\s*,\s*/);

    const originatingStationName = originatingStationComps[0];
    const originatingStationState = originatingStationComps[originatingStationComps.length - 1];

    const destinationStationName = destinationStationComps[0];
    const destinationStationState = destinationStationComps[destinationStationComps.length - 1];

    return (
      <ContentContainer navigate={navigate} hasFooter={false}>
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch'}}>

          <Button
            style={{backgroundColor: themeVars.toolbarDefaultBg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.props.submitCreateBookingForm(this.props.currentLanguage, this.props.accessToken, {
                schedule: this.props.schedule.id,
                colli: this.props.colli,
              }).then(booking => {
                navigate("BookingCreated", {id: booking.id});
              }).catch(error => {
                Toast.show({
                  text: error,
                  buttonText: "OK",
                  duration: 5000,
                });
              }).finally(() => {
                this.props.updateAPIVValue();

                this.props.loadBookings(
                  this.props.currentLanguage, this.props.accessToken,
                  {ordering: '-created_at', v: this.props.apiVValue}
                ).then(obj => {
                  this.props.setBookings(obj.results);
                });
              });
            }}
          >
            <Text>{translate("buttonBookNow")}</Text>
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
    apiVValue: state.appReducer.apiVValue,

    originatingStation: state.appReducer.findScheduleForm.originatingStation,
    destinationStation: state.appReducer.findScheduleForm.destinationStation,

    colli: state.appReducer.findScheduleForm.colli,
    totalWeight: state.appReducer.findScheduleForm.totalWeight,
    totalVolume: state.appReducer.findScheduleForm.totalVolume,

    schedule: state.appReducer.chooseScheduleForm.chosenSchedule,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateAPIVValue: () => dispatch(Actions.updateAPIVValue()),
    loadBookings: (languageCode, accessToken, config) => dispatch(
       Actions.loadBookings(languageCode, accessToken, config)
    ),
    setBookings: bookings => dispatch(Actions.setBookings(bookings)),

    setShipmentDetailsForm: form => dispatch(Actions.setShipmentDetailsForm(form)),
    submitCreateBookingForm: (languageCode, accessToken, booking) => dispatch(
      Actions.submitCreateBookingForm(languageCode, accessToken, booking),
    ),
  }
};

export const PaymentScreen = connect(mapStateToProps, mapDispatchToProps)(_PaymentScreen);
