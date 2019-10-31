import React from 'react';
import {connect} from 'react-redux';
import { translate } from "../utils/i18n";
import {View} from "react-native";
import {Content} from "native-base";
import Actions from '../state/Actions';
import {ScreenContainer} from './ScreenContainer';

class _ContentContainer extends React.Component {
  render() {
    return  (
      <ScreenContainer {...this.props}>
        {this.props.scrollEnabled === false ?
          <View style={{flexGrow: 1, justifyContent: 'space-between'}}>
             {this.props.children}
          </View> :
          <Content
             contentContainerStyle={{
               flexGrow: 1,
               justifyContent: 'space-between',
             }}
          >
             {this.props.children}
          </Content>
        }
      </ScreenContainer>
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

export const ContentContainer = connect(mapStateToProps, mapDispatchToProps)(_ContentContainer);
