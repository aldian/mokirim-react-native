import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Text as RNText} from 'react-native';
import {Text} from 'native-base';
import Swiper from 'react-native-swiper';
import { translate } from "../utils/i18n";
import themeVars from '../theme/variables/material';
import Actions from '../state/Actions';

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeVars.toolbarDefaultBg,
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeVars.toolbarDefaultBg,
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeVars.toolbarDefaultBg,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  buttonText: {
    fontSize: 50,
    color: 'white',
  }
});

class _HomeNewsSwiper extends React.Component {
  componentDidMount() {
  };

  render() {
    let style = [styles.wrapper];
    if (this.props.style) {
      if (Array.isArray(this.props.style)) {
        style = [...style, ...this.props.style];
      } else {
        style = [...style, this.props.style];
      }
    }
    return  (
      <Swiper
        style={style} showsButtons={false} activeDotColor="white"
        nextButton={<RNText style={styles.buttonText}>›</RNText>}
        prevButton={<RNText style={styles.buttonText}>‹</RNText>}
      >
        <View style={styles.slide1}>
          <Text style={styles.text}>News 1</Text>
        </View>
        <View style={styles.slide2}>
          <Text style={styles.text}>News 2</Text>
        </View>
        <View style={styles.slide3}>
          <Text style={styles.text}>News 3</Text>
        </View>
      </Swiper>
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

export const HomeNewsSwiper = connect(mapStateToProps, mapDispatchToProps)(_HomeNewsSwiper);
