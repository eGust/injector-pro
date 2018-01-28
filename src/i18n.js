export const tr = process.env.NODE_ENV === 'production' ?
  msg => chrome.i18n.getMessage(msg) :
  (() => {
    // eslint-disable-next-line global-require
    const messages = require('../static/_locales/en/messages.json');
    return msg => messages[msg];
  })()
;

export function fmt(s, args) {
  let text = s;
  Object.keys().forEach((key) => {
    text = text.replace(new RegExp(`$${key}`, 'img'), `${args[key]}`);
  });
  return text;
}

export function tf(msg, args) {
  return fmt(tr(msg), args);
}
