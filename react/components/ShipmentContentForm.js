import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {
  Button, Form, IconNB, Input, Item, Label, Spinner, Text, Textarea, Toast,
} from 'native-base';
import { translate } from "../utils/i18n";
import styles from '../styles';
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';
import Actions from '../state/Actions';

class _ShipmentContentForm extends React.Component {
  render() {
    return  (
      <Form style={{}}>
        <Item fixedLabel error={!!this.props.content.errors.description} style={{flexDirection: 'column', alignItems: 'stretch'}}>
          <Label style={{flex: 1}}>{translate("labelDescribePackageContent")}</Label>
          <Textarea
            keyboardType="default"
            rowSpan={4}
            onChangeText={val => this.props.setDescription(val)}
            value={this.props.content.description}
            style={{flex: 1}}
          />
          {!!this.props.content.errors.description ?
            <IconNB
              name="ios-close-circle"
              onPress={() => {
                this.props.setErrorDescription(false);
              }}
            /> :
            null
          }
        </Item>

        <Item fixedLabel error={!!this.props.content.errors.valueIDR} style={{flexDirection: 'column', alignItems: 'stretch'}}>
           <Label style={{flex: 1}}>{translate("labelEstimateTotalValue")}</Label>
             <Item style={{flex: 1}}>
               <Text>Rp</Text>

           <Input
             keyboardType="numeric"
             onChangeText={val => this.props.setValueIDR(val)}
             value={this.props.content.valueIDR}
             style={{flex: 1}}
           />
           {!!this.props.content.errors.valueIDR ?
             <IconNB
               name="ios-close-circle"
               onPress={() => {
                 this.props.setErrorValueIDR(false);
               }}
             /> :
             null
           }
             </Item>
        </Item>
      </Form>
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
    setErrorDescription: error => dispatch(Actions.setShipmentDetailsFormContentError({description: error})),
    setValueIDR: valueIDR => dispatch(Actions.setShipmentDetailsFormContent({valueIDR})),
    setErrorValueIDR: error => dispatch(Actions.setShipmentDetailsFormContentError({valueIDR: error})),
  }
};

export const ShipmentContentForm = connect(mapStateToProps, mapDispatchToProps)(_ShipmentContentForm);
