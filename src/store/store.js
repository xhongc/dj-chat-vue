import Vue from 'vue'
import Vuex from 'vuex'

import cookie from './cookie'

Vue.use(Vuex)

const userInfo = {
  name: cookie.getCookie('name') || '',
  token: cookie.getCookie('token') || ''
}

const state = {
  userInfo
}
export default new Vuex.Store({
  state,
  mutations: {
    setUserInfo (state, token) {
      state.userInfo.token = token
    }
  }
})
