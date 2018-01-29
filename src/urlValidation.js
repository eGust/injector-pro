export const VALID_URL = /^(https:)?\/\/(\w+\.)+\w+\/.+?\.(js|css)$/i;

export default function isValidUrl(s) {
  return s.match(VALID_URL);
}
