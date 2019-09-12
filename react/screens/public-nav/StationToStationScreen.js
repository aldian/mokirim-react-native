import React from 'react';
import {connect} from 'react-redux';
import { View } from 'react-native';
import {
  Button, Form, Text,
} from 'native-base';
import themeVars from '../../theme/variables/material';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { StationToStationScreenHeader } from '../../components/StationToStationScreenHeader';
import { ContentContainer } from '../../components/ContentContainer';
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
          <Button transparent style={{flex: 0}} onPress={() => navigate('MemberBenefits')}>
           <Text style={[{color: 'white'}]}>{translate('buttonMemberBenefits')}</Text>
          </Button>
        }
        <RoundedCornerPanel style={{flex: 1}}>
          <Form>
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
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const StationToStationScreen = connect(mapStateToProps, mapDispatchToProps)(_StationToStationScreen);
