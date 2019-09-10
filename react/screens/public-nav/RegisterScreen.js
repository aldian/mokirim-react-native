import React from 'react';
import {connect} from 'react-redux';
import {
  Container, Content, StyleProvider,
} from 'native-base';
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';
import { ContentContainer } from '../../components/ContentContainer';
import { RegisterScreenHeader } from '../../components/RegisterScreenHeader';
import { RegisterForm } from '../../components/RegisterForm';
import { ActivateForm } from '../../components/ActivateForm';

class _RegisterScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    header: <RegisterScreenHeader navigation={navigation}/>,
  });

  render() {
    const {navigate} = this.props.navigation;
    return  (
      <ContentContainer hasFooter={false} style={{backgroundColor: '#222B45'}}>
            <RegisterForm/>
            {this.props.encodedUserId ?
              <ActivateForm navigate={navigate}/> :
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

export const RegisterScreen = connect(mapStateToProps, mapDispatchToProps)(_RegisterScreen);
