import React from 'react';
import {connect} from 'react-redux';
import { translate } from "../utils/i18n";
import Actions from '../state/Actions';

class _LoggedInHeaderMenu extends React.Component {
  componentDidMount() {
  };

  render() {
    return  (
      <React.Fragment>
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

export const LoggedInHeaderMenu = connect(mapStateToProps, mapDispatchToProps)(_LoggedInHeaderMenu);
