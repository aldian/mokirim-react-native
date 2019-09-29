import React from 'react';
import {connect} from 'react-redux';
import {Image, View} from 'react-native';
import {
  Button,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Form, Icon, IconNB, Input, Item, Label, StyleProvider, Spinner, Text, Textarea, Toast,
} from 'native-base';
import { GoogleSignin } from 'react-native-google-signin';
import { LoginButton } from 'react-native-fbsdk';
import { translate } from "../../utils/i18n";
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';
import styles from '../../styles';
import Actions from '../../state/Actions';
import Address from '../../utils/address';
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ContentContainer } from '../../components/ContentContainer';
import { RoundedCornerPanel } from '../../components/RoundedCornerPanel';
import { EditProfileScreenHeader } from '../../components/EditProfileScreenHeader';

class _EditProfileScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    header: () => <EditProfileScreenHeader navigation={navigation}/>,
  });

  constructor(props) {
    super(props);

    this.state = {
      addressObj: {},
      currentPassword: '',
      newPassword: '',
      retypeNewPassword: '',
    };
  }

  componentDidMount() {
    this.props.setErrorName(false);
    this.props.setErrorEmail(false);
    this.props.setErrorPhone(false);
    this.props.setErrorAddress(false);
    this.props.setErrorSubdistrict(false);
    this.props.setErrorCurrentPassword(false);
    this.props.setErrorNewPassword(false);

    if (this.props.email && !this.props.profile.email) {
      this.props.setEmail(this.props.email);
    }

    if (this.props.name && !this.props.profile.name) {
      this.props.setName(this.props.name);
    }

    if (this.props.profile.address) {
      Address.getAddress(
        this.props.currentLanguage, this.props.accessToken, this.props.profile.address
      ).then(addressObj => {
        this.setState({addressObj});

        let postalCodePromise = undefined;
        if (addressObj.postalCode) {
          postalCodePromise = Address.getPostalCode(
            this.props.currentLanguage, this.props.accessToken, addressObj.postalCode
          );
        } else {
          postalCodePromise = new Promise((resolve, reject) => resolve({code: ''}));
        }

        const subdistrictPromise = Address.getSubdistrict(
          this.props.currentLanguage, this.props.accessToken, addressObj.subdistrict
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
              subdistrictObj.name + ", " +
              districtObj.name + ", " + cityObj.name + ", " + stateObj.name +
              (postalCodeObj.code ? (" " + postalCodeObj.code) : "")
            );

            this.props.setSubdistrict({
               subdistrict: addressObj.subdistrict,
               postalCode: addressObj.postalCode,
               text,
            });
          });
        });
      });
    }
  };

  render() {
    const {goBack, navigate} = this.props.navigation;
    return (
      <ContentContainer navigate={navigate} hasFooter={false}>
        <RoundedCornerPanel style={{flex: 1, flowDirection: 'column', justifyContent: 'flex-start'}}>
          <Form>
            <Item fixedLabel error={!!this.props.profile.errors.name} style={{flexDirection: 'column', alignItems: 'stretch'}}>
              <Label style={{flex: 1}}>{translate("labelFullName")}</Label>
              <Input
                keyboardType="default"
                onChangeText={val => this.props.setName(val)}
                value={this.props.profile.name}
                style={{flex: 1}}
              />
              {!!this.props.profile.errors.name ?
                <IconNB
                  name="ios-close-circle"
                  onPress={() => {
                    this.props.setErrorName(false);
                  }}
                /> :
                null
              }
            </Item>

            <Item fixedLabel error={!!this.props.profile.errors.email} style={{flexDirection: 'column', alignItems: 'stretch'}}>
               <Label style={{flex: 1}}>{translate("labelEmail")}</Label>
               <Input
                 autoCapitalize="none"
                 keyboardType="email-address"
                 onChangeText={val => this.props.setEmail(val)}
                 value={this.props.profile.email}
                 style={{flex: 1}}
               />
               {!!this.props.profile.errors.email ?
                 <IconNB
                   name="ios-close-circle"
                   onPress={() => {
                     this.props.setErrorEmail(false);
                   }}
                 /> :
                 null
               }
            </Item>

            <Item fixedLabel error={!!this.props.profile.errors.phone} style={{flexDirection: 'column', alignItems: 'stretch'}}>
              <Label style={{flex: 1}}>{translate("labelPhone")}</Label>
              <Input
                keyboardType="phone-pad"
                onChangeText={val => this.props.setPhone(val)}
                value={this.props.profile.phone}
                style={{flex: 1}}
              />
              {!!this.props.profile.errors.phone ?
                <IconNB
                  name="ios-close-circle"
                  onPress={() => {
                    this.props.setErrorPhone(false);
                  }}
                /> :
                null
              }
            </Item>

            <Item fixedLabel error={!!this.props.profile.errors.address} style={{flexDirection: 'column', alignItems: 'stretch'}}>
               <Label style={{flex: 1}}>{translate("labelAddress")}</Label>
               <Textarea
                 keyboardType="default"
                 rowSpan={4}
                 onChangeText={val => this.setState({
                   addressObj: {...this.state.addressObj, name: val}
                 })}
                 value={this.state.addressObj.name}
                 style={{flex: 1}}
               />
               {!!this.props.profile.errors.address ?
                 <IconNB
                   name="ios-close-circle"
                   onPress={() => {
                     this.props.setErrorAddress(false);
                   }}
                 /> :
                 null
               }
            </Item>

            <Item stackedLabel last error={!!this.props.profile.errors.subdistrict} style={{flexDirection: 'column', alignItems: 'stretch'}}>
               <Label style={{flex: 1}}>{translate("labelSubdistrict")}</Label>
               <Input
                 style={{flex: 1}}
                 multiline={true}
                 onFocus={() => navigate('SearchSubdistrict')}
                 value={this.props.selectedSubdistrictText}
               />
               {!!this.props.profile.errors.subdistrict ?
                  <IconNB
                    name="ios-close-circle"
                    onPress={() => {
                      this.props.setErrorSubdistrict(false);
                    }}
                  /> :
                  null
               }
            </Item>

            {this.props.profile.id ?
              <Item stackedLabel error={!!this.props.profile.errors.current_password} style={{flexDirection: 'column', alignItems: 'stretch'}}>
                <Label style={{flex: 1}}>{translate("labelCurrentPassword")}</Label>
                <Input
                  style={{flex: 1}}
                  autoCapitalize="none"
                  secureTextEntry={true} onChangeText={val => this.setState({currentPassword: val})}
                  value={this.state.currentPassword}
                />
                {!!this.props.profile.errors.current_password ?
                   <IconNB
                     name="ios-close-circle"
                     onPress={() => {
                       this.props.setErrorCurrentPassword(false);
                     }}
                   /> :
                   null
                }
              </Item> :
              null
            }

            <Item stackedLabel error={!!this.props.profile.errors.new_password} style={{flexDirection: 'column', alignItems: 'stretch'}}>
              <Label style={{flex: 1}}>{translate("labelNewPassword")}</Label>
              <Input
                style={{flex: 1}}
                autoCapitalize="none"
                secureTextEntry={true} onChangeText={val => this.setState({newPassword: val})}
                value={this.state.newPassword}
              />
              {!!this.props.profile.errors.new_password ?
                 <IconNB
                   name="ios-close-circle"
                   onPress={() => {
                     this.props.setErrorNewPassword(false);
                   }}
                 /> :
                 null
              }
            </Item>

            <Item stackedLabel last error={!!this.props.profile.errors.new_password} style={{flexDirection: 'column', alignItems: 'stretch'}}>
               <Label style={{flex: 1}}>{translate("labelRetypeNewPassword")}</Label>
               <Input
                 style={{flex: 1}}
                 autoCapitalize="none"
                 secureTextEntry={true} onChangeText={val => this.setState({retypeNewPassword: val})}
                 value={this.state.retypeNewPassword}
               />
               {!!this.props.profile.errors.new_password ?
                  <IconNB
                    name="ios-close-circle"
                    onPress={() => {
                      this.props.setErrorNewPassword(false);
                    }}
                  /> :
                  null
               }
            </Item>
          </Form>
          {this.props.profile.submitting ?
            <Spinner/> :
            <Button
              block style={[styles.submitButton, {backgroundColor: themeVars.toolbarDefaultBg}]}
              onPress={() => {
                let profile = {
                  id: this.props.profile.id,
                  name: this.props.profile.name,
                  email: this.props.profile.email,
                  phone: this.props.profile.phone,
                  address: {
                    ...this.state.addressObj,
                    id: this.props.profile.address,
                    subdistrict: this.props.selectedSubdistrict,
                    postalCode: this.props.selectedPostalCode,
                  },

                  currentPassword: this.state.currentPassword,
                  newPassword: this.state.newPassword,
                  retypeNewPassword: this.state.retypeNewPassword,
                }
                this.props.setProfile({submitting: true});
                this.props.submitForm(
                  this.props.currentLanguage, this.props.accessToken, profile
                ).then(() => {
                  Toast.show({
                     text: translate('messageProfileUpdated'), buttonText: "OK", duration: 5000,
                  });
                  if (profile.id) {
                    goBack();
                  } else {
                    navigate('Dashboard');
                  }
                }).catch(error => {
                  if (typeof(error) === 'object') {
                    let errors = [];
                    Object.keys(error).forEach(key => {
                      const value = error[key];
                      if (typeof(key) === 'number') {
                        errors = [...errors, value];
                      } else {
                        this.props.setError({[key]: true});
                        if (typeof(value) === 'object') {
                          errors = [...errors, (translate(key) + ': ' + value.join(', '))];
                        } else {
                          errors = [...errors, (translate(key) + ": " + value)];
                        }
                      }
                    });
                    Toast.show({
                      text: errors.join('\n'), buttonText: "OK", duration: 10000,
                    });
                  } else {
                    Toast.show({
                      text: error, buttonText: "OK", duration: 10000,
                    });
                  }
                }).finally(() => {
                  this.props.setProfile({submitting: false});
                });
              }}
            >
              <Text>{translate("buttonUpdate")}</Text>
            </Button>
          }
        </RoundedCornerPanel>
      </ContentContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    accessToken: state.appReducer.accessToken,
    email: state.appReducer.email,
    name: state.appReducer.name,
    profile: state.appReducer.editProfileForm,
    selectedSubdistrict: state.appReducer.searchSubdistrictForm.selectedSubdistrict,
    selectedPostalCode: state.appReducer.searchSubdistrictForm.selectedPostalCode,
    selectedSubdistrictText: state.appReducer.searchSubdistrictForm.selectedSubdistrictText,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setName: name => dispatch(Actions.setUserProfile({name})),
    setEmail: email => dispatch(Actions.setUserProfile({email})),
    setPhone: phone => dispatch(Actions.setUserProfile({phone})),
    setSubdistrict: obj => dispatch(Actions.setSearchSubdistrictForm({
       selectedSubdistrict: obj.subdistrict,
       selectedPostalCode: obj.postalCode,
       selectedSubdistrictText: obj.text,
    })),
    setProfile: profile => dispatch(Actions.setUserProfile(profile)),

    setError: obj => dispatch(Actions.setUserProfileError(obj)),
    setErrorName: error => dispatch(Actions.setUserProfileError({name: error})),
    setErrorEmail: error => dispatch(Actions.setUserProfileError({email: error})),
    setErrorPhone: error => dispatch(Actions.setUserProfileError({phone: error})),
    setErrorAddress: error => dispatch(Actions.setUserProfileError({address: error})),
    setErrorSubdistrict: error => dispatch(Actions.setUserProfileError({subdistrict: error})),
    setErrorCurrentPassword: error => dispatch(Actions.setUserProfileError({current_password: error})),
    setErrorNewPassword: error => dispatch(Actions.setUserProfileError({new_password: error})),

    submitForm: (languageCode, accessToken, profile) => (
      dispatch(Actions.submitEditProfileForm(languageCode, accessToken, profile))
    ),
  }
};

export const EditProfileScreen = connect(mapStateToProps, mapDispatchToProps)(_EditProfileScreen);
