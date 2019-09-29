import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
//import { HeaderTitle } from 'react-navigation-stack';
import {
  Button,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, StyleProvider, Text,
} from 'native-base';
import { GoogleSignin } from 'react-native-google-signin';
import { LoginButton } from 'react-native-fbsdk';
import { translate } from "../../utils/i18n";
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';
import Actions from '../../state/Actions';
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ContentContainer } from '../../components/ContentContainer';
import { RoundedCornerPanel } from '../../components/RoundedCornerPanel';

class _ProfileScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    //headerTitle: <HeaderTitle><NavigationL10nText textKey="headerProfile"/></HeaderTitle>
    //title: translate("headerProfile")
    header: <StyleProvider style={getTheme(themeVars)}>
      <Header noShadow style={{backgroundColor: themeVars.toolbarDefaultBg}}>
        <HeaderLeft>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" style={{color: 'white'}}/>
          </Button>
        </HeaderLeft>
        <HeaderBody>
          <HeaderTitle>{translate("headerProfile")}</HeaderTitle>
        </HeaderBody>
        <HeaderRight/>
      </Header>
    </StyleProvider>,
  });

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ContentContainer navigate={navigate} currentTab="Profile">
        <RoundedCornerPanel style={{flex: 1, flowDirection: 'column', justifyContent: 'flex-start'}}>
          {this.props.loggedInVia === 'facebook' &&
            <LoginButton onLogoutFinished={() => {
              this.props.logout(this.props.currentLanguage, this.props.accessToken, 'facebook');
              navigate('Login', {hasBack: false});
            }}/>
          }

          {this.props.loggedInVia === 'google' &&
            <Button onPress={() => {
              GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut());
              this.props.logout(this.props.currentLanguage, this.props.accessToken);
              navigate('Login', {hasBack: false});
            }}><Text>{translate('buttonLogout')}</Text></Button>
          }

          {this.props.loggedInVia === 'mokirim' &&
            <Button
              onPress={() => {
                this.props.logout(this.props.currentLanguage, this.props.accessToken);
                navigate('Login', {hasBack: false});
              }}
            ><Text>{translate('buttonLogout')}</Text></Button>
          }

        </RoundedCornerPanel>
      </ContentContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    loggedInVia: state.appReducer.loggedInVia,
    accessToken: state.appReducer.accessToken,
    facebook: state.appReducer.facebook,
    google: state.appReducer.google,
    notificationToken: state.appReducer.notificationToken,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: (languageCode, accessToken, via) => (
      dispatch(Actions.logout(languageCode, accessToken, via))
    ),
  }
};

export const ProfileScreen = connect(mapStateToProps, mapDispatchToProps)(_ProfileScreen);
