import Vue from 'vue'
import Vuex from 'vuex'
import {createStore} from 'vuex';
import VuexPersistence from 'vuex-persist';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)


export default new Vuex.Store({
  plugins: [
    // 可以有多个持久化实例
    createPersistedState({
      key: 'app_config_data',  // 状态保存到本地的 key
      paths: ['token', 'user'],  // 要持久化的状态，在state里面取，如果有嵌套，可以  a.b.c
      storage: {  // 存储方式定义
        getItem: (key) => uni.getStorageSync(key), // 获取
        setItem: (key, value) => uni.setStorageSync(key, value), // 存储
        removeItem: (key) => uni.removeStorageSync(key) // 删除
      }
    })
  ],
  state: {
    langPage: {},
    lang: '',
    token: '',
    user: null,
  },
  mutations: {
    set(state, data) {
      state[data.key] = data.value;
    }
  },
  getters: {
    stepData: state => `${state.stepData * 100}%`,
  },
  actions: {
  },
  modules: {},
});
