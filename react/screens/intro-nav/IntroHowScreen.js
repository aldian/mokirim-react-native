import React from 'react';
import { Button, Text, View } from 'react-native';
import {connect} from 'react-redux';
import { translate } from "../../utils/i18n";
import styles from "../../styles";

class _IntroHowScreen extends React.Component {
  render() {
    const {goBack, navigate} = this.props.navigation;
    return (
      <View style={[styles.screen, styles.splashScreen]}>
        <View style={styles.content}>
        <Text style={styles.splashText}>HOW</Text>
        </View>
        <View style={styles.buttonsRow}>
          <Button
             title={translate('buttonBack')}
             onPress={() => goBack()}
           />
          <Button
            title={translate('buttonNext')}
            onPress={() => navigate('IntroMonitoring')}
          />
        </View>
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
