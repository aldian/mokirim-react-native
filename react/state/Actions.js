import { GoogleSignin } from 'react-native-google-signin';
import uuid from 'uuid';
import { translate } from "../utils/i18n";
import ActionCodes from './ActionCodes';
import Database from '../utils/database';
import MokirimAPI from '../utils/MokirimAPI';

const updateAppStates = states => ({
  type: ActionCodes.UPDATE_APP_STATES,
  states,
});

const setErrorMessage = message => ({
  type: ActionCodes.SET_ERROR_MESSAGE,
  message,
});

const setCurrentLanguage = languageCode => ({
  type: ActionCodes.SET_CURRENT_LANGUAGE,
  languageCode,
});

const receiveNotificationToken = token => ({
  type: ActionCodes.RECEIVE_NOTIFICATION_TOKEN,
  token,
});

const _introFinished = () => ({
  type: ActionCodes.INTRO_FINISHED,
});

const introFinished = () => dispatch => {
  dispatch(_introFinished());

  return Database.openDatabase().then(db => {
    return Database.updateUserStates(db, {
      introFinished: "1",
    });
  });
}

const _loggedInToFacebook = accessToken => ({
  type: ActionCodes.LOGGED_IN_TO_FACEBOOK,
  accessToken,
});

const loggedInToFacebook = (languageCode, facebookAccessToken) => dispatch => {
  dispatch(_loggedInToFacebook(facebookAccessToken));

  Database.openDatabase().then(db => {
    return Database.updateUserStates(db, {
      loggedIn: "1", loggedInVia: "facebook", facebookAccessToken,
    });
  });

  return MokirimAPI.loginWithFacebook(languageCode, facebookAccessToken).then(response => {
    const responseClone = response.clone();
    if (responseClone.ok) {
      responseClone.json().then(obj => {
        Database.openDatabase().then(db => {
          return Database.updateUserStates(db, {
            accessToken: obj.token,
          });
        });

        dispatch(updateAppStates({accessToken: obj.token}));
      });
    }
    return response;
  });
}

const _loggedInToMokirim = accessToken => ({
  type: ActionCodes.LOGGED_IN_TO_MOKIRIM,
  accessToken,
});

const loggedInToMokirim = accessToken => dispatch => {
  dispatch(_loggedInToMokirim(accessToken));

  return Database.openDatabase().then(db => {
    return Database.updateUserStates(db, {
      loggedIn: "1", loggedInVia: "mokirim", accessToken: accessToken,
    });
  });
}

const _logout = () => ({
  type: ActionCodes.LOGOUT,
});

const logout = (languageCode, accessToken, via) => dispatch => {
  dispatch(_logout());

  Database.openDatabase().then(db => {
    return Database.updateUserStates(db, {
      loggedIn: undefined, loggedInVia: undefined, facebookAccessToken: undefined,
      googleAccessToken: undefined,
      introFinished: undefined, encodedUserId: undefined, accessToken: undefined,
      email: undefined,
    });
  });

  MokirimAPI.logout(languageCode, accessToken);
}

const downloadMasterData = (languageCode, accessToken) => dispatch => {
  Database.openDatabase().then(db => {
    const postalCodePromise = MokirimAPI.getPostalCode(languageCode, accessToken, null, {limit: 1000});
    const subdistrictPromise = MokirimAPI.getSubdistrict(languageCode, accessToken, null, {limit: 1000});
    const districtPromise = MokirimAPI.getDistrict(languageCode, accessToken, null, {limit: 1000});
    const cityPromise = MokirimAPI.getCity(languageCode, accessToken, null, {limit: 1000});
    const statePromise = MokirimAPI.getState(languageCode, accessToken, null, {limit: 1000});

    postalCodePromise.then(response => {
      if (response.ok) {
        response.json().then(obj => {
          Database.insertRows(db, 'PostalCode', obj.results);
        });
      }
    });

    subdistrictPromise.then(response => {
      if (response.ok) {
        response.json().then(obj => {
          Database.insertRows(db, 'Subdistrict', obj.results);
        });
      }
    });

    districtPromise.then(response => {
       if (response.ok) {
         response.json().then(obj => {
           Database.insertRows(db, 'District', obj.results);
         });
       }
    });

    cityPromise.then(response => {
       if (response.ok) {
         response.json().then(obj => {
           Database.insertRows(db, 'City', obj.results);
         });
       }
    });

    statePromise.then(response => {
       if (response.ok) {
         response.json().then(obj => {
           Database.insertRows(db, 'State', obj.results);
         });
       }
    });
  });
};

const loadAppStatesFromDb = (appStates, delay) => dispatch => {
  const timerStart = (new Date()).getTime();
  dispatch(updateAppStates({loadingStatesFromDb: true}));

  return Database.openDatabase().then(db => {
    return Database.loadUserStates(db).then(rows => {
      let states = {...appStates, loadingStatesFromDb: false, statesLoadedFromDb: true};
      const len = rows.length;
      for (let i = 0; i < len; ++i) {
        let row = rows.item(i);
        const name = row.name;
        const value = row.value;
        if (name === 'splashShown') {
          states.splashShown = !!parseInt(value, 10);
        } else if (name === 'loggedIn') {
          states.loggedIn = !!parseInt(value, 10);
        } else if (name === 'loggedInVia') {
          states.loggedInVia = value;
        } else if (name === 'encodedUserId') {
          states.encodedUserId = value;
        } else if (name === 'email') {
          states.email = value;
        } else if (name === 'accessToken') {
          states.accessToken = value;
        } else if (name === 'facebookAccessToken') {
          states.facebook.accessToken = value;
        } else if (name === 'googleAccessToken') {
          states.google.accessToken = value;
        } else if (name == 'introFinished') {
          states.introFinished = !!parseInt(value, 10);
        } else if (name == 'deviceId') {
          states.device.id = value;
        } else if (name == 'deviceToken') {
          states.device.token = value;
        }
      }
      dispatch(updateAppStates(states));

      if (states.device.id) {
        return new Promise((resolve, reject) => resolve());
      }

      states.device.id = uuid.v4();
      return MokirimAPI.registerDevice(states.currentLanguage, states.device.id).then(response => {
        if (response.ok) {
          return response.json().then(obj => {
            states.device.token = obj.token;
            dispatch(updateAppStates(states));
            Database.updateUserStates(
              db, {deviceId: states.device.id, deviceToken: states.device.token}
            );
            return new Promise((resolve, reject) => resolve());
          });
        } else {
          return new Promise((resolve, reject) => reject('ERROR ' + response.status));
        }
      });
    });
  });
};

const setLoginFormUsername = username => ({
  type: ActionCodes.SET_LOGIN_FORM_USERNAME,
  username,
});

const setLoginFormPassword = password => ({
  type: ActionCodes.SET_LOGIN_FORM_PASSWORD,
  password,
});

const setLoginFormErrorUsername = error => ({
  type: ActionCodes.SET_LOGIN_FORM_ERROR_USERNAME,
  error,
});

const setLoginFormErrorPassword = error => ({
  type: ActionCodes.SET_LOGIN_FORM_ERROR_PASSWORD,
  error,
});

const _submitLoginForm = submitting => ({
  type: ActionCodes.SUBMIT_LOGIN_FORM,
  submitting,
});

const submitLoginForm = (languageCode, username, password) => dispatch => {
  dispatch(_submitLoginForm(true));
  return MokirimAPI.login(languageCode, username, password);
}

const loginFormSubmitted = () => ({
  type: ActionCodes.SUBMIT_LOGIN_FORM,
  submitting: false,
});

const _loggedInToGoogle = accessToken => ({
  type: ActionCodes.LOGGED_IN_TO_GOOGLE,
  accessToken,
});

const pressGoogleLogin = languageCode => dispatch => {
  return GoogleSignin.hasPlayServices().then(() => GoogleSignin.signIn()).then(userInfo => {
    return GoogleSignin.getTokens().then(tokens => {
      dispatch(_loggedInToGoogle(tokens.accessToken));

       Database.openDatabase().then(db => {
         return Database.updateUserStates(db, {
           loggedIn: "1", loggedInVia: "google", googleAccessToken: tokens.accessToken,
         });
       });

       return MokirimAPI.loginWithGoogle(languageCode, tokens.accessToken).then(response => {
         const responseClone = response.clone();
         if (responseClone.ok) {
           responseClone.json().then(obj => {
             Database.openDatabase().then(db => {
               return Database.updateUserStates(db, {
                 accessToken: obj.token,
               });
             });

             dispatch(updateAppStates({accessToken: obj.token}));
           });
         }
         return response;
       });
    });
  });
};

const setRegisterFormUsername = username => ({
  type: ActionCodes.SET_REGISTER_FORM_USERNAME,
  username,
});

const setRegisterFormPassword = password => ({
  type: ActionCodes.SET_REGISTER_FORM_PASSWORD,
  password,
});

const setRegisterFormErrorUsername = error => ({
  type: ActionCodes.SET_REGISTER_FORM_ERROR_USERNAME,
  error,
});

const setRegisterFormErrorPassword = error => ({
  type: ActionCodes.SET_REGISTER_FORM_ERROR_PASSWORD,
  error,
});

const _submitRegisterForm = submitting => ({
  type: ActionCodes.SUBMIT_REGISTER_FORM,
  submitting,
});

const submitRegisterForm = (languageCode, username, password) => dispatch => {
  dispatch(_submitRegisterForm(true));
  return MokirimAPI.register(languageCode, username, password).then(response => {
     if (response.ok) {
       dispatch(setRegisterFormErrorUsername(false));
       dispatch(setRegisterFormErrorPassword(false));
       dispatch(setRegisterFormUsername(''));
       dispatch(setRegisterFormPassword(''));

       return response.json().then(obj => {
         Database.openDatabase().then(db => {
           return Database.updateUserStates(db, {
             encodedUserId: obj.encodedId,
             email: username,
           });
         });

         return dispatch(updateAppStates({encodedUserId: obj.encodedId, email: username}));
       });
     } else {
       if (response.status === 404) {
         return new Promise((resolve, reject) => reject(translate("errorResourceNotFound")));
       } else if (response.status === 400) {
         return response.json().then(obj => {
           return new Promise(
             (resolve, reject) => {
               let texts = [];
               if (obj.__all__) {
                 dispatch(setRegisterFormErrorUsername(true));
                 dispatch(setRegisterFormErrorPassword(true));
                 texts = [...texts, ...obj.__all__];
               }
               if (obj.username) {
                 dispatch(setRegisterFormErrorUsername(true));
                 texts = [...texts, ...obj.username.map(txt => 'username: ' + txt)];
               }
               if (obj.password) {
                 dispatch(setRegisterFormErrorPassword(true));
                 texts = [...texts, ...obj.password.map(txt => 'password: ' + txt)];
               }
               return reject(texts.join(' - '));
             }
           );
         });
       } else {
         return new Promise((resolve, reject) => reject("ERROR " + response.status));
       }
     }
  }).finally(() => {
    dispatch(_submitRegisterForm(false));
  });
}

const setActivateFormCode = code => ({
  type: ActionCodes.SET_ACTIVATE_FORM_CODE,
  code,
});

const setActivateFormErrorCode = error => ({
  type: ActionCodes.SET_ACTIVATE_FORM_ERROR_CODE,
  error,
});

const submitActivateForm = (languageCode, encodedUserId, code) => dispatch => {
  dispatch(_submitRegisterForm(true));
  return MokirimAPI.activate(languageCode, encodedUserId, code.toUpperCase()).then(response => {
     if (response.ok) {
       dispatch(setActivateFormErrorCode(false));
       dispatch(setActivateFormCode(''));

       Database.openDatabase().then(db => {
         return Database.updateUserStates(db, {
           encodedUserId: undefined,
           email: undefined,
         });
       });

       return dispatch(updateAppStates({encodedUserId: null, email: null}));
     } else {
       if (response.status === 404) {
         return new Promise((resolve, reject) => reject(translate("errorResourceNotFound")));
       } else if (response.status === 400) {
         return response.json().then(obj => {
           return new Promise(
             (resolve, reject) => {
               let texts = [];
               if (obj.__all__) {
                 dispatch(setActivateFormErrorCode(true));
                 texts = [...texts, ...obj.__all__];
               }
               if (obj.uid) {
                 texts = [...texts, ...obj.uid];
               }
               if (obj.token) {
                 dispatch(setActivateFormErrorCode(true));
                 texts = [...texts, ...obj.token];
               }
               return reject(texts.join(' - '));
             }
           );
         });
       } else {
         return new Promise((resolve, reject) => reject("ERROR " + response.status));
       }
     }
  }).finally(() => {
    dispatch(_submitRegisterForm(false));
  });
}

const setResetPasswordFormEmail = email => ({
  type: ActionCodes.SET_RESET_PASSWORD_FORM_EMAIL,
  email,
});

const setResetPasswordFormErrorEmail = error => ({
  type: ActionCodes.SET_RESET_PASSWORD_FORM_ERROR_EMAIL,
  error,
});

const _submitResetPasswordForm = submitting => ({
  type: ActionCodes.SUBMIT_RESET_PASSWORD_FORM,
  submitting,
});

const submitResetPasswordForm = (languageCode, email) => dispatch => {
  dispatch(_submitResetPasswordForm(true));
  return MokirimAPI.resetPassword(languageCode, email).then(response => {
     if (response.ok) {
       dispatch(setResetPasswordFormErrorEmail(false));
       dispatch(setResetPasswordFormEmail(''));

       return response.json().then(obj => {
         Database.openDatabase().then(db => {
           return Database.updateUserStates(db, {
             encodedUserId: obj.encodedId,
             email,
           });
         });

         return dispatch(updateAppStates({encodedUserId: obj.encodedId, email}));
       });
     } else {
       if (response.status === 404) {
         return new Promise((resolve, reject) => reject(translate("errorResourceNotFound")));
       } else if (response.status === 400) {
         return response.json().then(obj => {
           return new Promise(
             (resolve, reject) => {
               let texts = [];
               dispatch(setResetPasswordFormErrorEmail(true));
               if (Array.isArray(obj)) {
                 texts = [...texts, ...obj];
               } else {
                 if (obj.__all__) {
                   texts = [...texts, ...obj.__all__];
                 }
                 if (obj.email) {
                   texts = [...texts, ...obj.email.map(txt => 'email: ' + txt)];
                 }
               }
               return reject(texts.join(' - '));
             }
           );
         });
       } else {
         return new Promise((resolve, reject) => reject("ERROR " + response.status));
       }
     }
  }).finally(() => {
    dispatch(_submitResetPasswordForm(false));
  });
}

const setConfirmPasswordResetFormCode = code => ({
  type: ActionCodes.SET_CONFIRM_PASSWORD_RESET_FORM_CODE,
  code,
});

const setConfirmPasswordResetFormErrorCode = error => ({
  type: ActionCodes.SET_CONFIRM_PASSWORD_RESET_FORM_ERROR_CODE,
  error,
});

const setConfirmPasswordResetFormNewPassword = password => ({
  type: ActionCodes.SET_CONFIRM_PASSWORD_RESET_FORM_NEW_PASSWORD,
  password,
});

const setConfirmPasswordResetFormErrorNewPassword = error => ({
  type: ActionCodes.SET_CONFIRM_PASSWORD_RESET_FORM_ERROR_NEW_PASSWORD,
  error,
});

const _submitConfirmPasswordResetForm = submitting => ({
  type: ActionCodes.SUBMIT_CONFIRM_PASSWORD_RESET_FORM,
  submitting,
});

const submitConfirmPasswordResetForm = (languageCode, encodedUserId, code, newPassword) => dispatch => {
  dispatch(_submitConfirmPasswordResetForm(true));
  return MokirimAPI.confirmPasswordReset(languageCode, encodedUserId, code.toUpperCase(), newPassword).then(response => {
     if (response.ok) {
       dispatch(setConfirmPasswordResetFormErrorCode(false));
       dispatch(setConfirmPasswordResetFormCode(''));
       dispatch(setConfirmPasswordResetFormErrorNewPassword(false));
       dispatch(setConfirmPasswordResetFormNewPassword(''));

       Database.openDatabase().then(db => {
         return Database.updateUserStates(db, {
           encodedUserId: undefined,
           email: undefined,
         });
       });

       return dispatch(updateAppStates({encodedUserId: null, email: null}));
     } else {
       if (response.status === 404) {
         return new Promise((resolve, reject) => reject(translate("errorResourceNotFound")));
       } else if (response.status === 400) {
         return response.json().then(obj => {
           return new Promise(
             (resolve, reject) => {
               let texts = [];
               if (Array.isArray(obj)) {
                 dispatch(setConfirmPasswordResetFormErrorCode(true));
                 dispatch(setConfirmPasswordResetFormErrorNewPassword(true));
                 texts = [...texts, ...obj];
               } else {
                 if (obj.__all__) {
                   dispatch(setConfirmPasswordResetFormErrorCode(true));
                   dispatch(setConfirmPasswordResetFormErrorNewPassword(true));
                   texts = [...texts, ...obj.__all__];
                 }
                 if (obj.uid) {
                   texts = [...texts, ...obj.uid.map(txt => 'uid: ' + txt)];
                 }
                 if (obj.token) {
                   dispatch(setConfirmPasswordResetFormErrorCode(true));
                   texts = [...texts, ...obj.token.map(txt => 'token: ' + txt)];
                 }
                 if (obj.new_password) {
                   dispatch(setConfirmPasswordResetFormErrorNewPassword(true));
                   texts = [...texts, ...obj.new_password.map(txt => 'password: ' + txt)];
                 }
               }
               return reject(texts.join(' - '));
             }
           );
         });
       } else {
         return new Promise((resolve, reject) => reject("ERROR " + response.status));
       }
     }
  }).finally(() => {
    dispatch(_submitConfirmPasswordResetForm(false));
  });
}

const setFindScheduleFormOriginatingStation = place => ({
  type: ActionCodes.SET_FIND_SCHEDULE_FORM_ORIGINATING_STATION,
  place,
});

const setFindScheduleFormDestinationStation = place => ({
  type: ActionCodes.SET_FIND_SCHEDULE_FORM_DESTINATION_STATION,
  place,
});

const setFindScheduleFormDepartureDate = date => ({
  type: ActionCodes.SET_FIND_SCHEDULE_FORM_DEPARTURE_DATE,
  date,
});

const addCollo = () => ({
  type: ActionCodes.ADD_COLLO,
});

const removeCollo = index => ({
  type: ActionCodes.REMOVE_COLLO,
  index,
});

const setOpenedColloIndex = index => ({
  type: ActionCodes.SET_OPENED_COLLO_INDEX,
  index,
});

const setColloWeight = (index, weight) => ({
  type: ActionCodes.SET_COLLO_WEIGHT,
  index,
  weight,
});

const setColloLength = (index, length) => ({
  type: ActionCodes.SET_COLLO_LENGTH,
  index,
  length,
});

const setColloWidth = (index, width) => ({
  type: ActionCodes.SET_COLLO_WIDTH,
  index,
  width,
});

const setColloHeight = (index, height) => ({
  type: ActionCodes.SET_COLLO_HEIGHT,
  index,
  height,
});

const incrementColloWeight = (index, weight) => ({
  type: ActionCodes.INCREMENT_COLLO_WEIGHT,
  index,
  weight,
});

const _searchStations = searching => ({
  type: ActionCodes.SEARCH_STATIONS,
  searching,
});

const searchStations = (languageCode, accessToken, type, text) => dispatch => {
  dispatch(_searchStations(true));
  return MokirimAPI.searchStations(languageCode, accessToken, type, text).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      if (response.status === 404) {
        return new Promise((resolve, reject) => reject(translate("errorResourceNotFound")));
      } else if (response.status === 400) {
        return response.json().then(obj => {
          return new Promise(
            (resolve, reject) => {
              let texts = [];
              if (Array.isArray(obj)) {
                texts = [...texts, ...obj];
              } else {
                Object.keys(obj).forEach(key => {
                  texts = [...texts, ...obj[key]];
                });
              }
              return reject(texts.join(' - '));
            }
          );
        });
      } else {
         return new Promise((resolve, reject) => reject("ERROR " + response.status));
      }
    }
  }).finally(() => {
    dispatch(_searchStations(false));
  });
};

const downloadStationDetails = downloading => ({
  type: ActionCodes.SEARCH_STATIONS,
  searching: downloading,
});

export default Actions = {
  updateAppStates,

  setErrorMessage,
  introFinished,
  setCurrentLanguage,
  loggedInToFacebook,
  loggedInToMokirim,
  logout,
  downloadMasterData,
  loadAppStatesFromDb,

  setLoginFormUsername,
  setLoginFormPassword,
  setLoginFormErrorUsername,
  setLoginFormErrorPassword,
  submitLoginForm,
  loginFormSubmitted,
  pressGoogleLogin,

  setRegisterFormUsername,
  setRegisterFormPassword,
  setRegisterFormErrorUsername,
  setRegisterFormErrorPassword,
  submitRegisterForm,

  setActivateFormCode,
  setActivateFormErrorCode,
  submitActivateForm,

  setResetPasswordFormEmail,
  setResetPasswordFormErrorEmail,
  submitResetPasswordForm,

  setConfirmPasswordResetFormCode,
  setConfirmPasswordResetFormErrorCode,
  setConfirmPasswordResetFormNewPassword,
  setConfirmPasswordResetFormErrorNewPassword,
  submitConfirmPasswordResetForm,

  setFindScheduleFormOriginatingStation,
  setFindScheduleFormDestinationStation,
  setFindScheduleFormDepartureDate,
  addCollo,
  removeCollo,
  setOpenedColloIndex,
  setColloWeight,
  setColloLength,
  setColloWidth,
  setColloHeight,
  incrementColloWeight,

  searchStations,
  downloadStationDetails,
}
