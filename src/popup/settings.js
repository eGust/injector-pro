import { forEach, values } from 'lodash';

import storage from '../storage';
import DEFAULT_OPTIONS from '../defaultOptions.json';

export function getOptions() {
  return storage.get('options') || DEFAULT_OPTIONS;
}

export function getFilename(url) {
  const m = url.match(/\/([^/]+)$/);
  return m ? m[1] : '';
}

export function getExtname(filename) {
  const m = filename.match(/\.[^.]+$/);
  return m ? m[0].toLowerCase() : '';
}

export function getGroupList() {
  const { groups } = getOptions();
  const dict = {};
  forEach(groups, ({ items, hide = false, ...group }, order) => {
    dict[group.id] = {
      ...group,
      order,
      unsolved: items,
      hide,
      items: [],
    };
  });

  function solve(id) {
    const group = dict[id];
    if (!group.unsolved) return;

    group.unsolved.forEach(({ wait = 0, reference: key = null, url = null }) => {
      if (url) {
        const filename = getFilename(url);
        const ext = getExtname(filename) || '.js';
        group.items.push({ url, filename, ext, wait });
        return;
      }

      solve(key);
      group.items = group.items.concat(dict[key].items);
    });
    delete group.unsolved;
  }

  Object.keys(dict).forEach(solve);
  const list = values(dict)
    .filter(({ hide }) => !hide)
    .sort((a, b) => a.order - b.order)
    .map(({ id, title, description, items }) => ({ id, title, description, items }));
  return list;
}
