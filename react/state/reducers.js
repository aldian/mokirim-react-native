import {combineReducers} from 'redux';
import constants from '../constants';
import ActionCodes from './ActionCodes';

const appReducerInitialState = {
  currentLanguage: undefined,
  splashShown: false,
  statesLoadedFromDb: false,
  loadingStatesFromDb: false,
  errorMessage: '',
  notificationToken: null,
  introFinished: false,
  device: {
    id: null,
    token: null,
  },
  loggedIn: false,
  loggedInVia: null,
  loginForm: {
    username: '',
    password: '',
    errors: {},
    submitting: false,
  },
  registerForm: {
    username: '',
    password: '',
    activationCode: '',
    errors: {},
    submitting: false,
  },
  resetPasswordForm: {
    email: '',
    activationCode: '',
    newPassword: '',
    errors: {},
    submitting: false,
  },
  facebook: {
    accessToken: null,
    displayName: "",
  },
  google: {
    accessToken: null,
  },
  encodedUserId: null,
  accessToken: null,
  email: null,

  findScheduleForm: {
    originatingStation: {
      id: null,
      text: '',
    },
    destinationStation: {
      id: null,
      text: '',
    },
    departureDate: null,
    openedColloIndex: 0,
    colli: [
      {weight: String(constants.MINIMUM_PRICE_WEIGHT_KG), length: null, width: null, height: null},
    ],
    totalWeight: constants.MINIMUM_PRICE_WEIGHT_KG,
  },

  searchStationForm: {
    searching: false,
  },
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
        ...state, loggedIn: false, loggedInVia: null, encodedUserId: null, accessToken: null,
        email: null,
        facebook: {...state.facebook, accessToken: null},
        google: {...state.google, accessToken: null},
      };

    case ActionCodes.SET_REGISTER_FORM_USERNAME:
       return {
         ...state, registerForm: {...state.registerForm, username: action.username},
       };
    case ActionCodes.SET_REGISTER_FORM_PASSWORD:
       return {
         ...state, registerForm: {...state.registerForm, password: action.password},
       };
    case ActionCodes.SET_REGISTER_FORM_ERROR_USERNAME:
       return {
         ...state, registerForm: {...state.registerForm, errors: {...state.registerForm.errors, username: action.error}},
       };
    case ActionCodes.SET_REGISTER_FORM_ERROR_PASSWORD:
       return {
         ...state, registerForm: {...state.registerForm, errors: {...state.registerForm.errors, password: action.error}},
       };
    case ActionCodes.SET_ACTIVATE_FORM_CODE:
       return {
         ...state, registerForm: {...state.registerForm, activationCode: action.code},
       };
    case ActionCodes.SET_ACTIVATE_FORM_ERROR_CODE:
       return {
         ...state, registerForm: {...state.registerForm, errors: {...state.registerForm.errors, activationCode: action.error}},
       };
    case ActionCodes.SUBMIT_REGISTER_FORM:
    case ActionCodes.SUBMIT_ACTIVATE_FORM:
      return {
        ...state, registerForm: {...state.registerForm, submitting: action.submitting},
      };

    case ActionCodes.SET_RESET_PASSWORD_FORM_EMAIL:
      return {
        ...state, resetPasswordForm: {...state.resetPasswordForm, email: action.email},
      };
    case ActionCodes.SET_RESET_PASSWORD_FORM_ERROR_EMAIL:
      return {
        ...state, resetPasswordForm: {...state.resetPasswordForm, errors: {...state.resetPasswordForm.errors, email: action.error}},
      };

    case ActionCodes.SET_CONFIRM_PASSWORD_RESET_FORM_CODE:
      return {
        ...state, resetPasswordForm: {...state.resetPasswordForm, activationCode: action.code},
      };
    case ActionCodes.SET_CONFIRM_PASSWORD_RESET_FORM_ERROR_CODE:
      return {
        ...state, resetPasswordForm: {...state.resetPasswordForm, errors: {...state.resetPasswordForm.errors, activationCode: action.error}},
      };
    case ActionCodes.SET_CONFIRM_PASSWORD_RESET_FORM_NEW_PASSWORD:
      return {
        ...state, resetPasswordForm: {...state.resetPasswordForm, newPassword: action.password},
      };
    case ActionCodes.SET_CONFIRM_PASSWORD_RESET_FORM_ERROR_NEW_PASSWORD:
      return {
        ...state, resetPasswordForm: {...state.resetPasswordForm, errors: {...state.resetPasswordForm.errors, newPassword: action.error}},
      };
    case ActionCodes.SUBMIT_RESET_PASSWORD_FORM:
    case ActionCodes.SUBMIT_CONFIRM_PASSWORD_RESET_FORM:
      return {
        ...state, resetPasswordForm: {...state.resetPasswordForm, submitting: action.submitting},
      };

    case ActionCodes.SET_FIND_SCHEDULE_FORM_ORIGINATING_STATION:
      return {
        ...state, findScheduleForm: {...state.findScheduleForm, originatingStation: action.place},
      };
    case ActionCodes.SET_FIND_SCHEDULE_FORM_DESTINATION_STATION:
      return {
        ...state, findScheduleForm: {...state.findScheduleForm, destinationStation: action.place},
      };
    case ActionCodes.SET_FIND_SCHEDULE_FORM_DEPARTURE_DATE:
      return {
        ...state, findScheduleForm: {...state.findScheduleForm, departureDate: action.date},
      };
    case ActionCodes.ADD_COLLO:
      return {
        ...state,
        findScheduleForm: {
          ...state.findScheduleForm,
          openedColloIndex: state.findScheduleForm.colli.length,
          colli: [
            ...state.findScheduleForm.colli,
            {weight: null, length: null, width: null, height: null}
          ]
        },
      };
    case ActionCodes.REMOVE_COLLO:
      const colli = [
        ...state.findScheduleForm.colli.filter((el, i) => i < action.index),
        ...state.findScheduleForm.colli.filter((el, i) => i > action.index),
      ];
      return {
        ...state,
        findScheduleForm: {
           ...state.findScheduleForm,
          openedColloIndex: null,
           colli,
           totalWeight: colli.map(collo => collo.weight).reduce((a, b) => {
             let floatA = parseFloat(a);
             if (isNaN(floatA)) {
               floatA = 0;
             }
             let floatB = parseFloat(b);
             if (isNaN(floatB)) {
               floatB = 0;
             }
             return floatA + floatB;
           }),
        }
      };
    case ActionCodes.SET_OPENED_COLLO_INDEX:
      return {
        ...state,
        findScheduleForm: {
          ...state.findScheduleForm,
          openedColloIndex: action.index,
        }
      };
    case ActionCodes.SET_COLLO_WEIGHT: {
      const colli = [
        ...state.findScheduleForm.colli.filter((el, i) => i < action.index),
        {...state.findScheduleForm.colli[action.index], weight: action.weight},
        ...state.findScheduleForm.colli.filter((el, i) => i > action.index),
      ];
      return {
        ...state,
        findScheduleForm: {
           ...state.findScheduleForm,
           colli,
           totalWeight: colli.map(collo => collo.weight).reduce((a, b) => {
             let floatA = parseFloat(a);
             if (isNaN(floatA)) {
               floatA = 0;
             }
             let floatB = parseFloat(b);
             if (isNaN(floatB)) {
               floatB = 0;
             }
             return floatA + floatB;
           }),
        }
      };
    }
    case ActionCodes.SET_COLLO_LENGTH:
      return {
        ...state,
        findScheduleForm: {
           ...state.findScheduleForm,
           colli: [
             ...state.findScheduleForm.colli.filter((el, i) => i < action.index),
             {...state.findScheduleForm.colli[action.index], length: action.length},
             ...state.findScheduleForm.colli.filter((el, i) => i > action.index),
           ],
        }
      };
    case ActionCodes.SET_COLLO_WIDTH:
      return {
        ...state,
        findScheduleForm: {
           ...state.findScheduleForm,
           colli: [
             ...state.findScheduleForm.colli.filter((el, i) => i < action.index),
             {...state.findScheduleForm.colli[action.index], width: action.width},
             ...state.findScheduleForm.colli.filter((el, i) => i > action.index),
           ],
         }
       };
    case ActionCodes.SET_COLLO_HEIGHT:
      return {
        ...state,
        findScheduleForm: {
           ...state.findScheduleForm,
           colli: [
             ...state.findScheduleForm.colli.filter((el, i) => i < action.index),
             {...state.findScheduleForm.colli[action.index], height: action.height},
             ...state.findScheduleForm.colli.filter((el, i) => i > action.index),
           ],
         }
       };
    case ActionCodes.INCREMENT_COLLO_WEIGHT: {
      let weight = parseFloat(state.findScheduleForm.colli[action.index].weight);
      if (isNaN(weight)) {
        weight = 0;
      }
      weight += action.weight;

      const colli = [
        ...state.findScheduleForm.colli.filter((el, i) => i < action.index),
        {...state.findScheduleForm.colli[action.index], weight: String(weight)},
        ...state.findScheduleForm.colli.filter((el, i) => i > action.index),
      ];
      return {
        ...state,
        findScheduleForm: {
          ...state.findScheduleForm,
          colli,
          totalWeight: colli.map(collo => collo.weight).reduce((a, b) => {
            let floatA = parseFloat(a);
            if (isNaN(floatA)) {
              floatA = 0;
            }
            let floatB = parseFloat(b);
            if (isNaN(floatB)) {
              floatB = 0;
            }
            return floatA + floatB;
          }),
        }
      };
    }
    case ActionCodes.SEARCH_STATIONS:
      return {
        ...state, searchStationForm: {...state.searchStationForm, searching: action.searching},
      };

    default:
      return state;
  }
}

export const rootReducer = combineReducers({
  appReducer,
});
