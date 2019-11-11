import React from 'react';
import {connect} from 'react-redux';
import currency from 'currency.js';
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
import {ShipmentStatusScreenHeader} from '../../components/ShipmentStatusScreenHeader';
import Accordion from '../../components/Accordion';
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
     loadBookings: (languageCode, accessToken, config) => dispatch(
       Actions.loadBookings(languageCode, accessToken, config)
     ),
     setBookings: bookings => dispatch(Actions.setBookings(bookings)),
     updateAPIVValue: () => dispatch(Actions.updateAPIVValue()),
  }
};

class _PaymentFormHeader extends React.Component {
  render() {
    const booking = this.props.booking
    const paidAmountInt = currency(booking.paid_amount).intValue;
    const priceInt = currency(booking.price).intValue;
    const paid = paidAmountInt >= priceInt || booking.checkin_time;

    return <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
      <Text>{translate("headerPayment")}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        {this.props.expanded ?
          null :
          (paid ?
             <Text style={{color: '#09B07B', backgroundColor: '#E7F7F2', fontSize: 13, borderRadius: 2, padding: 4, paddingLeft: 8, paddingRight: 8}}>{translate("messagePaid")}</Text> :
             <Text style={{color: themeVars.toolbarDefaultBg, backgroundColor: '#FFEFE6', fontSize: 13, borderRadius: 2, padding: 4, paddingLeft: 8, paddingRight: 8}}>{translate("headerPending")}</Text>
          )
        }
        <Icon
          style={{fontSize: 16, color: '#919EAB', marginLeft: 8}}
          type="Ionicons"
          name={
            this.props.expanded ? 'ios-arrow-up' : 'ios-arrow-down'
          }
        />
      </View>
    </View>
  }
}
const PaymentFormHeader = connect(mapStateToProps, mapDispatchToProps)(_PaymentFormHeader);

class _PaymentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expirationCountdown: 0,
    };
  }

  componentDidMount() {
    const booking = this.props.booking
    const paidAmountInt = currency(booking.paid_amount).intValue;
    const priceInt = currency(booking.price).intValue;
    const paid = paidAmountInt >= priceInt || booking.checkin_time;
    if (paid) {

    } else {
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
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  render() {
    const booking = this.props.booking
    const paidAmountInt = currency(booking.paid_amount).intValue;
    const priceInt = currency(booking.price).intValue;
    const paid = paidAmountInt >= priceInt || booking.checkin_time;

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

    return <View style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch'}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
        <Text style={{padding: 16, color: '#919EAB'}}>{translate("labelBookingNumber")}</Text>
        <Text style={{padding: 16}}>{booking.booking_code}</Text>
      </View>
      {booking.checkin_time &&
         <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
           <Text style={{padding: 16, color: '#919EAB'}}>{translate("labelReceiptNumber")}</Text>
           <Text style={{padding: 16}}>{booking.awb_number}</Text>
         </View>
      }
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
        <Text style={{padding: 16, color: '#919EAB'}}>{translate("labelBookingDate")}</Text>
        <Text style={{padding: 16}}>{getDateDisplayString(booking.created_at, 0)} {getTimeDisplayString(booking.created_at, 0)}</Text>
      </View>
      {paid ?
        null :
        (countdownHours || countdownMinutes || countdownSeconds ?
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
            <View style={{padding: 16, color: '#919EAB', flexDirection: 'column',  justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <Text style={{color: '#222B45'}}>{translate("labelMoneyTransferDeadline")}</Text>
              <Text style={{color: '#919EAB'}}>{translate("labelBeforeAutoCancellation")}</Text>
            </View>
            <View style={{padding: 16}}>
              <Text style={{backgroundColor: '#222B45', color: 'white', borderRadius: 4, paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12}}>
                {String(countdownHours).padStart(2, '0')}:{String(countdownMinutes).padStart(2, '0')}:{String(countdownSeconds).padStart(2, '0')}
              </Text>
            </View>
          </View> :
          null
        )
      }
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Text style={{padding: 16, color: '#919EAB', marginRight: 8}}>{translate("labelStatus")}</Text>
          {paid &&
            <Text style={{color: '#09B07B', backgroundColor: '#E7F7F2', fontSize: 13, borderRadius: 2, padding: 4, paddingLeft: 8, paddingRight: 8}}>{translate("messagePaid")}</Text>
          }
        </View>
        {booking.paid_at ?
          <Text style={{padding: 16}}>{getDateDisplayString(booking.created_at, 0)} {getTimeDisplayString(booking.paid_at, 0)}</Text> :
          <Text style={{marginRight: 16, color: themeVars.toolbarDefaultBg, backgroundColor: '#FFEFE6', fontSize: 13, borderRadius: 2, padding: 4, paddingLeft: 8, paddingRight: 8}}>{translate("headerPending")}</Text>
        }
      </View>
      {paid ?
        null :
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
          <View style={{padding: 16, flexDirection: 'column', alignItems: 'flex-start'}}>
            <Text style={{color: '#919EAB'}}>{translate("headerReceivingBankAccount")}</Text>
            <Text>Bank BRI</Text>
            <Text>1234567890</Text>
            <Text>Mokirim Indonesia</Text>
          </View>

          <View style={{padding: 16, flexDirection: 'column', alignItems: 'flex-end'}}>
            <Text style={{color: '#919EAB'}}>{translate("headerTotalCosts")}</Text>
            <Text style={{color: themeVars.toolbarDefaultBg}}>{moneyStr(this.props.currentLanguage, booking.price)}</Text>
          </View>
        </View>
      }
    </View>
  }
}
const PaymentForm = connect(mapStateToProps, mapDispatchToProps)(_PaymentForm);

class _BookingDetailsFormHeader extends React.Component {
  render() {
    return <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
       <Text>{translate("headerBookingDetails")}</Text>
       <Icon
         style={{fontSize: 16, color: '#919EAB'}}
         type="Ionicons"
         name={
           this.props.expanded ? 'ios-arrow-up' : 'ios-arrow-down'
         }
       />
    </View>
  }
}
const BookingDetailsFormHeader = connect(mapStateToProps, mapDispatchToProps)(_BookingDetailsFormHeader);

class _BookingDetailsForm extends React.Component {
  render() {
    const booking = this.props.booking;
    const originatingStationName = booking.schedule.from_place.name;
    let addressComps = booking.schedule.from_place.address.text.split(",");
    const originatingStationCity = addressComps[addressComps.length - 2];

    const destinationStationName = booking.schedule.to_place.name;
    addressComps = booking.schedule.to_place.address.text.split(",");
    const destinationStationCity = addressComps[addressComps.length - 2];

    const checkinTime = moment(booking.schedule.datetime).subtract(2, 'hours').toDate();

    return <View style={{padding: 16}}>
      <View style={{borderWidth: 1, borderColor: '#DFE3E8', borderRadius: 4, padding: 16, marginBottom: 16}}>
        <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#DFE3E8', paddingBottom: 8}}>
           <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
             <Text style={{color: 'gray', fontSize: 12}}>{translate("titleOrigin")}</Text>
             <Text style={{fontSize: 13}}>{originatingStationName}</Text>
             <Text style={{fontSize: 13, textAlign: 'left'}}>{originatingStationCity}</Text>
           </View>
           <View style={{flex: 0, flexDirection: 'column', justifyContent: 'center', margin: 8}}>
             <Icon type="FontAwesome" name="long-arrow-right" style={{color: themeVars.toolbarDefaultBg}}/>
           </View>
           <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
             <Text style={{color: 'gray', fontSize: 12, textAlign: 'right'}}>{translate("titleDestination")}</Text>
             <Text style={{fontSize: 13, textAlign: 'right'}}>{destinationStationName}</Text>
             <Text style={{fontSize: 13, textAlign: 'right'}}>{destinationStationCity}</Text>
           </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#DFE3E8', paddingTop: 8, paddingBottom: 8}}>
           <View style={{flex: 1}}>
             <Text style={{color: 'gray', fontSize: 12}}>{translate('titleDeparture')}</Text>
             <Text style={{fontSize: 13}}>{getDateDisplayString(booking.schedule.datetime, 0)}</Text>
             <Text style={{fontSize: 13}}>{translate("labelAtTime")} {getTimeDisplayString(booking.schedule.datetime, 0)}</Text>
           </View>
           <View style={{flex: 1}}>
             <Text style={{textAlign: 'right', color: 'gray', fontSize: 12}}>{translate('titleArrival')}</Text>
             <Text style={{textAlign: 'right', fontSize: 13}}>{getDateDisplayString(booking.schedule.datetime, booking.schedule.duration_minutes)}</Text>
             <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
               <Text style={{fontSize: 11, backgroundColor: 'lightgray', marginRight: 4, paddingLeft: 4, paddingRight: 4, borderRadius: 4}}>{translate("labelEstimate")}</Text>
               <Text style={{fontSize: 13}}>{translate("labelAtTime")} {getTimeDisplayString(booking.schedule.datetime, booking.schedule.duration_minutes)}</Text>
             </View>
           </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 0, borderColor: '#DFE3E8', paddingTop: 8}}>
           <Text style={{flex: 1, color: themeVars.toolbarDefaultBg, fontSize: 13}}>{translate("labelCheckInDeadline")}</Text>

           <View style={{flex: 1}}>
             <Text style={{textAlign: 'right', color: themeVars.toolbarDefaultBg, fontSize: 13}}>{getDateDisplayString(checkinTime, 0)}</Text>
             <Text style={{textAlign: 'right', color: themeVars.toolbarDefaultBg, fontSize: 13}}>{getTimeDisplayString(checkinTime, 0)}</Text>
           </View>
        </View>
      </View>

      <View style={{borderWidth: 1, borderColor: '#DFE3E8', borderRadius: 4, padding: 16}}>
        <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', borderBottomWidth: 0, borderColor: '#DFE3E8', paddingBottom: 8}}>
          <Text style={{color: themeVars.toolbarDefaultBg, fontSize: 13}}>{translate("headerStationToStation")}</Text>
          <Text style={{color: themeVars.toolbarDefaultBg, fontSize: 13}}>{translate("labelColli.counting", {count: booking.num_colli})}</Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 0, borderColor: '#DFE3E8', paddingTop: 8}}>
           <View>
             <Text style={{color: '#919EAB', fontSize: 13}}>{translate("labelWeight")}</Text>
             <Text style={{fontSize: 13}}>{numberStr(this.props.currentLanguage, booking.total_weight)} kg</Text>
           </View>

           <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
             <Text style={{color: '#919EAB', fontSize: 13}}>{translate("labelDimension")}</Text>
             <Text style={{fontSize: 13}}>{numberStr(this.props.currentLanguage, booking.total_volume)} cm³</Text>
           </View>
        </View>
      </View>

      <View>
        <View style={{flexDirection: "row", justifyContent: "space-between", paddingTop: 16, paddingBottom: 8, borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
          <Text style={{color: '#454F5B'}}>{translate("labelTariff")}</Text>
          <Text style={{color: '#222B45'}}>{moneyStr(this.props.currentLanguage, currency(booking.price).divide(booking.total_weight).value)}/kg x {numberStr(this.props.currentLanguage, booking.total_weight)} kg</Text>
        </View>

        <View style={{flexDirection: "row", justifyContent: "space-between", paddingTop: 8}}>
          <Text style={{color: '#454F5B', fontWeight: 'bold'}}>{translate("labelTotal")}</Text>
          <Text style={{color: themeVars.toolbarDefaultBg, fontWeight: 'bold'}}>{moneyStr(this.props.currentLanguage, booking.price)}</Text>
        </View>
      </View>
    </View>
  }
}
const BookingDetailsForm = connect(mapStateToProps, mapDispatchToProps)(_BookingDetailsForm);

class _ShipmentStatusScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <ShipmentStatusScreenHeader navigation={navigation}/>,
  });

  constructor(props) {
    super(props);

    this.state = {
      openedSubformIndex: undefined,
      expirationCountdown: 0,
    };
  }

  componentDidMount() {
     const bookingId = this.props.navigation.getParam('id');
     const booking = this.props.bookings.find(booking => booking.id === bookingId);
     if (!booking) {
       return;
     }

     const paidAmountInt = currency(booking.paid_amount).intValue;
     const priceInt = currency(booking.price).intValue;
     const paid = paidAmountInt >= priceInt || booking.checkin_time;
     if (paid) {
       this.setState({openedSubformIndex: 0});
     } else {
       this.setState({openedSubformIndex: 0});
     }
  }

  renderAccordion(booking) {
    return <Accordion
       style={{borderWidth: 0}}
       dataArray={[{}, {}].map((obj, index) => ({...obj, index}))}
       animation={false}
       expanded={this.state.openedSubformIndex}
       renderHeader={(item, expanded) => {
         return <View style={{borderWidth: 0, borderBottomWidth: expanded ? 0 : 0, marginBottom: expanded ? 0 : 8, borderColor: expanded ? themeVars.toolbarDefaultBg : '#DFE3E8'}}>
           {item.index === 0 && <PaymentFormHeader booking={booking} expanded={expanded}/>}
           {item.index === 1 && <BookingDetailsFormHeader booking={booking} expanded={expanded}/>}
         </View>
       }}
       renderContent={item => {
         return <View style={{borderWidth: 0, borderTopWidth: 0, marginBottom: 8, borderColor: themeVars.toolbarDefaultBg}}>
           {item.index === 0 && <PaymentForm booking={booking} navigation={this.props.navigation}/>}
           {item.index === 1 && <BookingDetailsForm booking={booking}/>}
         </View>
       }}
       onAccordionOpen={(item, index) => this.setState({openedSubformIndex: index})}
       onAccordionClose={(item, index) => this.setState({openedSubformIndex: undefined})}
    />
  }

  renderPaid(booking) {
    const {navigate} = this.props.navigation;

    return <React.Fragment>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#DFE3E8'}}>
        <Button
          style={{
            flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
            backgroundColor: themeVars.toolbarDefaultBg, borderRadius: 4, marginLeft: 16, marginRight: 8
          }}
          onPress={() => {
            navigate('CheckIn', {id: booking.id})
          }}
        >
          <Text style={{color: 'white', textAlign: 'center'}}>{translate("buttonCheckInCode")}</Text>
        </Button>
        <Button
          style={{
            flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
            backgroundColor: booking.checkout_code ? themeVars.toolbarDefaultBg : '#DFE3E8', borderRadius: 4, marginLeft: 8, marginRight: 16
          }}
          disabled={booking.checkout_code ? false: true}
          onPress={() => {
            navigate('CheckOut', {id: booking.id});
          }}
        >
          <Text style={{color: booking.checkout_code ? 'white': '#919EAB', textAlign: 'center'}}>{translate("buttonCheckOutCode")}</Text>
        </Button>
      </View>
      {this.renderAccordion(booking)}
    </React.Fragment>
  }

  renderUnpaid(booking) {
    const {navigate} = this.props.navigation;

    return <React.Fragment>
      {this.renderAccordion(booking)}
      <Text style={{textAlign: 'center', color: '#637381'}}>{translate("messageHavingMadeThePayment")}</Text>
      <Button
        style={{margin: 16, justifyContent: 'center'}}
        onPress={() => {
          navigate('MoneyTransferConfirmation', {id: booking.id});
        }}
      >
        <Text>{translate("buttonConfirmPayment")}</Text>
      </Button>
    </React.Fragment>
  }

  render() {
    const {goBack, navigate} = this.props.navigation;

    const bookingId = this.props.navigation.getParam('id');
    const booking = this.props.bookings.find(booking => booking.id === bookingId);
    if (!booking) {
      goBack();
      return null;
    }

    const paidAmountInt = currency(booking.paid_amount).intValue;
    const priceInt = currency(booking.price).intValue;
    const paid = paidAmountInt >= priceInt || booking.checkin_time;

    return (
      <ContentContainer navigate={navigate} hasFooter={false}>
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', padding: 0}}>
          {paid ? this.renderPaid(booking) : this.renderUnpaid(booking)}
        </RoundedCornerPanel>
      </ContentContainer>
    );
  }
}

export const ShipmentStatusScreen = connect(mapStateToProps, mapDispatchToProps)(_ShipmentStatusScreen);
