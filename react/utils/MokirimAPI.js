import qs from 'query-string';

const CONTENT_TYPE_URL_ENCODED = 'application/x-www-form-urlencoded';
const BASE_URL = "https://mokirim.aldianfazrihady.com/";
const LOGIN_PATH = "/api/login/";
const LOGOUT_PATH = "/api/logout/";
const LOGIN_FACEBOOK_PATH = "/api/login/facebook/";
const LOGIN_GOOGLE_PATH = "/api/login/google/";

const login = (languageCode, username, password) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Referer': BASE_URL,
      'Content-Type': CONTENT_TYPE_URL_ENCODED,
    },
    body: qs.stringify({username, password}),
  };

  return fetch(BASE_URL + languageCode + LOGIN_PATH, requestOptions);
};

const logout = (languageCode, accessToken) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Referer': BASE_URL,
      'Content-Type': CONTENT_TYPE_URL_ENCODED,
      'Authorization': 'Token ' + accessToken,
    },
  };

  return fetch(BASE_URL + languageCode + LOGOUT_PATH, requestOptions);
};

const loginWithFacebook = (languageCode, fbAccessToken) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Referer': BASE_URL,
      'Content-Type': CONTENT_TYPE_URL_ENCODED,
    },
    body: qs.stringify({fbAccessToken}),
  };

  return fetch(BASE_URL + languageCode + LOGIN_FACEBOOK_PATH, requestOptions);
};

const loginWithGoogle = (languageCode, googleAccessToken) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Referer': BASE_URL,
      'Content-Type': CONTENT_TYPE_URL_ENCODED,
    },
    body: qs.stringify({googleAccessToken}),
  };

  return fetch(BASE_URL + languageCode + LOGIN_GOOGLE_PATH, requestOptions);
};

export default {
  login,
  logout,
  loginWithFacebook,
  loginWithGoogle,
};
