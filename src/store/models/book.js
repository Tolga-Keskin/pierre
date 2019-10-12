const state = {
  all: {},
  count: 0,
};

const mutations = {
  incrBook: (state) => {
    state.count = state.count++;
  },
  addBook(state, book) {
    if(typeof state.all[book.id] === 'undefined') {
      state.count++;
    }
    state.all[book.id] = book;
  },
  addBooks(state, books) {
    books.forEach((v) => {
      if(typeof state.all[v.id] === 'undefined') {
        state.count++;
      }
      state.all[v.id] = v;
    });
  },
  removeBook(state, id) {
    if(typeof state.all[id] === 'undefined') {
      state.count--;
    }
    delete state.all[id];
  },
  removeBooks(state, ids) {
    for (let i in ids) {
      if(typeof state.all[i] === 'undefined') {
        state.count--;
      }
      delete state.all[ids[i]];
    }
  }
};

const actions = {
  addBook({commit}, book) {
    commit('addBook', book);
  },
  addBooks({commit}, books) {
    commit('addBooks', books);
  },
  removeBook({commit}, id) {
    commit('removeBook', id);
  },
  removeBooks({commit}, ids) {
    commit('removeBooks', ids);
  },
};

const getters = {
  getBooks: (state) => {
    return state.all;
  },
  getBook: (state) => (id) => {
    return state.all[id];
  }
};

export default {
  namespaced: true,
  mutations,
  actions,
  getters,
  state,
};
