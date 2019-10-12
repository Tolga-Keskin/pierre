const state = {
  all: {},
  count: 0,
};

const mutations = {
  incrCategory: (state) => {
    state.count = state.count++;
  },
  addCategory(state, category) {
    if(typeof state.all[category.id] === 'undefined') {
      state.count++;
    }
    state.all[category.id] = category;
  },
  addBooks(state, {categoryId, books}) {
    state.all[categoryId].books = {};
    books.forEach((b) => {
      state.all[categoryId].books[b.id] = b;
    });
  },
  addCategories(state, categories) {
    categories.forEach((v) => {
      if(typeof state.all[v.id] === 'undefined') {
        state.count++;
      }
      state.all[v.id] = v;
    });
  },
  removeBooks(state, categoryId) {
    state.all[categoryId].books = {};
  },
  removeCategory(state, id) {
    if(typeof state.all[id] === 'undefined') {
      state.count--;
    }
    delete state.all[id];
  },
  removeCategories(state, ids) {
    for (let i in ids) {
      if(typeof state.all[i] === 'undefined') {
        state.count--;
      }
      delete state.all[ids[i]];
    }
  }
};

const actions = {
  addCategory({commit}, category) {
    commit('addCategory', category);
  },
  addCategories({commit}, categories) {
    commit('addCategories', categories);
  },
  removeCategory({commit}, id) {
    commit('removeCategory', id);
  },
  removeCategories({commit}, ids) {
    commit('removeCategories', ids);
  },
  addBooks({commit}, {categoryId, books}) {
    commit('addBooks', {categoryId, books});
  },
  removeBooks({commit}, categoryId) {
    commit('removeBooks', categoryId);
  },
};

const getters = {
  getCategories: (state) => {
    return state.all;
  },
  getBooks: (state) => (id) => {
    return state.all[id].books;
  },
  getCategory: (state) => (id) => {
    return state.all[id];
  }
};

export default {
  namespaced: true,
  mutations,
  actions,
  getters,
  state,
}
