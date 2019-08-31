import React from 'react';
import {connect} from 'react-redux';
import { View, Text } from 'react-native';
import { HeaderTitle } from 'react-navigation-stack';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ScreenContainer } from '../../components/ScreenContainer';

class _LoginScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    headerTitle: <HeaderTitle><NavigationL10nText textKey="headerLogin"/></HeaderTitle>
  });

  render() {
    const {navigate} = this.props.navigation;
    return  <ScreenContainer>
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
                  this.props.loggedInToFacebook(data.accessToken);
                  navigate('Dashboard');
                }
              )
            }
          }
        }
      />
    </View>
    </ScreenContainer>
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
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
