import React from 'react';
import {connect} from 'react-redux';
import { Button, Text, View } from 'react-native';
import { HeaderTitle } from 'react-navigation-stack';
import { LoginButton } from 'react-native-fbsdk';
import { translate } from "../utils/i18n";
import Actions from '../state/Actions';
import { NavigationL10nText } from '../components/NavigationL10nText';
import { NavigationHeader } from '../components/NavigationHeader';
import { ScreenContainer } from '../components/ScreenContainer';

class _HomeScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => {
  return {
    header: props => <NavigationHeader {...props}/>,
    headerTitle: <HeaderTitle><NavigationL10nText textKey="headerWelcome"/></HeaderTitle>,
  }};

  render() {
    const {navigate} = this.props.navigation;

    return (
      <ScreenContainer>
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
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    splashShown: state.appReducer.splashShown,
    currentLanguage: state.appReducer.currentLanguage,
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
