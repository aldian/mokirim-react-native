import React from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity, View} from 'react-native';
import {
  Button, DatePicker, Form, Icon, IconNB, Input, Item, Label, Spinner, Text, Toast,
} from 'native-base';
import themeVars from '../../theme/variables/material';
import {translate, getStartingDayDate, numberStr} from "../../utils/i18n";
import Error from '../../utils/error';
import constants from '../../constants';
import Actions from '../../state/Actions';
import Accordion, {DefaultContent as DefaultAccordionContent} from '../../components/Accordion';
import { StationToStationScreenHeader } from '../../components/StationToStationScreenHeader';
import { ContentContainer } from '../../components/ContentContainer';
import { MemberBenefitsButton } from '../../components/MemberBenefitsButton';
import { RoundedCornerPanel } from '../../components/RoundedCornerPanel';
import ColloAccordionHeader from '../../components/ColloAccordionHeader';
import { PackageDimensionInput } from '../../components/PackageDimensionInput';

class _StationToStationScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <StationToStationScreenHeader navigation={navigation}/>,
  });

  componentDidMount() {
    if (!this.props.departureDate) {
       this.props.setDepartureDate(getStartingDayDate());
    }
  }

  render() {
    const {navigate} = this.props.navigation;
    const todayDate = getStartingDayDate();

    return (
      <ContentContainer navigate={navigate} hasFooter={false}>
        {this.props.loggedIn ?
          null :
          null//<MemberBenefitsButton style={{flex: 0}} navigate={navigate}/>
        }
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column'}}>
          <Form>
            <Item stackedLabel error={!!this.props.errors.originatingStation}>
              <Label>{translate("labelOriginating")}</Label>
              <Input
                style={{}}
                multiline={true}
                placeholder={translate("placeholderOriginating")}
                placeholderTextColor={themeVars.placeholderTextColor}
                onFocus={() => navigate('SearchStation', {isOriginating: true})}
                value={this.props.originatingStation.text}
                onChangeText={() => this.props.setError({originatingStation: false})}
              />
            </Item>
            <Item stackedLabel error={!!this.props.errors.destinationStation}>
              <Label>{translate("labelDestination")}</Label>
              <Input
                style={{width: '100%'}}
                multiline={true}
                placeholder={translate("placeholderDestination")}
                placeholderTextColor={themeVars.placeholderTextColor}
                onFocus={() => navigate("SearchStation", {isOriginating: false})}
                value={this.props.destinationStation.text}
                onChangeText={() => this.props.setError({destinationStation: false})}
              />
            </Item>
            <Item stackedLabel error={!!this.props.errors.departureDate}>
              <Label>{translate("labelDepartureDate")}</Label>
              <View style={{width: '100%'}}>
                <DatePicker
                  defaultDate={this.props.departureDate || todayDate}
                  minimumDate={todayDate}
                  locale={this.props.currentLanguage}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  textStyle={{paddingLeft: 4}}
                  placeHolderTextStyle={{color: themeVars.placeholderTextColor, paddingLeft: 4}}
                  onDateChange={date => this.props.setDepartureDate(date)}
                />
              </View>
            </Item>
            <Item stackedLabel last>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                <Label style={{flex: 0}}>
                  {translate("labelPackage.counting", {count: this.props.colli.length})}
                </Label>
                <Label style={[{flex: 0}, (this.props.totalWeight < constants.MINIMUM_PRICE_WEIGHT_KG ? {color: 'red', fontWeight: 'bold'} : {})]}>
                  {translate("labelColli.counting", {count: this.props.colli.length})}, {numberStr(this.props.currentLanguage, this.props.totalWeight)} Kg{this.props.totalWeight < constants.MINIMUM_PRICE_WEIGHT_KG ? " (" + translate("messagePay10K") + ")" : null}
                </Label>
              </View>
              {this.props.colli.length < 2 ?
                <View style={{width: '100%'}}>
                  <PackageDimensionInput info={{...this.props.colli[0], index: 0}}/>
                </View> :
                <View style={{width: '100%', marginTop: 16, marginBottom: 16}}>
                  <Accordion
                    style={{borderWidth: 0}}
                    dataArray={this.props.colli.map((collo, index) => ({...collo, index}))}
                    animation={false}
                    expanded={this.props.openedColloIndex}
                    renderHeader={(item, expanded) => {
                      return <ColloAccordionHeader
                        expanded={expanded}
                        info={item}
                        onRemove={() => this.props.removeCollo(item.index)}
                      />
                    }}
                    renderContent={item => <PackageDimensionInput info={item}/>}
                    onAccordionOpen={(item, index) => this.props.setOpenedColloIndex(index)}
                    onAccordionClose={(item, index) => this.props.setOpenedColloIndex(null)}
                  />
                </View>
              }
              {this.props.colli.length < 5 ?
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingTop: 16, paddingBottom: 16}}>
                  <TouchableOpacity disabled={!this.props.addColloButtonEnabled} transparent style={{flex: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}} onPress={() => {this.props.addCollo()}}>
                    <Text style={{}}><Icon type="Ionicons" name="ios-add" style={{color: this.props.addColloButtonEnabled ? themeVars.toolbarDefaultBg : 'gray'}}/></Text>
                    <Text style={{color: this.props.addColloButtonEnabled ? themeVars.toolbarDefaultBg : 'gray'}}> {translate("buttonAddCollo")}</Text>
                  </TouchableOpacity>
                </View> :
                null
              }
            </Item>
          </Form>
          {this.props.submitting ?
            <Spinner/> :
            <Button
               style={{backgroundColor: themeVars.toolbarDefaultBg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
               onPress={() => {
                 this.props.setFindScheduleForm({submitting: true});
                 this.props.findSchedule(
                   this.props.currentLanguage, this.props.accessToken,
                   this.props.originatingStation.id, this.props.destinationStation.id, this.props.departureDate,
                   this.props.totalWeight, this.props.totalVolume
                 ).then(response => {
                   if (response.ok) {
                     response.json().then(obj => {
                       if (obj.count < 1) {
                         Toast.show({
                           text: translate("messageScheduleNotFound"), buttonText: "OK", duration: 5000,
                         });
                       } else {
                         this.props.setAvailableSchedules(obj);
                         this.props.cleanupColli();
                         navigate("ChooseSchedule");
                       }
                     });
                   } else {
                     response.json().then(obj => {
                       Error.toastError(obj).then(keys => {
                         keys.forEach(key => {
                           this.props.setError({[key]: true});
                         });
                       });
                     });
                   }
                 }).catch(error => {
                   if (typeof(error) === 'string') {
                     Toast.show({
                        text: error, buttonText: "OK", duration: 5000,
                     });
                   } else {
                     Error.toastError(error).then(keys => {
                        keys.forEach(key => {
                          this.props.setError({[key]: true});
                        });
                     });
                   }
                 }).finally(() => {
                   this.props.setFindScheduleForm({submitting: false});
                 });
               }}
            >
               <Text style={{flex: 0}}>{translate("buttonFindSchedule")}</Text>
            </Button>
          }
        </RoundedCornerPanel>
      </ContentContainer>
    );
  }
}

const mapStateToProps = state => {
  const colli = state.appReducer.findScheduleForm.colli;
  return {
    currentLanguage: state.appReducer.currentLanguage,
    loggedIn: state.appReducer.loggedIn,
    accessToken: state.appReducer.accessToken || state.appReducer.device.token,
    errors: state.appReducer.findScheduleForm.errors,
    submitting: state.appReducer.findScheduleForm.submitting,
    originatingStation: state.appReducer.findScheduleForm.originatingStation,
    destinationStation: state.appReducer.findScheduleForm.destinationStation,
    departureDate: state.appReducer.findScheduleForm.departureDate,
    colli,
    openedColloIndex: state.appReducer.findScheduleForm.openedColloIndex,
    totalWeight: state.appReducer.findScheduleForm.totalWeight,
    totalVolume: state.appReducer.findScheduleForm.totalVolume,
    addColloButtonEnabled: colli.every(collo => {
      const weight = parseFloat(collo.weight);
      return !isNaN(weight) && weight > 0;
    }),
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setDepartureDate: date => dispatch(Actions.setFindScheduleFormDepartureDate(date)),
    addCollo: () => dispatch(Actions.addCollo()),
    removeCollo: index => dispatch(Actions.removeCollo(index)),
    setOpenedColloIndex: index => dispatch(Actions.setOpenedColloIndex(index)),
    setFindScheduleForm: form => dispatch(Actions.setFindScheduleForm(form)),
    setError: obj => dispatch(Actions.setFindScheduleFormError(obj)),
    findSchedule: (languageCode, accessToken, originatingStation, destinationStation, departureDate, totalWeight, totalVolume) => dispatch(
      Actions.findSchedule(languageCode, accessToken, originatingStation, destinationStation, departureDate, totalWeight, totalVolume)
    ),
    setAvailableSchedules: obj => {
      dispatch(Actions.setAvailableSchedules(obj.results));
      dispatch(Actions.setMoreSchedulesURL(obj.next));
    },
    cleanupColli: () => dispatch(Actions.cleanupColli()),
  }
};

export const StationToStationScreen = connect(mapStateToProps, mapDispatchToProps)(_StationToStationScreen);
