import Vue from 'vue'
import Vuex from 'vuex'

import cookie from './cookie'

Vue.use(Vuex)

const state = {
  userInfo: {},
  GroupInfo: {},
  GroupInfoDict: {},
  msgHistory: {},
  token: cookie.getCookie('token') || '',
  ChatSocket: null,
  chatTextArea: '',
  activeChannelNo: -1,
  audiosList: [],
  ap: null,
  rightSide: 'null',
  musicSource: cookie.getCookie('musicSource') || '网易云音乐'
}
export default new Vuex.Store({
  state,
  getters: {
    userInfoGetter: state => state.userInfo,
    GroupInfoGetter: state => state.GroupInfo,
    GroupInfoDictGetter: state => state.GroupInfoDict,
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
    musicSourceGetter: state => unescape(state.musicSource)
  },
  mutations: {
    setUserInfo (state, token) {
      state.token = token
    },
    setInitInfo (state, InitInfo) {
      state.userInfo = InitInfo.user_info
      state.GroupInfo = InitInfo.room_info
      let msgHistoryDict = {'-1': '-1'}
      let GroupInfoDict = {}
      for (let i = 0; i < state.GroupInfo.length; i++) {
        msgHistoryDict[state.GroupInfo[i].channel_no] = state.GroupInfo[i].said_to_room.reverse() || []
        GroupInfoDict[state.GroupInfo[i].channel_no] = state.GroupInfo[i]
      }
      state.msgHistory = msgHistoryDict
      state.GroupInfoDict = GroupInfoDict
    },
    pushMsgHistory (state, data) {
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
      cookie.setCookie('musicSource', data)
    },
    setGroupInfoUnreadNo (state, data) {
      if (data.channel_no !== state.activeChannelNo) {
        state.GroupInfoDict[data.channel_no].unread_no = (parseInt(state.GroupInfoDict[data.channel_no].unread_no) || 0) + 1
      }
    },
    clearGroupInfoUnreadNo (state, channelNo) {
      state.GroupInfoDict[channelNo].unread_no = ''
    }
  },
  actions: {
    websocketSend (context, action) {
      let Data = {
        'action': action,
        'message': context.state.chatTextArea,
        'channel_no': context.state.activeChannelNo,
        'now_song_id': context.state.ap ? context.state.ap.currentMusic.id : '',
        'select_music_source': context.state.musicSource,
        'img_path': context.state.userInfo.img_path
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
