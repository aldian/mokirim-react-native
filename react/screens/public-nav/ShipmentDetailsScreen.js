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
import {ShipmentDetailsScreenHeader} from '../../components/ShipmentDetailsScreenHeader';
import {ShipmentSenderFormHeader} from '../../components/ShipmentSenderFormHeader';
import {ShipmentSenderForm} from '../../components/ShipmentSenderForm';
import {ShipmentReceiverFormHeader} from '../../components/ShipmentReceiverFormHeader';
import {ShipmentReceiverForm} from '../../components/ShipmentReceiverForm';
import {ShipmentContentFormHeader} from '../../components/ShipmentContentFormHeader';
import {ShipmentContentForm} from '../../components/ShipmentContentForm';
import Accordion, {DefaultContent as DefaultAccordionContent} from '../../components/Accordion';
import {ContentContainer} from '../../components/ContentContainer';
import {RoundedCornerPanel} from '../../components/RoundedCornerPanel';

class _ShipmentDetailsScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <ShipmentDetailsScreenHeader navigation={navigation}/>,
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
          <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch'}}>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text style={{color: 'gray', fontSize: 12}}>{translate("titleOrigin")}</Text>
              <Text style={{fontSize: 13, fontWeight: 'bold'}}>{originatingStationName}</Text>
              <Text style={{fontSize: 13, fontWeight: 'bold'}}>{originatingStationState}</Text>
            </View>

            <View style={{flex: 0, flexDirection: 'column', justifyContent: 'center'}}>
              <Icon type="FontAwesome" name="long-arrow-right" style={{color: themeVars.toolbarDefaultBg}}/>
            </View>

            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
              <Text style={{color: 'gray', fontSize: 12}}>{translate("titleDestination")}</Text>
              <Text style={{fontSize: 13, fontWeight: 'bold', textAlign: 'right'}}>{destinationStationName}</Text>
              <Text style={{fontSize: 13, fontWeight: 'bold'}}>{destinationStationState}</Text>
            </View>
          </View>

          <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch', marginTop: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#DFE3E8'}}>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text style={{color: 'gray', fontSize: 12}}>{translate("titleDepartureTime")}</Text>

              <Text style={{fontSize: 13, fontWeight: 'bold'}}>{getDateDisplayString(this.props.schedule.datetime, 0)}, {getTimeDisplayString(this.props.schedule.datetime, 0)}</Text>
            </View>

            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
              <Text style={{color: 'gray', fontSize: 12}}>{numberStr(this.props.currentLanguage, this.props.totalWeight)} kg, {numberStr(this.props.currentLanguage, this.props.totalVolume)} cm³</Text>


              <Text style={{color: 'gray', fontSize: 12}}>{translate("labelColli.counting", {count: this.props.colli.length})}</Text>
            </View>
          </View>

          <Accordion
             style={{borderWidth: 0}}
             dataArray={[{}, {}, {}].map((obj, index) => ({...obj, index}))}
             animation={false}
             expanded={this.props.openedSubformIndex}
             renderHeader={(item, expanded) => {
               return <View style={{borderWidth: 2, borderBottomWidth: expanded ? 0 : 2, marginBottom: expanded ? 0 : 8, borderColor: expanded ? themeVars.toolbarDefaultBg : '#DFE3E8'}}>
                 {item.index === 0 && <ShipmentSenderFormHeader expanded={expanded}/>}
                 {item.index === 1 && <ShipmentReceiverFormHeader expanded={expanded}/>}
                 {item.index === 2 && <ShipmentContentFormHeader expanded={expanded}/>}
               </View>
             }}
             renderContent={item => {
               return <View style={{borderWidth: 2, borderTopWidth: 0, marginBottom: 8, borderColor: themeVars.toolbarDefaultBg}}>
                 {item.index === 0 && <ShipmentSenderForm/>}
                 {item.index === 1 && <ShipmentReceiverForm/>}
                 {item.index === 2 && <ShipmentContentForm/>}
               </View>
             }}
             onAccordionOpen={(item, index) => this.props.setShipmentDetailsForm({openedSubformIndex: index})}
             onAccordionClose={(item, index) => this.props.setShipmentDetailsForm({openedSubformIndex: undefined})}
          />
          <Button
            style={{backgroundColor: themeVars.toolbarDefaultBg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              navigate('BookingDetails');
            }}
          >
            <Text>{translate("buttonContinue")}</Text>
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

export const ShipmentDetailsScreen = connect(mapStateToProps, mapDispatchToProps)(_ShipmentDetailsScreen);