import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid';
import {FlatList, View} from 'react-native';
import currency from 'currency.js';
import {Body, Button, Input, Icon, Item, Label, Left, ListItem, Right, Text} from 'native-base';
import themeVars from '../theme/variables/material';
import { translate, getDateDisplayString, getTimeDisplayString, moneyStr, numberStr} from "../utils/i18n";
import Actions from '../state/Actions';

class _BookingList extends React.Component {
  render() {
    const navigate = this.props.navigate;

    return  (
      <FlatList
        onRefresh={() => {
           this.props.setShipmentsForm({loaded: false});
           this.props.updateAPIVValue();
           this.props.loadBookings(
             this.props.currentLanguage, this.props.accessToken,
             {ordering: '-created_at', v: uuid.v4()}
           ).then(obj => {
             this.props.setBookings(obj.results);
           }).catch(error => {
             Toast.show({
                text: error,
                buttonText: "OK",
                duration: 5000,
             });
           }).finally(() => this.props.setShipmentsForm({loaded: true}));
        }}
        ListEmptyComponent={
          <View style={{padding: 16}}>
            <Text>{translate("messageDoesNotExist")}</Text>
          </View>
        }
        refreshing={this.props.refreshing}
        data={
          this.props.bookings
        }
        keyExtractor={(item, index) => String(item.id)}
        renderItem={({item, index}) => {
          const fromCity = item.schedule.from_place.address.text.split(',').slice(-2)[0].trim();
          const toCity = item.schedule.to_place.address.text.split(',').slice(-2)[0].trim();
          const paidAmountInt = currency(item.paid_amount).intValue;
          const priceInt = currency(item.price).intValue;
          const paid = paidAmountInt >= priceInt || item.checkin_time;
          return <ListItem
            style={{borderBottomWidth: 1, borderColor: 'white', paddingBottom: 0}}
            onPress={() => {
              navigate('ShipmentStatus', {id: item.id});
            }}
          >
            <Left style={{flex: 0}}>
            </Left>
            <Body style={{flex: 1}}>
              <View style={{borderWidth: 1, borderColor: '#DFE3E8'}}>
                <View style={{borderBottomWidth: 1, borderColor: '#DFE3E8', backgroundColor: '#FFEFE6', paddingTop: 8, paddingBottom: 8}}>
                  <Text>{getDateDisplayString(item.schedule.datetime, 0)}</Text>
                  {item.checkin_time ?
                    <Text>{translate("labelReceiptNumberColon")} {item.awb_number}</Text> :
                    <Text>{translate("labelBookingNumberColon")} {item.booking_code}</Text>
                  }
                </View>

                <View style={{borderBottomWidth: 1, borderColor: '#DFE3E8', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingBottom: 8}}>
                  <Text style={{color: themeVars.toolbarDefaultBg}}>{translate("headerStationToStation")}</Text>
                  <Text style={{color: themeVars.toolbarDefaultBg}}>{translate("labelColli.counting", {count: item.num_colli})}</Text>
                </View>

                <View style={{borderBottomWidth: 1, borderColor: '#DFE3E8', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', paddingTop: 8, paddingBottom: 8}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <Text style={{color: '#919EAB'}}>{translate("titleOrigin")}</Text>
                    <Text style={{color: '#919EAB'}}>{translate("titleDestination")}</Text>
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                      <Text>{item.schedule.from_place.name}</Text>
                      <Text>{fromCity}</Text>
                      <Text>{getDateDisplayString(item.schedule.datetime, 0)}</Text>
                      <Text>{translate("labelAtTime")} {getTimeDisplayString(item.schedule.datetime, 0)}</Text>
                    </View>
                    <View style={{flex: 0}}>
                      <Icon type="FontAwesome" name="long-arrow-right" style={{color: themeVars.toolbarDefaultBg}}/>
                    </View>
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                      <Text style={{textAlign: 'right'}}>{item.schedule.to_place.name}</Text>
                      <Text style={{textAlign: 'right'}}>{toCity}</Text>
                      <Text style={{textAlign: 'right'}}>{getDateDisplayString(item.schedule.datetime, item.schedule.duration_minutes)}</Text>
                      <Text style={{textAlign: 'right'}}>{translate("labelAtTime")} {getTimeDisplayString(item.schedule.datetime, item.schedule.duration_minutes)}</Text>
                    </View>
                  </View>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingBottom: 8}}>
                  {paid ?
                    <React.Fragment>
                      <View>
                        <Text style={{color: (item.checkin_time ? '#09B07B' : themeVars.toolbarDefaultBg)}}>{translate("messageActionCheckIn")}</Text>
                      </View>
                      <View>
                        <Text style={{color: (item.checkin_time ? (item.departed ? '#09B07B': themeVars.toolbarDefaultBg) : '#DFE3E8')}}>{translate("messageActionDeparted")}</Text>
                      </View>
                      <View>
                        <Text style={{color: (item.checkout_time ? '#09B07B' : (item.departed ? themeVars.toolbarDefaultBg: '#DFE3E8'))}}>{translate("messageActionCheckOut")}</Text>
                      </View>
                    </React.Fragment> :
                    <React.Fragment>
                      <Text style={{color: themeVars.toolbarDefaultBg, backgroundColor: '#FFEFE6', borderRadius: 2, paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8}}>{translate('headerPending')}</Text>
                      {paidAmountInt ?
                        (paidAmountInt < priceInt ?
                          <Text>{translate("messageUnderpaid")}</Text> :
                          <Text>{translate("messagePaid")}</Text>
                        ) :
                        <Text>{translate("messageWaitingForPayment")}</Text>
                      }
                    </React.Fragment>
                  }
                </View>
              </View>
            </Body>
            <Right style={{flex: 0}}>
            </Right>
          </ListItem>
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    accessToken: state.appReducer.accessToken || state.appReducer.device.token,
    apiVValue: state.appReducer.apiVValue,
    refreshing: !state.appReducer.shipmentsForm.loaded,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setShipmentsForm: form => dispatch(Actions.setShipmentsForm(form)),
    loadBookings: (languageCode, accessToken, config) => dispatch(
      Actions.loadBookings(languageCode, accessToken, config)
    ),
    setBookings: bookings => dispatch(Actions.setBookings(bookings)),
    updateAPIVValue: () => dispatch(Actions.updateAPIVValue()),
  }
};

export const BookingList = connect(mapStateToProps, mapDispatchToProps)(_BookingList);
