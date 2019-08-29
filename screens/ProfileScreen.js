import React from 'react';
import {connect} from 'react-redux';
import { Text } from 'react-native';
import { HeaderTitle } from 'react-navigation-stack';
import { translate } from "../utils/i18n";
import { NavigationL10nText } from '../components/NavigationL10nText';
import { NavigationHeader } from '../components/NavigationHeader';
import { ScreenContainer } from '../components/ScreenContainer';

class _ProfileScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    header: props => <NavigationHeader {...props}/>,
    headerTitle: <HeaderTitle><NavigationL10nText textKey="headerProfile"/></HeaderTitle>
  });

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScreenContainer>
        <Text>{this.props.facebook.displayName}</Text>
        <Text>{this.props.facebook.accessToken}</Text>
      </ScreenContainer>
    );
  }

  afterSplash() {
    this.props.navigation.setParams({header: props => <Header {...props}/>});
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    facebook: state.appReducer.facebook,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const ProfileScreen = connect(mapStateToProps, mapDispatchToProps)(_ProfileScreen);
