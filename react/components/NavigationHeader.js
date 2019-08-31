import React from 'react';
import {connect} from 'react-redux';
import { Header } from 'react-navigation-stack';

class _NavigationHeader extends React.Component {
  render() {
    // return null if you want to hide the header
    return <Header {...this.props}/>
  }
}

const mapStateToProps = state => {
  return {
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const NavigationHeader = connect(mapStateToProps, mapDispatchToProps)(_NavigationHeader);
