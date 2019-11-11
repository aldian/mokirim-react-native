import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import currency from 'currency.js';
import {TouchableOpacity, View} from 'react-native';
import {
  Button, DatePicker, Form, Icon, IconNB, Input, Item, Label, Spinner,
  Tab, TabHeading, Tabs,
  Text, Toast,
} from 'native-base';
import themeVars from '../../theme/variables/material';
import {translate, getDateDisplayString, getTimeDisplayString, moneyStr, numberStr} from "../../utils/i18n";
import Error from '../../utils/error';
import constants from '../../constants';
import Actions from '../../state/Actions';
import {ShipmentsScreenHeader} from '../../components/ShipmentsScreenHeader';
import {ShipmentSenderFormHeader} from '../../components/ShipmentSenderFormHeader';
import {ShipmentSenderForm} from '../../components/ShipmentSenderForm';
import {ShipmentReceiverFormHeader} from '../../components/ShipmentReceiverFormHeader';
import {ShipmentReceiverForm} from '../../components/ShipmentReceiverForm';
import {ShipmentContentFormHeader} from '../../components/ShipmentContentFormHeader';
import {ShipmentContentForm} from '../../components/ShipmentContentForm';
import Accordion, {DefaultContent as DefaultAccordionContent} from '../../components/Accordion';
import {ContentContainer} from '../../components/ContentContainer';
import {RoundedCornerPanel} from '../../components/RoundedCornerPanel';
import {BookingList} from '../../components/BookingList';

class _ShipmentsScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <ShipmentsScreenHeader navigation={navigation}/>,
  });

  constructor(props) {
    super(props);

    this.state = {
      currentTab: 0,
    }
  }

  componentDidMount() {
    this.props.setShipmentsForm({loaded: false});
    this.props.loadBookings(
      this.props.currentLanguage, this.props.accessToken,
      {ordering: '-created_at', v: this.props.apiVValue}
    ).then(obj => {
      this.props.setBookings(obj.results);
    }).catch(error => {
      Toast.show({
         text: error,
         buttonText: "OK",
         duration: 5000,
      });
    }).finally(() => this.props.setShipmentsForm({loaded: true}));
  }

  render() {
    const {navigate} = this.props.navigation;

    return (
      <ContentContainer navigate={navigate} currentTab={"Shipments"} scrollEnabled={false}>
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', padding: 0}}>
          <Tabs tabContainerStyle={{elevation: 0, backgroundColor: 'transparent'}} onChangeTab={({ i }) => this.setState({ currentTab: i })}  tabBarUnderlineStyle={{backgroundColor: themeVars.toolbarDefaultBg}}>
            <Tab heading={ <TabHeading style={{backgroundColor: 'transparent'}}><Text style={{color: this.state.currentTab === 0 ? themeVars.toolbarDefaultBg : '#637381'}}>{translate("headerPending")}</Text></TabHeading>}>
              <BookingList bookings={this.props.bookings.filter(booking => {
                const paidAmountInt = currency(booking.paid_amount).intValue;
                const priceInt = currency(booking.price).intValue;
                return paidAmountInt < priceInt && !booking.checkin_time;
              })} navigate={navigate}/>
            </Tab>
            <Tab heading={ <TabHeading style={{backgroundColor: 'transparent'}}><Text style={{color: this.state.currentTab === 1 ? themeVars.toolbarDefaultBg : '#637381'}}>{translate("headerActive")}</Text></TabHeading>}>
              <BookingList bookings={this.props.bookings.filter(booking => {
                const paidAmountInt = currency(booking.paid_amount).intValue;
                const priceInt = currency(booking.price).intValue;
                return (paidAmountInt >= priceInt || booking.checkin_time) && !booking.checkout_time;
              })} navigate={navigate}/>
            </Tab>
            <Tab heading={ <TabHeading style={{backgroundColor: 'transparent'}}><Text style={{color: this.state.currentTab === 2 ? themeVars.toolbarDefaultBg : '#637381'}}>{translate("headerDone")}</Text></TabHeading>}>
              <BookingList bookings={this.props.bookings.filter(booking => booking.checkout_time)} navigate={navigate}/>
            </Tab>
          </Tabs>
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
    bookingsLoaded: state.appReducer.shipmentsForm.loaded,
    bookings: state.appReducer.bookings,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setShipmentsForm: form => dispatch(Actions.setShipmentsForm(form)),
    loadBookings: (languageCode, accessToken, config) => dispatch(
      Actions.loadBookings(languageCode, accessToken, config)
    ),
    setBookings: bookings => dispatch(Actions.setBookings(bookings)),
  }
};

export const ShipmentsScreen = connect(mapStateToProps, mapDispatchToProps)(_ShipmentsScreen);
