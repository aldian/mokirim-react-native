import React from 'react';
import {connect} from 'react-redux';
import { translate } from "../utils/i18n";

class _NavigationL10nText extends React.Component {
  render() {
    return <React.Fragment>{translate(this.props.textKey)}</React.Fragment>
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

export const NavigationL10nText = connect(mapStateToProps, mapDispatchToProps)(_NavigationL10nText);
