import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {Button, Text} from 'native-base';
import { translate } from "../utils/i18n";
import Actions from '../state/Actions';

class _DeliveryOptionsMenu extends React.Component {
  componentDidMount() {
  };

  render() {
    return  (
      <React.Fragment>
        <Text style={{marginBottom: 16, fontWeight: 'bold'}}>{translate("sectionDeliveryOptions")}</Text>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch'}}>
          <Button style={{marginRight: 4, flex: 1}} onPress={() => this.props.navigate("StationToStation")}>
            <Text>{translate("buttonStationToStation")}</Text>
          </Button>
          <Button style={{marginLeft: 4, flex: 1}} disabled><Text>{translate("buttonDoorToDoor")}</Text></Button>
        </View>
      </React.Fragment>
    )
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

export const DeliveryOptionsMenu = connect(mapStateToProps, mapDispatchToProps)(_DeliveryOptionsMenu);
