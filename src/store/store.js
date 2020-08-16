import Vue from 'vue'
import Vuex from 'vuex'

import cookie from './cookie'

Vue.use(Vuex)

const state = {
  userInfo: {},
  GroupInfo: {},
  token: cookie.getCookie('token') || ''
}
export default new Vuex.Store({
  state,
  getters: {
    userInfoGetter: state => state.userInfo,
    GroupInfoGetter: state => state.GroupInfo
  },
  mutations: {
    setUserInfo (state, token) {
      state.token = token
    },
    setInitInfo (state, InitInfo) {
      state.userInfo = InitInfo.user_info
      state.GroupInfo = InitInfo.room_info
    }
  }
})
