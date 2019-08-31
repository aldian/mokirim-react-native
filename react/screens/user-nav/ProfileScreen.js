import React from 'react';
import {connect} from 'react-redux';
import { Text } from 'react-native';
import { HeaderTitle } from 'react-navigation-stack';
import { translate } from "../../utils/i18n";
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ScreenContainer } from '../../components/ScreenContainer';

class _ProfileScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    headerTitle: <HeaderTitle><NavigationL10nText textKey="headerProfile"/></HeaderTitle>
  });

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScreenContainer>
        <Text>DISPLAY NAME: {this.props.facebook.displayName}</Text>
        <Text>ACCESS TOKEN: {this.props.facebook.accessToken}</Text>
        <Text>NOTIFICATION TOKEN: {this.props.notificationToken}</Text>
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    facebook: state.appReducer.facebook,
    notificationToken: state.appReducer.notificationToken,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const ProfileScreen = connect(mapStateToProps, mapDispatchToProps)(_ProfileScreen);
