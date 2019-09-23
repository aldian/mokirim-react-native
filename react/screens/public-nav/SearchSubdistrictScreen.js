import React from 'react';
import {connect} from 'react-redux';
import { FlatList, View } from 'react-native';
import {
  Button, Form, Input, Icon, Item, Label, Left, ListItem, Right, Text, Toast,
} from 'native-base';
import themeVars from '../../theme/variables/material';
import { translate } from "../../utils/i18n";
import MokirimAPI from "../../utils/MokirimAPI";
import Address from "../../utils/address";
import Actions from '../../state/Actions';
import { SearchSubdistrictScreenHeader } from '../../components/SearchSubdistrictScreenHeader';
import { ContentContainer } from '../../components/ContentContainer';
import { RoundedCornerPanel } from '../../components/RoundedCornerPanel';

class _SearchSubdistrictScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <SearchSubdistrictScreenHeader navigation={navigation}/>,
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

    return (
      <ContentContainer navigate={navigate} hasFooter={false}>
        <RoundedCornerPanel style={{flex: 1, flexDirection: 'column'}}>
          <Text style={[{flex: 0, marginBottom: 16, fontWeight: 'bold'}]}>
            {translate("headerChooseSubdistrict")}
          </Text>
          <Item>
            {this.props.searching ?
              <Icon active type="EvilIcons" name='spinner'/> :
              <Icon active type="Ionicons" name='search'/>
            }
            <Input
              placeholder={
                translate("placeholderSearchSubdistrict")
              }
              placeholderTextColor="#919EAB"
              onChangeText={text => {
                this.setState({notFound: false, text});
                if (text.length < 2) {
                  return;
                }
                this.setState({listData: {}});
                this.props.searchSubdistricts(
                  this.props.currentLanguage, this.props.accessToken,
                  text
                ).then(
                  obj => this.processSearchResults(obj.results)
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
                Object.keys(this.state.listData).map(key => {
                  const [subdistrict, postalCode] = key.split('-');
                  return {key, subdistrict, postalCode, text: this.state.listData[key]};
                })
              }
              keyExtractor={(item, index) => String(item.key)}
              renderItem={({item, index}) =>
                <ListItem onPress={() => {
                  this.props.setSubdistrict(item);
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

  generateSubdistrictText(subdistrictObj, district, city, state, postalCodeObj) {
    const text = (
      subdistrictObj.name + ", " +
      district + ", " + city + ", " + state +
      (postalCodeObj ? (" " + postalCodeObj.code) : "")
    );
    this.setState({listData: {
      ...this.state.listData,
      [subdistrictObj.id + "-" + (postalCodeObj ? postalCodeObj.id : "0")]: text
    }});
  }

  processSearchResults(results) {
     if (results.length < 1) {
       this.setState({notFound: true});
       return;
     }
     this.props.downloadSubdistrictDetails(true);
     results.forEach(subdistrict => {
       const postalCodePromise = MokirimAPI.getPostalCode(
         this.props.currentLanguage, this.props.accessToken, null, {subdistrict__id: subdistrict.id}
       );

       const districtPromise = Address.getDistrict(
         this.props.currentLanguage, this.props.accessToken, subdistrict.district
       ).then(districtObj => {
         const cityPromise = Address.getCity(
           this.props.currentLanguage, this.props.accessToken, districtObj.city
         );
         return cityPromise.then(cityObj => ({districtObj, cityObj}));
       }).then(({districtObj, cityObj}) => {
         const statePromise = Address.getState(
           this.props.currentLanguage, this.props.accessToken, cityObj.state
         );
         return statePromise.then(stateObj => ({districtObj, cityObj, stateObj}));
       }).then(({districtObj, cityObj, stateObj}) => {
         postalCodePromise.then(response => {
           if (response.ok) {
             response.json().then(obj => {
               if (obj.count < 1) {
                 this.generateSubdistrictText(subdistrict, districtObj.name, cityObj.name, stateObj.name);
               } else {
                 obj.results.forEach(result => {
                   this.generateSubdistrictText(subdistrict, districtObj.name, cityObj.name, stateObj.name, result);
                 });
               }
               this.props.downloadSubdistrictDetails(false);
             });
           } else {
             this.generateSubdistrictText(subdistrict, districtObj.name, cityObj.name, stateObj.name);
             this.props.downloadSubdistrictDetails(false);
             Toast.show({
               text: "ERROR " + response.status,
               buttonText: "OK",
               duration: 5000,
             });
           }
         }).catch(error => {
           this.generateSubdistrictText(subdistrict, districtObj.name, cityObj.name, stateObj.name);
           this.props.downloadSubdistrictDetails(false);
           Toast.show({
             text: error,
             buttonText: "OK",
             duration: 5000,
           });
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
    searching: state.appReducer.searchSubdistrictForm.searching,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setSubdistrict: obj => dispatch(Actions.setSearchSubdistrictForm({
      selectedSubdistrict: obj.subdistrict,
      selectedPostalCode: obj.postalCode,
      selectedSubdistrictText: obj.text,
    })),
    searchSubdistricts: (languageCode, accessToken, text) => dispatch(
      Actions.searchSubdistricts(languageCode, accessToken, text, {limit: 100})
    ),
    downloadSubdistrictDetails: downloading => dispatch(Actions.setSearchSubdistrictForm({searching: downloading})),
  }
};

export const SearchSubdistrictScreen = connect(mapStateToProps, mapDispatchToProps)(_SearchSubdistrictScreen);
