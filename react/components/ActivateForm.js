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

class _ActivateForm extends React.Component {
  componentDidMount() {
    this.props.setCode('');
    this.props.setErrorCode(false);
  };

  render() {
    return  (
      <React.Fragment>
         <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'white', borderRadius: 16, paddingBottom: 16}}>
           <Text style={{padding: 16}}>{translate("instructionActivate.counting", {count: 6, email: this.props.email})}</Text>
           <Form style={{alignSelf: 'stretch'}}>
              <Item fixedLabel error={!!this.props.errors.code}>
                <Label>{translate("labelCode")}</Label>
                <Input onChangeText={val => this.props.setCode(val)} value={this.props.code}/>
                {!!this.props.errors.code ?
                  <IconNB
                    name="ios-close-circle"
                    onPress={() => {
                      this.props.setCode('');
                      this.props.setErrorCode(false);
                    }}
                  /> :
                  null
                }
              </Item>
           </Form>
         </View>
         {this.props.submitting ?
            <Spinner/> :
            <Button
              block style={[styles.submitButton, {backgroundColor: themeVars.toolbarDefaultBg}]}
              onPress={() => this.props.submitForm(
                this.props.currentLanguage, this.props.encodedUserId, this.props.code,
              ).then(() => {
                Toast.show({text: translate('messageAccountActivated'), buttonText: "OK", duration: 10000});
                this.props.navigate('Login');
              })}
            >
              <Text>{translate("buttonActivate")}</Text>
            </Button>
         }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    encodedUserId: state.appReducer.encodedUserId,
    email: state.appReducer.email,
    code: state.appReducer.registerForm.activationCode,
    errors: state.appReducer.registerForm.errors,
    submitting: state.appReducer.registerForm.submitting,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitForm: (languageCode, encodedUserId, code) => dispatch(Actions.submitActivateForm(
      languageCode, encodedUserId, code,
    )).catch(error => {
      Toast.show({text: error, buttonText: "OK", duration: 10000});
      return new Promise((resolve, reject) => reject());
    }),

    setCode: code => dispatch(Actions.setActivateFormCode(code)),
    setErrorCode: error => dispatch(Actions.setActivateFormErrorCode(error)),
  }
};

export const ActivateForm = connect(mapStateToProps, mapDispatchToProps)(_ActivateForm);
