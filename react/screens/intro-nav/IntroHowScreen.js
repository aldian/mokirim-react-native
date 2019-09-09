import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {Button, Text} from 'native-base';
import Dots from 'react-native-dots-pagination';
import themeVars from '../../theme/variables/material';
import { translate } from "../../utils/i18n";
import {ContentContainer} from '../../components/ContentContainer';

class _IntroHowScreen extends React.Component {
  render() {
    const {goBack, navigate} = this.props.navigation;
    return (
      <ContentContainer hasFooter={false}>
        <View style={{backgroundColor: 'white', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, flex: 8, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={{flex: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{flex: 0, fontSize: 24, fontWeight: 'bold', color: themeVars.toolbarDefaultBg}}>HOW?</Text>
          </View>
          <View style={{flex: 1}}>
            <Dots length={3} active={1} />
          </View>
        </View>
        <View style={{padding: 16, flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <Button
              style={{width: 128, flex: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
              onPress={() => goBack()}
            ><Text style={{flex: 0}}>{translate('buttonBack')}</Text></Button>

            <Button
              style={{width: 128, flex: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
              onPress={() => navigate('IntroMonitoring')}
            ><Text style={{flex: 0}}>{translate('buttonNext')}</Text></Button>
        </View>
      </ContentContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const IntroHowScreen = connect(mapStateToProps, mapDispatchToProps)(_IntroHowScreen);
