import {combineReducers} from 'redux';
import ActionCodes from './ActionCodes';

const appReducerInitialState = {
  splashShown: false,
  currentLanguage: undefined,
  statesLoadedFromDb: false,
  loadingStatesFromDb: false,
  errorMessage: '',
  loggedIn: false,
  loggedInVia: null,
  facebook: {
    accessToken: null,
    displayName: "ciki cipay",
  }
};

function appReducer(state = appReducerInitialState, action = {}) {
  switch (action.type) {
    case ActionCodes.UPDATE_APP_STATES:
      return {
        ...state, ...action.states
      };
    case ActionCodes.CLEAR_SPLASH:
      return {
        ...state, splashShown: true,
      };
    case ActionCodes.SET_ERROR_MESSAGE:
      return {
        ...state, errorMessage: action.message,
      };
    case ActionCodes.SET_CURRENT_LANGUAGE:
       return {
         ...state, currentLanguage: action.languageCode,
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
