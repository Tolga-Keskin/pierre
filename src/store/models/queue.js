const state = {
  loader: false,
  logged: false,
  loggedUserCount: 0,
  loggedAdminCount: 0,
  chartCount: 0,
  imgCount: 0,
  activeUsers: {},
  activeAdmins: {},
  pageTitle: '',
  searchQuery: '',
};

const mutations = {
  setSearchQuery(state, query) {
    state.searchQuery = query;
  },
  incrChartCount(state) {
    state.chartCount++;
  },
  incrImgCount(state) {
    state.imgCount++;
  },
  setLoader(state, loaderState) {
    state.loader = loaderState;
  },
  setLogged(state, loggedState) {
    state.logged = loggedState;
  },
  setLoggedUserCount(state, count) {
    state.loggedUserCount = count;
  },
  setLoggedAdminCount(state, count) {
    state.loggedAdminCount = count;
  },
  setActiveUsers(state, users) {
    users.forEach((v) => {
      state.activeUsers[v.id] = v;
    });
  },
  setActiveAdmins(state, users) {
    users.forEach((v) => {
      state.activeAdmins[v.id] = v;
    });
  }
};

const actions = {
  setSearchQuery({commit}, query) {
    commit('setSearchQuery', query);
  },
  setLoader({commit}, loaderState) {
    commit('setLoader', loaderState);
  },
  setLogged({commit}, loggedState) {
    commit('setLogged', loggedState);
  },
  setLoggedUserCount({commit}, count) {
    commit('setLoggedUserCount', count);
  },
  setLoggedAdminCount({commit}, count) {
    commit('setLoggedAdminCount', count);
  },
  incrChartCount({commit}) {
    commit('incrChartCount');
  },
  incrImgCount({commit}) {
    commit('incrImgCount');
  },
  setActiveUsers({commit}, users) {
    commit('setActiveUsers', users);
  },
  setActiveAdmins({commit}, users) {
    commit('setActiveAdmins', users);
  },
};

const getters = {
  getLoader: (state) => {
    return state.loader;
  },
  getLogged: (state) => {
    return state.logged;
  },
  getLoggedUserCount: (state) => {
    return state.loggedUserCount;
  },
  getLoggedAdminCount: (state) => {
    return state.loggedAdminCount;
  },
  getChartCount: (state) => {
    return state.chartCount;
  },
  getImgCount: (state) => {
    return state.imgCount;
  },
  getActiveUsers: (state) => {
    return state.activeUsers;
  },
  getActiveAdmins: (state) => {
    return state.activeAdmins;
  },
  getSearchQuery: (state) => {
    return state.searchQuery;
  },
};


export default {
  mutations,
  actions,
  getters,
  state,
}
