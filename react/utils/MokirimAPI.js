import moment from 'moment';
import qs from 'query-string';

const BASE_URL = "https://mokirim.aldianfazrihady.com/";
const CONTENT_TYPE_URL_ENCODED = 'application/x-www-form-urlencoded';
const CONTENT_TYPE_JSON = 'application/json';
const CONTENT_TYPE_MULTIPART = 'multipart/form-data';
const DEVICE_PATH = "/api/device/";

const LOGIN_PATH = "/api/login/";
const LOGOUT_PATH = "/api/logout/";
const LOGIN_FACEBOOK_PATH = "/api/login/facebook/";
const LOGIN_GOOGLE_PATH = "/api/login/google/";

const REGISTER_PATH = "/auth/users/";
const ACTIVATE_PATH = "/auth/users/activation/";

const RESET_PASSWORD_PATH = "/auth/users/reset_password/";
const CONFIRM_PASSWORD_RESET_PATH = "/auth/users/reset_password_confirm/";
const SET_PASSWORD_PATH = "/auth/users/set_password/";

const GET_PROFILE_PATH = "/api/person/";
const POST_PROFILE_PATH = "/api/person/";

const GET_ADDRESS_PATH = "/api/address/";
const GET_SUBDISTRICT_PATH = "/api/subdistrict/";
const GET_DISTRICT_PATH = "/api/district/";
const GET_CITY_PATH = "/api/city/";
const GET_STATE_PATH = "/api/state/";
const GET_POSTAL_CODE_PATH = "/api/postal_code/";

const POST_ADDRESS_PATH = "/api/address/";

const SEARCH_STATIONS_PATH = "/api/station/";
const SEARCH_SUBDISTRICTS_PATH = "/api/subdistrict/";

const GET_SCHEDULE_PATH = "/api/schedule/";
const GET_BOOKING_PATH = "/api/booking/";
const POST_BOOKING_PATH = "/api/booking/";

const POST_BOOKING_PAYMENT_CONFIRM = "/api/booking/payment/confirm/";

const DEFAULT_CONFIG = {
  baseUrl: BASE_URL,
  offset: 0,
  limit: 50,
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

const setPassword = (languageCode, accessToken, newPassword, currentPassword = '') => {
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Token ' + accessToken,
      'Content-Type': CONTENT_TYPE_URL_ENCODED,
    },
    body: qs.stringify({new_password: newPassword, current_password: currentPassword}),
  };
  const url = BASE_URL + languageCode + SET_PASSWORD_PATH;
  return fetch(url, requestOptions);
};

const getProfile = (languageCode, accessToken, id, config = null) => {
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

  const url = config.baseUrl + languageCode + GET_PROFILE_PATH + (id ? id + '/' : '') + '?' + qs.stringify({limit: config.limit, offset: config.offset, v: config.v || ''});
  return fetch(url, requestOptions);
};

const postProfile = (languageCode, accessToken, profile, config = null) => {
  if (config) {
    config = {...DEFAULT_CONFIG, ...config};
  } else {
    config = DEFAULT_CONFIG;
  }

  let serverProfile = {...profile};
  delete(serverProfile.id);
  delete(serverProfile.submitting);
  delete(serverProfile.errors);

  const requestOptions = {
    method: profile.id ? 'PATCH' : 'POST',
    headers: {
      Referer: config.baseUrl,
      'Content-Type': CONTENT_TYPE_URL_ENCODED,
      Authorization: 'Token ' + accessToken,
    },
    body: qs.stringify(serverProfile),
  };

  return fetch(config.baseUrl + languageCode + POST_PROFILE_PATH + (profile.id ? profile.id + '/' : ''), requestOptions);
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

const getAddress = (languageCode, accessToken, id, config = null) => {
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

  const url = config.baseUrl + languageCode + GET_ADDRESS_PATH + (id ? id + '/' : '') + '?' + qs.stringify({limit: config.limit, offset: config.offset, v: config.v || ''});
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

  const url = config.baseUrl + languageCode + GET_SUBDISTRICT_PATH + (id ? id + '/' : '') + '?' + qs.stringify({limit: config.limit, offset: config.offset, v: config.v || ''});
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

  const url = config.baseUrl + languageCode + GET_DISTRICT_PATH + (id ? id + '/': '') + '?' + qs.stringify({limit: config.limit, offset: config.offset, v: config.v || ''});
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

  const url = config.baseUrl + languageCode + GET_CITY_PATH + (id ? id + '/' : '') + '?' + qs.stringify({limit: config.limit, offset: config.offset, v: config.v || ''});
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

  const url = config.baseUrl + languageCode + GET_STATE_PATH + (id ? id + '/' : '') + '?' + qs.stringify({limit: config.limit, offset: config.offset, v: config.v || ''});
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

  const queryString = qs.stringify(config);
  const url = config.baseUrl + languageCode + GET_POSTAL_CODE_PATH + (id ? id + '/' : '') + '?' + queryString;
  return fetch(url, requestOptions);
};

const postAddress = (languageCode, accessToken, address, config = null) => {
  if (config) {
    config = {...DEFAULT_CONFIG, ...config};
  } else {
    config = DEFAULT_CONFIG;
  }
  let serverAddress = {...address};
  if (address.postalCode) {
    serverAddress.postal_code = address.postalCode;
    delete(serverAddress.postalCode);
  }
  delete(serverAddress.id);

  const requestOptions = {
    method: address.id ? 'PATCH' : 'POST',
    headers: {
      Authorization: 'Token ' + accessToken,
      'Content-Type': CONTENT_TYPE_URL_ENCODED,
    },
    body: qs.stringify(serverAddress),
  };

  return fetch(config.baseUrl + languageCode + POST_ADDRESS_PATH + (address.id ? address.id + '/' : ''), requestOptions);
};

const searchStations = (languageCode, accessToken, type, text) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      Referer: BASE_URL,
      Authorization: 'Token ' + accessToken,
    },
  };

  const queryString = qs.stringify({type, search: text});

  return fetch(BASE_URL + languageCode + SEARCH_STATIONS_PATH + '?' + queryString, requestOptions);
};

const searchSubdistricts = (languageCode, accessToken, text, config = null) => {
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

  const queryString = qs.stringify({search: text, limit: config.limit, offset: config.offset, v: config.v || ''});

  return fetch(config.baseUrl + languageCode + SEARCH_SUBDISTRICTS_PATH + '?' + queryString, requestOptions);
};

const getSchedule = (
  languageCode, accessToken, originatingStation, destinationStation, departureDate,
  totalWeight, totalVolume, config = null
) => {
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

  const nowDate = new Date();
  const departureDateOriginal = departureDate;
  if (departureDate < nowDate) {
    departureDate = nowDate;
  }

  const startDateStr = departureDate.toISOString().replace(/(\d)T(\d)/, "$1 $2").replace(/\D+$/, "");
  const endDateStr = moment(departureDateOriginal).add(1, 'days').toDate().toISOString().replace(/(\d)T(\d)/, "$1 $2").replace(/\D+$/, "");

  const queryString = qs.stringify({
    min_datetime: startDateStr, max_datetime: endDateStr,
    from_place: originatingStation, to_place: destinationStation,
    weight_kg: totalWeight,
    volume_cm3: totalVolume,
    limit: config.limit, offset: config.offset,
    v: config.v || '',
  });

  return fetch(config.baseUrl + languageCode + GET_SCHEDULE_PATH + '?' + queryString, requestOptions);
};

const postBooking = (
  languageCode, accessToken,
  booking,
  config = null
) => {
  if (config) {
    config = {...DEFAULT_CONFIG, ...config};
  } else {
    config = DEFAULT_CONFIG;
  }

  let colli = (booking.colli || []).map((collo, i) => ({
    weight_kg: collo.weight || 0,
    length_cm: collo.length || 0, width_cm: collo.width || 0, height_cm: collo.height || 0,
    code: String(i+1),
  }));
  let fromPerson = {...booking.from_person}
  let toPerson = {...booking.to_person}
  let serverBooking = {...booking, colli, from_person: fromPerson, to_person: toPerson};
  delete(serverBooking.id);
  if (serverBooking.from_person && serverBooking.from_person.errors) {
    delete(serverBooking.from_person.errors);
  }
  if (serverBooking.to_person && serverBooking.to_person.errors) {
    delete(serverBooking.to_person.errors);
  }

  const requestOptions = {
    method: booking.id ? 'PATCH' : 'POST',
    headers: {
      Referer: config.baseUrl,
      'Content-Type': CONTENT_TYPE_JSON,
      Authorization: 'Token ' + accessToken,
    },
    body: JSON.stringify(serverBooking),
  };

  return fetch(config.baseUrl + languageCode + POST_BOOKING_PATH + (booking.id ? booking.id + '/' : ''), requestOptions);
};

const getBooking = (
  languageCode, accessToken,
  config = null
) => {
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

  let queryObj = {
    limit: config.limit, offset: config.offset,
  }
  if (config.v) {
    queryObj.v = config.v;
  }
  if (config.ordering) {
    queryObj.ordering = config.ordering;
  }

  const queryString = qs.stringify(queryObj);

  return fetch(config.baseUrl + languageCode + GET_BOOKING_PATH + '?' + queryString, requestOptions);
};

const postBookingPaymentConfirm = (
  languageCode, accessToken,
  data,
  config = null
) => {
  if (config) {
    config = {...DEFAULT_CONFIG, ...config};
  } else {
    config = DEFAULT_CONFIG;
  }

  const formData  = new FormData();

  for(const name in data) {
    formData.append(name, data[name]);
  }

  const requestOptions = {
    method: 'POST',
    headers: {
       Referer: config.baseUrl,
       Authorization: 'Token ' + accessToken,
    },
    body: formData,
  };

  return fetch(config.baseUrl + languageCode + POST_BOOKING_PAYMENT_CONFIRM, requestOptions);
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
  setPassword,

  getProfile,
  postProfile,

  get,
  getAddress,
  getSubdistrict,
  getDistrict,
  getCity,
  getState,
  getPostalCode,

  postAddress,

  searchStations,
  searchSubdistricts,

  getSchedule,

  postBooking,
  getBooking,

  postBookingPaymentConfirm,
};
