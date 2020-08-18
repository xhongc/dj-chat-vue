import Vue from 'vue'
import Vuex from 'vuex'

import cookie from './cookie'

Vue.use(Vuex)

const state = {
  userInfo: {},
  GroupInfo: {},
  msgHistory: {},
  token: cookie.getCookie('token') || '',
  ChatSocket: null,
  chatTextArea: '',
  activeChannelNo: -1
}
export default new Vuex.Store({
  state,
  getters: {
    userInfoGetter: state => state.userInfo,
    GroupInfoGetter: state => state.GroupInfo,
    IndexOfGroupInfo: (state) => (index) => {
      return state.GroupInfo[index]
    },
    msgHistoryGetter: state => state.msgHistory,
    ChatSocketGetter: state => state.ChatSocket,
    activeChannelNo: state => state.activeChannelNo,
    chatTextAreaGetter: state => state.chatTextArea
  },
  mutations: {
    setUserInfo (state, token) {
      state.token = token
    },
    setInitInfo (state, InitInfo) {
      state.userInfo = InitInfo.user_info
      state.GroupInfo = InitInfo.room_info
      let msgHistoryDict = {'-1': '-1'}
      for (let i = 0; i < state.GroupInfo.length; i++) {
        msgHistoryDict[state.GroupInfo[i].channel_no] = []
      }
      state.msgHistory = msgHistoryDict
    },
    pushMsgHistory (state, data) {
      console.log(data)
      state.msgHistory[data.channel_no].push(data)
    },
    setChatSocket (state, ChatSocket) {
      state.ChatSocket = ChatSocket
    },
    setActiveChannel (state, activeChannelNo) {
      state.activeChannelNo = activeChannelNo
    },
    setChatTextArea (state, chatTextArea) {
      state.chatTextArea = chatTextArea
    }
  },
  actions: {
    websocketSend (context, action) {
      let Data = {
        'action': action,
        'message': context.state.chatTextArea,
        'channel_no': context.state.activeChannelNo
      }
      console.log(context)
      context.state.ChatSocket.send(JSON.stringify(Data))
    }
  }
})
