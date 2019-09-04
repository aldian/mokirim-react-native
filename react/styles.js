import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  screen: {
     flex: 1,
     flexDirection: 'column',
     alignItems: 'stretch',
     justifyContent: 'space-between',
  },

  splashScreen: {
    backgroundColor: '#F58223',
  },

  splashText: {
    color: 'white',
    fontWeight: 'bold',
  },

  content: {
     flex: 1,
     flexDirection: 'column',
     alignItems: 'center',
     justifyContent: 'center',
  },

  buttonsRow: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    margin: 5,
  },

  submitButton: {margin: 15, marginLeft: 'auto', marginRight: 'auto', width: 250},
});