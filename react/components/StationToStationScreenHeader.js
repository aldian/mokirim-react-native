import React from 'react';
import {connect} from 'react-redux';
import {
  Button,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, Spinner, StyleProvider,
} from 'native-base';
import { translate } from "../utils/i18n";
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';

class _StationToStationScreenHeader extends React.Component {
  render() {
    return <StyleProvider style={getTheme(themeVars)}>
      <Header noShadow style={{backgroundColor: themeVars.toolbarDefaultBg}}>
        <HeaderLeft>
          {this.props.submitting ?
            <Spinner/> :
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{color: 'white'}}/>
            </Button>
          }
       </HeaderLeft>
       <HeaderBody>
          <HeaderTitle>{translate("headerStationToStation")}</HeaderTitle>
        </HeaderBody>
        <HeaderRight/>
      </Header>
    </StyleProvider>
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    submitting: state.appReducer.findScheduleForm.submitting,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const StationToStationScreenHeader = connect(mapStateToProps, mapDispatchToProps)(_StationToStationScreenHeader);
