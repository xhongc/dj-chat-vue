<template>
  <div style="height: 100%">
    <el-container>
      <el-container>
        <el-aside width="70px" style="background-color: white;height: 100vh">
          <div>
            <div>
              <i class="el-icon-chat-dot-round nav-first"></i>
            </div>
            <div>
              <i class="el-icon-chat-line-square nav"></i>
            </div>
            <div>
              <i class="el-icon-user nav"></i>
            </div>
            <div>
              <i class="el-icon-star-off nav"></i>
            </div>
            <div>
              <i class="el-icon-edit nav-footer"></i>
            </div>
            <div>
              <i class="el-icon-setting nav-footer"></i>
            </div>
            <div>
              <i class="el-icon-switch-button nav-footer"></i>
            </div>
          </div>
        </el-aside>
        <el-aside width="350px">
          <div class="sidebar-body">
            <section class="user-info">
              <span class="nick-name">Hi {{ userInfo.nick_name }}</span>
              <span class="group-btn">
                <el-button type="info" size="small" plain><i class="el-icon-user-solid"></i></el-button>
                <el-button type="info" size="small" plain><i class="el-icon-user-solid"></i></el-button>
              </span>
              <el-input style="width: 320px;margin-top: 10px;" placeholder="搜索用户"></el-input>
            </section>
            <section class="user-list">
              <div v-for="(item,index) in groupInfo" :key="'chat-list'+index" @click="showChatBox(index)" class="user-per" :class="{'active':active_index===index}">
                <img class="ava-img" :src=item.img_path />
                <div class="group-title">{{item.room_name}}</div>
                <div class="group-info">{{item.room_description}}</div>
              </div>
            </section>
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <div class="chat-box" v-show="isShowChatBox">
              <el-row :gutter="10">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <div class="chat-title">
                    <img :src="activeGroupInfo.img_path" />
                    <div>
                      <div class="group-title" style="margin-left: 0.625rem;">{{activeGroupInfo.room_name}}</div>
                      <div class="group-info" style="margin-left: 0.625rem;">{{activeGroupInfo.room_description}}</div>
                    </div>
                  </div>
                </el-col>
                <el-col :md="12" :lg="12" :xl="12">
                  <div class="more-btn hidden-sm-and-down">
                    <el-button size="medium" class="music" @click="drawer = true" plain><i class="el-icon-headset"></i>
                    </el-button>
                    <el-button size="medium" class="music" plain><i class="el-icon-video-play"></i></el-button>
                    <el-button size="medium" class="music" plain><i class="el-icon-arrow-down"></i></el-button>
                  </div>
                </el-col>
              </el-row>
              <div v-for="(content,index) in msgList" :key="'content'+index">
                <div>
                  <img class="ava-img" :src=content.img_path />
                  <div>{{content.message}}</div>
                </div>
              </div>
              <footer class="chat-input">
                <div class="input-expend">
                  <el-button type="text">文字按钮</el-button>
                  <el-button type="text">文字按钮</el-button>
                  <el-button type="text">文字按钮</el-button>
                </div>
                <el-input
                  type="textarea"
                  placeholder="chàng suǒ yù yán"
                  maxlength="811"
                  show-word-limit
                  v-model="textarea"
                  rows=3
                  resize=none
                  autofocus=true
                  @keydown.enter.native.exact.prevent="sendMessage"
                  v-on:keyup.alt.enter.native="textarea+='\n'"
                ></el-input>
              </footer>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :direction='direction'
      :with-header="false">
      <span>我来啦!</span>
    </el-drawer>
  </div>
</template>
<script>
import store from '../store/store'
import {mapGetters} from 'vuex'
export default {
  name: 'HelloWorld',
  data () {
    return {
      textarea: '',
      drawer: false,
      direction: 'ltr',
      chatSocket: null,
      extra_data: '',
      isShowChatBox: false,
      activeGroupInfo: '',
      msgList: [],
      active_index: -1
    }
  },
  mounted () {
    console.log(this.$store.getters.userInfoGetter)
    console.log(this.userInfo)
  },
  created () {
    this.initWebSocket()
  },
  destroyed () {
    this.chatSocket.close()
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfoGetter',
      groupInfo: 'GroupInfoGetter'
    })
  },
  methods: {
    showChatBox (index) {
      this.isShowChatBox = true
      this.activeGroupInfo = this.groupInfo[index]
      this.active_index = index
    },
    sendMessage () {
      this.websocketSend('chat_message')
      this.msgList.push({'message': this.textarea, 'img_path': this.userInfo.img_path})
      this.textarea = ''
    },
    initWebSocket () {
      let token = `JWT ${store.state.token}`
      const wsuri = 'ws://127.0.0.1:8099/ws/chat' + '/?token=' + token
      this.chatSocket = new WebSocket(wsuri)
      console.log('chatSocket.readyState', this.chatSocket.readyState)
      this.chatSocket.onmessage = this.websocketOnmessage
      this.chatSocket.onopen = this.websocketOnopen
      this.chatSocket.onerror = this.websocketOnerror
      this.chatSocket.onclose = this.websocketClose
    },
    websocketOnopen () {
      this.websocketSend('first_init')
    },
    websocketOnerror () {
      this.initWebSocket()
    },
    websocketOnmessage (e) {
      const data = JSON.parse(e.data)
      if (data.action === 'first_init') {
        this.$store.commit('setInitInfo', data.extra_data)
      } else if (data.action === 'chat_message') {
        console.log(this.userInfo.unicode_id)
        if (data.user_uid !== this.userInfo.unicode_id) {
          this.msgList.push(data)
        }
      }
    },
    websocketSend (action) {
      let Data = {
        'action': action,
        'message': this.textarea,
        'channel_no': this.activeGroupInfo ? this.activeGroupInfo.channel_no : ''
      }
      this.chatSocket.send(JSON.stringify(Data))
    },
    websocketClose (e) {
      console.log('断开连接', e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-header, .el-footer {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  /* background-color: white; */
  color: #333;
  text-align: center;
  line-height: 100vh;
  margin-right: 1rem;
  overflow: hidden;
}

.el-main {
  margin: 0 auto;
  padding: 0;
  padding-right: 30px;
  overflow: hidden;
}

.nav-first {
  width: 70px;
  height: 60px;
  font-size: 38px;
  display: block;
  margin-bottom: 17px;
  padding-top: 17px;
  background-color: #67C23A;
  color: white;
}

.nav {
  margin-bottom: 5px;
  width: 70px;
  height: 60px;
  font-size: 22px;
  display: block;
  cursor: pointer;
}

.nav-footer {
  margin-bottom: 5px;
  width: 70px;
  height: 60px;
  font-size: 22px;
  display: block;
  cursor: pointer;
  position: relative;
  top: 21rem;
}

.sidebar-body {
  background-color: white;
  border-radius: 10px;
  height: 94%;
  width: 100%;
  top: 30px;
  position: relative;
  overflow: hidden;
}

.user-info {
  height: 80px;
  font-size: 28px;
  padding-top: 15px;
  margin-left: 20px;
  line-height: 60px;
  text-align: left;
  position: relative;
}

.nick-name {
  position: absolute;
  left: 0px;
  width: 12.80rem;
}

.group-btn {
  margin-left: 13.2rem;
}

.user-list {
  position: absolute;
  margin-top: 3.5rem;
  width: 21.875rem;
  height: 80vh;
}

.user-per {
  height: 2.4375rem;
  line-height: 2.4375rem;
  padding: 1.25rem 1.25rem;
  position: relative;
  cursor: pointer;
}
.user-per:hover::before {
  content: '';
  width: 0.3125rem;
  background-color: #67C23A;
  height: 100%;
  line-height: 2.4375rem;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 1;
}
.active::before {
  content: '';
  width: 0.3125rem;
  background-color: #67C23A;
  height: 100%;
  line-height: 2.4375rem;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 1;
}
.clearfix {
  overflow: auto;
  margin: 0 auto;
}

.ava-img {
  height: 1.875rem;
  width: 1.875rem;
  position: absolute;
  left: 25px;
}

.group-title {
  position: absolute;
  left: 5rem;
  top: 8px;
}

.group-info {
  position: absolute;
  left: 5rem;
  top: 28px;
  color: gray;
  font-size: 14px;
}

i:hover {
  color: seagreen;
}

.el-row {
  background-color: white;
}

.el-col {
  border-radius: 3px;
}

.chat-box {
  background-color: whitesmoke;
  border-radius: 10px;
  height: 94%;
  width: 100%;
  top: 30px;
  position: relative;
  overflow: hidden;
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

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.bg-purple-light {
  background: white;
}

.music {
  margin-top: 1.75rem;
  /* width: 2.8125rem;
  height: 2.5rem; */
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
  position: absolute;
  bottom: 0rem;
}

.input-expend {
  border-radius: 0.3125rem;
  background-color: white;
  height: 2.1875rem;
  border-top: 1px solid #DCDFE6;
  padding-left: 0.625rem;
}
</style>
