import React from 'react';
import {connect} from 'react-redux';
import { Button as RNButton, View, Text as RNText } from 'react-native';
import {
  Button,
  Container, Card, CardItem, DeckSwiper,
  Header, Body as HeaderBody, Title as HeaderTitle, Left as HeaderLeft, Right as HeaderRight,
  Icon, IconNB, StyleProvider, Text
} from 'native-base';
import { LoginButton } from 'react-native-fbsdk';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';
import { NavigationL10nText } from '../../components/NavigationL10nText';
import { ScreenContainer } from '../../components/ScreenContainer';
import styles from '../../styles';
import getTheme from '../../theme/components';
import themeVars from '../../theme/variables/material';

const cards = [
  {
    text: "Benefit 1 Text",
    title: "Benefit 1",
  },
  {
    text: "Benefit 2 Text",
    title: "Benefit 2",
  },
  {
    text: "Benefit 3 Text",
    title: "Benefit 3",
  },
  {
    text: "Benefit 4 Text",
    title: "Benefit 4",
  }
];

class _MemberBenefitsScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps, theme, navigationOptions}) => ({
    header: <StyleProvider style={getTheme(themeVars)}>
      <Header>
        <HeaderLeft>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back"/>
          </Button>
        </HeaderLeft>
        <HeaderBody>
          <HeaderTitle>{translate("headerMemberBenefits")}</HeaderTitle>
        </HeaderBody>
      </Header>
    </StyleProvider>,
  });

  constructor(props) {
    super(props);

    this.state = {
      page: 0,
    }
  }


  render() {
    const {navigate} = this.props.navigation;

    return (
      <StyleProvider style={getTheme(themeVars)}>
        <Container>
          <View style={[{flex: 1, flexDirection: 'column', backgroundColor: 'orange', alignItems: 'stretch'}]}>
            <View style={[{flex: 2, alignItems: 'center', flowDirection: 'column', justifyContent: 'center'}]}>
              <Carousel style={[{flex: 1, alignItems: 'stretch', justifyContent: 'center'}]}
                 sliderWidth={360}
                 itemWidth={300}
                 onSnapToItem={idx => this.setState({page: idx})}
                 loop={true}
                 data={cards}
                 renderItem={(item, idx) =>
                   <Card style={[{height: 200}]}>
                     <CardItem>
                       <HeaderBody>
                         <Text>{item.item.text}</Text>
                       </HeaderBody>
                     </CardItem>
                   </Card>
                 }
              />
            </View>
            <View style={[{flex: 1}]}>
              <Pagination
                dotsLength={4} activeDotIndex={this.state.page} style={[{flex: 1, alignItems: 'stretch', justifyContent: 'center'}]}
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.92)'
                }}
                inactiveDotStyle={{
                  // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
               />
            </View>
            <View style={[{flex: 0, flexDirection: 'row', justifyContent: 'center', padding: 32}]}>
              <Button
                style={[{margin: 4}]}
                onPress={() => navigate('Login')}
              ><Text>{translate('headerLogin')}</Text></Button>
              <Button
                style={[{margin: 4}]}
                onPress={() => navigate('Register')}
               ><Text>{translate('headerRegister')}</Text></Button>
            </View>
          </View>
        </Container>
      </StyleProvider>
    );
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

export const MemberBenefitsScreen = connect(mapStateToProps, mapDispatchToProps)(_MemberBenefitsScreen);
