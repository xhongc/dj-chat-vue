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
  activeChannelNo: -1,
  audiosList: [],
  ap: null,
  rightSide: 'null',
  musicSource: '网易云音乐'
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
    chatTextAreaGetter: state => state.chatTextArea,
    audiosListGetter: state => state.audiosList,
    apGetter: state => state.ap,
    rightSideGetter: state => state.rightSide,
    musicSourceGetter: state => state.musicSource
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
    },
    pushAudiosList (state, data) {
      state.audiosList.push(data)
    },
    setAudiosList (state, data) {
      state.audiosList = data
    },
    updateAudiosList (state, data) {
      state.audiosList[data.index].url = data.url
    },
    deleteAudiosList (state, index = 0) {
      if (index >= 0) {
       state.audiosList.splice(index, 1)
      }
    },
    setRefAp (state, refAplayer) {
      state.ap = refAplayer
    },
    setRightSide (state, data) {
      state.rightSide = data
    },
    setMusicSource (state, data) {
      state.musicSource = data
    }
  },
  actions: {
    websocketSend (context, action) {
      let Data = {
        'action': action,
        'message': context.state.chatTextArea,
        'channel_no': context.state.activeChannelNo,
        'now_song_id': context.state.ap ? context.state.ap.currentMusic.id : '',
        'select_music_source': context.state.musicSource
      }
      context.state.ChatSocket.send(JSON.stringify(Data))
    },
    websocketBaseSend (context, data) {
      data['message'] = context.state.chatTextArea
      data['channel_no'] = context.state.activeChannelNo
      data['now_song_id'] = context.state.ap ? context.state.ap.currentMusic.id : ''
      context.state.ChatSocket.send(JSON.stringify(data))
    }
  }
})
