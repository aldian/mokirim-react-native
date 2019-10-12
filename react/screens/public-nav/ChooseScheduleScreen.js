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
import {ChooseScheduleScreenHeader} from '../../components/ChooseScheduleScreenHeader';
import {ContentContainer} from '../../components/ContentContainer';
import {RoundedCornerPanel} from '../../components/RoundedCornerPanel';

class _ChooseScheduleScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <ChooseScheduleScreenHeader navigation={navigation}/>,
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
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column'}}>
          <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between'}}>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 8}}>
              <Text style={{color: 'gray', fontSize: 12}}>{translate("titleOrigin")}</Text>
              <Text style={{fontSize: 13}}>{originatingStationName}</Text>
              <Text style={{fontSize: 13, textAlign: 'left'}}>{originatingStationState}</Text>
            </View>
            <View style={{flex: 0, flexDirection: 'column', justifyContent: 'center'}}>
              <Icon type="FontAwesome" name="long-arrow-right" style={{color: themeVars.toolbarDefaultBg}}/>
            </View>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 8}}>
              <Text style={{color: 'gray', fontSize: 12, textAlign: 'right'}}>{translate("titleDestination")}</Text>
              <Text style={{fontSize: 13, textAlign: 'right'}}>{destinationStationName}</Text>
              <Text style={{fontSize: 13, textAlign: 'right'}}>{destinationStationState}</Text>
            </View>
          </View>

          <View>
            {this.props.availableSchedules.map((schedule, key) => {
              const checkinTime = moment(schedule.datetime).subtract(2, 'hours').toDate();
              return <TouchableOpacity
                key={key} style={{borderWidth: 2, borderColor: 'gray', padding: 4, flexDirection: 'column', alignItems: 'stretch', marginBottom: 8}}
                onPress={() => {
                  this.props.chooseSchedule(schedule);
                  if (this.props.loggedIn) {
                    navigate("ShipmentDetails");
                  } else {
                    navigate("AskLogin");
                  }
                }}
              >
                <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'gray', paddingBottom: 4}}>
                  <View style={{flex: 1}}>
                    <Text style={{color: 'gray', fontSize: 12}}>{translate('titleDeparture')}</Text>
                    <Text style={{fontSize: 13}}>{getDateDisplayString(schedule.datetime, 0)}</Text>
                    <Text style={{fontSize: 13}}>{translate("labelAtTime")} {getTimeDisplayString(schedule.datetime, 0)}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{textAlign: 'right', color: 'gray', fontSize: 12}}>{translate('titleArrival')}</Text>
                    <Text style={{textAlign: 'right', fontSize: 13}}>{getDateDisplayString(schedule.datetime, schedule.duration_minutes)}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                      <Text style={{fontSize: 11, backgroundColor: 'lightgray', marginRight: 4, paddingLeft: 4, paddingRight: 4, borderRadius: 4}}>{translate("labelEstimate")}</Text>
                      <Text style={{fontSize: 13}}>{translate("labelAtTime")} {getTimeDisplayString(schedule.datetime, schedule.duration_minutes)}</Text>
                    </View>
                  </View>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: 'gray', paddingBottom: 4}}>
                  <Text style={{flex: 1, color: themeVars.toolbarDefaultBg, fontSize: 13}}>{translate("labelCheckinDeadline")}</Text>

                  <View style={{flex: 1}}>
                    <Text style={{textAlign: 'right', color: themeVars.toolbarDefaultBg, fontSize: 13}}>{getDateDisplayString(checkinTime, 0)}</Text>
                    <Text style={{textAlign: 'right', color: themeVars.toolbarDefaultBg, fontSize: 13}}>{getTimeDisplayString(checkinTime, 0)}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{flex: 1}}>
                    <Text style={{fontSize: 12, color: 'gray'}}>{translate('labelTariff')}</Text>
                    <Text style={{fontSize: 13}}>{moneyStr(this.props.currentLanguage, schedule.price_per_kg)}/kg x {numberStr(this.props.currentLanguage, this.props.totalWeight)} kg</Text>
                  </View>

                  <View style={{flex: 1}}>
                    <Text style={{fontSize: 12, color: 'gray', textAlign: 'right'}}>{translate('labelTotalPrice')}</Text>
                    <Text style={{fontSize: 13, color: themeVars.toolbarDefaultBg, textAlign: 'right'}}>{moneyStr(this.props.currentLanguage, schedule.price)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            })}
          </View>
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
    departureDate: state.appReducer.findScheduleForm.departureDate,

    availableSchedules: state.appReducer.chooseScheduleForm.availableSchedules,

    totalWeight: state.appReducer.findScheduleForm.totalWeight,
    totalVolume: state.appReducer.findScheduleForm.totalVolume,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    chooseSchedule: schedule => dispatch(Actions.chooseSchedule(schedule)),
  }
};

export const ChooseScheduleScreen = connect(mapStateToProps, mapDispatchToProps)(_ChooseScheduleScreen);
