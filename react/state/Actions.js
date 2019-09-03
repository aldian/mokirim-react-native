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
            accessToken: obj.accessToken,
          });
        });

        dispatch(updateAppStates({accessToken: obj.accessToken}));
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
      introFinished: undefined, accessToken: undefined,
    });
  });

  MokirimAPI.logout(languageCode, accessToken);
}

const loadAppStatesFromDb = (appStates, navigate, delay) => dispatch => {
  dispatch(updateAppStates({loadingStatesFromDb: true}));

  Database.openDatabase().then(db => {
    return Database.loadUserStates(db).then(rows => {
      let states = {...appStates, loadingStatesFromDb: false, statesLoadedFromDb: true};
      const len = rows.length;
      for (let i = 0; i < len; ++i) {
        let row = rows.item(i);
        const name = row.name;
        const value = row.value;
        if (name === 'loggedIn') {
          states.loggedIn = !!parseInt(value, 10);
        } else if (name === 'loggedInVia') {
          states.loggedInVia = value;
        } else if (name === 'accessToken') {
          states.accessToken = value;
        } else if (name === 'facebookAccessToken') {
          states.facebook.accessToken = value;
        } else if (name == 'introFinished') {
          states.introFinished = !!parseInt(value, 10);
        }
      }
      dispatch(updateAppStates(states));
      if (!navigate) {
        return;
      }
      let nextScreen = 'Home';
      if (states.loggedIn) {
        nextScreen = 'Dashboard';
      } else if (!states.introFinished) {
        nextScreen = 'IntroWhy';
      }
      if (delay) {
        setTimeout(() => navigate(nextScreen), delay);
      } else {
        navigate(nextScreen);
      }
    });
  });
}

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

export default Actions = {
  setErrorMessage,
  introFinished,
  setCurrentLanguage,
  loggedInToFacebook,
  loggedInToMokirim,
  logout,
  loadAppStatesFromDb,
  setLoginFormUsername,
  setLoginFormPassword,
  setLoginFormErrorUsername,
  setLoginFormErrorPassword,
  submitLoginForm,
  loginFormSubmitted,
}
