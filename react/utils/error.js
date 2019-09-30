import {
  Toast,
} from 'native-base';
import { translate } from "./i18n";


const toastError = error => {
  return new Promise((resolve, reject) => {
    let keys = [];
    if (typeof(error) === 'object') {
       let errors = [];
       Object.keys(error).forEach(key => {
         const value = error[key];
         if (typeof(key) === 'number') {
           errors = [...errors, value];
         } else {
           keys.push(key);
           if (typeof(value) === 'object') {
             errors = [...errors, (translate(key) + ': ' + value.join(', '))];
           } else {
             errors = [...errors, (translate(key) + ": " + value)];
           }
         }
       });
       Toast.show({
         text: errors.join('\n'), buttonText: "OK", duration: 10000,
       });
    } else {
       Toast.show({
         text: error, buttonText: "OK", duration: 10000,
       });
    }
    resolve(keys);
  });
};


export default {
  toastError,
}
