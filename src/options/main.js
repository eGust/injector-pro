import Vue from 'vue';
import {
  Button,
  Collapse,
  CollapseItem,
  Container,
  Header,
  Main,
} from 'element-ui';

import App from './App';

Vue.config.productionTip = false;

Vue.prototype.$ELEMENT = { size: 'mini' };
Vue.use(Button);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Main);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
