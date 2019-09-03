import React from 'react';
import {connect} from 'react-redux';
import { View } from 'react-native';
//import { HeaderTitle } from 'react-navigation-stack';
import {
  Button,
  Container, Content, Form, Input, Item, Label, Text, Toast,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, IconNB, Spinner, StyleProvider,
} from 'native-base';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ScreenContainer } from '../../components/ScreenContainer';
import { LoginFormHeader } from '../../components/LoginFormHeader';
import styles from '../../styles';
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';

class _LoginScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    //headerTitle: <HeaderTitle><NavigationL10nText textKey="headerLogin"/></HeaderTitle>
    header: <LoginFormHeader navigation={navigation}/>,
  });

  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      username: '',
      password: '',
    };
  }

  componentDidMount() {
    this.props.setUsername('');
    this.props.setPassword('');
    this.props.setErrorUsername(false);
    this.props.setErrorPassword(false);
  };

  render() {
    const {navigate} = this.props.navigation;
    return  (
      //<ScreenContainer>
        <StyleProvider style={getTheme(themeVars)}>
        <Container>
          <Content>
            <Form>
              <Item fixedLabel error={!!this.props.errors.username}>
                <Label>{translate("labelUsername")}</Label>
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
                block style={{margin: 15}}
                onPress={() => this.props.submitForm(
                  this.props.currentLanguage, this.props.username, this.props.password
                )}
              >
                <Text>{translate("buttonLogin")}</Text>
              </Button>
            }

            {this.props.submitting ?
              null :
              <View style={styles.screen}>
                <View style={styles.content}>
                  <View></View>
                  <LoginButton
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
                </View>
              </View>
            }
          </Content>
        </Container>
        </StyleProvider>
      //</ScreenContainer>
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
            dispatch(Actions.setLoginFormErrorUsername(true));
            dispatch(Actions.setLoginFormErrorPassword(true));
            response.json().then(obj => {
              Toast.show({
                text: translate("errorInvalidUsernameOrPassword"),
              });
            });
          } else {
            Toast.show({
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
    setUsername: username => dispatch(Actions.setLoginFormUsername(username)),
    setPassword: password => dispatch(Actions.setLoginFormPassword(password)),
    setErrorUsername: error => dispatch(Actions.setLoginFormErrorUsername(error)),
    setErrorPassword: error => dispatch(Actions.setLoginFormErrorPassword(error)),
  }
};

export const LoginScreen = connect(mapStateToProps, mapDispatchToProps)(_LoginScreen);
