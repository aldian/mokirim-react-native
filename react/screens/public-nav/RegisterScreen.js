import React from 'react';
import {connect} from 'react-redux';
import { View, Text } from 'react-native';
//import { HeaderTitle } from 'react-navigation-stack';
import {
  Button,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, StyleProvider,
} from 'native-base';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ScreenContainer } from '../../components/ScreenContainer';
import styles from '../../styles';
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';

class _RegisterScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    //headerTitle: <HeaderTitle><NavigationL10nText textKey="headerRegister"/></HeaderTitle>
    header: <StyleProvider style={getTheme(themeVars)}><Header><HeaderLeft>
      <Button transparent onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" />
      </Button>
    </HeaderLeft><HeaderBody>
      <HeaderTitle>{translate("headerRegister")}</HeaderTitle>
    </HeaderBody><HeaderRight/></Header></StyleProvider>,
  });

  render() {
    const {navigate} = this.props.navigation;
    return  (
      //<ScreenContainer>
      <StyleProvider style={getTheme(themeVars)}>
        <View style={styles.screen}>
          <View style={styles.content}></View>
        </View>
      </StyleProvider>
      //</ScreenContainer>
    )
  }
}

const mapStateToProps = state => {
  return {
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const RegisterScreen = connect(mapStateToProps, mapDispatchToProps)(_RegisterScreen);
