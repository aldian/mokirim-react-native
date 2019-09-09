import React from 'react';
import {connect} from 'react-redux';
import { View } from 'react-native';
//import { HeaderTitle } from 'react-navigation-stack';
import {
  Content,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  StyleProvider,
} from 'native-base';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ScreenContainer } from '../../components/ScreenContainer';
import { LoggedInHeaderMenu } from '../../components/LoggedInHeaderMenu';
import { HomeNewsSwiper } from '../../components/HomeNewsSwiper';
import styles from '../../styles';
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';

class _DashboardScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
//    headerTitle: <HeaderTitle><NavigationL10nText textKey="headerDashboard"/></HeaderTitle>,
    header: <StyleProvider style={getTheme(themeVars)}><Header noShadow><HeaderLeft/><HeaderBody>
      <HeaderTitle>{translate("headerDashboard")}</HeaderTitle>
    </HeaderBody><HeaderRight><LoggedInHeaderMenu/></HeaderRight></Header></StyleProvider>,
  });

  render() {
    const {navigate} = this.props.navigation;

    return (
      <ScreenContainer navigate={navigate} currentTab="Dashboard">
        <Content>
          <HomeNewsSwiper/>
        </Content>
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
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
