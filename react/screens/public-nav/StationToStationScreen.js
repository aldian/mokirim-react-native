import React from 'react';
import {connect} from 'react-redux';
import { View } from 'react-native';
import {
  Button, Form, Input, Item, Label, Text,
} from 'native-base';
import themeVars from '../../theme/variables/material';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { StationToStationScreenHeader } from '../../components/StationToStationScreenHeader';
import { ContentContainer } from '../../components/ContentContainer';
import { MemberBenefitsButton } from '../../components/MemberBenefitsButton';
import { RoundedCornerPanel } from '../../components/RoundedCornerPanel';

class _StationToStationScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <StationToStationScreenHeader navigation={navigation}/>,
  });

  render() {
    const {navigate} = this.props.navigation;

    return (
      <ContentContainer navigate={navigate} hasFooter={false}>
        {this.props.loggedIn ?
          null :
          <MemberBenefitsButton style={{flex: 0}} navigate={navigate}/>
        }
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column'}}>
          <Form>
            <Item stackedLabel>
              <Label>{translate("labelOriginating")}</Label>
              <Input
                style={{width: '100%'}}
                multiline={true}
                editable={true} placeholder={translate("placeholderOriginating")}
                placeholderTextColor="#919EAB"
                onFocus={() => navigate('SearchStation', {isOriginating: true})}
                value={this.props.originatingStation.text}
              />
            </Item>
            <Item stackedLabel last>
              <Label>{translate("labelDestination")}</Label>
              <Input
                style={{width: '100%'}}
                multiline={true}
                editable={true} placeholder={translate("placeholderDestination")}
                placeholderTextColor="#919EAB"
                onFocus={() => navigate("SearchStation", {isOriginating: false})}
                value={this.props.destinationStation.text}
              />
            </Item>
          </Form>
          <Button style={{backgroundColor: themeVars.toolbarDefaultBg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{flex: 0}}>{translate("buttonFindSchedule")}</Text>
          </Button>
        </RoundedCornerPanel>
      </ContentContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    loggedIn: state.appReducer.loggedIn,
    originatingStation: state.appReducer.findScheduleForm.originatingStation,
    destinationStation: state.appReducer.findScheduleForm.destinationStation,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const StationToStationScreen = connect(mapStateToProps, mapDispatchToProps)(_StationToStationScreen);
