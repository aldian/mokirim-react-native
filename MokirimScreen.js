import React from 'react';
import {connect} from 'react-redux';
import * as RNLocalize from "react-native-localize";
import { setI18nConfig } from "./utils/i18n";
import Actions from './Actions';


class _MokirimScreen extends React.Component {
  constructor(props) {
    super(props);
    setI18nConfig();
  }

  componentDidMount() {
    RNLocalize.addEventListener("change", this.handleLocalizationChange);
    this.props.onL10nChange();
    this.loadStates();
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig();
    this.props.onL10nChange();
    this.forceUpdate();
  };

  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>
  }

  loadStates() {
    if (this.props.statesLoadedFromDb) {
      return;
    }
    if (this.props.loadingStatesFromDb) {
      return;
    }
    this.props.loadStatesFromDb();
  }
}

const mapStateToProps = state => {
  return {
    statesLoadedFromDb: state.appReducer.statesLoadedFromDb,
    loadingStatesFromDb: state.appReducer.loadingStatesFromDb,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadStatesFromDb: () => dispatch(Actions.loadStatesFromDb()),
  }
};

export const MokirimScreen = connect(mapStateToProps, mapDispatchToProps)(_MokirimScreen);
