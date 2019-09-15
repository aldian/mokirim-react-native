import React from 'react';
import {connect} from 'react-redux';
import { View } from 'react-native';
import {
  Button, DatePicker, Form, Input, Item, Label, Text,
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
                placeholder={translate("placeholderOriginating")}
                placeholderTextColor={themeVars.placeholderTextColor}
                onFocus={() => navigate('SearchStation', {isOriginating: true})}
                value={this.props.originatingStation.text}
              />
            </Item>
            <Item stackedLabel>
              <Label>{translate("labelDestination")}</Label>
              <Input
                style={{width: '100%'}}
                multiline={true}
                placeholder={translate("placeholderDestination")}
                placeholderTextColor={themeVars.placeholderTextColor}
                onFocus={() => navigate("SearchStation", {isOriginating: false})}
                value={this.props.destinationStation.text}
              />
            </Item>
            <Item stackedLabel last>
              <Label>{translate("labelDepartureDate")}</Label>
              <View style={{width: '100%'}}>
                <DatePicker
                  defaultDate={this.props.departureDate}
                  minimumDate={new Date()}
                  locale={this.props.currentLanguage}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  textStyle={{paddingLeft: 4}}
                  placeHolderText={this.props.departureDate ? null : translate("placeholderSelectDate")}
                  placeHolderTextStyle={{color: themeVars.placeholderTextColor, paddingLeft: 4}}
                  onDateChange={date => this.props.setDepartureDate(date)}
                />
              </View>
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
    departureDate: state.appReducer.findScheduleForm.departureDate,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setDepartureDate: date => dispatch(Actions.setFindScheduleFormDepartureDate(date)),
  }
};

export const StationToStationScreen = connect(mapStateToProps, mapDispatchToProps)(_StationToStationScreen);
