import React from 'react';
import {connect} from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
//import { HeaderTitle } from 'react-navigation-stack';
import {
  Button,
  Container, Content, Form, Input, Item, Label, Text, Toast,
  Title as HeaderTitle,
  Icon, IconNB, Spinner, StyleProvider,
} from 'native-base';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
//import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ContentContainer } from '../../components/ContentContainer';
import { LoginScreenHeader } from '../../components/LoginScreenHeader';
import styles from '../../styles';
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';

class _LoginScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    //headerTitle: <HeaderTitle><NavigationL10nText textKey="headerLogin"/></HeaderTitle>
    header: () => <LoginScreenHeader navigation={navigation}/>,
  });

  componentDidMount() {
    this.props.setUsername('');
    this.props.setPassword('');
    this.props.setErrorUsername(false);
    this.props.setErrorPassword(false);
  };

  render() {
    const {navigate} = this.props.navigation;
    return  (
      <ContentContainer hasFooter={false} style={{backgroundColor: '#222B45'}}>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, paddingBottom: 16}}>
             <Text style={{color: themeVars.toolbarDefaultBg, textAlign: 'center', margin: 16, fontSize: 32, fontWeight: 'bold'}}>{translate("headerLogin")}</Text>
             {this.props.submitting ?
               null :
               <React.Fragment>
                   <LoginButton
                     style={{width: 250, height: 32}}
                     permissions={['email']}
                     onLoginFinished={
                       (error, result) => {
                         if (error) {
                           this.props.setErrorMessage(error);
                         } else if (result.isCancelled) {
                           Toast.show({
                             text: translate("messageLoginCancelled"),
                             //buttonText: "Okay"
                           });
                         } else {
                           AccessToken.getCurrentAccessToken().then(
                             (data) => {
                               this.props.loggedInToFacebook(this.props.currentLanguage, data.accessToken);
                               navigate('Dashboard');
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
                     onPress={() => this.props.pressGoogleLogin(navigate, this.props.currentLanguage)}
                     disabled={false} />
               </React.Fragment>
             }
             <View style={{marginTop: 16}}>
               <Text style={{textAlign: 'center', color: '#919EAB'}}>{translate("messageOrLoginWithEmail")}</Text>
             </View>
             <Form style={{alignSelf: 'stretch'}}>
               <Item fixedLabel error={!!this.props.errors.username}>
                 <Label>{translate("labelEmailOrUsername")}</Label>
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
             <Button
               transparent
               onPress={() => navigate('ResetPassword')}
             >
               <Text>{translate("buttonForgotPassword")}</Text>
             </Button>
             <TouchableOpacity onPress={() => navigate('Dashboard')}>
               <Text>{translate("buttonSkip")}</Text>
             </TouchableOpacity>
        </View>
        <View>
            {this.props.submitting ?
              <Spinner/> :
              <React.Fragment>
                <Button
                  block style={[styles.submitButton, {backgroundColor: themeVars.toolbarDefaultBg}]}
                  onPress={() => this.props.submitForm(
                    this.props.currentLanguage, this.props.username, this.props.password
                  )}
                >
                  <Text>{translate("buttonLogin")}</Text>
                </Button>
              </React.Fragment>
            }
        </View>
      </ContentContainer>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    username: state.appReducer.loginForm.username,
    password: state.appReducer.loginForm.password,
    errors: state.appReducer.loginForm.errors,
    submitting: state.appReducer.loginForm.submitting,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const {navigate} = ownProps.navigation;
  return {
    loggedInToFacebook: (languageCode, accessToken) => dispatch(Actions.loggedInToFacebook(languageCode, accessToken)).then(response => {
      if (response.ok) {
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

    submitForm: (languageCode, username, password) => dispatch(Actions.submitLoginForm(
      languageCode, username, password
    )).then(
      response => {
        dispatch(Actions.loginFormSubmitted());

        if (response.ok) {
          dispatch(Actions.setLoginFormErrorUsername(false));
          dispatch(Actions.setLoginFormErrorPassword(false));
          dispatch(Actions.setLoginFormUsername(''));
          dispatch(Actions.setLoginFormPassword(''));

          response.json().then(obj => {
            dispatch(Actions.loggedInToMokirim(obj.token));
            navigate("Dashboard");
          });
        } else {
          if (response.status === 404) {
            Toast.show({
              text: translate("errorResourceNotFound"),
            });
          } else if (response.status === 400) {
            response.json().then(obj => {
              let texts = [];
              if (obj.__all__) {
                dispatch(Actions.setLoginFormErrorUsername(true));
                dispatch(Actions.setLoginFormErrorPassword(true));
                texts = [...texts, ...obj.__all__];
              }
              if (obj.username) {
                dispatch(Actions.setLoginFormErrorUsername(true));
                texts = [...texts, ...obj.username.map(txt => 'username: ' + txt)];
              }
              if (obj.password) {
                dispatch(Actions.setLoginFormErrorPassword(true));
                texts = [...texts, ...obj.password.map(txt => 'password: ' + txt)];
              }
              Toast.show({
                text: texts.join(' - '), buttonText: "OK", duration: 10000,
              });
            });
          } else {
            Toast.show({
              //text: translate("errorInvalidUsernameOrPassword"),
              text: "ERROR " + response.status,
            });
          }
        }
      }
    ).catch(
      error => {
         dispatch(Actions.loginFormSubmitted());
         Toast.show({
           text: error,
         });
      }
    ),

    pressGoogleLogin: (navigate, languageCode) => dispatch(Actions.pressGoogleLogin(languageCode)).then(response => {
       if (response.ok) {
         navigate("Dashboard");
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

    setUsername: username => dispatch(Actions.setLoginFormUsername(username)),
    setPassword: password => dispatch(Actions.setLoginFormPassword(password)),
    setErrorUsername: error => dispatch(Actions.setLoginFormErrorUsername(error)),
    setErrorPassword: error => dispatch(Actions.setLoginFormErrorPassword(error)),
  }
};

export const LoginScreen = connect(mapStateToProps, mapDispatchToProps)(_LoginScreen);
