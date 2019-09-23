import React from 'react';
import {connect} from 'react-redux';
import {Image, View} from 'react-native';
import {Button, Text} from 'native-base';
import Dots from 'react-native-dots-pagination';
import themeVars from '../../theme/variables/material';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import {ContentContainer} from '../../components/ContentContainer';

class _IntroMonitoringScreen extends React.Component {
  render() {
    const {goBack, navigate} = this.props.navigation;
    //         <Text style={{flex: 0, fontSize: 24, fontWeight: 'bold', color: themeVars.toolbarDefaultBg}}>MONITORING</Text>
    return (
       <ContentContainer hasFooter={false}>
         <View style={{backgroundColor: 'white', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, flex: 8, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
           <View style={{flex: 8, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
             <Image source={require('../../img/mokirim_colored.png')} style={{flex: 1, width: 160, height: 60, resizeMode: 'contain'}}/>
             <Text style={{color: themeVars.toolbarDefaultBg, padding: 24, textAlign: 'center', fontSize: 18}}>{translate("messageIntroMonitorTitle")}</Text>
             <Text style={{color: '#637381', padding: 24, textAlign: 'center', fontSize: 14}}>{translate("messageIntroMonitorText")}</Text>
             <Image source={require('../../img/onboarding_3.png')} style={{flex: 1, width: 200, height: 200, resizeMode: 'contain'}}/>
           </View>
           <View style={{flex: 1}}>
             <Dots length={3} active={2} />
           </View>
         </View>
         <View style={{padding: 32, flex: 0, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
             <Button
               style={{width: 128, flex: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
               onPress={() => goBack()}
             ><Text style={{flex: 0}}>{translate('buttonBack')}</Text></Button>

             <Button
               style={{width: 128, flex: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
               onPress={() => {
                 this.props.loggedIn ? navigate('Dashboard') : navigate('Register', {hasBack: false});
                 this.props.introFinished();
               }}
             ><Text style={{flex: 0}}>{translate('buttonNext')}</Text></Button>
         </View>
       </ContentContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.appReducer.loggedIn,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    introFinished: () => dispatch(Actions.introFinished()),
  }
};

export const IntroMonitoringScreen = connect(mapStateToProps, mapDispatchToProps)(
  _IntroMonitoringScreen
);
