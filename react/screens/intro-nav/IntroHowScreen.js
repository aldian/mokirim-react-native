import React from 'react';
import { Button, Text, View } from 'react-native';
import {connect} from 'react-redux';
import { translate } from "../../utils/i18n";

class _IntroHowScreen extends React.Component {
  render() {
    const {goBack, navigate} = this.props.navigation;
    return (
      <View>
        <Text>HOW</Text>
        <Button
           title={translate('buttonBack')}
           onPress={() => goBack()}
         />
        <Button
          title={translate('buttonNext')}
          onPress={() => navigate('IntroMonitoring')}
        />
      </View>
    );
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

export const IntroHowScreen = connect(mapStateToProps, mapDispatchToProps)(_IntroHowScreen);
