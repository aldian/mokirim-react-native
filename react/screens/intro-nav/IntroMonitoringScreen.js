import React from 'react';
import { Button, Text, View } from 'react-native';
import {connect} from 'react-redux';
import { translate } from "../../utils/i18n";
import Actions from '../../state/Actions';

class _IntroMonitoringScreen extends React.Component {
  render() {
    const {goBack, navigate} = this.props.navigation;
    return (
      <View>
        <Text>MONITORING</Text>
        <Button
           title={translate('buttonBack')}
           onPress={() => goBack()}
         />
        <Button
          title={translate('buttonNext')}
          onPress={() => {
            navigate('Home');
            this.props.introFinished();
          }}
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
    introFinished: () => dispatch(Actions.introFinished()),
  }
};

export const IntroMonitoringScreen = connect(mapStateToProps, mapDispatchToProps)(
  _IntroMonitoringScreen
);
