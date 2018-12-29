import Vue from 'vue';
import Core from '@/utils/Core';
import Http from '@/utils/Network';
import App from './App';

import router from './router';
import mixin from './mixin';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
