import I18n from "i18n-js";
import { I18nManager } from "react-native";
import * as RNLocalize from "react-native-localize";
import memoize from "lodash.memoize";

import en from "../locales/en";
import id from "../locales/id";

export const translate = memoize(
  (key, config) => {
    return I18n.t(key, config);
  },
  (key, config) => {
    return (config ? key + JSON.stringify(config) : key);
  },
);
//export const translate = key => I18n.t(key);

export const setI18nConfig = () => {
  const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(['en', 'id']);

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);

  I18n.translations = {en, id};
  I18n.locale = languageTag;
};
