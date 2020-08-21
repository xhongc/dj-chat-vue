<template>
  <div style="height: 100%">
    <el-container>
      <el-container>
        <el-aside width="70px" style="background-color: white">
          <div class="slider">
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
            <div style="flex:1;overflow: hidden"></div>
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
              <div v-for="(item,index) in groupInfo" :key="'chat-list'+index" @click="showChatBox(index, item.channel_no)" class="user-per" :class="{'active':activeIndex===index}">
                <el-avatar size="small" :src=item.img_path class="ava-img" @error=false>
                  <el-avatar> {{item.room_name[0]}} </el-avatar>
                </el-avatar>
                <div class="group-title">{{item.room_name}}</div>
                <div class="group-info">{{item.room_description}}</div>
                <el-badge :value="100" :max="10" class="group-badge"></el-badge>
              </div>
            </section>
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <chat-box v-show="isShowChatBox" :activeIndex="activeIndex" ref="auto"></chat-box>
          </el-main>
          <el-aside width="350px">
            <chat-music v-if="isShowMusicBox" ref="music"></chat-music>
          </el-aside>
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
import {mapGetters} from 'vuex'
import ChatBox from './ChatBox'
import ChatMusic from './ChatMusic'
import GroupMember from './GroupMember'
export default {
  name: 'HelloWorld',
  components: {
    'chat-box': ChatBox,
    'chat-music': ChatMusic,
    'group-member': GroupMember
  },
  data () {
    return {
      drawer: false,
      direction: 'ltr',
      isShowChatBox: false,
      isShowMusicBox: false,
      isShowGroupMember: false,
      activeIndex: -1
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfoGetter',
      groupInfo: 'GroupInfoGetter'
    })
  },
  methods: {
    showChatBox (index, channelNo) {
      this.isShowChatBox = true
      this.activeIndex = index
      this.$store.commit('setActiveChannel', channelNo)
      if (channelNo.startsWith('MC_')) {
        this.$store.dispatch('websocketSend', 'chat_message#init_data')
        this.isShowMusicBox = true
          }
      this.$nextTick(() => {
        this.$refs.auto.$refs.input.focus()
    })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-aside {
  color: #333;
  text-align: center;
  line-height: 100vh;
  margin-right: 1rem;
  overflow: hidden;
}
.slider{
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.el-main {
  margin: 0 auto;
  padding: 0;
  padding-right: 15px;
}
.el-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
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
  position: absolute;
  left: 25px;
  background: white;
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
.group-badge {
  position: absolute;
  left: 18.1rem;
}
i:hover {
  color: seagreen;
}

.el-col {
  border-radius: 3px;
}
</style>
