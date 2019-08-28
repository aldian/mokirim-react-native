import ActionCodes from './ActionCodes';

const setErrorMessage = message => ({
  type: ActionCodes.SET_ERROR_MESSAGE,
  message,
});

const loggedInToFacebook = accessToken => ({
  type: ActionCodes.LOGGED_IN_TO_FACEBOOK,
  accessToken,
});

const logout = () => ({
  type: ActionCodes.LOGOUT,
});

export default Actions = {
  setErrorMessage,
  loggedInToFacebook,
  logout,
}