import React from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity, View} from 'react-native';
import {
  Button, Form, Spinner, Text, IconNB, Input, Item, Label, Toast,
} from 'native-base';
import uuid from 'uuid';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
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
    const {navigate} = this.props.navigation;
    return  (
      <React.Fragment>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'white', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, paddingBottom: 16}}>
          <Text style={{color: themeVars.toolbarDefaultBg, textAlign: 'center', margin: 16, fontSize: 32, fontWeight: 'bold'}}>{translate("headerRegister")}</Text>
          {this.props.submitting ?
            null :
            <React.Fragment>
                <LoginButton
                  style={{width: 250, height: 32}}
                  permissions={['email']}
                  onLoginFinished={
                    (error, result) => {
                      if (error) {
                        Toast.show({
                           text: error,
                        });
                      } else if (result.isCancelled) {
                        Toast.show({
                          text: translate("messageLoginCancelled"),
                          //buttonText: "Okay"
                        });
                      } else {
                        AccessToken.getCurrentAccessToken().then(
                          data => {
                            this.props.loggedInToFacebook(this.props.currentLanguage, data.accessToken, this.props.profile);
                          }
                        )
                      }
                    }
                  }
                />

                <GoogleSigninButton
                  style={{ width: 250, height: 48 }}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={() => this.props.pressGoogleLogin(navigate, this.props.currentLanguage, this.props.profile)}
                  disabled={false} />
            </React.Fragment>
          }
          <View style={{marginTop: 16}}>
            <Text style={{textAlign: 'center', color: '#919EAB'}}>{translate("messageOrRegisterWithEmail")}</Text>
          </View>

          <Form style={{alignSelf: 'stretch'}}>
             <Item fixedLabel error={!!this.props.errors.username}>
               <Label>{translate("labelEmail")}</Label>
               <Input
                 autoCapitalize="none"
                 keyboardType="email-address"
                 onChangeText={val => this.props.setUsername(val)}
                 value={this.props.username}
               />
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
          </Form>
          <TouchableOpacity onPress={() => navigate('Dashboard')}>
            <Text>{translate("buttonSkip")}</Text>
          </TouchableOpacity>
        </View>
        {this.props.submitting ?
           <Spinner/> :
           <Button
             block style={[styles.submitButton, {backgroundColor: themeVars.toolbarDefaultBg}]}
             onPress={() => this.props.submitForm(
               this.props.currentLanguage, this.props.username, uuid.v4()
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
    profile: state.appReducer.editProfileForm,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const {navigate} = ownProps.navigation;
  return {
    loggedInToFacebook: (languageCode, accessToken, profile) => dispatch(Actions.loggedInToFacebook(languageCode, accessToken)).then(response => {
       if (response.ok) {
          response.json().then(obj => {
            dispatch(Actions.loadUserProfile(languageCode, obj.token, profile)).then(profile => {
              if (profile.id) {
                navigate("Dashboard");
              } else {
                navigate("EditProfile", {hasBack: false});
              }
            });
         });
         return; // as ok response only handled in Actions
       }
       if (response.status === 404) {
         Toast.show({
           text: translate("errorResourceNotFound")
         });
       } else if (response.status === 400) {
         Toast.show({
           text: translate("errorInvalidFacebookAccessToken"),
         });
       } else {
         Toast.show({
           text: "ERROR " + response.status,
         });
       }
    }),

    pressGoogleLogin: (navigate, languageCode, profile) => dispatch(Actions.pressGoogleLogin(languageCode)).then(response => {
      if (response.ok) {
        response.json().then(obj => {
          dispatch(Actions.loadUserProfile(languageCode, obj.token, profile)).then(profile => {
            if (profile.id) {
              navigate("Dashboard");
            } else {
              navigate("EditProfile", {hasBack: false});
            }
          });
        });
        return; // as ok response only handled in Actions
      }
      if (response.status === 404) {
        Toast.show({
          text: translate("errorResourceNotFound")
        });
      } else if (response.status === 400) {
        Toast.show({
          text: translate("errorInvalidGoogleAccessToken"),
        });
      } else {
        Toast.show({
          text: "ERROR " + response.status,
        });
      }
    }),

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
