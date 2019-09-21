import React from 'react';
import {connect} from 'react-redux';
import { View } from 'react-native';
//import { HeaderTitle } from 'react-navigation-stack';
import {
  Content,
  Button, Text,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Footer, FooterTab,
  StyleProvider,
} from 'native-base';
import { LoginButton } from 'react-native-fbsdk';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ContentContainer } from '../../components/ContentContainer';
import { HomeScreenHeader } from '../../components/HomeScreenHeader';
import { MemberBenefitsButton } from '../../components/MemberBenefitsButton';
import { HomeNewsSwiper } from '../../components/HomeNewsSwiper';
import { RoundedCornerPanel } from '../../components/RoundedCornerPanel';
import { DeliveryOptionsMenu } from '../../components/DeliveryOptionsMenu';
import styles from '../../styles';
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';

class _HomeScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    //headerTitle: <HeaderTitle><NavigationL10nText textKey="headerWelcome"/></HeaderTitle>,
    header: <HomeScreenHeader/>,
  });

  render() {
    const {navigate} = this.props.navigation;

    return (
      <ContentContainer navigate={navigate} currentTab={this.props.loggedIn ? "Dashboard" : "Home"}>
        {this.props.loggedIn ?
          null :
          null//<MemberBenefitsButton style={{flex: 0}} navigate={navigate}/>
        }
        <HomeNewsSwiper style={{flex: 0}}/>
        <RoundedCornerPanel style={{flex: 100, flowDirection: 'column', justifyContent: 'flex-start'}}>
          <DeliveryOptionsMenu navigate={navigate}/>
        </RoundedCornerPanel>
      </ContentContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    loggedIn: state.appReducer.loggedIn,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(_HomeScreen);
