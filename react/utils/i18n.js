import I18n from "i18n-js";
import { I18nManager } from "react-native";
import * as RNLocalize from "react-native-localize";
import memoize from "lodash.memoize";
import moment from "moment";

import en from "../locales/en";
import id from "../locales/id";

import Actions from '../state/Actions';

export const translate = memoize(
  (key, config) => {
    return I18n.t(key, config);
  },
  (key, config) => {
    return (config ? key + JSON.stringify(config) : key);
  },
);

export const setI18nConfig = () => {
  const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(['en', 'id']);

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);

  I18n.translations = {en, id};
  I18n.locale = languageTag;
  moment.locale(languageTag);
  return languageTag;
};

export const initI18n = stateStore => {
  const languageTag = setI18nConfig();

  RNLocalize.addEventListener("change", () => {
    const languageTag = setI18nConfig();
    stateStore.dispatch(Actions.setCurrentLanguage(languageTag));
  });

  stateStore.dispatch(Actions.setCurrentLanguage(languageTag));
};

export const getDateDisplayString = (isoDateTime, deltaMinutes) => {
  return moment(isoDateTime).add(deltaMinutes, 'minutes').format('ddd, ll');
};

export const getTimeDisplayString = (isoDateTime, deltaMinutes) => {
  return moment(isoDateTime).add(deltaMinutes, 'minutes').format('HH:mm');
};

export const getStartingDayDate = () => {
  let m = moment(new Date());
  m = m.subtract(m.milliseconds(), 'milliseconds');
  m = m.subtract(m.seconds(), 'seconds');
  m = m.subtract(m.minutes(), 'minutes');
  m = m.subtract(m.hours(), 'hours');
  return m.toDate();
};

export const moneyStr = (languageCode, value) => {
    return Intl.NumberFormat(languageCode, {style: 'currency', currency: 'IDR', currencyDisplay: 'symbol', minimumFractionDigits: 0, maximumFractionDigits: 0}).format(value);
};

export const numberStr = (languageCode, value) => {
  return Intl.NumberFormat(languageCode, {style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0}).format(value);
};

