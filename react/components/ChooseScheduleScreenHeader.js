import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {
  Button,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, Spinner, StyleProvider, Text,
} from 'native-base';
import {translate, numberStr} from "../utils/i18n";
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';

class _ChooseScheduleScreenHeader extends React.Component {
  render() {

    return <StyleProvider style={getTheme(themeVars)}>
      <Header noShadow style={{backgroundColor: themeVars.toolbarDefaultBg}}>
        <HeaderLeft style={{flex: 0, paddingRight: 8}}>
          {this.props.submitting ?
            <Spinner/> :
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{color: 'white'}}/>
            </Button>
          }
        </HeaderLeft>
        <HeaderBody style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}>
          <HeaderTitle>{translate("headerChooseShipmentSchedule")}</HeaderTitle>
          <HeaderTitle style={{fontSize: 11}}>
            {translate("labelColli.counting", {count: this.props.colli.length})}, {numberStr(this.props.currentLanguage, this.props.totalWeight)} kg, {numberStr(this.props.currentLanguage, this.props.totalVolume)} cm³
          </HeaderTitle>
        </HeaderBody>
      </Header>
    </StyleProvider>
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    submitting: state.appReducer.chooseScheduleForm.submitting,

    totalWeight: state.appReducer.findScheduleForm.totalWeight,
    totalVolume: state.appReducer.findScheduleForm.totalVolume,
    colli: state.appReducer.findScheduleForm.colli,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const ChooseScheduleScreenHeader = connect(mapStateToProps, mapDispatchToProps)(_ChooseScheduleScreenHeader);
