import Vue from 'vue'
import axios from 'axios'
import { Checkbox ,Table,Form,Button,Icon,Input,Select} from "ant-design-vue";
import App from './App'
import router from './router'
import store from './store'
// import 'ant-design-vue/dist/antd.css';
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Checkbox);
Vue.use(Table);
Vue.use(Form);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Select)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
