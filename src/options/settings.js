import { cloneDeep, isEqual } from 'lodash';

import storage from '../storage';
import DEFAULT_OPTIONS from '../defaultOptions.json';

let cache = null;

const settings = {
  load() {
    if (!cache) {
      cache = storage.get('options') || DEFAULT_OPTIONS;
    }
    return cloneDeep(cache);
  },

  save(value) {
    const options = cloneDeep(value);
    if (!isEqual(options, cache)) {
      cache = options;
      storage.set('options', options);
    }
  },
};

export default settings;
