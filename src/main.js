import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

Vue.prototype.$http = axios; //修改内部的$http为axios  $http.get("")

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
