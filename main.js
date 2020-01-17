import Vue from 'vue'
import App from './App'
import './public/base.css'

import store from './store'
Vue.prototype.$store = store

import mixins from './common'
Vue.use(mixins)

// import toyoCard from '@components/toyo-card'
// Vue.component('toyoCard', toyoCard)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
