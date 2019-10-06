import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {Button, Input, Icon, Item, Label, Text} from 'native-base';
import themeVars from '../theme/variables/material';
import { translate } from "../utils/i18n";
import Actions from '../state/Actions';

class _PackageDimensionInput extends React.Component {
  render() {
    let weight = parseFloat(this.props.info.weight);
    if (isNaN(weight)) {
      weight = 0;
    }
    const decrementDisabled = (weight - 1 < 0) || (weight === 0);
    return  (
      <React.Fragment>
        <Label>{translate("labelWeight")}</Label>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <View style={{width: 80}}>
            <Item>
              <Input
                keyboardType="numeric" value={this.props.info.weight} onChangeText={text => this.props.setWeight(this.props.info.index, text)}
              />
              <Text>kg</Text>
            </Item>
          </View>
          <Button
            bordered style={{marginLeft: 8, borderColor: decrementDisabled ? 'gray' : themeVars.toolbarDefaultBg}}
            disabled={decrementDisabled}
            onPress={() => this.props.incrementWeight(this.props.info.index, -1)}
          >
            <Text><Icon style={{color: decrementDisabled ? 'gray' : themeVars.toolbarDefaultBg}} type="Ionicons" name="ios-remove"/></Text>
          </Button>
          <Button
            bordered style={{marginLeft: 8, borderColor: themeVars.toolbarDefaultBg}}
            onPress={() => this.props.incrementWeight(this.props.info.index, 1)}
          >
            <Text><Icon style={{color: themeVars.toolbarDefaultBg}} type="Ionicons" name="ios-add"/></Text>
          </Button>
        </View>
        <Label>{translate("labelDimension")}</Label>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 0, width: 80}} flexDirection="column">
            <Item style={{flex: 0}}>
              <Input keyboardType="numeric" value={this.props.info.length} onChangeText={text => this.props.setLength(this.props.info.index, text)}/>
              <Text>cm</Text>
            </Item>
            <Text style={{flex: 0, color: '#919EAB', fontSize: 12}}>{translate("labelLength")}</Text>
          </View>
          <View style={{flex: 0, width: 80}} flexDirection="column">
            <Item style={{flex: 0}}>
              <Input keyboardType="numeric" value={this.props.info.width} onChangeText={text => this.props.setWidth(this.props.info.index, text)}/>
              <Text>cm</Text>
            </Item>
            <Text style={{flex: 0, color: '#919EAB', fontSize: 12}}>{translate("labelWidth")}</Text>
          </View>
          <View style={{flex: 0, width: 80}} flexDirection="column">
            <Item style={{flex: 0}}>
               <Input keyboardType="numeric" value={this.props.info.height} onChangeText={text => this.props.setHeight(this.props.info.index, text)}/>
               <Text>cm</Text>
            </Item>
            <Text style={{flex: 0, color: '#919EAB', fontSize: 12}}>{translate("labelHeight")}</Text>
          </View>
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
    setWeight: (index, weight) => dispatch(Actions.setColloWeight(index, weight)),
    setLength: (index, length) => dispatch(Actions.setColloLength(index, length)),
    setWidth: (index, width) => dispatch(Actions.setColloWidth(index, width)),
    setHeight: (index, height) => dispatch(Actions.setColloHeight(index, height)),
    incrementWeight: (index, weight) => dispatch(Actions.incrementColloWeight(index, weight)),
  }
};

export const PackageDimensionInput = connect(mapStateToProps, mapDispatchToProps)(_PackageDimensionInput);
