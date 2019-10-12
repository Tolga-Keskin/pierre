const state = {
  playing: false,
  loaded: false
};

const mutations = {  
  setLoader(state, loaderState) {
    state.loaded = loaderState;
  },
  setplaying(state, status) {
    state.playing = status;
  }  
};

const actions = {
  setplaying({commit}, status) {
    commit('setplaying', status);
  },
  setplaying({commit}) {
    commit('setplaying', false);
  },
  setLoader({commit}, loaderState) {
    commit('setLoader', loaderState);
  } 
  
};

const getters = {
  getPlaying(state){
    return state.playing
  }
};


export default {
  mutations,
  actions,
  getters,
  state,
}
