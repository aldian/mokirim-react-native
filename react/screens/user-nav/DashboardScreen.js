import React from 'react';
import {connect} from 'react-redux';
import { Button, Text, View } from 'react-native';
import { HeaderTitle } from 'react-navigation-stack';
import { LoginButton } from 'react-native-fbsdk';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ScreenContainer } from '../../components/ScreenContainer';

class _DashboardScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => {
  return {
    headerTitle: <HeaderTitle><NavigationL10nText textKey="headerDashboard"/></HeaderTitle>,
  }};

  render() {
    const {navigate} = this.props.navigation;

    return (
      <ScreenContainer>
      <View>
        {this.props.errorMessage ? <Text>{this.props.errorMessage}</Text> : null}
        <Button
          title={translate('headerProfile')}
          onPress={() => (
            navigate('Profile', {'name': ''})
          )}
        />
        {this.props.loggedInVia === 'facebook' ?
          <LoginButton onLogoutFinished={() => {
            this.props.logout();
            navigate('Home');
          }}/> :
          null
        }
      </View>
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    errorMessage: state.appReducer.errorMessage,
    loggedInVia: state.appReducer.loggedInVia,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(Actions.logout()),
  }
};

export const DashboardScreen = connect(mapStateToProps, mapDispatchToProps)(_DashboardScreen);
