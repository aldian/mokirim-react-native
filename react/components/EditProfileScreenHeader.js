import React from 'react';
import {connect} from 'react-redux';
import {Image} from 'react-native';
import {
  Button, Text,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, Spinner, StyleProvider,
} from 'native-base';
import { translate } from "../utils/i18n";
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';

class _EditProfileScreenHeader extends React.Component {
  render() {
    const hasBack = this.props.navigation.getParam('hasBack', true);

    return (
     <StyleProvider style={getTheme(themeVars)}>
       <Header noShadow style={{backgroundColor: themeVars.toolbarDefaultBg}}>
         <HeaderLeft>
           {this.props.profile.submitting ?
             <Spinner/> :
             (hasBack ?
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                  <Icon name="arrow-back" style={{color: 'white'}}/>
                </Button> :
                <Image source={require('../img/mokirim_logo.png')} style={{flex: 1, alignSelf: 'center', width: 24, height: 24, resizeMode: 'contain'}}/>
             )
           }
         </HeaderLeft>
         <HeaderBody>
           <HeaderTitle>{translate("headerEditProfile")}</HeaderTitle>
         </HeaderBody>
         <HeaderRight/>
       </Header>
     </StyleProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    profile: state.appReducer.editProfileForm,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const EditProfileScreenHeader = connect(mapStateToProps, mapDispatchToProps)(_EditProfileScreenHeader);
