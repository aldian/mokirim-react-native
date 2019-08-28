import {combineReducers} from 'redux';
import ActionCodes from './ActionCodes';

const appReducerInitialState = {
  errorMessage: '',
  loggedIn: false,
  loggedInVia: null,
  facebook: {
    accessToken: null,
  }
};

function appReducer(state = appReducerInitialState, action = {}) {
  switch (action.type) {
    case ActionCodes.SET_ERROR_MESSAGE:
      return {
        ...state, errorMessage: action.message,
      };
    case ActionCodes.LOGGED_IN_TO_FACEBOOK:
      return {
        ...state, loggedIn: true, loggedInVia: 'facebook',
        facebook: {...state.facebook, accessToken: action.accessToken}
      };
    case ActionCodes.LOGOUT:
      return {
         ...state, loggedIn: false, loggedInVia: null,
      };
    default:
      return state;
  }
}

export const rootReducer = combineReducers({
  appReducer,
});
