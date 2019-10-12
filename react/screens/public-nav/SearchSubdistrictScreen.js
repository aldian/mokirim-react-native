import React from 'react';
import {connect} from 'react-redux';
import { FlatList, View } from 'react-native';
import {
  Button, Form, Input, Icon, Item, Label, Left, ListItem, Right, Text, Toast,
} from 'native-base';
import themeVars from '../../theme/variables/material';
import { translate } from "../../utils/i18n";
import MokirimAPI from "../../utils/MokirimAPI";
import Database from '../../utils/database';
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
                  return {
                    key, subdistrict: parseInt(subdistrict, 10),
                    postalCode: parseInt(postalCode, 10), text: this.state.listData[key]
                  };
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
     this.setState({listData: {}});
     if (results.length < 1) {
       this.setState({notFound: true});
       return;
     }
     results.forEach(subdistrict => {
       Database.openDatabase().then(db => {
          if (subdistrict.postalcode) {
            Database.addOrUpdatePostalCode(db, {
              id: subdistrict.postalcode,
              code: subdistrict.postalcode_code,
              subdistrict: subdistrict.id,
            });
          }

          Database.addOrUpdateSubdistrict(db, {
            id: subdistrict.id,
            name: subdistrict.name,
            district: subdistrict.district,
          });

          Database.addOrUpdateDistrict(db, {
            id: subdistrict.district,
            name: subdistrict.district_name,
            city: subdistrict.city,
          });

          Database.addOrUpdateCity(db, {
            id: subdistrict.city,
            name: subdistrict.city_name,
            state: subdistrict.state,
          });

          Database.addOrUpdateState(db, {
            id: subdistrict.state,
            name: subdistrict.state_name,
            country: subdistrict.country,
          });
       });

       this.generateSubdistrictText(
         {id: subdistrict.id, name: subdistrict.name}, subdistrict.district_name, subdistrict.city_name,
         subdistrict.state_name,
         (subdistrict.postalcode ? {id: subdistrict.postalcode, code: subdistrict.postalcode_code} : undefined),
       );
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
      Actions.searchSubdistricts(languageCode, accessToken, text, {limit: 20})
    ),
    downloadSubdistrictDetails: downloading => dispatch(Actions.setSearchSubdistrictForm({searching: downloading})),
  }
};

export const SearchSubdistrictScreen = connect(mapStateToProps, mapDispatchToProps)(_SearchSubdistrictScreen);
