import { camelCase, snakeCase } from 'lodash';

export const tr = process.env.NODE_ENV === 'production' ?
  msg => chrome.i18n.getMessage(msg) :
  (() => {
    const LOCALE = 'en';
    // eslint-disable-next-line
    const messages = require(`../static/_locales/${LOCALE}/messages.json`);
    console.log(messages);
    return (msg) => {
      const r = messages[msg];
      return r ? r.message : '';
    };
  })()
;

export function fmt(s, args) {
  console.log(s, args);
  let text = s;
  Object.keys(args).forEach((key) => {
    text = text.replace(new RegExp(`\\$${key}`, 'img'), `${args[key]}`);
  });
  return text;
}

export function tf(msg, args) {
  return fmt(tr(msg), args);
}

export function generateComputedMessages(keys) {
  const r = {};
  keys.forEach((name) => {
    const msgKey = snakeCase(name);
    r[camelCase(`msg_${name}`)] = () => tr(msgKey);
  });
  return r;
}

export function makeOptions(values, prefix) {
  const r = {};
  values.forEach((value) => {
    r[value] = {
      label: tr(`${prefix}_${value}`),
      value,
    };
  });
  return r;
}

// "": {
//   "message": ""
// },
