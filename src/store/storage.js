import Vue from 'vue';
import Vuex from 'vuex';

import book from "./models/book";
import category from "./models/category";
import queue from "./models/queue";
import plyr from "./models/plyr";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    category: category,
    queue,plyr
  }
});
