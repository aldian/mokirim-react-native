import React from 'react';
import {connect} from 'react-redux';
import { View } from 'react-native';
import {
  Button, Text,
} from 'native-base';
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
        <Button transparent onPress={() => navigate('MemberBenefits')}>
          <Text style={[{color: 'white'}]}>{translate('buttonMemberBenefits')}</Text>
        </Button>
        <RoundedCornerPanel>
        </RoundedCornerPanel>
      </ContentContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const StationToStationScreen = connect(mapStateToProps, mapDispatchToProps)(_StationToStationScreen);
