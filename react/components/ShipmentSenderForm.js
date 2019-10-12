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

class _ShipmentSenderForm extends React.Component {
  componentDidMount() {
    if (!this.props.sender.name) {
      this.props.setName(this.props.profile.name);
    }
    if (!this.props.sender.phone) {
      this.props.setPhone(this.props.profile.phone);
    }
    if (!this.props.sender.email) {
      this.props.setEmail(this.props.profile.email);
    }
  }

  render() {
    return  (
      <Form style={{}}>
        <Item fixedLabel error={!!this.props.sender.errors.name} style={{flexDirection: 'column', alignItems: 'stretch'}}>
           <Label style={{flex: 1}}>{translate("labelFullName")}</Label>
           <Input
             keyboardType="default"
             onChangeText={val => this.props.setName(val)}
             value={this.props.sender.name}
             style={{flex: 1}}
           />
           {!!this.props.sender.errors.name ?
             <IconNB
               name="ios-close-circle"
               onPress={() => {
                 this.props.setErrorName(false);
               }}
             /> :
             null
           }
        </Item>

        <Item fixedLabel error={!!this.props.sender.errors.phone} style={{flexDirection: 'column', alignItems: 'stretch'}}>
           <Label style={{flex: 1}}>{translate("labelPhone")}</Label>
           <Input
             keyboardType="phone-pad"
             onChangeText={val => this.props.setPhone(val)}
             value={this.props.sender.phone}
             style={{flex: 1}}
           />
           {!!this.props.sender.errors.phone ?
             <IconNB
               name="ios-close-circle"
               onPress={() => {
                 this.props.setErrorPhone(false);
               }}
             /> :
             null
           }
        </Item>

        <Item fixedLabel error={!!this.props.sender.errors.email} style={{flexDirection: 'column', alignItems: 'stretch'}}>
          <Label style={{flex: 1}}>{translate("labelEmail")}</Label>
          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={val => this.props.setEmail(val)}
            value={this.props.sender.email}
            style={{flex: 1}}
          />
          {!!this.props.sender.errors.email ?
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
    profile: state.appReducer.editProfileForm,
    sender: state.appReducer.shipmentDetailsForm.sender,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setName: name => dispatch(Actions.setShipmentDetailsFormSender({name})),
    setErrorName: error => dispatch(Actions.setShipmentDetailsFormSenderError({name: error})),
    setPhone: phone => dispatch(Actions.setShipmentDetailsFormSender({phone})),
    setErrorPhone: error => dispatch(Actions.setShipmentDetailsFormSenderError({phone: error})),
    setEmail: email => dispatch(Actions.setShipmentDetailsFormSender({email})),
    setErrorEmail: error => dispatch(Actions.setShipmentDetailsFormSenderError({email: error})),
  }
};

export const ShipmentSenderForm = connect(mapStateToProps, mapDispatchToProps)(_ShipmentSenderForm);
