import compressor from 'pako';

const OPTION = { to: 'string' };

const storage = {
  clear() {
    localStorage.clear();
  },

  get(key) {
    const value = localStorage.getItem(key);
    return value && JSON.parse(compressor.inflateRaw(value, OPTION));
  },

  set(key, value) {
    localStorage.setItem(key, compressor.deflateRaw(JSON.stringify(value), OPTION));
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};

export default storage;
