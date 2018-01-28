import Vue from 'vue';
import {
  Button,
  ButtonGroup,
  Col,
  Collapse,
  CollapseItem,
  Container,
  Header,
  Input,
  Main,
  Row,
  Option,
  Select,
  Switch,
} from 'element-ui';

import App from './App';

Vue.config.productionTip = false;

Vue.prototype.$ELEMENT = { size: 'mini' };
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Col);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Input);
Vue.use(Main);
Vue.use(Row);
Vue.use(Option);
Vue.use(Select);
Vue.use(Switch);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
