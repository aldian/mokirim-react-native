import qs from 'query-string';

const CONTENT_TYPE_URL_ENCODED = 'application/x-www-form-urlencoded';
const BASE_URL = "https://mokirim.aldianfazrihady.com/";
const LOGIN_PATH = "/api/login/";
const LOGOUT_PATH = "/api/logout/";

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

export default {
  login,
  logout,
};
