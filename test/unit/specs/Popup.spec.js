import Vue from 'vue';
import Popup from '@/popup/App';

import {
  Button,
  Input,
  Menu,
  MenuItem,
} from 'element-ui';

Vue.use(Button);
Vue.use(Input);
Vue.use(Menu);
Vue.use(MenuItem);

describe('Popup/App.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Popup);
    const vm = new Constructor().$mount();
    expect(vm).toBeTruthy();
  });
});
