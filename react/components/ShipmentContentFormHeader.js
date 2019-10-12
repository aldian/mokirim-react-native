import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {
  Button, Form, IconNB, Input, Item, Label, Spinner, Text, Toast,
} from 'native-base';
import {moneyStr, translate} from "../utils/i18n";
import styles from '../styles';
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';
import Actions from '../state/Actions';

class _ShipmentContentFormHeader extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Text>{translate('titleContentDetails')}</Text>
        {this.props.expanded ?
          null : <React.Fragment>
          {this.props.content.description ? <Text>{this.props.content.description && this.props.content.description.trim()}</Text> : null}
          {this.props.content.valueIDR ? <Text>{moneyStr(this.props.currentLanguage, this.props.content.valueIDR)}</Text> : null}
        </React.Fragment>}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    content: state.appReducer.shipmentDetailsForm.content,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setDescription: description => dispatch(Actions.setShipmentDetailsFormContent({description})),
    setValueIDR: valueIDR => dispatch(Actions.setShipmentDetailsFormContent({valueIDR})),
  }
};

export const ShipmentContentFormHeader = connect(mapStateToProps, mapDispatchToProps)(_ShipmentContentFormHeader);