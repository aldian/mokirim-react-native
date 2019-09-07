import React from 'react';
import {connect} from 'react-redux';
import {
  Button, Form, IconNB, Input, Item, Label, Spinner, Text, Toast,
} from 'native-base';
import { translate } from "../utils/i18n";
import Actions from '../state/Actions';
import styles from '../styles';
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';

class _ConfirmPasswordResetForm extends React.Component {
  componentDidMount() {
    this.props.setCode('');
    this.props.setErrorCode(false);

    this.props.setNewPassword('');
    this.props.setErrorNewPassword(false);
  };

  render() {
    return  (
      <React.Fragment>
         <Text>{translate("instructionReset.counting", {count: 6, email: this.props.email})}</Text>
         <Form>
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

           <Item fixedLabel error={!!this.props.errors.newPassword}>
             <Label>{translate("labelNewPassword")}</Label>
             <Input secureTextEntry={true} onChangeText={val => this.props.setNewPassword(val)} value={this.props.newPassword}/>
             {!!this.props.errors.newPassword ?
               <IconNB
                 name="ios-close-circle"
                 onPress={() => {
                   this.props.setNewPassword('');
                   this.props.setErrorNewPassword(false);
                 }}
               /> :
               null
             }
           </Item>
         </Form>
         {this.props.submitting ?
            <Spinner/> :
            <Button
              block style={styles.submitButton}
              onPress={() => this.props.submitForm(
                this.props.currentLanguage, this.props.encodedUserId, this.props.code, this.props.newPassword
              ).then(() => {
                Toast.show({text: translate('messagePasswordChanged'), buttonText: "OK", duration: 10000});
                this.props.navigate('Login');
              })}
            >
              <Text>{translate("buttonChangePassword")}</Text>
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
    code: state.appReducer.resetPasswordForm.activationCode,
    newPassword: state.appReducer.resetPasswordForm.newPassword,
    errors: state.appReducer.registerForm.errors,
    submitting: state.appReducer.resetPasswordForm.submitting,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitForm: (languageCode, encodedUserId, code, newPassword) => dispatch(Actions.submitConfirmPasswordResetForm(
      languageCode, encodedUserId, code, newPassword
    )).catch(error => {
      Toast.show({text: error, buttonText: "OK", duration: 10000});
      return new Promise((resolve, reject) => reject());
    }),

    setCode: code => dispatch(Actions.setConfirmPasswordResetFormCode(code)),
    setErrorCode: error => dispatch(Actions.setConfirmPasswordResetFormErrorCode(error)),

    setNewPassword: password => dispatch(Actions.setConfirmPasswordResetFormNewPassword(password)),
    setErrorNewPassword: error => dispatch(Actions.setConfirmPasswordResetFormErrorNewPassword(error)),
  }
};

export const ConfirmPasswordResetForm = connect(mapStateToProps, mapDispatchToProps)(_ConfirmPasswordResetForm);
