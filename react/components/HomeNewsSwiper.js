import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import {Text} from 'native-base';
import { translate } from "../utils/i18n";
import Actions from '../state/Actions';
import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
});

class _HomeNewsSwiper extends React.Component {
  componentDidMount() {
  };

  render() {
    return  (
      <Swiper style={styles.wrapper} showsButtons={true}>
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
