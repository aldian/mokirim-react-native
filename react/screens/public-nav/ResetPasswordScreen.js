import React from 'react';
import {connect} from 'react-redux';
import {
  Container, Content, StyleProvider,
} from 'native-base';
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';
import { ContentContainer } from '../../components/ContentContainer';
import { ResetPasswordScreenHeader } from '../../components/ResetPasswordScreenHeader';
import { ResetPasswordForm } from '../../components/ResetPasswordForm';
import { ConfirmPasswordResetForm } from '../../components/ConfirmPasswordResetForm';

class _ResetPasswordScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    header: <ResetPasswordScreenHeader navigation={navigation}/>,
  });

  render() {
    const {navigate} = this.props.navigation;
    return  (
      <ContentContainer hasFooter={false} style={{backgroundColor: '#222B45'}}>
            <ResetPasswordForm/>
            {this.props.encodedUserId ?
              <ConfirmPasswordResetForm navigate={navigate}/> :
              null
            }
      </ContentContainer>
    )
  }
}

const mapStateToProps = state => {
  return {
    encodedUserId: state.appReducer.encodedUserId,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

export const ResetPasswordScreen = connect(mapStateToProps, mapDispatchToProps)(_ResetPasswordScreen);
