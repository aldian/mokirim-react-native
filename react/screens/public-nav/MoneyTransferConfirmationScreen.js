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
import ImagePicker from 'react-native-image-picker';
import themeVars from '../../theme/variables/material';
import {translate, getDateDisplayString, getTimeDisplayString, moneyStr, numberStr} from "../../utils/i18n";
import Error from '../../utils/error';
import constants from '../../constants';
import Actions from '../../state/Actions';
import {MoneyTransferConfirmationScreenHeader} from '../../components/MoneyTransferConfirmationScreenHeader';
import {ContentContainer} from '../../components/ContentContainer';
import {RoundedCornerPanel} from '../../components/RoundedCornerPanel';
import {BookingList} from '../../components/BookingList';

class _MoneyTransferConfirmationScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <MoneyTransferConfirmationScreenHeader navigation={navigation}/>,
  });

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      errors: {},
      photo: null,
    }

  }

  componentDidMount() {
  }

  handleChoosePhoto() {
      const options = {
        noData: true,
      }
      ImagePicker.launchCamera(options, response => {
        if (response.uri) {
          this.setState({photo: {
            name: response.fileName,
            type: response.type,
            uri: Platform.OS === "android" ? response.uri : response.uri.replace("file://", ""),
          }});
        }
      })
  }

  render() {
    const {goBack, navigate} = this.props.navigation;

    const bookingId = this.props.navigation.getParam('id');
    const booking = this.props.bookings.find(booking => booking.id === bookingId);
    if (!booking) {
      goBack();
      return;
    }

    return (
      <ContentContainer navigate={navigate}>
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
          <Form>
            <Item fixedLabel error={!!this.state.errors.name} style={{flexDirection: 'column', alignItems: 'stretch'}}>
               <Label style={{flex: 1}}>{translate("labelFullName")}</Label>
               <Input
                 keyboardType="default"
                 onChangeText={val => this.setState({name: val})}
                 value={this.state.name}
                 style={{flex: 1}}
               />
               {!!this.state.errors.name ?
                 <IconNB
                   name="ios-close-circle"
                   onPress={() => {
                     this.setState({errors: {...this.state.errors, name: undefined}});
                   }}
                 /> :
                 null
               }
            </Item>

            <Item fixedLabel error={!!this.state.errors.email} style={{flexDirection: 'column', alignItems: 'stretch'}}>
                <Label style={{flex: 1}}>{translate("labelEmail")}</Label>
                <Input
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={val => this.setState({email: val})}
                  value={this.state.email}
                  style={{flex: 1}}
                />
                {!!this.state.errors.email ?
                  <IconNB
                    name="ios-close-circle"
                    onPress={() => {
                      this.setState({errors: {...this.state.errors, email: undefined}});
                    }}
                  /> :
                  null
                }
            </Item>
            <Item>
              <Button onPress={() => this.handleChoosePhoto()}><Text>{translate("labelUploadTransferProof")}</Text></Button>
            </Item>
          </Form>

          {this.props.submitting ?
            <Spinner/> :
            <Button
                style={{margin: 16, justifyContent: 'center'}}
                onPress={() => {
                  this.props.setMoneyTransferConfirmationForm({submitting: true})
                  this.props.submitConfirmBookingPaymentForm(this.props.currentLanguage, this.props.accessToken, {
                    booking: booking.id,
                    confirming_person_name: this.state.name,
                    confirming_person_email: this.state.email,
                    ...(this.state.photo ? {proof: this.state.photo} : {}),
                  }).then(() => {
                    Toast.show({
                      text: translate("messageWeWillSendCheckInCodeShortly"),
                      buttonText: "OK",
                      duration: 5000,
                    });
                    navigate("Dashboard");
                  }).catch(error => {
                    Toast.show({
                       text: error,
                       buttonText: "OK",
                       duration: 5000,
                    });
                  }).finally(() => {
                    this.props.setMoneyTransferConfirmationForm({submitting: false});
                  });
                }}
            >
                <Text>{translate("buttonSendConfirmation")}</Text>
            </Button>
          }
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
    bookings: state.appReducer.bookings,
    submitting: state.appReducer.moneyTransferConfirmationForm.submitting,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setMoneyTransferConfirmationForm: form => dispatch(
      Actions.setMoneyTransferConfirmationForm(form)
    ),
    submitConfirmBookingPaymentForm: (languageCode, accessToken, data) => dispatch(
      Actions.submitConfirmBookingPaymentForm(languageCode, accessToken, data)
    ),
  }
};

export const MoneyTransferConfirmationScreen = connect(mapStateToProps, mapDispatchToProps)(_MoneyTransferConfirmationScreen);
