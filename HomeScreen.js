import React from 'react';
import {connect} from 'react-redux';
import { Button, Text, View } from 'react-native';
import { LoginButton } from 'react-native-fbsdk';
import { translate } from "./utils/i18n";
import Actions from './Actions';
import { MokirimScreen } from './MokirimScreen';

class _HomeScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    title: navigation.getParam('title', translate('headerWelcome'))
  });
  setNavigationHeader() {
    this.props.navigation.setParams({title: translate('headerWelcome')});
  }

  render() {
    const {navigate} = this.props.navigation;

    return (
      <MokirimScreen onL10nChange={() => this.setNavigationHeader()}>
      <View>
        {this.props.errorMessage ? <Text>{this.props.errorMessage}</Text> : null}
        <Button
          title={this.props.loggedIn ? translate('headerProfile') : translate('headerLogin')}
          onPress={() => (
            this.props.loggedIn ? navigate('Profile', {'name': ''}) : navigate('Login')
          )}
        />
        {this.props.loggedIn ?
          (this.props.loggedInVia === 'facebook' ?
            <LoginButton onLogoutFinished={() => this.props.logout()}/> :
            null
          ) :
          null
        }
      </View>
      </MokirimScreen>
    );
  }
}

const mapStateToProps = state => {
  return {
    errorMessage: state.appReducer.errorMessage,
    loggedIn: state.appReducer.loggedIn,
    loggedInVia: state.appReducer.loggedInVia,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(Actions.logout()),
  }
};

export const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(_HomeScreen);
