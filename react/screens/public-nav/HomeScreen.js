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
import { HomeNewsSwiper } from '../../components/HomeNewsSwiper';
import { RoundedCornerPanel } from '../../components/RoundedCornerPanel';
import styles from '../../styles';
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';

class _HomeScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    //headerTitle: <HeaderTitle><NavigationL10nText textKey="headerWelcome"/></HeaderTitle>,
    header: <StyleProvider style={getTheme(themeVars)}>
      <Header noShadow><HeaderLeft/><HeaderBody>
      <HeaderTitle>{translate("headerWelcome")}</HeaderTitle>
      </HeaderBody><HeaderRight/></Header>
    </StyleProvider>,
  });

  render() {
    const {navigate} = this.props.navigation;

    return (
      <ContentContainer navigate={navigate} currentTab="Home">
        <Button transparent onPress={() => navigate('MemberBenefits')}>
          <Text style={[{color: 'white'}]}>{translate('buttonMemberBenefits')}</Text>
        </Button>
        <HomeNewsSwiper/>
        <RoundedCornerPanel>
          <Text>Dummy Content</Text>
        </RoundedCornerPanel>
      </ContentContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(_HomeScreen);
