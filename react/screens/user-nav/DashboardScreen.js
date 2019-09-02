import React from 'react';
import {connect} from 'react-redux';
import { Button, Text, View } from 'react-native';
//import { HeaderTitle } from 'react-navigation-stack';
import {
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  StyleProvider,
} from 'native-base';
import { LoginButton } from 'react-native-fbsdk';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ScreenContainer } from '../../components/ScreenContainer';
import styles from '../../styles';
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';

class _DashboardScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
//    headerTitle: <HeaderTitle><NavigationL10nText textKey="headerDashboard"/></HeaderTitle>,
    header: <StyleProvider style={getTheme(themeVars)}><Header><HeaderLeft/><HeaderBody>
      <HeaderTitle>{translate("headerDashboard")}</HeaderTitle>
    </HeaderBody><HeaderRight/></Header></StyleProvider>,
  });

  render() {
    const {navigate} = this.props.navigation;

    return (
      <StyleProvider style={getTheme(themeVars)}>
        <View style={styles.screen}>
          <View style={styles.content}>
          {this.props.errorMessage ? <Text>{this.props.errorMessage}</Text> : null}
          <Button
            title={translate('headerProfile')}
            onPress={() => navigate('Profile', {'name': ''})}
          />
          {this.props.loggedInVia === 'facebook' &&
            <LoginButton onLogoutFinished={() => {
              this.props.logout(this.props.currentLanguage, this.props.accessToken, 'facebook');
              navigate('Home');
            }}/>
          }
          {this.props.loggedInVia === 'mokirim' &&
            <Button
              title={translate('buttonLogout')}
              onPress={() => {
                this.props.logout(this.props.currentLanguage, this.props.accessToken);
                navigate('Home');
              }}
            />
          }
          </View>
        </View>
      </StyleProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    errorMessage: state.appReducer.errorMessage,
    loggedInVia: state.appReducer.loggedInVia,
    accessToken: state.appReducer.accessToken,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: (languageCode, accessToken, via) => (
      dispatch(Actions.logout(languageCode, accessToken, via))
    ),
  }
};

export const DashboardScreen = connect(mapStateToProps, mapDispatchToProps)(_DashboardScreen);
