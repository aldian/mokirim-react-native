import React from 'react';
import {connect} from 'react-redux';
import {Button, Text} from 'native-base';
import {translate} from "../utils/i18n";
import Actions from '../state/Actions';

class _MemberBenefitsButton extends React.Component {
  render() {
    let style = [{margin: 32, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}];
    if (this.props.style) {
      if (Array.isArray(this.props.style)) {
        style = [...style, ...this.props.style]
      } else {
        style = [...style, this.props.style]
      }
    }
    return  (
      <Button style={style} onPress={() => this.props.navigate('MemberBenefits')}>
        <Text style={[{flex: 0, color: 'white', margin: 16, padding: 16}]}>{translate('buttonMemberBenefits')}</Text>
      </Button>
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

export const MemberBenefitsButton = connect(mapStateToProps, mapDispatchToProps)(_MemberBenefitsButton);
