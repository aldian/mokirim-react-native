import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {
  Button, Form, Spinner, Text, IconNB, Input, Item, Label, Toast,
} from 'native-base';
import { translate } from "../utils/i18n";
import themeVars from '../theme/variables/material';
import Actions from '../state/Actions';
import styles from '../styles';

class _ResetPasswordForm extends React.Component {
  componentDidMount() {
    this.props.setEmail('');
    this.props.setErrorEmail(false);
  };

  render() {
    return  (
      <React.Fragment>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'white', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, paddingBottom: 16}}>
          <Text style={{color: themeVars.toolbarDefaultBg, textAlign: 'center', margin: 16, fontSize: 32, fontWeight: 'bold'}}>{translate("headerResetPassword")}</Text>
          <Form style={{alignSelf: 'stretch'}}>
             <Item fixedLabel error={!!this.props.errors.email}>
               <Label>{translate("labelEmail")}</Label>
               <Input
                 autoCapitalize="none"
                 keyboardType="email-address"
                 onChangeText={val => this.props.setEmail(val)} value={this.props.email}
               />
               {!!this.props.errors.email ?
                 <IconNB
                   name="ios-close-circle"
                   onPress={() => {
                     this.props.setEmail('');
                     this.props.setErrorEmail(false);
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
               this.props.currentLanguage, this.props.email
             )}
           >
             <Text>{translate("buttonResetPassword")}</Text>
           </Button>
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    email: state.appReducer.resetPasswordForm.email,
    errors: state.appReducer.resetPasswordForm.errors,
    submitting: state.appReducer.resetPasswordForm.submitting,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitForm: (languageCode, email) => dispatch(Actions.submitResetPasswordForm(
      languageCode, email
    )).catch(error => {
      Toast.show({text: error, buttonText: "OK", duration: 10000});
    }),

    setEmail: email => dispatch(Actions.setResetPasswordFormEmail(email)),
    setErrorEmail: error => dispatch(Actions.setResetPasswordFormErrorEmail(error)),
  }
};

export const ResetPasswordForm = connect(mapStateToProps, mapDispatchToProps)(_ResetPasswordForm);
