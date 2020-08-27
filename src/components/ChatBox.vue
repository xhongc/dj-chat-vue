<template>
  <div class="chat-box">
    <el-row :gutter="10" class="chat-header">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="chat-title">
          <img :src="activeGroupInfo.img_path"/>
          <div>
            <div class="group-title" style="margin-left: 0.625rem;">{{activeGroupInfo.room_name}}</div>
            <div class="group-info" style="margin-left: 0.625rem;">{{activeGroupInfo.room_description}}</div>
          </div>
        </div>
      </el-col>
      <el-col :md="12" :lg="12" :xl="12">
        <div class="more-btn hidden-sm-and-down">
          <el-button size="medium" class="music" plain @click="musicBtn"><i class="el-icon-headset"></i></el-button>
          <el-button size="medium" class="music" plain><i class="el-icon-video-play"></i></el-button>
          <el-button size="medium" class="music" plain @click="infoBtn"><i class="el-icon-arrow-down"></i></el-button>
        </div>
      </el-col>
    </el-row>
    <div class="chat-body" ref="chat_body" v-scroll="loadMore">
      <div v-if="loading" class="more"><i class="el-icon-loading" style="font-size: 32px"></i></div>
      <div v-if="page>=3&&!finish" class="more" @click="loadMore">查看更多</div>
      <div v-if="finish" class="no-more">没有更多了</div>
      <el-row v-for="(content,index) in msgLists" :key="'content'+index" :gutter="10">
        <el-col v-if="userInfo.unicode_id===content.user_uid" class="chat-msg" :xs="24" :sm="24" :md="12" :lg="12"
                :xl="12">
          <div>
            <el-popover
              placement="right"
              width="60px"
              trigger="click">
              <el-avatar :size="60" :src="content.img_path" shape="square"
                         class="chat-img hidden-sm-and-down"></el-avatar>
              <el-avatar slot="reference" :size="30" :src="content.img_path" shape="square"
                         class="chat-img hidden-sm-and-down"></el-avatar>
            </el-popover>
            <div class="chat-content">{{content.message}}</div>
          </div>
        </el-col>
        <el-col v-else class="chat-msg-right" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div style="float: right">
            <div class="chat-content-right">{{content.message}}</div>
            <el-popover
              placement="right"
              width="60px"
              trigger="click">
              <el-avatar :size="60" :src="content.img_path" shape="square"
                         class="chat-img-right hidden-sm-and-down"></el-avatar>
              <el-avatar slot="reference" :size="30" :src="content.img_path" shape="square"
                         class="chat-img-right hidden-sm-and-down"></el-avatar>
            </el-popover>
            <!--            <img class="chat-img-right hidden-sm-and-down" :src=content.img_path />-->
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="chat-input">
      <div class="input-expend">
        <el-button type="text">文字按钮</el-button>
        <el-button type="text">文字按钮</el-button>
        <el-button type="text">文字按钮</el-button>
      </div>
      <el-input
        ref="input"
        type="textarea"
        placeholder="chàng suǒ yù yán"
        maxlength="811"
        show-word-limit
        v-model="ChatTextArea"
        rows=3
        resize=none
        :autofocus="true"
        @keydown.enter.native.exact.prevent="sendMessage"
        v-on:keyup.alt.enter.native="ChatTextArea+='\n'"
      ></el-input>
    </div>
  </div>
</template>

<script>
  import store from '@/store/store'
  import {mapGetters} from 'vuex'
  import {getChatLog} from '@/api/api'
  import LoadMore from './LoadMore'
  export default {
    name: 'ChatBox',
    props: ['activeGroupInfo'],
    components: {
      'load-more': LoadMore
    },
    data () {
      return {
        isConnect: false,
        rec: ''
      }
    },
    created () {
    },
    mounted () {
      this.initWebSocket()
    },
    destroyed () {
      this.chatSocket.close()
    },
    directives: {
      scroll: {
        bind: (el, binding) => {
          console.log('asd', this)
          el.addEventListener('scroll', () => {
            if (el.scrollTop < 5) {
              let loadData = binding.value
              loadData()
            }
          })
        }
      }
    },
    computed: {
      msgLists () {
        if (this.activeChannelNo === -1) {
          return {}
        }
        return this.msgHistory[this.activeChannelNo]
      },
      loading: {
        get () {
          if (this.activeChannelNo === -1) {
          return false
        }
        return this.IndexOfLoad(this.activeChannelNo).loading
        },
        set (val) {
          this.$store.commit('setLoad', val)
        }
      },
      finish: {
        get () {
          if (this.activeChannelNo === -1 || this.msgLists.length < 20) {
          return 'null'
        }
        return this.IndexOfLoad(this.activeChannelNo).finish
        },
        set (val) {
          this.$store.commit('setFinish', val)
        }
      },
      page: {
        get () {
          if (this.activeChannelNo === -1) {
          return 2
        }
        return this.IndexOfLoad(this.activeChannelNo).page
        },
        set (val) {
          this.$store.commit('setPage', val)
        }
      },
      ChatTextArea: {
        get () {
          return this.chatTextArea
        },
        set (val) {
          this.$store.commit('setChatTextArea', val)
        }
      },
      ...mapGetters({
        msgHistory: 'msgHistoryGetter',
        userInfo: 'userInfoGetter',
        chatSocket: 'ChatSocketGetter',
        activeChannelNo: 'activeChannelNo',
        chatTextArea: 'chatTextAreaGetter',
        ap: 'apGetter',
        rightSide: 'rightSideGetter',
        IndexOfLoad: 'IndexOfLoadGetter'
      })
    },
    methods: {
      sendMessage () {
        if (this.ChatTextArea === '') {
          return
        }
        this.$store.dispatch('websocketSend', 'chat_message')
        let data = {
          'message': this.ChatTextArea,
          'img_path': this.userInfo.img_path,
          'user_uid': this.userInfo.unicode_id,
          'channel_no': this.activeChannelNo
        }
        this.$store.commit('pushMsgHistory', data)
        this.ChatTextArea = ''
        this.$nextTick(() => {
          let msg = this.$refs.chat_body
          msg.scrollTop = msg.scrollHeight // 滚动高度
        })
      },
      initWebSocket () {
        let token = `JWT ${store.state.token}`
        if (token === 'JWT ') {
          this.$router.push({name: 'login'})
        }
        const wsuri = 'ws://127.0.0.1:8099/ws/chat' + '/?token=' + token
        let chatSocket = new WebSocket(wsuri)
        this.$store.commit('setChatSocket', chatSocket)
        this.chatSocket.onmessage = this.websocketOnmessage
        this.chatSocket.onopen = this.websocketOnopen
        this.chatSocket.onerror = this.websocketOnerror
        this.chatSocket.onclose = this.websocketClose
      },
      websocketOnopen () {
        console.log('连接成功')
        this.isConnect = true
      },
      websocketOnerror () {
        this.isConnect = false
      },
      websocketOnmessage (e) {
        // 自己看到和 自己看不到判断
        const data = JSON.parse(e.data)
        if (data.action === 'chat_message') {
          if (data.user_uid !== this.userInfo.unicode_id) {
            this.$store.commit('pushMsgHistory', data)
            this.$store.commit('setGroupInfoUnreadNo', data)
          }
        } else if (data.action === 'chat_music') {
          if (data.command === 'add_song') {
            this.$store.commit('pushAudiosList', data.aplayer_data[0])
          } else if (data.command === 'init_data') {
            if (data.user_uid === this.userInfo.unicode_id) {
              if (data.aplayer_data.length === 0) {
              return
            }
            this.$store.commit('setAudiosList', data.aplayer_data)
            this.$store.dispatch('websocketSend', 'chat_message#ack_song_process')
            }
          } else if (data.command === 'switch_next_song') {
            this.$store.commit('deleteAudiosList')
          } else if (data.command === 'tips') {
            this.$message({
              message: data.aplayer_data,
              type: 'warning'
            })
          } else if (data.command === 'reload_song_url') {
            this.$store.commit('updateAudiosList', {'index': this.ap.currentIndex, 'url': data.aplayer_data})
          } else if (data.command === 'ack_song_process') {
            // console.log('ack_song_process', this.activeChannelNo)
            if (this.activeChannelNo.startsWith('MC_')) {
              console.log('ack_song_process', this.activeChannelNo)
              this.$store.dispatch('websocketBaseSend', {'action': 'chat_message#syn_song_process', 'current_time': this.ap.currentSettings.currentTime})
            }
          } else if (data.command === 'syn_song_process') {
            this.ap.seek(data.aplayer_data)
          }
        }
      },
      websocketClose (e) {
        this.isConnect = false
        console.log('断开连接', e)
        this.reConnect()
      },
      reConnect () {
        if (this.isConnect) return
        this.rec && clearTimeout(this.rec)
        // 延迟5秒重连  避免过多次过频繁请求重连
        console.log('延迟5秒重连  避免过多次过频繁请求重连')
        this.rec = setTimeout(() => {
          this.initWebSocket()
        }, 5000)
      },
      musicBtn () {
        let action = 'music'
        if (this.rightSide === 'music') {
          action = 'null'
        }
        this.$store.commit('setRightSide', action)
      },
      infoBtn () {
        let action = 'info'
        if (this.rightSide === 'info') {
          action = 'null'
        }
        this.$store.commit('setRightSide', action)
      },
      loadMore () {
        if (this.finish || this.finish === 'null') {
          return
        }
        this.loading = true
        this.loadData && clearTimeout(this.loadData)
        this.loadData = setTimeout(() => {
          getChatLog({
            said_to_room__channel_no: this.activeChannelNo,
            page: this.page
          }).then((response) => {
            this.$store.commit('pushMsgHistoryHead', {'data': response.data.results, 'channel_no': this.activeChannelNo})
            this.loading = false
            this.page = this.page + 1
          }).catch((error) => {
            console.log(error)
            this.loading = false
            this.finish = true
          })
        }, 500)
        console.log(this.loading)
      }
    }
  }
</script>

<style scoped>
  .chat-box {
    background-color: whitesmoke;
    border-radius: 10px;
    height: 94vh;
    width: 100%;
    overflow: hidden;
    display: flex; /*父元素的定义为flex布局*/
    flex-direction: column; /*定义排列方向为竖排*/
    margin-top: 30px;
  }

  .chat-header {
    background-color: white;
  }

  .chat-title {
    height: 5.92rem;
    width: 18.75rem;
    margin-left: 20px;
    line-height: 60px;
    position: relative;
  }

  .chat-title img {
    position: absolute;
    height: 3.75rem;
    width: 3.75rem;
    left: 1.25rem;
    margin-top: 1.25rem;
    border-radius: 50%;
    cursor: pointer;
  }

  .music {
    margin-top: 1.75rem;
  }

  .music i {
    font-size: 1.3rem;
  }

  .more-btn {
    float: right;
    margin-right: 1.875rem;
  }

  .chat-input {
    width: 100%;
    bottom: 0;
  }

  .input-expend {
    border-radius: 0.3125rem;
    background-color: white;
    height: 2.1875rem;
    border-top: 1px solid #DCDFE6;
    padding-left: 0.625rem;
  }

  .chat-msg {
    margin-top: 40px;
    margin-left: 30px;
  }

  .chat-img {
    background-color: whitesmoke;
    display: inline-block;
    vertical-align: bottom;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  }

  .chat-content {
    display: inline-block;
    vertical-align: bottom;
    border: 1px solid white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    background-color: white;
    margin-left: 10px;
    /*width: 100px;*/
    max-width: 20vw;
    line-height: 28px;
    text-align: left;
    padding-left: 20px;
    padding-right: 20px;
  }

  .chat-msg-right {
    margin-top: 40px;
    margin-right: 30px;
    float: right;
  }

  .chat-content-right {
    display: inline-block;
    vertical-align: bottom;
    border: 1px solid white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    background-color: white;
    margin-right: 10px;
    /*width: 100px;*/
    max-width: 20vw;
    line-height: 28px;
    text-align: left;
    padding-left: 20px;
    padding-right: 20px;
  }

  .chat-img-right {
    background-color: whitesmoke;
    display: inline-block;
    vertical-align: bottom;
    height: 1.875rem;
    width: 1.875rem;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  }

  .chat-body {
    flex: 1; /*中间分配剩下的所有空间*/
    overflow: auto;
    padding-bottom: 30px;
  }
  .more {
    margin-top: 10px;
    text-align: center;
    color: cornflowerblue;
    cursor: pointer;
  }
  .no-more{
    margin-top: 10px;
    text-align: center;
    color: gray;
  }
</style>
