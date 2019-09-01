import React from 'react';
import {connect} from 'react-redux';
import { View, Text } from 'react-native';
import { HeaderTitle } from 'react-navigation-stack';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ScreenContainer } from '../../components/ScreenContainer';

class _RegisterScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    headerTitle: <HeaderTitle><NavigationL10nText textKey="headerRegister"/></HeaderTitle>
  });

  render() {
    const {navigate} = this.props.navigation;
    return  (
      <ScreenContainer>
        <View>
        </View>
      </ScreenContainer>
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
