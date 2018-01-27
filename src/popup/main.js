import Vue from 'vue';
import {
  Button,
  Input,
  Menu,
  MenuItem,
} from 'element-ui';

import App from './App';

Vue.config.productionTip = false;

Vue.prototype.$ELEMENT = { size: 'mini' };
Vue.use(Button);
Vue.use(Input);
Vue.use(Menu);
Vue.use(MenuItem);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
