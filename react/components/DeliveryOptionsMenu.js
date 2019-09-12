import React from 'react';
import {connect} from 'react-redux';
import {Image, View} from 'react-native';
import {Button, Text} from 'native-base';
import { translate } from "../utils/i18n";
import Actions from '../state/Actions';

class _DeliveryOptionsMenu extends React.Component {
  componentDidMount() {
  };

  render() {
    return  (
      <React.Fragment>
        <Text style={[{flex: 0, marginBottom: 16, fontWeight: 'bold'}]}>{translate("sectionDeliveryOptions")}</Text>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
          <Button transparent style={{flex: 0, width: 152, height: 152, padding: 0, margin: 0}} onPress={() => this.props.navigate("StationToStation")}>
            <Image source={require('../img/btn_delivery_ss.png')} style={{flex: 0, width: 152, height: 152, resizeMode: 'contain'}}/>
          </Button>
          <Button transparent style={{flex: 0, width: 152, height: 152, padding: 0, margin: 0}}>
            <Image source={require('../img/btn_delivery_dd.png')} style={{flex: 0, width: 152, height: 152, resizeMode: 'contain'}}/>
          </Button>
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
