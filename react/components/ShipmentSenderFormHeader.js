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

class _ShipmentSenderFormHeader extends React.Component {
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
      <React.Fragment>
        <Text>{translate('titleSender')}</Text>
        {this.props.expanded ?
          null : <React.Fragment>
          {this.props.sender.name ? <Text>{this.props.sender.name}</Text> : null}
          {this.props.sender.email ? <Text>{this.props.sender.email}</Text> : null}
          {this.props.sender.phone ? <Text>{this.props.sender.phone}</Text> : null}
        </React.Fragment>}
      </React.Fragment>
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
    setPhone: phone => dispatch(Actions.setShipmentDetailsFormSender({phone})),
    setEmail: email => dispatch(Actions.setShipmentDetailsFormSender({email})),
  }
};

export const ShipmentSenderFormHeader = connect(mapStateToProps, mapDispatchToProps)(_ShipmentSenderFormHeader);
