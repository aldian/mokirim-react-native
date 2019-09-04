import {combineReducers} from 'redux';
import ActionCodes from './ActionCodes';

const appReducerInitialState = {
  currentLanguage: undefined,
  statesLoadedFromDb: false,
  loadingStatesFromDb: false,
  errorMessage: '',
  notificationToken: null,
  introFinished: false,
  loggedIn: false,
  loggedInVia: null,
  loginForm: {
    username: '',
    password: '',
    errors: {},
    submitting: false,
  },
  facebook: {
    accessToken: null,
    displayName: "ciki cipay",
  },
  google: {
    accessToken: null,
  },
  accessToken: null,
};

function appReducer(state = appReducerInitialState, action = {}) {
  switch (action.type) {
    case ActionCodes.UPDATE_APP_STATES:
      return {
        ...state, ...action.states
      };
    case ActionCodes.SET_ERROR_MESSAGE:
      return {
        ...state, errorMessage: action.message,
      };
    case ActionCodes.INTRO_FINISHED:
       return {
         ...state, introFinished: true,
       };
     case ActionCodes.RECEIVE_NOTIFICATION_TOKEN:
       return {
        ...state, notificationToken: action.token,
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
    case ActionCodes.LOGGED_IN_TO_GOOGLE:
      return {
        ...state, loggedIn: true, loggedInVia: 'google',
        google: {...state.google, accessToken: action.accessToken}
      };
    case ActionCodes.LOGGED_IN_TO_MOKIRIM:
       return {
         ...state, loggedIn: true, loggedInVia: 'mokirim',
         accessToken: action.accessToken,
       };
    case ActionCodes.SET_LOGIN_FORM_USERNAME:
      return {
        ...state, loginForm: {...state.loginForm, username: action.username},
      };
    case ActionCodes.SET_LOGIN_FORM_PASSWORD:
      return {
        ...state, loginForm: {...state.loginForm, password: action.password},
      };
    case ActionCodes.SET_LOGIN_FORM_ERROR_USERNAME:
      return {
        ...state, loginForm: {...state.loginForm, errors: {...state.loginForm.errors, username: action.error}},
      };
    case ActionCodes.SET_LOGIN_FORM_ERROR_PASSWORD:
      return {
        ...state, loginForm: {...state.loginForm, errors: {...state.loginForm.errors, password: action.error}},
      };
    case ActionCodes.SUBMIT_LOGIN_FORM:
      return {
        ...state, loginForm: {...state.loginForm, submitting: action.submitting},
      };
    case ActionCodes.LOGOUT:
      return {
         ...state, loggedIn: false, loggedInVia: null, accessToken: null,
         facebook: {...state.facebook, accessToken: null},
         google: {...state.google, accessToken: null},
      };
    default:
      return state;
  }
}

export const rootReducer = combineReducers({
  appReducer,
});
