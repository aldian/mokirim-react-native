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

class _ShipmentReceiverFormHeader extends React.Component {
  render() {
    return  (
      <React.Fragment>
         <Text>{translate('titleReceiver')}</Text>
         {this.props.expanded ?
           null : <React.Fragment>
           {this.props.receiver.name ? <Text>{this.props.receiver.name}</Text> : null}
           {this.props.receiver.email ? <Text>{this.props.receiver.email}</Text> : null}
           {this.props.receiver.phone ? <Text>{this.props.receiver.phone}</Text> : null}
         </React.Fragment>}
      </React.Fragment>
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
    setPhone: phone => dispatch(Actions.setShipmentDetailsFormReceiver({phone})),
    setEmail: email => dispatch(Actions.setShipmentDetailsFormReceiver({email})),
  }
};

export const ShipmentReceiverFormHeader = connect(mapStateToProps, mapDispatchToProps)(_ShipmentReceiverFormHeader);
