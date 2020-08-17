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
              <el-row :gutter="10" class="chat-header">
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
              <div class="chat-body" ref="chat_body">
                <el-row v-for="(content,index) in msgLists" :key="'content'+index" :gutter="10">
                <el-col v-if="userInfo.unicode_id===content.user_uid" class="chat-msg" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <div>
                    <img class="chat-img hidden-sm-and-down" :src=content.img_path />
                    <div class="chat-content">{{content.message}}</div>
                  </div>
                </el-col>
                <el-col v-else class="chat-msg-right" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <div style="float: right">
                    <div class="chat-content-right">{{content.message}}</div>
                    <img class="chat-img-right hidden-sm-and-down" :src=content.img_path />
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
              </div>
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
    msgLists () {
      this.$nextTick(() => {
        let msg = this.$refs.chat_body
        msg.scrollTop = msg.scrollHeight // 滚动高度
      })
      return this.msgList
    },
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
      this.msgList.push({'message': this.textarea, 'img_path': this.userInfo.img_path, 'user_uid': this.userInfo.unicode_id})
      this.textarea = ''
      this.$nextTick(() => {
        let msg = this.$refs.chat_body
        msg.scrollTop = msg.scrollHeight // 滚动高度
      })
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
  top: 62vh;
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

.chat-header {
  background-color: white;
}

.el-col {
  border-radius: 3px;
}

.chat-box {
  background-color: whitesmoke;
  border-radius: 10px;
  height: 94vh;
  width: 100%;
  overflow: hidden;
  display:flex; /*父元素的定义为flex布局*/
  flex-direction: column; /*定义排列方向为竖排*/
  margin-top: 30px;
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
.chat-msg{
  margin-top: 40px;
  margin-left: 30px;
  }
.chat-img {
  display: inline-block;
  vertical-align: bottom;
  height: 1.875rem;
  width: 1.875rem;
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
.chat-msg-right{
    margin-top: 40px;
    margin-right: 30px;
    float: right;
  }
.chat-content-right{
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
  display: inline-block;
  vertical-align: bottom;
  height: 1.875rem;
  width: 1.875rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  }
.chat-body{
  flex:1; /*中间分配剩下的所有空间*/
  overflow:auto;
  }
</style>
