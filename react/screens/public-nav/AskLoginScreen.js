import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {Image, TouchableOpacity, View} from 'react-native';
import {
  Button, DatePicker, Form, Icon, IconNB, Input, Item, Label, Spinner, Text, Toast,
} from 'native-base';
import themeVars from '../../theme/variables/material';
import {translate, getDateDisplayString, getTimeDisplayString, moneyStr, numberStr} from "../../utils/i18n";
import Error from '../../utils/error';
import constants from '../../constants';
import Actions from '../../state/Actions';
import {AskLoginScreenHeader} from '../../components/AskLoginScreenHeader';
import {ContentContainer} from '../../components/ContentContainer';
import {RoundedCornerPanel} from '../../components/RoundedCornerPanel';

class _AskLoginScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <AskLoginScreenHeader navigation={navigation}/>,
  });

  render() {
    const {navigate} = this.props.navigation;

    return (
      <ContentContainer navigate={navigate} hasFooter={false}>
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Image source={require('../../img/mokirim_colored.png')} style={{flex: 0, width: 200, height: 100, resizeMode: 'contain'}}/>
          <Text style={{flex: 0, color: '#637381', fontWeight: 'bold'}}>{translate("messageLoginToBookSchedule")}</Text>
          <Text style={{flex: 0, color: '#637381', fontSize: 12, width: '75%', textAlign: 'center'}}>{translate("messageRegisterAccountForBenefits")}</Text>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch', alignSelf: 'stretch'}}>
            <Button
              bordered style={{borderColor: themeVars.toolbarDefaultBg, flexDirection: 'row', justifyContent: 'center'}}
              onPress={() => navigate('Login')}
            >
              <Text style={{color: themeVars.toolbarDefaultBg}}>{translate("buttonLogin")}</Text>
            </Button>
            <Text style={{color: '#637381', fontSize: 12, alignSelf: 'center', marginTop: 16}}>{translate("messageDontHaveAccountYet")}</Text>
            <Button
              style={{backgroundColor: themeVars.toolbarDefaultBg, flexDirection: 'row', justifyContent: 'center'}}
              onPress={() => navigate('Register')}
            >
              <Text style={{}}>{translate("buttonRegister")}</Text>
            </Button>
          </View>
        </RoundedCornerPanel>
      </ContentContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    loggedIn: state.appReducer.loggedIn,
    accessToken: state.appReducer.accessToken || state.appReducer.device.token,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const AskLoginScreen = connect(mapStateToProps, mapDispatchToProps)(_AskLoginScreen);
