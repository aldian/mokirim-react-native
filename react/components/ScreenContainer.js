import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import * as RNLocalize from "react-native-localize";
import {
  Button, Container, Icon, Text,
  Footer, FooterTab,
  StyleProvider,
} from 'native-base';
import getTheme from '../theme/components';
import themeVars from '../theme/variables/material';
import { translate } from "../utils/i18n";
import Actions from '../state/Actions';

class _ScreenContainer extends React.Component {
  componentDidMount() {
    this.props.setErrorMessage('');
  }

  render() {
    return <StyleProvider style={getTheme(themeVars)}>
      <Container style={[{backgroundColor: themeVars.toolbarDefaultBg}]}>
        {this.props.children}
        {(this.props.hasFooter === undefined || this.props.hasFooter) ?
           <Footer>
             <FooterTab>
               {this.props.loggedIn ?
                 <Button
                   vertical active={this.props.currentTab === 'Dashboard'} onPress={() => this.props.navigate('Dashboard')}
                 >
                   <Icon name="home"/>
                   <Text>{translate("buttonDashboard")}</Text>
                 </Button> :
                 <Button vertical active={this.props.currentTab === 'Home'} onPress={() => this.props.navigate('Home')}>
                   <Icon name="home"/>
                   <Text>{translate("buttonHome")}</Text>
                 </Button>
               }
               {this.props.loggedIn ?
                 <Button vertical active={this.props.currentTab === 'Profile'} onPress={() => this.props.navigate('Profile')}>
                   <Icon name="person"/>
                   <Text>{translate("buttonAccount")}</Text>
                 </Button> :
                 <Button vertical active={this.props.currentTab === 'MemberBenefits'} onPress={() => this.props.navigate('MemberBenefits')}>
                   <Icon name="person"/>
                   <Text>{translate("buttonAccount")}</Text>
                 </Button>
               }
             </FooterTab>
           </Footer> :
          null
        }
      </Container>
    </StyleProvider>;
  }
}

const mapStateToProps = state => {
  return {
    currentLanguage: state.appReducer.currentLanguage,
    loggedIn: state.appReducer.loggedIn,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setErrorMessage: txt => dispatch(Actions.setErrorMessage(txt)),
  }
};

export const ScreenContainer = connect(mapStateToProps, mapDispatchToProps)(_ScreenContainer);
