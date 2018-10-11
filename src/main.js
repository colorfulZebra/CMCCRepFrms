// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueDraggable from 'vue-draggable'
import VueCookie from 'vue-cookie'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueDraggable)
Vue.use(VueCookie)

Vue.component('font-awesome-icon', FontAwesomeIcon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
