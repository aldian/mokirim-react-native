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
    const originatingStationState = originatingStationComps[originatingStationComps.length - 1];

    const destinationStationName = destinationStationComps[0];
    const destinationStationState = destinationStationComps[destinationStationComps.length - 1];

    return (
      <ContentContainer navigate={navigate} hasFooter={false}>
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch'}}>

          <Button style={{backgroundColor: themeVars.toolbarDefaultBg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text>{translate("buttonContinueToPayment")}</Text>
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
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setShipmentDetailsForm: form => dispatch(Actions.setShipmentDetailsForm(form)),
  }
};

export const BookingDetailsScreen = connect(mapStateToProps, mapDispatchToProps)(_BookingDetailsScreen);
