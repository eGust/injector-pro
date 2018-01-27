export const tr = process.env.NODE_ENV === 'production' ?
  msg => chrome.i18n.getMessage(msg) :
  (() => {
    // eslint-disable-next-line global-require
    const messages = require('../static/_locales/en/messages.json');
    return msg => messages[msg];
  })()
;

export function tf(msg, args) {
  let text = tr(msg);
  Object.keys().forEach((key) => {
    text = text.replace(/\$${key}/i, `${args[key]}`);
  });
  return text;
}
