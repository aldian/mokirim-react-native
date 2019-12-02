import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid';
import moment from 'moment';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {
  Button, DatePicker, Form, Icon, IconNB, Input, Item, Label, Left, ListItem, Spinner, Text, Toast,
} from 'native-base';
import themeVars from '../../theme/variables/material';
import {translate, getDateDisplayString, getTimeDisplayString, getFormattedTime, moneyStr, numberStr} from "../../utils/i18n";
import MokirimAPI from "../../utils/MokirimAPI";
import Error from '../../utils/error';
import constants from '../../constants';
import Actions from '../../state/Actions';
import {BankSelectionScreenHeader} from '../../components/BankSelectionScreenHeader';
import {ShipmentSenderFormHeader} from '../../components/ShipmentSenderFormHeader';
import {ShipmentSenderForm} from '../../components/ShipmentSenderForm';
import {ShipmentReceiverFormHeader} from '../../components/ShipmentReceiverFormHeader';
import {ShipmentReceiverForm} from '../../components/ShipmentReceiverForm';
import {ShipmentContentFormHeader} from '../../components/ShipmentContentFormHeader';
import {ShipmentContentForm} from '../../components/ShipmentContentForm';
import Accordion, {DefaultContent as DefaultAccordionContent} from '../../components/Accordion';
import {ContentContainer} from '../../components/ContentContainer';
import {RoundedCornerPanel} from '../../components/RoundedCornerPanel';

class _BankSelectionScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <BankSelectionScreenHeader navigation={navigation}/>,
  });

  constructor(props) {
    super(props);

    this.state = {
      bankListLoaded: false,
      banks: [],
      selectedBankId: undefined,
    }
  }

  componentDidMount() {
    MokirimAPI.getBank(
      this.props.currentLanguage, this.props.accessToken, {v: 0}
    ).then(response => {
      this.setState({bankListLoaded: true});
      if (response.ok) {
        response.json().then(obj => {
          this.setState({banks: obj.results});
        });
      }
    });
  }

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
          {this.state.bankListLoaded ?
            <FlatList
               data={this.state.banks}
               extraData={this.state.selectedBankId}
               keyExtractor={(item, index) => String(item.id)}
               renderItem={({item, index}) =>
                 <ListItem onPress={() => {
                   this.setState({selectedBankId: item.id});
                 }}>
                   <Left>
                     <Text style={{fontWeight: item.id == this.state.selectedBankId ? 'bold' : 'normal'}}>
                       {item.name}
                     </Text>
                   </Left>
                 </ListItem>
               }
            /> :
            <Spinner/>
          }

          {this.props.submitting ?
            <Spinner/> :
            <Button
              style={{backgroundColor: themeVars.toolbarDefaultBg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
              disabled={this.state.selectedBankId ? false : true}
              onPress={() => {
                this.props.setBookingDetailsForm({submitting: true});
                this.props.submitCreateBookingForm(this.props.currentLanguage, this.props.accessToken, {
                  schedule: this.props.schedule.id,
                  colli: this.props.colli,
                  from_person: this.props.sender,
                  to_person: this.props.receiver,
                  content_description: this.props.content.description || '',
                  content_value_estimate: this.props.content.valueIDR || '0.00',
                  receiving_bank: this.state.selectedBankId,
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

export const BankSelectionScreen = connect(mapStateToProps, mapDispatchToProps)(_BankSelectionScreen);
