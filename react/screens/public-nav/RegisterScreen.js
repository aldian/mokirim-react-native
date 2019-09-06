import React from 'react';
import {connect} from 'react-redux';
import {
  Container, Content, StyleProvider,
} from 'native-base';
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';
import { RegisterFormHeader } from '../../components/RegisterFormHeader';
import { RegisterForm } from '../../components/RegisterForm';
import { ActivateForm } from '../../components/ActivateForm';

class _RegisterScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, navigationOptions}) => ({
    header: <RegisterFormHeader navigation={navigation}/>,
  });

  render() {
    const {navigate} = this.props.navigation;
    return  (
      <StyleProvider style={getTheme(themeVars)}>
        <Container>
          <Content>
            <RegisterForm/>
            {this.props.encodedUserId ?
              <ActivateForm navigate={navigate}/> :
              null
            }
          </Content>
        </Container>
      </StyleProvider>
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
