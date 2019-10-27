import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {
  Button, Form, IconNB, Input, Item, Label, Spinner, Text, Toast,
} from 'native-base';
import { translate } from "../utils/i18n";
import styles from '../styles';
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';
import Actions from '../state/Actions';

class _ShipmentReceiverForm extends React.Component {
  render() {
    return  (
      <Form style={{}}>
        <Item fixedLabel error={!!this.props.receiver.errors.name} style={{flexDirection: 'column', alignItems: 'stretch'}}>
           <Label style={{flex: 1}}>{translate("labelFullName")}</Label>
           <Input
             keyboardType="default"
             onChangeText={val => this.props.setName(val)}
             value={this.props.receiver.name}
             style={{flex: 1}}
           />
           {!!this.props.receiver.errors.name ?
             <IconNB
               name="ios-close-circle"
               onPress={() => {
                 this.props.setErrorName(false);
               }}
             /> :
             null
           }
        </Item>

        <Item fixedLabel error={!!this.props.receiver.errors.phone} style={{flexDirection: 'column', alignItems: 'stretch'}}>
           <Label style={{flex: 1}}>{translate("labelPhone")}</Label>
           <Input
             keyboardType="phone-pad"
             onChangeText={val => this.props.setPhone(val)}
             value={this.props.receiver.phone}
             style={{flex: 1}}
           />
           {!!this.props.receiver.errors.phone ?
             <IconNB
               name="ios-close-circle"
               onPress={() => {
                 this.props.setErrorPhone(false);
               }}
             /> :
             null
           }
        </Item>

        <Item fixedLabel error={!!this.props.receiver.errors.email} style={{flexDirection: 'column', alignItems: 'stretch'}}>
          <Label style={{flex: 1}}>{translate("labelEmail")}</Label>
          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={val => this.props.setEmail(val)}
            value={this.props.receiver.email}
            style={{flex: 1}}
          />
          {!!this.props.receiver.errors.email ?
            <IconNB
              name="ios-close-circle"
              onPress={() => {
                this.props.setErrorEmail(false);
              }}
            /> :
            null
          }
        </Item>
      </Form>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    receiver: state.appReducer.shipmentDetailsForm.receiver,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setName: name => dispatch(Actions.setShipmentDetailsFormReceiver({name})),
    setErrorName: error => dispatch(Actions.setShipmentDetailsFormReceiverError({name: error})),
    setPhone: phone => dispatch(Actions.setShipmentDetailsFormReceiver({phone})),
    setErrorPhone: error => dispatch(Actions.setShipmentDetailsFormReceiverError({phone: error})),
    setEmail: email => dispatch(Actions.setShipmentDetailsFormReceiver({email})),
    setErrorEmail: error => dispatch(Actions.setShipmentDetailsFormReceiverError({email: error})),
  }
};

export const ShipmentReceiverForm = connect(mapStateToProps, mapDispatchToProps)(_ShipmentReceiverForm);
