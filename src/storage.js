const storage = {
  clear() {
    localStorage.clear();
  },

  get(key) {
    const value = localStorage.getItem(key);
    return key === undefined ? null : JSON.parse(value);
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};

export default storage;
