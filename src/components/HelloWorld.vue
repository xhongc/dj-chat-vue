<template>
  <div>
    <el-container>
      <el-container>
        <el-aside width="70px" style="background-color: white;">
          <div style="height: 100vh;">
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
            <div style="height: 62vh;">
            </div>
            <div>
              <i class="el-icon-edit nav"></i>
            </div>
            <div>
              <i class="el-icon-setting nav"></i>
            </div>
            <div>
              <i class="el-icon-switch-button nav"></i>
            </div>
          </div>
        </el-aside>
        <el-aside width="350px">
          <div class="sidebar-body">
            <section class="user-info">
              <span class="nick-name">Hi {{nickName}}</span>
              <span class="group-btn">
                <el-button type="info" size="small" plain><i class="el-icon-user-solid"></i></el-button>
                <el-button type="info" size="small" plain><i class="el-icon-user-solid"></i></el-button>
              </span>
              <el-input style="width: 320px;margin-top: 10px;" placeholder="搜索用户"></el-input>
            </section>
            <section class="user-list">
              <div class="user-per">
                <img class="ava-img" src="https://s1.ax1x.com/2020/07/23/ULRdD1.png" />
                <div class="group-title">花湖湖</div>
                <div class="group-info">描述毛啊圣诞节啊是</div>
              </div>
              <el-divider class="clearfix"></el-divider>
              <div class="user-per">
                <img class="ava-img" src="https://s1.ax1x.com/2020/07/23/ULRdD1.png" />
                <div class="group-title">花湖湖</div>
                <div class="group-info">描述毛啊圣诞节啊是</div>
              </div>
              <el-divider class="clearfix"></el-divider>
              <div class="user-per">
                <img class="ava-img" src="https://s1.ax1x.com/2020/07/23/ULRdD1.png" />
                <div class="group-title">花湖湖</div>
                <div class="group-info">描述毛啊圣诞节啊是</div>
              </div>
              <el-divider class="clearfix"></el-divider>
              <div class="user-per">
                <img class="ava-img" src="https://s1.ax1x.com/2020/07/23/ULRdD1.png" />
                <div class="group-title">花湖湖</div>
                <div class="group-info">描述毛啊圣诞节啊是</div>
              </div>
              <el-divider class="clearfix"></el-divider>
            </section>
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <div class="chat-box">
              <el-row :gutter="10">
                <el-col :span="8"><div class="chat-title">
                  <img src="https://s1.ax1x.com/2020/07/23/ULRdD1.png" />
                  <div>
                    <div class="group-title" style="margin-left: 0.625rem;">花湖湖</div>
                    <div class="group-info" style="margin-left: 0.625rem;">描述毛啊圣诞节啊是</div>
                  </div>
                </div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
                <el-col :span="8"><div class="more-btn">
                  <el-button size="medium" class="music" @click="drawer = true" plain><i class="el-icon-headset"></i></el-button>
                  <el-button size="medium" class="music" plain><i class="el-icon-video-play"></i></el-button>
                  <el-button size="medium" class="music" plain><i class="el-icon-arrow-down"></i></el-button>
                </div></el-col>
              </el-row>
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
<script>import axios from 'axios'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'title',
      nickName: '咚咚咚',
      isCollapsed: false,
      message: '',
      textarea: '',
      drawer: false,
      direction: 'ltr'
    }
  },
  mounted () {
    axios
      .get('http://127.0.0.1:8099/api/friends/')
      .then(response => (this.msg = response))
      .catch(function (error) { // 请求失败处理
        console.log(error)
      })
  },
  methods: {
    sendon (event) {
      console.log(event.currentTarget.value)
      this.message = event.currentTarget.value
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
      margin-bottom:17px;
      padding-top: 17px;
      background-color: #67C23A;
      color: white;
    }
    .nav {
      margin-bottom:5px;
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
      left: 0px;
      top: 0px;
      opacity:1;
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
      border-radius:50%;
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
