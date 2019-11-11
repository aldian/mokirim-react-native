import { GoogleSignin } from '@react-native-community/google-signin';
import uuid from 'uuid';
import { translate } from "../utils/i18n";
import ActionCodes from './ActionCodes';
import Database from '../utils/database';
import MokirimAPI from '../utils/MokirimAPI';

const updateAppStates = states => ({
  type: ActionCodes.UPDATE_APP_STATES,
  states,
});

const updateAPIVValue = () => ({
  type: ActionCodes.UPDATE_API_V_VALUE,
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

const loggedInToFacebook = (languageCode, facebookAccessToken, v) => dispatch => {
  dispatch(_loggedInToFacebook(facebookAccessToken));

  Database.openDatabase().then(db => {
    return Database.updateUserStates(db, {
      loggedIn: "1", loggedInVia: "facebook", facebookAccessToken,
    });
  });

  return MokirimAPI.loginWithFacebook(languageCode, facebookAccessToken, {v}).then(response => {
    const responseClone = response.clone();
    if (responseClone.ok) {
      responseClone.json().then(obj => {
        Database.openDatabase().then(db => {
          return Database.updateUserStates(db, {
            accessToken: obj.token,
            email: obj.fb.email,
            name: obj.fb.name,
          });
        });

        dispatch(updateAppStates({accessToken: obj.token, email: obj.fb.email, name: obj.fb.name}));
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
      loggedIn: "1", loggedInVia: "mokirim", accessToken,
    });
  });
}

const _logout = () => ({
  type: ActionCodes.LOGOUT,
});

const logout = (languageCode, accessToken, via, v) => dispatch => {
  dispatch(_logout());

  Database.openDatabase().then(db => {
    return Database.updateUserStates(db, {
      loggedIn: undefined, loggedInVia: undefined, facebookAccessToken: undefined,
      googleAccessToken: undefined,
      introFinished: undefined, encodedUserId: undefined, accessToken: undefined,
      email: undefined,
    });
  });

  MokirimAPI.logout(languageCode, accessToken, {v});
}

const downloadMasterData = (languageCode, accessToken, v) => dispatch => {
  Database.openDatabase().then(db => {
    const postalCodePromise = MokirimAPI.getPostalCode(languageCode, accessToken, null, {limit: 1000, v});
    const subdistrictPromise = MokirimAPI.getSubdistrict(languageCode, accessToken, null, {limit: 1000, v});
    const districtPromise = MokirimAPI.getDistrict(languageCode, accessToken, null, {limit: 1000, v});
    const cityPromise = MokirimAPI.getCity(languageCode, accessToken, null, {limit: 1000, v});
    const statePromise = MokirimAPI.getState(languageCode, accessToken, null, {limit: 1000, v});

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

const loadAppStatesFromDb = (appStates, delay, v) => dispatch => {
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
        } else if (name === 'name') {
          states.name = value;
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
        } else if (name === 'profileId') {
          states.editProfileForm.id = parseInt(value, 10);
        } else if (name === 'profileName') {
          states.editProfileForm.name = value;
        } else if (name === 'profileEmail') {
          states.editProfileForm.email = value;
        } else if (name === 'profilePhone') {
          states.editProfileForm.phone = value;
        } else if (name === 'profileAddress') {
          states.editProfileForm.address = parseInt(value, 10);
        }
      }
      dispatch(updateAppStates(states));

      if (states.device.id) {
        return new Promise((resolve, reject) => resolve());
      }

      states.device.id = uuid.v4();
      return MokirimAPI.registerDevice(states.currentLanguage, states.device.id, {v}).then(response => {
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

const submitLoginForm = (languageCode, username, password, v) => dispatch => {
  dispatch(_submitLoginForm(true));
  return MokirimAPI.login(languageCode, username, password, {v}).then(response => {
    Database.openDatabase().then(db => {
       return Database.updateUserStates(db, {
         email: username,
       });
    });

    dispatch(updateAppStates({email: username}));

    const responseClone = response.clone();
    if (responseClone.ok) {
      responseClone.json().then(obj => {
        dispatch(loggedInToMokirim(obj.token));
      });
    }
    return response;
  }).finally(() => {
    dispatch(_submitLoginForm(false));
  });
}

const _loggedInToGoogle = accessToken => ({
  type: ActionCodes.LOGGED_IN_TO_GOOGLE,
  accessToken,
});

const pressGoogleLogin = (languageCode, v) => dispatch => {
  return GoogleSignin.hasPlayServices().then(() => GoogleSignin.signIn()).then(userInfo => {
    return GoogleSignin.getTokens().then(tokens => {
      dispatch(_loggedInToGoogle(tokens.accessToken));

       Database.openDatabase().then(db => {
         return Database.updateUserStates(db, {
           loggedIn: "1", loggedInVia: "google", googleAccessToken: tokens.accessToken,
         });
       });

       return MokirimAPI.loginWithGoogle(languageCode, tokens.accessToken, {v}).then(response => {
         const responseClone = response.clone();
         if (responseClone.ok) {
           responseClone.json().then(obj => {
             Database.openDatabase().then(db => {
               return Database.updateUserStates(db, {
                 accessToken: obj.token,
                 email: userInfo.user.email,
               });
             });

             dispatch(updateAppStates({accessToken: obj.token, email: userInfo.user.email}));
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

const submitRegisterForm = (languageCode, username, password, v) => dispatch => {
  dispatch(_submitRegisterForm(true));
  return MokirimAPI.register(languageCode, username, password, {v}).then(response => {
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

const submitActivateForm = (languageCode, encodedUserId, code, v) => dispatch => {
  dispatch(_submitRegisterForm(true));
  return MokirimAPI.activate(languageCode, encodedUserId, code.toUpperCase(), {v}).then(response => {
     if (response.ok) {
       dispatch(setActivateFormErrorCode(false));
       dispatch(setActivateFormCode(''));

       if (response.status === 204) {
         Database.openDatabase().then(db => {
           return Database.updateUserStates(db, {
             encodedUserId: undefined,
             email: undefined,
           });
         });

         dispatch(updateAppStates({encodedUserId: null, email: null}));
       } else {
          const responseClone = response.clone();
          responseClone.json().then(obj => {
             dispatch(loggedInToMokirim(obj.token));
          });
       }

       return response;
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

const submitResetPasswordForm = (languageCode, email, v) => dispatch => {
  dispatch(_submitResetPasswordForm(true));
  return MokirimAPI.resetPassword(languageCode, email, {v}).then(response => {
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

const submitConfirmPasswordResetForm = (languageCode, encodedUserId, code, newPassword, v) => dispatch => {
  dispatch(_submitConfirmPasswordResetForm(true));
  return MokirimAPI.confirmPasswordReset(languageCode, encodedUserId, code.toUpperCase(), newPassword, {v}).then(response => {
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

const setUserProfile = profile => ({
  type: ActionCodes.SET_USER_PROFILE,
  profile,
});

const setUserProfileError = error => ({
  type: ActionCodes.SET_USER_PROFILE_ERROR,
  error,
});

const _loadUserProfile = (dispatch, languageCode, accessToken, v) => {
  return MokirimAPI.getProfile(languageCode, accessToken, undefined, {v}).then(response => {
    if (response.ok) {
      return response.json().then(obj => {
        if (obj.count < 1) {
          return {};
        }
        const profile = obj.results[0];
        dispatch(setUserProfile(profile));
        Database.openDatabase().then(db => {
          return Database.updateUserStates(db, {
            profileId: profile.id,
            profileName: profile.name, profileEmail: profile.email, profilePhone: profile.phone,
            ...(profile.address ? {profileAddress: String(profile.address)} : {})
          });
        });

        return profile;
      });
    } else {
      return {};
    }
  }).catch(error => {
    return {};
  });
};

const loadUserProfile = (languageCode, accessToken, profile) => dispatch => {
  if (profile.id) {
    return new Promise((resolve, reject) => {
      resolve(profile);
      _loadUserProfile(dispatch, languageCode, accessToken);
    });
  } else {
    return _loadUserProfile(dispatch, languageCode, accessToken);
  }
};

const submitEditProfileForm = (languageCode, accessToken, profile, v) => dispatch => new Promise((resolveProfile, rejectProfile) => {
  let errors = {};
  if (!profile.name) {
     errors.name = [translate("errorFieldMayNotBeNull")];
  }
  if (!profile.email) {
    errors.email = [translate("errorFieldMayNotBeNull")];
  }
  if (!profile.phone) {
    errors.phone = [translate("errorFieldMayNotBeNull")];
  }
  if (!profile.address.name) {
    errors.address = [translate("errorFieldMayNotBeNull")];
  }
  if (!profile.address.subdistrict) {
     errors.subdistrict = [translate("errorFieldMayNotBeNull")];
  }
  if (profile.newPassword !== profile.retypeNewPassword) {
    errors.new_password = [translate("errorPasswordsDoesNotMatch")];
  }
  if (!profile.id && !profile.newPassword && !profile.retypeNewPassword) {
    errors.new_password = [translate("errorUsersMustCreatePassword")];
  }

  if (profile.id && profile.currentPassword && !profile.newPassword && !profile.retypePassword) {
    errors.new_password = [translate("errorUsersMustCreatePassword")];
  }

  const passwordPromise = new Promise((resolvePassword, rejectPassword) => {
    if (Object.keys(errors).length > 0) {
       rejectPassword(errors);
       return;
    }

    if (profile.id && !profile.currentPassword && !profile.newPassword && !profile.retypePassword) {
      resolvePassword();
      return;
    }

    MokirimAPI.setPassword(languageCode, accessToken, profile.newPassword, profile.currentPassword, {v}).then(response => {
      if (response.ok) {
        resolvePassword();
      } else {
        response.json().then(obj => {
          rejectPassword({...errors, ...obj});
        });
      }
    }).catch(error => {
      rejectPassword(error);
    });
  });

  const addressPromise = new Promise((resolveAddress, rejectAddress) => {
       let address = profile.address;
       delete(address.id);
       MokirimAPI.postAddress(languageCode, accessToken, address, {v}).then(response => {
         if (response.ok) {
           response.json().then(obj => {
             dispatch(setUserProfile({address: obj.id}));
             Database.openDatabase().then(db => {
               return Database.updateUserStates(db, {
                 profileAddress: String(obj.id),
               });
             });

             resolveAddress(obj.id);
           });
         } else {
           response.json().then(obj => {
             let adaptedObj = {...obj};
             Object.keys(obj).filter(key => key === 'name').forEach(key => {
               adaptedObj['address'] = adaptedObj.name;
               delete(adaptedObj.name);
             });
             rejectAddress({...errors, ...adaptedObj});
           });
         }
       }).catch(error => {
         rejectAddress(error);
       });
  });

  passwordPromise.then(() => {
    addressPromise.then(addressId => {
       if (Object.keys(errors).length > 0) {
         rejectProfile(errors);
         return;
       }

       const serverProfile = {...profile, address: addressId};
       MokirimAPI.postProfile(languageCode, accessToken, serverProfile, {v}).then(response => {
         if (response.ok) {
           response.json().then(obj => {
             resolveProfile(obj);

             dispatch(setUserProfile(obj));
             Database.openDatabase().then(db => {
               return Database.updateUserStates(db, {
                 profileId: String(obj.id),
                 profileName: obj.name,
                 profileEmail: obj.email,
                 profilePhone: obj.phone,
               });
             });
           });
         } else {
           response.json().then(obj => {
             rejectProfile(obj);
           });
         }
       }).catch(error => {
         rejectProfile(error);
       });
    }).catch(error => {
      rejectProfile(error);
    });
  }).catch(error => {
    rejectProfile(error);
  });
});

const setFindScheduleForm = form => ({
  type: ActionCodes.SET_FIND_SCHEDULE_FORM,
  form,
});

const setFindScheduleFormError = error => ({
  type: ActionCodes.SET_FIND_SCHEDULE_FORM_ERROR,
  error,
});

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

const cleanupColli = () => ({
  type: ActionCodes.CLEANUP_COLLI,
});

const _searchStations = searching => ({
  type: ActionCodes.SEARCH_STATIONS,
  searching,
});

const searchStations = (languageCode, accessToken, type, text, v) => dispatch => {
  dispatch(_searchStations(true));
  return MokirimAPI.searchStations(languageCode, accessToken, type, text, {v}).then(response => {
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
                  texts = [...texts, ...obj[key].map(text => (key + ": " + text))];
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

const searchSubdistricts = (languageCode, accessToken,  text, config) => dispatch => {
  dispatch(setSearchSubdistrictForm({searching: true}));
  return MokirimAPI.searchSubdistricts(languageCode, accessToken, text, config).then(response => {
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
                  texts = [...texts, ...obj[key].map(text => (key + ": " + text))];
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
    dispatch(setSearchSubdistrictForm({searching: false}));
  });
};

const setSearchSubdistrictForm = form => ({
  type: ActionCodes.SET_SEARCH_SUBDISTRICT_FORM,
  form,
});

const findSchedule = (
  languageCode, accessToken, originatingStation, destinationStation, departureDate,
  totalWeight, totalVolume, v
) => dispatch => {
  return new Promise((resolveSchedule, rejectSchedule) => {
    let errors = {};
    if (!originatingStation) {
      errors.originatingStation = [translate("errorFieldMayNotBeNull")];
    }
    if (!destinationStation) {
      errors.destinationStation = [translate("errorFieldMayNotBeNull")];
    }
    if (!departureDate) {
      errors.departureDate = [translate("errorFieldMayNotBeNull")];
    }
    if (Object.keys(errors).length > 0) {
      rejectSchedule(errors);
    }
    MokirimAPI.getSchedule(
       languageCode, accessToken, originatingStation, destinationStation, departureDate,
       totalWeight, totalVolume, {v}
    ).then(response => {
      resolveSchedule(response);
    }).catch(error => {
      rejectSchedule(error);
    });
  });
};

const setAvailableSchedules = schedules => ({
  type: ActionCodes.SET_AVAILABLE_SCHEDULES,
  schedules,
});

const addAvailableSchedules = schedules => ({
  type: ActionCodes.ADD_AVAILABLE_SCHEDULES,
  schedules,
});

const setMoreSchedulesURL = url => ({
  type: ActionCodes.SET_MORE_SCHEDULES_URL,
  url,
});

const chooseSchedule = schedule => ({
  type: ActionCodes.CHOOSE_SCHEDULE,
  schedule,
});

const setShipmentDetailsForm = form => ({
  type: ActionCodes.SET_SHIPMENT_DETAILS_FORM,
  form,
});

const setShipmentDetailsFormSender = sender => ({
  type: ActionCodes.SET_SHIPMENT_DETAILS_FORM_SENDER,
  sender,
});

const setShipmentDetailsFormSenderError = error => ({
  type: ActionCodes.SET_SHIPMENT_DETAILS_FORM_SENDER_ERROR,
  error,
});

const setShipmentDetailsFormReceiver = receiver => ({
  type: ActionCodes.SET_SHIPMENT_DETAILS_FORM_RECEIVER,
  receiver,
});

const setShipmentDetailsFormReceiverError = error => ({
  type: ActionCodes.SET_SHIPMENT_DETAILS_FORM_RECEIVER_ERROR,
  error,
});

const setShipmentDetailsFormContent = content => ({
  type: ActionCodes.SET_SHIPMENT_DETAILS_FORM_CONTENT,
  content,
});

const setShipmentDetailsFormContentError = error => ({
  type: ActionCodes.SET_SHIPMENT_DETAILS_FORM_CONTENT_ERROR,
  error,
});

const setBookingDetailsForm = form => ({
  type: ActionCodes.SET_BOOKING_DETAILS_FORM,
  form,
});

const loadBookings = (languageCode, accessToken, config) => dispatch => {
  return new Promise((resolveBookings, rejectBookings) => {
    MokirimAPI.getBooking(
      languageCode, accessToken, config
    ).then(response => {
      if (response.ok) {
        response.json().then(obj => {
          resolveBookings(obj);
        })
      } else {
        response.json().then(obj => {
          let texts = [];
          if (Array.isArray(obj)) {
            texts = [...texts, ...obj];
          } else {
            Object.keys(obj).forEach(key => {
              texts = [...texts, ...obj[key].map(text => (key + ": " + text))];
            });
          }
          rejectBookings(texts.join('\n'));
        });
      }
    }).catch(error => {
      rejectBookings(error);
    });
  });
};

const setBookings = bookings => ({
  type: ActionCodes.SET_BOOKINGS,
  bookings,
});

const setShipmentsForm = form => ({
  type: ActionCodes.SET_SHIPMENTS_FORM,
  form,
});

const submitCreateBookingForm = (languageCode, accessToken, booking, v) => dispatch => {
  return new Promise((resolveBooking, rejectBooking) => {
    MokirimAPI.postBooking(
       languageCode, accessToken, booking, {v}
    ).then(response => {
       if (response.ok) {
         response.json().then(obj => {
           resolveBooking(obj);
         })
       } else {
         response.json().then(obj => {
           let texts = [];
           if (Array.isArray(obj)) {
             texts = [...texts, ...obj];
           } else {
             Object.keys(obj).forEach(key => {
               texts = [...texts, ...obj[key].map(text => (key + ": " + text))];
             });
           }
           rejectBooking(texts.join('\n'));
         });
       }
    }).catch(error => {
       rejectBooking(error);
    });
  });
};

const setMoneyTransferConfirmationForm = form => ({
  type: ActionCodes.SET_MONEY_TRANSFER_CONFIRMATION_FORM,
  form,
});

const submitConfirmBookingPaymentForm = (languageCode, accessToken, data) => dispatch => {
  return new Promise((resolveBooking, rejectBooking) => {
    MokirimAPI.postBookingPaymentConfirm(
       languageCode, accessToken, data
    ).then(response => {
       if (response.ok) {
         response.json().then(obj => {
           resolveBooking(obj);
         })
       } else {
         response.json().then(obj => {
           let texts = [];
           if (Array.isArray(obj)) {
             texts = [...texts, ...obj];
           } else {
             Object.keys(obj).forEach(key => {
               texts = [...texts, ...obj[key].map(text => (key + ": " + text))];
             });
           }
           rejectBooking(texts.join('\n'));
         });
       }
    }).catch(error => {
       rejectBooking(error);
    });
  });
};

export default Actions = {
  updateAppStates,
  updateAPIVValue,

  setErrorMessage,
  introFinished,
  setCurrentLanguage,
  loggedInToFacebook,
  logout,
  downloadMasterData,
  loadAppStatesFromDb,

  setLoginFormUsername,
  setLoginFormPassword,
  setLoginFormErrorUsername,
  setLoginFormErrorPassword,
  submitLoginForm,
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

  setUserProfile,
  setUserProfileError,
  loadUserProfile,
  submitEditProfileForm,

  setFindScheduleForm,
  setFindScheduleFormError,
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
  cleanupColli,

  searchStations,
  downloadStationDetails,

  searchSubdistricts,
  setSearchSubdistrictForm,

  findSchedule,

  setAvailableSchedules,
  addAvailableSchedules,
  setMoreSchedulesURL,
  chooseSchedule,

  setShipmentDetailsForm,
  setShipmentDetailsFormSender,
  setShipmentDetailsFormSenderError,
  setShipmentDetailsFormReceiver,
  setShipmentDetailsFormReceiverError,
  setShipmentDetailsFormContent,
  setShipmentDetailsFormContentError,

  setBookingDetailsForm,

  loadBookings,
  setBookings,
  setShipmentsForm,
  submitCreateBookingForm,

  setMoneyTransferConfirmationForm,
  submitConfirmBookingPaymentForm,
}
