import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  store.state.routes.baseUrl = 'http://oxy.api.ncmed.cn'
} else if (process.env.NODE_ENV === 'development') {
  store.state.routes.baseUrl = 'http://192.168.2.22:9088'
  // store.state.routes.baseUrl = 'http://oxy.api.test.ncmed.cn'
} else {
  store.state.routes.baseUrl = 'http://oxy.api.ncmed.cn'
}
import VDistpicker from 'v-distpicker'

Vue.component('v-distpicker', VDistpicker)
// set ElementUI lang to EN
Vue.use(ElementUI, {locale})
// 注册全局组件

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
