import React from 'react';
import { Button, Text, View } from 'react-native';
import {connect} from 'react-redux';
import { translate } from "../../utils/i18n";
import styles from "../../styles";

class _IntroWhyScreen extends React.Component {
  render() {
    const {goBack, navigate} = this.props.navigation;
    return (
      <View style={styles.screen}>
        <View style={[styles.content]}>
          <Text>WHY</Text>
        </View>
        <View style={[styles.buttonsRow, {justifyContent: 'flex-end'}]}>
            <Button
              title={translate('buttonNext')}
              onPress={() => navigate('IntroHow')}
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

export const IntroWhyScreen = connect(mapStateToProps, mapDispatchToProps)(_IntroWhyScreen);
