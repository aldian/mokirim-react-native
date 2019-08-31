import ActionCodes from './ActionCodes';
import Database from '../utils/database';

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

const _loggedInToFacebook = accessToken => ({
  type: ActionCodes.LOGGED_IN_TO_FACEBOOK,
  accessToken,
});

const loggedInToFacebook = accessToken => dispatch => {
  dispatch(_loggedInToFacebook(accessToken));

  return Database.openDatabase().then(db => {
    return Database.updateUserStates(db, {
      loggedIn: "1", loggedInVia: "facebook", facebookAccessToken: accessToken,
    });
  });
}

const _logout = () => ({
  type: ActionCodes.LOGOUT,
});

const logout = () => dispatch => {
  dispatch(_logout());

  return Database.openDatabase().then(db => {
    return Database.updateUserStates(db, {
      loggedIn: undefined, loggedInVia: undefined, facebookAccessToken: undefined,
    });
  });
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
        } else if (name === 'facebookAccessToken') {
          states.facebook.accessToken = value;
        }
      }
      dispatch(updateAppStates(states));
      if (!navigate) {
        return;
      }
      const nextScreen = states.loggedIn ? 'Dashboard' : 'Home';
      if (delay) {
        setTimeout(() => navigate(nextScreen), delay);
      } else {
        navigate(nextScreen);
      }
    });
  });
}

export default Actions = {
  setErrorMessage,
  setCurrentLanguage,
  loggedInToFacebook,
  logout,
  loadAppStatesFromDb,
}