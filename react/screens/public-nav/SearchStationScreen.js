import React from 'react';
import {connect} from 'react-redux';
import { FlatList, View } from 'react-native';
import {
  Button, Form, Input, Icon, Item, Label, Left, ListItem, Right, Text, Toast,
} from 'native-base';
import themeVars from '../../theme/variables/material';
import { translate } from "../../utils/i18n";
import Address from "../../utils/address";
import Actions from '../../state/Actions';
import { SearchStationScreenHeader } from '../../components/SearchStationScreenHeader';
import { ContentContainer } from '../../components/ContentContainer';
import { RoundedCornerPanel } from '../../components/RoundedCornerPanel';

class _SearchStationScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <SearchStationScreenHeader navigation={navigation}/>,
  });

  constructor(props) {
    super(props);

    this.state = {
      notFound: false,
      text: '',
      listData: {}
    };
  }

  render() {
    const {navigate, goBack, getParam} = this.props.navigation;
    const isOriginating = getParam("isOriginating");

    return (
      <ContentContainer navigate={navigate} hasFooter={false}>
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column'}}>
          <Text style={[{flex: 0, marginBottom: 16, fontWeight: 'bold'}]}>
            {isOriginating ?
              translate("headerChooseOriginatingCity") :
              translate("headerChooseDestinationCity")
            }
          </Text>
          <Item>
            {this.props.searching ?
              <Icon active type="EvilIcons" name='spinner'/> :
              <Icon active type="Ionicons" name='search'/>
            }
            <Input
              placeholder={isOriginating ?
                translate("placeholderSearchOriginating") :
                translate("placeholderSearchDestination")
              }
              placeholderTextColor="#919EAB"
              onChangeText={text => {
                this.setState({notFound: false, text});
                if (text.length < 2) {
                  return;
                }
                this.setState({listData: {}});
                this.props.searchStations(
                  this.props.currentLanguage, this.props.accessToken,
                  isOriginating ? "checkin" : "checkout",
                  text
                ).then(
                  results => this.processSearchResults(results)
                ).catch(err => {
                  Toast.show({
                    text: error,
                    buttonText: "OK",
                    duration: 5000,
                  });
                });
              }}
            />
          </Item>
          {this.state.notFound && this.state.text.length > 0 ?
            <Text>{translate("messageNoResult", {text: this.state.text})}</Text> :
            null
          }
          {Object.keys(this.state.listData).length > 0 ?
            <FlatList
              data={
                Object.keys(this.state.listData).map(key => ({id: key, text: this.state.listData[key]}))
              }
              keyExtractor={(item, index) => String(item.id)}
              renderItem={({item, index}) =>
                <ListItem onPress={() => {
                  if (isOriginating) {
                    this.props.setOriginatingStation(item);
                  } else {
                    this.props.setDestinationStation(item);
                  }
                  goBack();
                }}>
                  <Left>
                    <Text>
                      {item.text}
                    </Text>
                  </Left>
                </ListItem>
              }
            /> :
            null
          }
        </RoundedCornerPanel>
      </ContentContainer>
    );
  }

  processSearchResults(results) {
     if (results.length < 1) {
       this.setState({notFound: true});
       return;
     }
     this.props.downloadStationDetails(true);
     results.forEach(place => {
       const postalCodePromise = Address.getPostalCode(
         this.props.currentLanguage, this.props.accessToken, place.address__postal_code
       );
       const subdistrictPromise = Address.getSubdistrict(
         this.props.currentLanguage, this.props.accessToken, place.address__subdistrict
       ).then(subdistrictObj => {
         const districtPromise = Address.getDistrict(
           this.props.currentLanguage, this.props.accessToken, subdistrictObj.district
         );
         return districtPromise.then(districtObj => ({subdistrictObj, districtObj}));
       }).then(({subdistrictObj, districtObj}) => {
         const cityPromise = Address.getCity(
           this.props.currentLanguage, this.props.accessToken, districtObj.city
         );
         return cityPromise.then(cityObj => ({subdistrictObj, districtObj, cityObj}));
       }).then(({subdistrictObj, districtObj, cityObj}) => {
         const statePromise = Address.getState(
           this.props.currentLanguage, this.props.accessToken, cityObj.state
         );
         return statePromise.then(stateObj => ({subdistrictObj, districtObj, cityObj, stateObj}));
       }).then(({subdistrictObj, districtObj, cityObj, stateObj}) => {
         postalCodePromise.then(postalCodeObj => {
           const text = (
             place.name + ", " + place.address__name + ", " + subdistrictObj.name + ", " +
             districtObj.name + ", " + cityObj.name + ", " + stateObj.name + " " +
             postalCodeObj.code
           );
           this.setState({listData: {...this.state.listData, [place.id]: text}});
           this.props.downloadStationDetails(false);
         });
       });
     });
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    loggedIn: state.appReducer.loggedIn,
    accessToken: state.appReducer.accessToken || state.appReducer.device.token,
    searching: state.appReducer.searchStationForm.searching,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setOriginatingStation: place => dispatch(Actions.setFindScheduleFormOriginatingStation(place)),
    setDestinationStation: place => dispatch(Actions.setFindScheduleFormDestinationStation(place)),
    searchStations: (languageCode, accessToken, type, text) => dispatch(
      Actions.searchStations(languageCode, accessToken, type, text)
    ),
    downloadStationDetails: downloading => dispatch(Actions.downloadStationDetails(downloading)),
  }
};

export const SearchStationScreen = connect(mapStateToProps, mapDispatchToProps)(_SearchStationScreen);
