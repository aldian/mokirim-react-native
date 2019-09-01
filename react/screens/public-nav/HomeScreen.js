import React from 'react';
import {connect} from 'react-redux';
import { Button, Text, View } from 'react-native';
import { HeaderTitle } from 'react-navigation-stack';
import { LoginButton } from 'react-native-fbsdk';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ScreenContainer } from '../../components/ScreenContainer';
import styles from '../../styles';

class _HomeScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => {
  return {
    headerTitle: <HeaderTitle><NavigationL10nText textKey="headerWelcome"/></HeaderTitle>,
  }};

  render() {
    const {navigate} = this.props.navigation;

    return (
      <ScreenContainer>
        <View style={[styles.screen]}>
          <View style={styles.content}>
            <View style={[styles.buttonsRow, {width: 150}]}>
              <Button
                title={translate('headerLogin')}
                onPress={() => navigate('Login')}
              />
              <Button
                title={translate('headerRegister')}
                onPress={() => navigate('Register')}
               />
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    loggedIn: state.appReducer.loggedIn,
    loggedInVia: state.appReducer.loggedInVia,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(Actions.logout()),
  }
};

export const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(_HomeScreen);
