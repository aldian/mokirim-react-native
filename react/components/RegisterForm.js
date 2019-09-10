import React from 'react';
import {connect} from 'react-redux';
import {
  Button, Form, Spinner, Text, IconNB, Input, Item, Label, Toast,
} from 'native-base';
import { translate } from "../utils/i18n";
import themeVars from '../theme/variables/material';
import Actions from '../state/Actions';
import styles from '../styles';

class _RegisterForm extends React.Component {
  componentDidMount() {
    this.props.setUsername('');
    this.props.setPassword('');
    this.props.setErrorUsername(false);
    this.props.setErrorPassword(false);
  };

  render() {
    return  (
      <React.Fragment>
        <Form style={{backgroundColor: 'white', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, paddingBottom: 16}}>
           <Item fixedLabel error={!!this.props.errors.username}>
             <Label>{translate("labelEmail")}</Label>
             <Input onChangeText={val => this.props.setUsername(val)} value={this.props.username}/>
             {!!this.props.errors.username ?
               <IconNB
                 name="ios-close-circle"
                 onPress={() => {
                   this.props.setUsername('');
                   this.props.setErrorUsername(false);
                 }}
               /> :
               null
             }
           </Item>
           <Item fixedLabel last error={!!this.props.errors.password}>
             <Label>{translate("labelPassword")}</Label>
             <Input
               secureTextEntry={true} onChangeText={val => this.props.setPassword(val)}
               value={this.props.password}
             />
             {!!this.props.errors.password ?
               <IconNB
                 name="ios-close-circle"
                 onPress={() => {
                   this.props.setPassword('');
                   this.props.setErrorPassword(false);
                 }}
               /> :
               null
             }
           </Item>
        </Form>
        {this.props.submitting ?
           <Spinner/> :
           <Button
             block style={[styles.submitButton, {backgroundColor: themeVars.toolbarDefaultBg}]}
             onPress={() => this.props.submitForm(
               this.props.currentLanguage, this.props.username, this.props.password
             )}
           >
             <Text>{translate("buttonRegister")}</Text>
           </Button>
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    username: state.appReducer.registerForm.username,
    password: state.appReducer.registerForm.password,
    errors: state.appReducer.registerForm.errors,
    submitting: state.appReducer.registerForm.submitting,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitForm: (languageCode, username, password) => dispatch(Actions.submitRegisterForm(
      languageCode, username, password
    )).catch(error => {
      Toast.show({text: error, buttonText: "OK", duration: 10000});
    }),

    setUsername: username => dispatch(Actions.setRegisterFormUsername(username)),
    setPassword: password => dispatch(Actions.setRegisterFormPassword(password)),
    setErrorUsername: error => dispatch(Actions.setRegisterFormErrorUsername(error)),
    setErrorPassword: error => dispatch(Actions.setRegisterFormErrorPassword(error)),
  }
};

export const RegisterForm = connect(mapStateToProps, mapDispatchToProps)(_RegisterForm);
