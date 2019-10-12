/* eslint disable */
// Import Vue
import Vue from 'vue';

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle';

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

import './assets/css/global.css';

// Import F7 Style
import Framework7CSS from 'framework7/css/framework7.bundle.min.css';

// Import F7 iOS Icons
import Framework7Icons from 'framework7-icons/css/framework7-icons.css';

// Import Material Icons
import MaterialIcons from 'material-design-icons/iconfont/material-icons.css';

// Import Fontawesome Theme Styles
import FontAwesome from '@fortawesome/fontawesome-free/css/all.min.css';

// Import fastClick
import FastClick from 'fastclick';

// Import App Custom Styles
// import AppStyles from './assets/sass/main.scss'

// Import App Component
import app from './main.vue';

// Import Vuex Storage
import store from './store/storage.js';

import Request from './plugins/request';
import Auth from './plugins/auth';
import Database from './plugins/database';
import File from './plugins/file';
import VuePlyr from 'vue-plyr';
import 'vue-plyr/dist/vue-plyr.css';
import 'es6-promise/auto';

Date.prototype.systemZone = 'UTC';

import './utils/helper';

const database = new Database();
const file = new File();

const VueDatabase = {
  install(Vue, options) {
    Vue.mixin({});
    Vue.prototype.$database = function () {
      return database;
    };

    Vue.prototype.$isApp = function () {
      return (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1);
    };

    Vue.prototype.$file = file;
  },
};

Vue.use(VueDatabase);

const request = new Request();

const VueRequest = {
  install(Vue, options) {
    Vue.mixin({});
    Vue.prototype.$crequest = function() {
      return request;
    };
  }
};

const VueSocket = {
  install(Vue, options) {
    Vue.mixin({});
    Vue.prototype.$socket = null;
  }
};

const VueSocketPresence = {
  install(Vue, options) {
    Vue.mixin({});

    Vue.prototype.$presence = {};
  }
};

const VueSocketChannels = {
  install(Vue, options) {
    Vue.mixin({});

    Vue.prototype.$channels = {};
  }
};

const $auth = new Auth({request: request, store: store, storage: window.localStorage});

const VueAuth = {
  install(Vue, options) {
    Vue.mixin({});
    Vue.prototype.$auth = function(){
      return $auth;
    };
  }
};

Vue.use(VueRequest);
Vue.use(VueAuth);
Vue.use(VueSocket);
Vue.use(VueSocketPresence);
Vue.use(VueSocketChannels);
Vue.use(VuePlyr);


// Different F7-Vue plugin initialization with f7 v3.0
Framework7.use(Framework7Vue);

// Init Vue App
const VueApp = new Vue({
  // Root Element
  el: '#app',
  store,
  render: c => c('app'),
  components: {
    app
  },
  mounted() {
    window.addEventListener('load', () => {
      // run after everything is in-place
      FastClick.attach(document.body);
    });
  }
});

window.app = VueApp;
$auth.setApp(app);
database.setApp(app);
file.setApp(app);

export default VueApp;
