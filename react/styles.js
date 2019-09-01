import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  screen: {
     flex: 1,
     flexDirection: 'column',
     alignItems: 'stretch',
     justifyContent: 'space-between',
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
});