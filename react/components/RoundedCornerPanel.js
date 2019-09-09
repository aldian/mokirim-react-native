import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import { translate } from "../utils/i18n";
import Actions from '../state/Actions';

class _RoundedCornerPanel extends React.Component {
  componentDidMount() {
  };

  render() {
    return  (
      <View style={[{backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16}, this.props.style]}>
        {this.props.children}
      </View>
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

export const RoundedCornerPanel = connect(mapStateToProps, mapDispatchToProps)(_RoundedCornerPanel);
