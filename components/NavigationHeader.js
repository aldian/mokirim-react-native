import React from 'react';
import {connect} from 'react-redux';
import { Header } from 'react-navigation-stack';

class _NavigationHeader extends React.Component {
  render() {
    if (this.props.splashShown) {
      return <Header {...this.props}/>
    }

    return null;
  }
}

const mapStateToProps = state => {
  return {
    splashShown: state.appReducer.splashShown,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const NavigationHeader = connect(mapStateToProps, mapDispatchToProps)(_NavigationHeader);
