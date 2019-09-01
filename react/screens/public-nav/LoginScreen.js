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

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
    }
  }

  render() {
    const {navigate} = this.props.navigation;
    return  (
      <ScreenContainer>
        <View>
          {this.state.errorMessage ? <Text>{this.state.errorMessage}</Text> : null}
          <LoginButton
            onLoginFinished={
              (error, result) => {
                if (error) {
                  this.props.setErrorMessage(error);
                } else if (result.isCancelled) {
                  this.setState({errorMessage: translate("messageLoginCancelled")});
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
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loggedInToFacebook: accessToken => dispatch(Actions.loggedInToFacebook(accessToken)),
  }
};

export const LoginScreen = connect(mapStateToProps, mapDispatchToProps)(_LoginScreen);
