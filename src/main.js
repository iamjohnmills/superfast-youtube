import Vue from 'vue'
import App from './App.vue'

import Icon from '@/components/Icon'

Vue.component('icon',Icon);

Vue.prototype.$eventHub = new Vue();

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
