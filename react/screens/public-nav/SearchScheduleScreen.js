import React from 'react';
import {connect} from 'react-redux';
import { FlatList, View } from 'react-native';
import {
  Button, Form, Input, Icon, Item, Label, Left, ListItem, Right, Text, Toast,
} from 'native-base';
import themeVars from '../../theme/variables/material';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { SearchScheduleScreenHeader } from '../../components/SearchScheduleScreenHeader';
import { ContentContainer } from '../../components/ContentContainer';
import { RoundedCornerPanel } from '../../components/RoundedCornerPanel';

class _SearchScheduleScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <SearchScheduleScreenHeader navigation={navigation}/>,
  });

  render() {
    const {navigate, goBack, getParam} = this.props.navigation;
    const isOriginating = getParam("isOriginating");

    return (
      <ContentContainer navigate={navigate} hasFooter={false}>
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column'}}>
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

export const SearchScheduleScreen = connect(mapStateToProps, mapDispatchToProps)(_SearchScheduleScreen);
