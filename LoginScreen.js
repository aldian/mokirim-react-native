import React from 'react';
import {connect} from 'react-redux';
import { View, Text } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import Actions from './Actions';
import { MokirimScreen } from './MokirimScreen';
import { translate } from "./utils/i18n";

class _LoginScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    title: navigation.getParam('title', translate('headerLogin'))
  });
  setNavigationHeader() {
   this.props.navigation.setParams({title: translate('headerLogin')});
  }

  render() {
    const {navigate, goBack} = this.props.navigation;
    return <MokirimScreen onL10nChange={() => this.setNavigationHeader()}>
    <View>
      {this.props.errorMessage ? <Text>{this.props.errorMessage}</Text> : null}
      <LoginButton
        onLoginFinished={
          (error, result) => {
            if (error) {
              this.props.setErrorMessage(error);
            } else if (result.isCancelled) {
              meongMeong1();
            } else {
              AccessToken.getCurrentAccessToken().then(
                (data) => {
                  let stackIndex = this.props.navigation.dangerouslyGetParent().state.index;
                  if (stackIndex > 0) {
                    goBack();
                  } else {
                    navigate('Home');
                  }
                  this.props.loggedInToFacebook(data.accessToken);
                }
              )
            }
          }
        }
      />
    </View>
    </MokirimScreen>
  }
}

const mapStateToProps = state => {
  return {
    errorMessage: state.appReducer.errorMessage,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setErrorMessage: message => dispatch(Actions.setErrorMessage(message)),
    loggedInToFacebook: accessToken => dispatch(Actions.loggedInToFacebook(accessToken)),
  }
};

export const LoginScreen = connect(mapStateToProps, mapDispatchToProps)(_LoginScreen);
