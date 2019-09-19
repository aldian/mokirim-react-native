import qs from 'query-string';

const BASE_URL = "https://mokirim.aldianfazrihady.com/";
const CONTENT_TYPE_URL_ENCODED = 'application/x-www-form-urlencoded';
const DEVICE_PATH = "/api/device/";

const LOGIN_PATH = "/api/login/";
const LOGOUT_PATH = "/api/logout/";
const LOGIN_FACEBOOK_PATH = "/api/login/facebook/";
const LOGIN_GOOGLE_PATH = "/api/login/google/";

const REGISTER_PATH = "/auth/users/";
const ACTIVATE_PATH = "/auth/users/activation/";

const RESET_PASSWORD_PATH = "/auth/users/reset_password/";
const CONFIRM_PASSWORD_RESET_PATH = "/auth/users/reset_password_confirm/";

const GET_SUBDISTRICT = "/api/subdistrict/";
const GET_DISTRICT = "/api/district/";
const GET_CITY = "/api/city/";
const GET_STATE = "/api/state/";
const GET_POSTAL_CODE = "/api/postal_code/";

const SEARCH_STATIONS = "/api/stations/";

const DEFAULT_CONFIG = {
  baseUrl: BASE_URL,
  offset: 0,
  limit: 1000,
};

const registerDevice = (languageCode, deviceId) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Referer': BASE_URL,
      'Content-Type': CONTENT_TYPE_URL_ENCODED,
    },
    body: qs.stringify({deviceId}),
  };

  return fetch(BASE_URL + languageCode + DEVICE_PATH, requestOptions);
}

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

const register = (languageCode, username, password) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Referer': BASE_URL,
      'Content-Type': CONTENT_TYPE_URL_ENCODED,
    },
    body: qs.stringify({username, password, email: username}),
  };

  return fetch(BASE_URL + languageCode + REGISTER_PATH, requestOptions);
};

const activate = (languageCode, encodedUserId, activationCode) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Referer': BASE_URL,
      'Content-Type': CONTENT_TYPE_URL_ENCODED,
    },
    body: qs.stringify({uid: encodedUserId, token: activationCode}),
  };

  return fetch(BASE_URL + languageCode + ACTIVATE_PATH, requestOptions);
};

const resetPassword = (languageCode, email) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Referer': BASE_URL,
      'Content-Type': CONTENT_TYPE_URL_ENCODED,
    },
    body: qs.stringify({email}),
  };

  return fetch(BASE_URL + languageCode + RESET_PASSWORD_PATH, requestOptions);
};

const confirmPasswordReset = (languageCode, encodedUserId, activationCode, newPassword) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Referer': BASE_URL,
      'Content-Type': CONTENT_TYPE_URL_ENCODED,
    },
    body: qs.stringify({uid: encodedUserId, token: activationCode, new_password: newPassword}),
  };

  return fetch(BASE_URL + languageCode + CONFIRM_PASSWORD_RESET_PATH, requestOptions);
};

const get = (url, accessToken, config = null) => {
  if (config) {
    config = {...DEFAULT_CONFIG, ...config};
  } else {
    config = DEFAULT_CONFIG;
  }

  const requestOptions = {
    method: 'GET',
    headers: {
      Referer: config.baseUrl,
      Authorization: 'Token ' + accessToken,
    },
  };

  return fetch(url, requestOptions);
};

const getSubdistrict = (languageCode, accessToken, id, config = null) => {
  if (config) {
    config = {...DEFAULT_CONFIG, ...config};
  } else {
    config = DEFAULT_CONFIG;
  }

  const requestOptions = {
    method: 'GET',
    headers: {
      Referer: config.baseUrl,
      Authorization: 'Token ' + accessToken,
    },
  };

  const url = config.baseUrl + languageCode + GET_SUBDISTRICT + (id ? id + '/' : '') + '?' + qs.stringify({limit: config.limit, offset: config.offset});
  return fetch(url, requestOptions);
};

const getDistrict = (languageCode, accessToken, id, config = null) => {
  if (config) {
    config = {...DEFAULT_CONFIG, ...config};
  } else {
    config = DEFAULT_CONFIG;
  }

  const requestOptions = {
    method: 'GET',
    headers: {
      Referer: config.baseUrl,
      Authorization: 'Token ' + accessToken,
    },
  };

  const url = config.baseUrl + languageCode + GET_DISTRICT + (id ? id + '/': '') + '?' + qs.stringify({limit: config.limit, offset: config.offset});
  return fetch(url, requestOptions);
};

const getCity = (languageCode, accessToken, id, config = null) => {
  if (config) {
    config = {...DEFAULT_CONFIG, ...config};
  } else {
    config = DEFAULT_CONFIG;
  }

  const requestOptions = {
    method: 'GET',
    headers: {
      Referer: config.baseUrl,
      Authorization: 'Token ' + accessToken,
    },
  };

  const url = config.baseUrl + languageCode + GET_CITY + (id ? id + '/' : '') + '?' + qs.stringify({limit: config.limit, offset: config.offset});
  return fetch(url, requestOptions);
};

const getState = (languageCode, accessToken, id, config = null) => {
  if (config) {
    config = {...DEFAULT_CONFIG, ...config};
  } else {
    config = DEFAULT_CONFIG;
  }

  const requestOptions = {
    method: 'GET',
    headers: {
      Referer: config.baseUrl,
      Authorization: 'Token ' + accessToken,
    },
  };

  const url = config.baseUrl + languageCode + GET_STATE + (id ? id + '/' : '') + '?' + qs.stringify({limit: config.limit, offset: config.offset});
  return fetch(url, requestOptions);
};

const getPostalCode = (languageCode, accessToken, id, config = null) => {
  if (config) {
    config = {...DEFAULT_CONFIG, ...config};
  } else {
    config = DEFAULT_CONFIG;
  }

  const requestOptions = {
    method: 'GET',
    headers: {
      Referer: config.baseUrl,
      Authorization: 'Token ' + accessToken,
    },
  };

  const url = config.baseUrl + languageCode + GET_POSTAL_CODE + (id ? id + '/' : '') + '?' + qs.stringify({limit: config.limit, offset: config.offset});
  return fetch(url, requestOptions);
};

const searchStations = (languageCode, accessToken, type, text) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      Referer: BASE_URL,
      Authorization: 'Token ' + accessToken,
    },
  };

  const queryString = qs.stringify({type, text});

  return fetch(BASE_URL + languageCode + SEARCH_STATIONS + '?' + queryString, requestOptions);
};

export default {
  registerDevice,

  login,
  logout,
  loginWithFacebook,
  loginWithGoogle,

  register,
  activate,

  resetPassword,
  confirmPasswordReset,

  get,
  getSubdistrict,
  getDistrict,
  getCity,
  getState,
  getPostalCode,

  searchStations,
};
