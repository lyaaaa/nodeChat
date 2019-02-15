// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueSocketio from 'vue-socket.io';
Vue.use(new VueSocketio({
  connection: 'http://localhost:3000'
}))

Vue.config.productionTip = false
Vue.prototype.$axios = axios;
axios.defaults.baseURL = '/api'
/* eslint-disable no-new */
axios.defaults.timeout = 5000 // 超时时间
axios.interceptors.request.use(
  config => {
    const express_token = window.localStorage.getItem('express_token')
    if (express_token) {
      config.headers['Authorization'] = `Bearer ${express_token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });


new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
